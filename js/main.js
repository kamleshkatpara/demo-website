/**
 * Carousel Code
 */
let slideIndex = 1;
let slideInterval;

function showSlides(n) {
  const slides = document.getElementsByClassName("carousel__slide");
  const dots = document.getElementsByClassName("carousel__dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" carousel__dot--active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " carousel__dot--active";
}

function plusSlides(n) {
  showSlides((slideIndex += n));
  resetAutoSlide();
}

function currentSlide(n) {
  showSlides((slideIndex = n));
  resetAutoSlide();
}

function createIndicators() {
  const slides = document.getElementsByClassName("carousel__slide");
  const indicatorsContainer = document.getElementById("carousel-indicators");

  indicatorsContainer.innerHTML = "";

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("span");
    dot.className = "carousel__dot";
    dot.onclick = () => currentSlide(i + 1);
    indicatorsContainer.appendChild(dot);
  }
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(() => plusSlides(1), 5000);
}

/**
 * Products List Scroller
 */
const scrollerContainer = document.querySelector(
  ".products__list__scroller__container"
);
const scrollerLeftArrow = document.querySelector(
  ".products__list__scroller__arrow--left"
);
const scrollerRightArrow = document.querySelector(
  ".products__list__scroller__arrow--right"
);
const scrollerItemsContainer = scrollerContainer.querySelector(
  ".products__list__scroller__items"
);
const scrollerTemplateItem = document.querySelector(
  ".products__list__scroller__item"
);

const listContainer = document.querySelector(".product__list__container");
const listItemsContainer = listContainer.querySelector(".product__list__items");
const listTemplateItem = document.querySelector(".product__list__item");

scrollerTemplateItem.style.display = "none";
listTemplateItem.style.display = "none";

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching products", error);
  }
}

// Create product item function
function createProductItem(
  container,
  templateItem,
  product,
  imgClass,
  titleClass,
  priceClass,
  buttonClass
) {
  const item = templateItem.cloneNode(true);

  item.querySelector(imgClass).src = product.image;
  item.querySelector(imgClass).alt = product.title;
  item.querySelector(titleClass).textContent = product.title;
  item.querySelector(priceClass).textContent = product.price;

  const button = item.querySelector(buttonClass);
  if (button) {
    button.textContent = "Buy Now";
    button.addEventListener("click", () => {
      button.style.display = "none";
      const counterContainer = item.querySelector(".counter-container");
      if (counterContainer) {
        counterContainer.style.display = "flex";
      }
    });
  }

  const counter = item.querySelector(".counter");
  const minusButton = item.querySelector(".counter-button--minus");
  const plusButton = item.querySelector(".counter-button--plus");

  if (minusButton && plusButton) {
    minusButton.addEventListener("click", () => {
      let count = parseInt(counter.textContent);
      if (count > 1) {
        counter.textContent = count - 1;
      }
      if (count === 1) {
        item.querySelector(".counter-container").style.display = "none";
        button.style.display = "inline-block";
      }
    });

    plusButton.addEventListener("click", () => {
      let count = parseInt(counter.textContent);
      counter.textContent = count + 1;
    });
  }

  item.style.display = "flex";

  container.appendChild(item);
}

let startX,
  startScrollLeft,
  isDragging = false;

function handleStart(event) {
  if (event.type === "mousedown") {
    isDragging = true;
    startX = event.pageX;
    startScrollLeft = scrollerContainer.scrollLeft;
    scrollerContainer.style.cursor = "grabbing";
  } else if (event.type === "touchstart") {
    isDragging = true;
    startX = event.touches[0].pageX;
    startScrollLeft = scrollerContainer.scrollLeft;
  }
}

function handleMove(event) {
  if (!isDragging) return;

  let currentX;
  if (event.type === "mousemove") {
    currentX = event.pageX;
  } else if (event.type === "touchmove") {
    currentX = event.touches[0].pageX;
  }

  const distance = currentX - startX;
  scrollerContainer.scrollLeft = startScrollLeft - distance;
}

function handleEnd() {
  isDragging = false;
  scrollerContainer.style.cursor = "grab";
}

scrollerContainer.addEventListener("mousedown", handleStart);
scrollerContainer.addEventListener("mousemove", handleMove);
scrollerContainer.addEventListener("mouseup", handleEnd);
scrollerContainer.addEventListener("mouseleave", handleEnd);

scrollerContainer.addEventListener("touchstart", handleStart);
scrollerContainer.addEventListener("touchmove", handleMove);
scrollerContainer.addEventListener("touchend", handleEnd);

scrollerLeftArrow.addEventListener("click", () => {
  scrollerContainer.scrollBy({
    left: -300,
    behavior: "smooth",
  });
});

scrollerRightArrow.addEventListener("click", () => {
  scrollerContainer.scrollBy({
    left: 300,
    behavior: "smooth",
  });
});

async function generateProductsListScroller() {
  const data = await fetchProducts();
  data.forEach((product) => {
    createProductItem(
      scrollerItemsContainer,
      scrollerTemplateItem,
      product,
      ".products__list__scroller-img",
      ".products__list__scroller__title",
      ".products__list__scroller__price",
      ".products__list__scroller__btn"
    );
  });
}

async function fetchProductList() {
  const data = await fetchProducts();
  data.forEach((product) => {
    createProductItem(
      listItemsContainer,
      listTemplateItem,
      product,
      ".product__list-img",
      ".product__list__title",
      ".product__list__price",
      ".product__list__btn"
    );
  });
}

window.onload = function () {
  createIndicators();
  showSlides(slideIndex);
  startAutoSlide();
  generateProductsListScroller();
  fetchProductList();
};
