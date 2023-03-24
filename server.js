// https://www.youtube.com/watch?v=H9M02of22z4
// .env DOSYASI OLUŞTURUP DÜZENLEMEYİ UNUTMA:
// PORT = 5001
// CONNECTION_STRING = mongodb+srv://admin:admin@mycontacts.rhzh6pn.mongodb.net/mycontacts?retryWrites=true&w=majority
// ACCESS_TOKEN_SECRET = masum123

const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const PORT = process.env.PORT || 3000;
const dir = `${__dirname}/public/`;

// veritabanı bağlantısı için asenkron fonksiyon oluşturuyoruz.
// önce veritabanı bağlantısının sağlanması için connectDb() fonksiyonunu await ediyoruz
// await edilen fonksiyon çözüldüğünde, yani Promise resolve olduğunda port dinlemeyi başlatıyoruz
const startApp = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Uygulama ${PORT} portunda ${process.env.DB_HOST}'ta çalışıyor.`);
    });
  } catch (err) {
    console.log("Uygulama başlatılırken bir hata oluştu:", err);
  }
};

startApp();

app.use(errorHandler);

// CORS hatası almamak için
app.use(cors());

// POST metoduyla gelen body'yi (yani veriyi) parse etmek için built-in bir fonksiyon, aksi takdirde "undefined" hatası alıyoruz
app.use(express.json());

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// public'teki dosyaların statik olduğunu söylüyoruz. index.html, css vb..
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(dir);
});