const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

// güvenlik için tüm route'lara validateToken'ı ekliyoruz
router.use(validateToken);

/*

    app.get("/", (req, res) => {
      
    });

    yerine, aşağıdaki formu kullanıyoruz:

    router.route("/").get((req,res)) => {

    });

*/

// "/" adresine gelen get isteğini getContact ile karşılamak için
router.route("/").get(getContacts);

// "/" adresine gelen post isteğini createContact ile karşılamak için
router.route("/").post(createContact);

// get metoduyla id'nin contact bilgisi çekmek için
router.route("/:id").get(getContact);

// put metoduyla id'nin contact bilgisi güncellemek için
router.route("/:id").put(updateContact);

// delete metoduyla id'nin contact'ı silmek için
router.route("/:id").delete(deleteContact);

/*

yukarıdaki kodları ayrı ayrı satırda yazmak yerine şöyle de birleştirerek yazabilirdik:

router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

*/

module.exports = router;
