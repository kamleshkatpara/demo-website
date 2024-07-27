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

// Hide the template items
scrollerTemplateItem.style.display = "none";
listTemplateItem.style.display = "none";

// Fetch products data
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
  // Clone the template item
  const item = templateItem.cloneNode(true);

  // Set dynamic data
  item.querySelector(imgClass).src = product.image;
  item.querySelector(imgClass).alt = product.title;
  item.querySelector(titleClass).textContent = product.title;
  item.querySelector(priceClass).textContent = product.price;

  // Set button text and add click event if buttonClass is provided
  const button = item.querySelector(buttonClass);
  if (button) {
    button.textContent = "Buy Now";
    button.addEventListener("click", () => {
      console.log("Buy Now button clicked for product:", product.title);
      // Toggle visibility of button and counter
      button.style.display = "none";
      const counterContainer = item.querySelector(".counter-container");
      if (counterContainer) {
        counterContainer.style.display = "flex";
      }
    });
  }

  // Handle counter functionality if present
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

  // Show the cloned item
  item.style.display = "flex";

  // Append the item to the container
  container.appendChild(item);
}

// Grab-and-drag functionality for desktop
let isDragging = false;
let startX;
let scrollLeft;

scrollerContainer.addEventListener("mousedown", (event) => {
  isDragging = true;
  startX = event.pageX - scrollerContainer.offsetLeft;
  scrollLeft = scrollerContainer.scrollLeft;
  scrollerContainer.style.cursor = "grabbing"; // Change cursor to grabbing
});

scrollerContainer.addEventListener("mouseleave", () => {
  isDragging = false;
  scrollerContainer.style.cursor = "grab"; // Change cursor back to grab
});

scrollerContainer.addEventListener("mouseup", () => {
  isDragging = false;
  scrollerContainer.style.cursor = "grab"; // Change cursor back to grab
});

scrollerContainer.addEventListener("mousemove", (event) => {
  if (!isDragging) return;
  event.preventDefault();
  const x = event.pageX - scrollerContainer.offsetLeft;
  const walk = (x - startX) * 2; // Adjust scroll speed here
  scrollerContainer.scrollLeft = scrollLeft - walk;
});

// Scroll functionality for scroller
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

/** Load carousel and products */
window.onload = function () {
  createIndicators();
  showSlides(slideIndex);
  startAutoSlide();
  generateProductsListScroller();
  fetchProductList();
};
