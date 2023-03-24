const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  // token validate etmek için headerda bulunan Authorization verilerini okumamız gerekiyor
  let authHeader = req.headers.Authorization || req.headers.authorization;

  // eğer bu veriler varsa ve "Bearer" ile başlıyorsa (her zaman "Bearer" ile başlar)
  // örneğin: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiemEiLCJlbWFpbCI6InphQHphLmNvbSIsImlkIjoiNjQxYzk1NTJhYWMyYjc3NGU0ZGRlMDI4In0sImlhdCI6MTY3OTU5NTE2NSwiZXhwIjoxNjc5NTk1MjI1fQ.jyVO4K04Z-OA_qad9JH5_0YmfmLG9z6ougBWEQH8Tqs
  if (authHeader && authHeader.startsWith("Bearer")) {

    // Bearer eyJhbGciOiJIUzI1NiIsInR5cC.... diye devam eden bir tokenımız var
    // headerdaki bu token'ı yakalamak için header'da boşluk ile ayrılanları ayırıyoruz ve dizi oluşturuyoruz ve ilk indexi, yani token'ı elde ediyoruz
    // yani şöyle yapmış oluyoruz: ['Bearer', 'eyJhbGciOiJIUzI1NiIsInR5cC....']
    // dolayısıyla ilk indeximiz token olmuş oluyor (array'ler 0'dan başlıyor çünkü)
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(400);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });
  }
  // eğer token geçersizse veya farklı bir kullanıcı girişi üzerinden token deneniyorsa
  if (!token) {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;