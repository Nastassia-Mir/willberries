const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

//carts
const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const modalClose = document.querySelector(".modal-close");

const openModal = function () {
  modalCart.classList.toggle("show");
};

let closeModal = function (e) {
  if (e.target.id != "modal-cart" && e.target.className != "modal-close")
    return;

  modalCart.classList.remove("show");
};

buttonCart.addEventListener("click", openModal);
modalCart.addEventListener("click", closeModal);

//scroll smoth
const scrollLinks = document.querySelectorAll("a.scroll-link");

{
  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", function (e) {
      e.preventDefault();
      const id = scrollLink.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}

//goods

const more = document.querySelector(".more");
const navigationLink = document.querySelectorAll(".navigation-link");
const buttomBanner = document.querySelectorAll(".button");
const longGoodsList = document.querySelector(".long-goods-list");

const getGoots = async function () {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw "Ошибка:" + result.status;
  }
  return result.json();
};

const createCard = function (objCard) {
  const card = document.createElement("div");
  card.className = "col-lg-3 col-sm-6";
  console.log(objCard);
  card.innerHTML = `<div class="goods-card">
  ${objCard.label ? `<span class="label">${objCard.label}</span>` : ""}
  
  <img
    src="db/${objCard.img}"
    alt="${objCard.name}"
    class="goods-image"
  />
  <h3 class="goods-title">Embroidered Hoodie</h3>
  <p class="goods-description">${objCard.description}</p>
   <button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
    <span class="button-price">${objCard.price}</span>
  </button>
</div>`;

  return card;
};

const renderCards = function (data) {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
};

more.addEventListener("click", function (e) {
  e.preventDefault();
  getGoots().then(renderCards);
});

const filterCards = function (field, value) {
  getGoots()
    .then(function (data) {
      const filterdGoods = data.filter(function (good) {
        return good[field] === value;
      });
      return filterdGoods;
    })
    .then(renderCards);
};

navigationLink.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
    if (value && !field) {
      getGoots().then(renderCards);
    }
  });
});

buttomBanner.forEach(function (buttom) {
  buttom.addEventListener("click", function (e) {
    e.preventDefault();
    const field = buttom.dataset.field;
    const value = buttom.dataset.value;
    if (value && field) {
      filterCards(field, value);
    }
  });
});
