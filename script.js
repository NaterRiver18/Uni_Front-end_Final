const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const cookieNotification = document.getElementById('cookieNotification');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const weatherContainer = document.getElementById('weatherContainer');

document.addEventListener('DOMContentLoaded', () => {
  setupBurgerMenu();
  setupScrollEffects();
  setupContactModal();
  setupForms();
  setupPasswordToggle();
  showCookieNotification();
  fetchWeather(); 
});

function setupBurgerMenu() {
  burgerMenu.addEventListener('click', e => {
    e.stopPropagation();
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navMenu.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', () => {
    burgerMenu.classList.remove('active');
    navMenu.classList.remove('active');
  });
}

function setupScrollEffects() {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
    scrollToTopBtn.classList.toggle('show', window.scrollY > 400);
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupContactModal() {
  document.querySelectorAll('.contact-btn, a[href="#contact"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      contactModal.style.display = 'block';
    });
  });

  contactModal.querySelector('.close').addEventListener('click', () => {
    contactModal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === contactModal) {
      contactModal.style.display = 'none';
    }
  });
}

function setupForms() {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(contactForm));
    clearErrors();

    if (!data.name || data.name.length < 2) return showError('name');
    if (!validateEmail(data.email)) return showError('email');
    if (!validatePassword(data.password)) return showError('password');
    if (data.password !== data.confirmPassword) return showError('confirmPassword');

    alert('Form submitted successfully!');
    contactForm.reset();
    contactModal.style.display = 'none';
  });

  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;

    if (!validateEmail(email)) return alert('Invalid email');
    alert('Subscribed successfully!');
    newsletterForm.reset();
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function showError(id) {
  document.getElementById(id).classList.add('error');
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function setupPasswordToggle() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });
}

function showCookieNotification() {
  if (!localStorage.getItem('cookiesAccepted')) {
    cookieNotification.classList.add('show');
  }
}

acceptCookiesBtn.addEventListener('click', () => {
  localStorage.setItem('cookiesAccepted', 'true');
  cookieNotification.classList.remove('show');
});

async function fetchWeather() {
  try {
    const city = 'London';
    const apiKey = 'ff4ea6683b28eb90cd34547b70a23638';
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await res.json();

    if (weatherContainer) {
      weatherContainer.innerHTML = `
        <span>${data.name}</span>
        <span>${Math.round(data.main.temp)}°C</span>
        <span>${data.weather[0].description}</span>
      `;
    }
  } catch (err) {
    console.log('Weather not available', err);
  }
}



