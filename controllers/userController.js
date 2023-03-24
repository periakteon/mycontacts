const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @amacımız: Kullanıcı kaydı
// @route: POST /api/users/register
// @access: public

const registerUser = asyncHandler(async (req, res) => {
  //İlk önce, isteğin gövdesinden (body) "username", "email" ve "password" adlı alanları (property) ayrıştırmak için object destructuring (nesne yıkımı) kullanılır. Bu işlem sayesinde, isteğin gövdesindeki bu üç alanın değerleri, sırasıyla "username", "email" ve "password" değişkenlerine atanır.
  const { username, email, password } = req.body;

  //tüm alanların doldurulup doldurulmadığını kontrol ediyoruz. eğer dolu değilse hata döndürüyoruz
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Tüm alanlar doldurulmalıdır.");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered.");
  }

  // password'ü hash'liyoruz
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password: ", hashedPassword);

  // veritabanına bilgileri gönderiyoruz
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created: ${user}`);

  // eğer kayıt başarıyla tamamlandıysa response olarak json formatında kullanıcı bilgileri dönsün
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  }
  // eğer başarıyla tamamlanmadıysa
  else {
    res.status(400);
    throw new Error("User data is not valid.");
  }
});

/* ---------------------------------------------------------------------------- */

// @amacımız: Kullanıcı girişi
// @route: POST /api/users/login
// @access: public

const loginUser = asyncHandler(async (req, res) => {
  console.log("Login denemesi geldi");
  //İlk önce, isteğin gövdesinden (body) "username", "email" ve "password" adlı alanları (property) ayrıştırmak için object destructuring (nesne yıkımı) kullanılır. Bu işlem sayesinde, isteğin gövdesindeki bu üç alanın değerleri, sırasıyla "username", "email" ve "password" değişkenlerine atanır.
  const { email, password } = req.body;

  // Eğer email veya password girilmemişse
  if (!email || !password) {
    res.status(400);
    throw new Error("Tüm alanları doldurmak zorunludur.");
  }

  // eğer her şey düzgün devam ediyorsa, veritabanından email ile kullanıcı emailini bul
  const user = await User.findOne({ email });

  // (user'dan gelen) email varsa VE (&&) boddy'den gelen password'ü (ilkini) hashlenmiş password ile karşılaştır ve eşleşiyorsa devam et
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      // ilk parametre olarak crypt etmek istediğimiz nesneyi yazıyoruz
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      // ikinci parametre olarak access token'ımızı yazıyoruz
      process.env.ACCESS_TOKEN_SECRET,

      // kaç dakika geçerli olacağını yazıyoruz
      { expiresIn: "60m" }
    );
    console.log(`${user} Giriş başarılı!`);
    res.status(200).json({ accessToken });
  } else {
    // eğer email veya password valid değilse hata döndürüyoruz
    res.status(401);
    throw new Error("Email or password is not valid.");
  }
});

/* ---------------------------------------------------------------------------- */

// @amacımız: Current user info
// @route: GET /api/users/current
// @access: private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

/* ---------------------------------------------------------------------------- */

module.exports = { registerUser, loginUser, currentUser };