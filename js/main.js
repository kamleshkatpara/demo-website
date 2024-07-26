/**
 * Carousel Code
 */
let slideIndex = 1;
let slideInterval;

function showSlides(n) {
  const slides = document.getElementsByClassName("carousel__slide");
  const dots = document.getElementsByClassName("carousel__dot");
  
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  
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
  showSlides(slideIndex += n);
  resetAutoSlide();
}

function currentSlide(n) {
  showSlides(slideIndex = n);
  resetAutoSlide();
}

function createIndicators() {
  const slides = document.getElementsByClassName("carousel__slide");
  const indicatorsContainer = document.getElementById("carousel-indicators");
  
  indicatorsContainer.innerHTML = '';
  
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

window.onload = function() {
  createIndicators();
  showSlides(slideIndex);
  startAutoSlide();
};

/**
 * Products List Scroller
 */

const container = document.querySelector(".products__list__scroller__container");
const leftArrow = document.querySelector(".products__list__scroller__arrow--left");
const rightArrow = document.querySelector(".products__list__scroller__arrow--right");

leftArrow.addEventListener("click", () => {
  container.scrollBy({
    left: -300,
    behavior: "smooth"
  });
});

rightArrow.addEventListener("click", () => {
  container.scrollBy({
    left: 300,
    behavior: "smooth"
  });
});
  