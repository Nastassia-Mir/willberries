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
const more = document.querySelector(".more");
const navigationLink = document.querySelectorAll(".navigation-link");
const buttomBanner = document.querySelectorAll(".button");
const longGoodsList = document.querySelector(".long-goods-list");
const cartTableGoods = document.querySelector(".cart-table__goods");
const cardTableTotal = document.querySelector(".card-table__total");
const cartCount = document.querySelector(".cart-count");
const clearCart = document.querySelector(".clear-cart");

const getGoots = async () => {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw "Ошибка:" + result.status;
  }
  return result.json();
};

const cart = {
  cartGoods: [],
  countQuantity() {
    cartCount.textContent = this.cartGoods.reduce((sum, item) => {
      return sum + item.count;
    }, 0);
  },
  renderCart() {
    cartTableGoods.textContent = "";
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement("tr");
      trGood.className = "cart-item";
      trGood.dataset.id = id;
      trGood.innerHTML = `<td>${name}</td>
        <td>${price}$</td>
      <td><button class="cart-btn-minus">-</button></td>
      <td>${count}</td>
      <td><button class="cart-btn-plus">+</button></td>
      <td>${price * count}$</td>
      <td><button class="cart-btn-delete">x</button></td>`;
      cartTableGoods.append(trGood);
    });
    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
    cardTableTotal.textContent = totalPrice + "$";
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => id !== item.id);
    this.renderCart();
    this.countQuantity();
  },
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart();
    this.countQuantity();
  },
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
    this.countQuantity();
  },
  addCartGoods(id) {
    const goodItem = this.cartGoods.find((item) => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoots()
        .then((data) => data.find((item) => item.id === id))
        .then(({ id, name, price }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1,
          });
          this.countQuantity();
        });
    }
  },
  clearCartGoods() {
    this.cartGoods.length = 0;
    this.renderCart();
    this.countQuantity();
  },
};

clearCart.addEventListener("click", () => cart.clearCartGoods());

document.body.addEventListener("click", (e) => {
  const addToCart = e.target.closest(".add-to-cart");
  if (addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
  }
});

cartTableGoods.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("cart-btn-delete")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.deleteGood(id);
  }

  if (target.classList.contains("cart-btn-minus")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.minusGood(id);
  }
  if (target.classList.contains("cart-btn-plus")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.plusGood(id);
  }
});

const openModal = () => {
  cart.renderCart();
  modalCart.classList.toggle("show");
};

let closeModal = () => {
  modalCart.classList.remove("show");
};

buttonCart.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);

modalCart.addEventListener("click", (e) => {
  if (e.target.classList.contains("overlay")) {
    closeModal();
  }
});

//scroll smoth
const scrollLinks = document.querySelectorAll("a.scroll-link");

{
  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", (e) => {
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

const createCard = (objCard) => {
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

const renderCards = (data) => {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
};

more.addEventListener("click", (e) => {
  e.preventDefault();
  getGoots().then(renderCards);
});

const filterCards = (field, value) => {
  getGoots()
    .then((data) => data.filter((good) => good[field] === value))
    .then(renderCards);
};

navigationLink.forEach((link) => {
  link.addEventListener("click", (e) => {
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

const modalForm = document.querySelector(".modal-form");
const buttonForm = document.querySelector(".cart-buy");
const modalInput = document.querySelectorAll(".modal-input");
const postData = (dataUser) =>
  fetch("server.php", {
    method: "POST",
    body: dataUser,
  });

buttonForm.addEventListener("click", (e) => {
  e.preventDefault();
  let count = 0;
  modalInput.forEach((input) => {
    if (input.value.length === 0 || input.value.match(/^[ ]+$/)) {
      count++;
    }
  });
  if (cart.cartGoods.length === 0 || count > 0) {
    alert("ваша карзина пуста или данные пусты");
    return;
  }
  const formData = new FormData(modalForm);
  formData.append("cart", JSON.stringify(cart.cartGoods));

  postData(formData)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      alert("все супер");
    })
    .catch((err) => {
      alert("ошибка");
    })
    .finally(() => {
      closeModal();
      modalForm.reset();
      cart.clearCartGoods();
    });
});
