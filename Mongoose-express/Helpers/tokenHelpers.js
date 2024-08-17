const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema"); // User bir colleciton

// header kısmındaki access_tokeni almaya yarayan fonksiyon
const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers["authorization"];
  const access_token = authorization.split(" ")[1];
  // yukarıdaki fonksiyonlar ile postman üzerindne gönderilen requestteki header kısmında bakılıyor.
  // authorization = baerar DEĞEĞER kısmındaki DEĞER
  return access_token; // olarak geri döndürülüyor
};

// user req body içerisindeki bilgiler ile
const access_token_creater = async (user_information) => {
  console.log("access_token_creater çalıştı ");
  const { _id, userName, email, role } = user_information;
  // token üzerinde saklanacak veri userPayload
  const userPayload = {
    _id,
    userName,
    email,
    role,
  };
  return await (accessToken = jwt.sign(
    userPayload,
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_SECRET_KEY_EXPIRES_IN,
    }
  ));
  // oluşturulan access token'in cookie veya headers üzerinde saklanması gerekiyor
};

// id ile refresh token oluşturur
const refresh_token_creater = async (user_id) => {
  const user = await User.findById(user_id);
  const { _id, userName, email, role } = user;
  // token üzerinde saklanacak veri userPayload
  const userPayload = {
    _id,
    userName,
    email,
    role,
  };
  const refresh_access_token = jwt.sign(
    userPayload,
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: process.env.REFRESH_SECRET_KEY_EXPIRES_IN }
  );
  await addRefreshTokenToDatabase(user, refresh_access_token);
};

// refresh tokeni veri tabanına kaydeder
const addRefreshTokenToDatabase = async (user, refresh_access_token) => {
  // refresh tokeni veri tabanına kaydeder
  // user önceden acces tokeni varsa sıfırlanır
  if (user.refreshToken != " ") {
    await expireTheToken(user);
  }
  // eğer yoksa yeni değer atanır
  user.refreshToken = refresh_access_token; // yeni token veri tabanına atıldı
  await user.save(); // user değeri veri tabanına save edilir
};

// kaydedilmiş refresh token sona ermediyse sona geçersiz kılar
const expireTheToken = async (user) => {
  // bu fonksiyon ile parametre olarak verilen user'ın refresh secret key değeri veri tabanından bulunur ve sona ermesi sağlanır
  const refreshToken = user.refreshToken; // şimdiki değer veri tabanından okundu ve refreshToken aktarıldı
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
  // TODO --> kontrol et gerçekten de sona eriyor mu ?
  decoded.exp = new Date(Date.now()); // bu şimdiki tokenin sona ermesini sağlar
};

const expireAccessToken = async (req, next) => {
  const access_token = getAccessTokenFromHeader(req);
  console.log("access_token = " + access_token);
  const decoded_token = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
  decoded_token.exp = new Date(Date.now());
  console.log(decoded_token);
  next();
};

const access_token_using_refresh_token = async (req, res, next) => {
  const access_token = getAccessTokenFromHeader(req);
  if (!access_token) {
    return res.status(400).json({ message: "parametreleri gözden geçirin" });
  }

  try {
    // Access token'ı doğrula
    const decoded_access_token = jwt.verify(
      access_token,
      process.env.JWT_SECRET_KEY
    );

    // Token süresinin dolup dolmadığını kontrol et
    if (decoded_access_token.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Token süresi dolmuş" });
    }

    // Kullanıcıyı veritabanında bul
    const user_id = decoded_access_token._id;
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Böyle bir kullanıcı bulunmuyor" });
    }

    // Refresh token'ı doğrula
    const refresh_access_token = user.refreshToken;
    let decoded_refresh_token;
    try {
      decoded_refresh_token = jwt.verify(
        refresh_access_token,
        process.env.REFRESH_SECRET_KEY
      );
    } catch (err) {
      return res.status(403).json({ message: "Geçersiz refresh token" });
    }

    // Yeni access token oluştur
    const newAccess_token = await access_token_creater(decoded_refresh_token);

    // Önceki access token'ı sona erdir
    expireAccessToken(req, next);

    // Başarılı yanıt
    res.status(201).json({
      message: "Başarılı bir şekilde yeni access_token oluşturuldu",
      access_token: newAccess_token,
    });
  } catch (error) {
    // Genel hata yakalama
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

module.exports = {
  getAccessTokenFromHeader,
  refresh_token_creater,
  access_token_creater,
  access_token_using_refresh_token,
  expireAccessToken,
};
