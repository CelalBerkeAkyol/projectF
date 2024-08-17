const express = require("express");
const router = express.Router();
const {
  getAllUserFromDatabase,
  deleteAllUsersFromDatabase,
  updateUserFromDatabase,
  getUserByIDFromDatabase,
  deleteUserFromDatabase,
} = require("../controllers/userController");
const { getAccessToRoute, isAdmin } = require("../middlewares/authMiddleware"); // kullanıcı kontrolü burada yapılıyor

// Veri tabanı
const mongosee = require("mongoose");
const User = require("../Models/UserSchema");

// ---> / ile belirtilen route {{url}}/api/user

// tüm userları çekme
router.get("/", getAllUserFromDatabase);

// bir kişiyi çekme
router.get("/:id", getUserByIDFromDatabase);

// bir kullanıcı güncelleme
router.put("/:id", getAccessToRoute, updateUserFromDatabase);

// bir kişi silenecek
router.delete("/:id", getAccessToRoute, isAdmin, deleteUserFromDatabase);

// tüm kulllanıcıları silme
router.post(
  "/delete-all-users",
  getAccessToRoute,
  isAdmin,
  deleteAllUsersFromDatabase
);

module.exports = router;
