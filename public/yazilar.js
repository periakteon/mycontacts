const accessToken = localStorage.getItem('accessToken');

fetch("http://localhost:5001/api/contacts/", {
  headers: {
    method: "GET",
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("container");
    
    // en yeni olanı başta göstermek için sort ediyoruz
    // "a" ve "b" parametreleri burada temsili. aslında data'daki tüm nesneleri temsil ediyorlar.
    // "a" daha başta, "b" ise daha sonra geliyor - sırasal düzen itibariyle.
    // bunlar string olarak varlar, dolayısıyla bunlar arasında işlem yapmak için sayısal olana çevirmemiz gerek
    // bunun için "new Date" diyoruz ve en son olanın sayısal değeri daha büyük olduğu için ilk en son eklenen görünüyor
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    data.forEach((yazi) => {
      console.log(yazi);
      const name = yazi.name;
      const email = yazi.email;
      const phone = yazi.phone;
      const contactName = document.createElement("div"); // Create a new div element for each contact
      contactName.classList.add("card");
      const contactInfo = document.createElement("div"); // Create a new div element for each contact
      contactInfo.classList.add("card");
      contactName.innerHTML = `<p class="baslik">Name: ${name}</p><p>Email: ${email}</p><p>Phone: ${phone}</p><br>`; // Populate the div with contact information
      contactInfo.innerHTML = `<p>Email: ${email}</p><p>Phone: ${phone}</p>`; // Populate the div with contact information
      container.appendChild(contactName, contactInfo); // Append the new div element to the container div
    });
  })

  .catch((error) => {
    const articles = document.getElementById("articles-title");
    articles.style.display = "none";
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.innerHTML = "<p>ÜYE GİRİŞİ YAPILMADI. <br><br> LÜTFEN GÖRÜNTÜLEMEK İÇİN <a href='index.html'>ÜYE GİRİŞİ YAPIN</a></p>";
    document.querySelector("#container").appendChild(errorDiv);
  });  