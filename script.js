const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('primary-nav');
const header = document.querySelector('.header');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
    header.classList.toggle('header-open', !expanded);
  });

  // Close menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      header.classList.remove('header-open');
    }
  });

  // Close when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && menuToggle.getAttribute('aria-expanded') === 'true') {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      header.classList.remove('header-open');
    }
  });
}

// Back-to-top behavior and footer interactions
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const showAt = 300;
  window.addEventListener('scroll', () => {
    if (window.scrollY > showAt) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Product carousel logic: autoplay, nav, and basic drag */
(() => {
  const track = document.querySelector('.product-track');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  if (!track) return;

  const cards = Array.from(track.children);
  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let rafId = null;
  const autoplayDelay = 3600;
  let autoplayTimer = null;

  function update() {
    const cardWidth = cards[0].getBoundingClientRect().width + 18; // gap
    currentTranslate = -index * cardWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function next() { index = (index + 1) % cards.length; update(); }
  function prev() { index = (index - 1 + cards.length) % cards.length; update(); }

  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, autoplayDelay);
  }

  // Basic pointer drag
  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    track.style.transform = `translateX(${currentTranslate + dx}px)`;
  });

  track.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - startX;
    const threshold = (cards[0].getBoundingClientRect().width || 220) / 3;
    if (dx < -threshold) next();
    else if (dx > threshold) prev();
    track.style.transition = '';
    update();
    resetAutoplay();
  });

  track.addEventListener('pointercancel', () => { isDragging = false; update(); resetAutoplay(); });

  // Pause autoplay on hover/focus
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', resetAutoplay);
  }

  // init
  window.addEventListener('load', () => { update(); resetAutoplay(); });
  window.addEventListener('resize', update);
})();

/* Reveal product cards when they enter the viewport */
(function() {
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => obs.observe(card));
})();

// Social icon tap animation
document.querySelectorAll('.socials .social').forEach((socialLink) => {
  socialLink.addEventListener('click', () => {
    socialLink.classList.remove('is-tapped');
    // restart animation reliably
    void socialLink.offsetWidth;
    socialLink.classList.add('is-tapped');
    window.setTimeout(() => socialLink.classList.remove('is-tapped'), 450);
  });
});

// Improve focus accessibility for footer location button
const locBtn = document.querySelector('.location-btn');
const locationPicker = document.querySelector('.location-picker');
const locationLabel = document.querySelector('.location-label');
const countryMenu = document.querySelector('.country-menu');
const countryList = document.querySelector('.country-list');
const countrySearch = document.querySelector('.country-search-input');

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

let countryLinks = [];

if (countryList) {
  countryList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  countries.forEach((country) => {
    const countryLink = document.createElement('a');
    countryLink.href = '#';
    countryLink.role = 'menuitem';
    countryLink.textContent = country;
    countryLink.dataset.country = country;
    fragment.appendChild(countryLink);
  });
  countryList.appendChild(fragment);
  countryLinks = Array.from(countryList.querySelectorAll('a[data-country]'));
}

function filterCountries(query) {
  const normalizedQuery = query.trim().toLowerCase();
  let firstVisible = null;

  countryLinks.forEach((countryLink) => {
    const matches = countryLink.dataset.country.toLowerCase().includes(normalizedQuery);
    countryLink.classList.toggle('is-hidden', normalizedQuery.length > 0 && !matches);
    countryLink.classList.remove('is-active');
    if (!countryLink.classList.contains('is-hidden') && !firstVisible) {
      firstVisible = countryLink;
    }
  });

  if (firstVisible) {
    firstVisible.classList.add('is-active');
  }

  return firstVisible;
}

function resetCountryFilter() {
  if (countrySearch) {
    countrySearch.value = '';
  }
  filterCountries('');
}

if (locBtn && locationPicker) {
  locBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = locationPicker.classList.contains('open');
    locationPicker.classList.toggle('open', !isOpen);
    locBtn.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen && countrySearch) {
      window.setTimeout(() => {
        countrySearch.focus();
        countrySearch.select();
      }, 0);
    }
  });

  document.addEventListener('click', (event) => {
    if (!locationPicker.contains(event.target) && locationPicker.classList.contains('open')) {
      locationPicker.classList.remove('open');
      locBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && locationPicker.classList.contains('open')) {
      locationPicker.classList.remove('open');
      locBtn.setAttribute('aria-expanded', 'false');
      resetCountryFilter();
      locBtn.focus();
    }
  });

  if (countrySearch) {
    countrySearch.addEventListener('input', () => {
      const activeMatch = filterCountries(countrySearch.value);
      if (activeMatch && activeMatch.dataset.country.toLowerCase() === countrySearch.value.trim().toLowerCase()) {
        activeMatch.classList.add('is-active');
      }
    });

    countrySearch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const activeMatch = countryLinks.find((countryLink) => !countryLink.classList.contains('is-hidden'));
        if (activeMatch && locationLabel) {
          locationLabel.textContent = activeMatch.dataset.country;
          locationPicker.classList.remove('open');
          locBtn.setAttribute('aria-expanded', 'false');
          resetCountryFilter();
        }
      }
    });
  }

  if (countryList && locationLabel) {
    countryList.addEventListener('click', (event) => {
      const countryLink = event.target.closest('a[data-country]');
      if (!countryLink) return;
      event.preventDefault();
      locationLabel.textContent = countryLink.dataset.country;
      locationPicker.classList.remove('open');
      locBtn.setAttribute('aria-expanded', 'false');
      resetCountryFilter();
    });
  }
}
