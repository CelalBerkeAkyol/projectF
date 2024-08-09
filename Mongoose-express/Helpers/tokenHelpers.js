
const getAccessTokenFromHeader = (req) =>{
    const authorization = req.headers["authorization"];
    const access_token = authorization.split(' ')[1];
    return access_token;
}

module.exports = {
    getAccessTokenFromHeader
}