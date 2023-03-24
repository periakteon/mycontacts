const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

/* ---------------------------------------------------------------------------- */

// @amacımız: Get all contacts
// @route: GET /api/contacts
// @access: private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
  console.log("Sunucuya get all contacts talebi geldi.");
});

/* ---------------------------------------------------------------------------- */

// @amacımız: Create New Contact
// @route: POST /api/contacts
// @access: private

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is: ", req.body);

  // body'den gelen verileri ayrıştırmak için
  //İlk önce, isteğin gövdesinden (body) "name", "email" ve "phone" adlı alanları (property) ayrıştırmak için object destructuring (nesne yıkımı) kullanılır. Bu işlem sayesinde, isteğin gövdesindeki bu üç alanın değerleri, sırasıyla "name", "email" ve "phone" değişkenlerine atanır.
  const { name, email, phone } = req.body;

  //eğer bilgilerden birisi eksikse, error handling yapıyoruz
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Tüm alanları doldurmak zorunludur.");
  }

  //eğer eksik değilse, girilen "name", "email" ve "phone" keyine göre yeni bir contact oluşturuyoruz (Contact.create)
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  //yanıt olarak oluşturulan kişiyi bize response olarak dön, aşağıdaki gibi

  /*
  {
    "_id": "641c4aa7d40daff920818372",
    "name": "Masum",
    "email": "masumgokyuz@gmail.com",
    "phone": "0551027617",
    "createdAt": "2023-03-23T12:48:39.559Z",
    "updatedAt": "2023-03-23T12:48:39.559Z",
    "__v": 0
  }
  */

  res.status(201).json(contact);
});

/* ---------------------------------------------------------------------------- */

// @amacımız: Get contact for given id
// @route: GET /api/contacts/:id
// @access: private

const getContact = asyncHandler(async (req, res) => {
  // parametre olarak girilen id'ye göre kullanıcıyı buluyoruz
  // örnek: Request URL: http://localhost:5001/api/contacts/:id (buradaki ":id" == req.params.id)
  const contact = await Contact.findById(req.params.id);

  // eğer kullanıcı yoksa hata döndürüyoruz
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  console.log(`${req.params.id} için GET talebi geldi.`);
  res.status(200).json(contact);
});

/* ---------------------------------------------------------------------------- */

// @amacımız: Update for given id
// @route: PUT /api/contacts/:id
// @access: private

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  // eğer kullanıcı yoksa hata döndürüyoruz
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // eğer contact'i kayıt eden kullanıcıyla update isteği gönderen kullanıcının id'leri aynı değilse
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other users' contacts."
    );
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    // hangi id'yi update edeceğimizi verilen parametre olarak belirliyoruz
    req.params.id,

    // id'si verilenin içeriği güncellenirken body olarak verileni esas alıyoruz (yani, id'si verilen neye göre güncellenecek? body olarak girilen veriye göre.)
    req.body,

    // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    { new: true }
  );
  res.status(200).json(updatedContact);
});

/* ---------------------------------------------------------------------------- */

// @amacımız: Delete the contact
// @route: DELETE /api/contacts/:id
// @access: private

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  // eğer kullanıcı yoksa hata döndürüyoruz
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  // eğer contact'i kayıt eden kullanıcıyla delete isteği gönderen kullanıcının id'leri aynı değilse
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User don't have permission to delete other users' contacts."
    );
  }
  // verilen id'deki contact'i silmek için
  // "_id" şeklinde olması database'de öyle olmasından dolayı
  // dolayısıyla id olarak verilenin db'den silinmesi için db'deki "_id"yi "id" ile aynı alıyoruz
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

/* ---------------------------------------------------------------------------- */

// contactRoutes.js'de veya başka bir yerde kullanabilmek için fonksiyonları export ediyoruz
module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
