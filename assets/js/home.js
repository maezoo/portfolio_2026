'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (window.Swiper && document.querySelector('.project-swiper')) {
    new Swiper('.project-swiper', {
      slidesPerView: 1.08,
      spaceBetween: 18,
      breakpoints: { 720: { slidesPerView: 1.6 }, 1024: { slidesPerView: 2.2 } }
    });
  }
});
