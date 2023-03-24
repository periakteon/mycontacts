// login form elementini daha sonra kullanmak için referans alıyoruz
const loginForm = document.getElementById("login-form");

// login status elementini daha sonra kullanmak için referans alıyoruz
const loginStatus = document.getElementById("login-status");

// login formundaki submit butonu için EventListener ekliyoruz
loginForm.addEventListener("submit", async (event) => {
  // login formuna yönelik kullanıcı tıklamasını veya sayfa yenilemesini vb. engelliyoruz
  event.preventDefault();

  // "başarılı" veya "başarısız" şeklinde dönecek divi görünür hale getiriyoruz
  loginStatus.style.display = "block";

  // daha sonra JSON şeklinde verileri göndermek için girilen değerleri alıyoruz (body tesisi için)
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // endpoint'e göndereceğimiz body için JSON dosyası oluşturuyoruz (email ve password'ü JSON haline getiriyoruz)
  const body = JSON.stringify({ email, password });

  // POST metodu kullanarak body'yi endpoint'e gönderiyoruz
  const response = await fetch("http://localhost:5001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  })
    .then((response) => {
      // eğer 200, yani OK cevabı alırsak, login status div'ini "Giriş başarılı!" olarak güncelliyoruz
      if (response.status === 200) {
        loginStatus.textContent = "Giriş başarılı! Yönlendiriliyorsunuz.";
      }
      // Kalan tüm durumlarda, login status div'ini "Giriş başarısız!" olarak güncelliyoruz
      else {
        loginStatus.textContent = "Giriş başarısız!";
        throw new Error("Giriş başarısız!");
      }

      // bir sonraki promise zincirinde accessToken'a erişmek için yanıtı JSON olarak döndürüyoruz
      return response.json();
    })
    .then((data) => {
      // gelen body'deki accessToken nesnesine erişiyoruz
      const accessToken = data.accessToken;

      // ileriki süreçlerde kullanmak üzere accessToken'ı yerel olarak kaydediyoruz
      localStorage.setItem("accessToken", accessToken);

      // giriş başarılı olursa 3 saniye sonra yazılara yönlendiriyoruz
      setTimeout(() => {
        window.location.href = "/yazilar.html";
      }, 3000);
    })
    .catch((error) => {
      console.error("Giriş yaparken bir sorun oluştu:", error);
    });
});
