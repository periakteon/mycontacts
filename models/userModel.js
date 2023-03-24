const mongoose = require("mongoose");

// kullanıcı için şema oluşturuyoruz
// şemada "username" olacak ve "username"e girilecek olan veri türü String olmalı ve required, yani doldurmak zorunlu
// aynı zamanda verilen verinin zaten veritabanında olup olmadığını kontrol etmek için de "unique" ekliyoruz.
// bunu diğer şema nesneleri için de yapıyoruz
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the username."],
    },
    email: {
      type: String,
      required: [true, "Please enter the email address."],
      unique: [true, "This e-mail address already taken."],
    },
    password: {
      type: String,
      required: [true, "Please enter the password."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
