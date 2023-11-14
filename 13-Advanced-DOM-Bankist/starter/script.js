'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', (e) => openModal(e)));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Learn more button and nav panel

const btnScrollTo = document.querySelector(".btn--scroll-to");
const navElements = document.querySelectorAll(".nav__link");
const navContainer = document.querySelector(".nav");

const scroll = function(e) {
  e.preventDefault();
  
  if (e.target === document.querySelector(".nav__link--btn")) return;
  const section = document.querySelector(e.target.getAttribute("href") || "#section--1");
  section.scrollIntoView();
}
btnScrollTo.addEventListener("click", (e) => scroll(e));
navElements.forEach(elem => elem.addEventListener("click", (e) => scroll(e)));

const showHideElements = function(e, opacityValue) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((elem) => elem !== e.target && (elem.style.opacity = opacityValue));
    logo.style.opacity = opacityValue;
  }
}
navContainer.addEventListener("mouseover", (e) => showHideElements(e, 0.5));
navContainer.addEventListener("mouseout", (e) => showHideElements(e, 1));

const header = document.querySelector(".header");

const obsCallback = function(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navContainer.classList.add("sticky");
  } else {
    navContainer.classList.remove("sticky");
  }
}

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navContainer.getBoundingClientRect().height}px`
}

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

// Tabbed component

const tabsContainer = document.querySelector(".operations__tab-container");
const contents = document.querySelectorAll(".operations__content");
let activeTab = document.querySelector(".operations__tab--active");

const showTab = function(e) {
  const clickedTab = e.target.closest(".operations__tab");
  const prevIndex = activeTab.dataset.tab - 1;
  const currentIndex = clickedTab.dataset.tab - 1;
  if (clickedTab === activeTab) return;
  activeTab.classList.remove("operations__tab--active");
  clickedTab.classList.add("operations__tab--active");
  contents[prevIndex].classList.remove("operations__content--active");
  contents[currentIndex].classList.add("operations__content--active");
  activeTab = clickedTab;
}
tabsContainer.addEventListener("click", (e) => showTab(e));

// Section effect

const revealSection = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  } else {
    entry.target.classList.remove("section--hidden");
    sectionObserver.unobserve(entry.target);
  }
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})

const sections = document.querySelectorAll(".section");
sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden")
});

// Lazy loading images

const images = document.querySelectorAll("img[data-src]");

const loadImg = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.setAttribute("src", entry.target.dataset.src);
  entry.target.addEventListener("load", function() {
    entry.target.classList.remove("lazy-img");
  })
  imagesObserver.unobserve(entry.target);
}

const imgObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: "200px"
}

const imagesObserver = new IntersectionObserver(loadImg, imgObsOptions);
images.forEach((image) => {
  imagesObserver.observe(image);
});

// Slider

const nextBtn = document.querySelector(".slider__btn--right");
const prevBtn = document.querySelector(".slider__btn--left")
const dotContainer = document.querySelector(".dots");
const slides = document.querySelectorAll(".slide");
let slide = 0;

const createDots = function() {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${index}"></button>`)
  });
}
createDots();

const activateDot = function(slide) {
  const dots = document.querySelectorAll(".dots__dot");
  dots.forEach((dot) => dot.classList.remove("dots__dot--active"));
  dots[slide].classList.add("dots__dot--active");
}

const goToSlide = function(slideNum) {
  slides.forEach((slide, index) => slide.style.transform = `translate(${100 * (index - slideNum)}%)`);
  activateDot(slideNum);
}
goToSlide(slide);

const nextSlide = function() {
  if (slide < 2) slide++;
  else if (slide === 2) slide = 0;
  goToSlide(slide);
}
nextBtn.addEventListener("click", nextSlide);

const prevSlide = function() {
  if (slide > 0) slide--;
  else if (slide === 0) slide = 2;
  goToSlide(slide);
}
prevBtn.addEventListener("click", prevSlide);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    slide = e.target.dataset.slide;
    goToSlide(slide);
  }
});