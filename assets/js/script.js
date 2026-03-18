'use strict';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials (guarded since the section may be removed)
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

if (modalContainer && modalCloseBtn && overlay && testimonialsItem.length > 0) {
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt;
      }
      if (modalTitle) modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      if (modalText) modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  }

  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables - only initialize if elements exist
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// Only add event listeners if the elements exist
if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  // Only run if filter items exist
  if (filterItems.length === 0) return;

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
if (filterBtn.length > 0) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    let targetPage = this.innerHTML.toLowerCase();
    
    // Map navigation button text to section data-page attributes
    const sectionNameMap = {
      'about': 'about',
      'resume': 'resume',
      'info': 'resume', // map new label to existing section key
      'certifications': 'certifications',
      'projects': 'projects',
      'contact': 'contact'
    };

    // Remove active class from all pages and navigation links
    for (let j = 0; j < pages.length; j++) {
      pages[j].classList.remove("active");
    }
    
    for (let j = 0; j < navigationLinks.length; j++) {
      navigationLinks[j].classList.remove("active");
    }

    // Find and activate the target page
    for (let j = 0; j < pages.length; j++) {
      if (sectionNameMap[targetPage] === pages[j].dataset.page) {
        pages[j].classList.add("active");
        this.classList.add("active");
        window.scrollTo(0, 0);
        break;
      }
    }

  });
}



// Seamless marquee setup (single initializer, triple-copy technique)
(function setupSeamlessMarquee(){
  const init = () => {
    const marquee = document.querySelector('.tech-marquee');
    const track = marquee ? marquee.querySelector('.tech-marquee-track') : null;
    if (!marquee || !track) return;

    if (!track.dataset.duplicated) {
      const originals = Array.from(track.children);
      if (originals.length === 0) return;
      // Create 2 extra copies (total 3 sequences) to mask any rounding drift
      for (let k = 0; k < 2; k++) {
        originals.forEach(node => track.appendChild(node.cloneNode(true)));
      }
      track.dataset.duplicated = 'true';
      track.dataset.originalCount = String(originals.length);
    }

    requestAnimationFrame(() => {
      // Force layout to settle
      void track.offsetWidth;
      const originalCount = parseInt(track.dataset.originalCount || '0', 10) || Math.floor(track.children.length / 3);

      // Sum widths of the first (original) sequence
      let itemsWidth = 0;
      for (let i = 0; i < originalCount; i++) {
        const rect = track.children[i].getBoundingClientRect();
        itemsWidth += rect.width;
      }

      // Include flex gap between items in that first sequence
      const cs = getComputedStyle(track);
      const gapPx = parseFloat(cs.columnGap || cs.gap || '0') || 0;
      const totalGap = gapPx * Math.max(0, originalCount - 1);

      const setWidth = itemsWidth + totalGap;
      if (setWidth <= 0) return;

      // Translate exactly one set width for a perfect loop
      const distance = (-setWidth).toFixed(3) + 'px';
      track.style.setProperty('--marquee-distance', distance);

      const speedPxPerSec = 120; // tune speed
      const duration = Math.max(15, setWidth / speedPxPerSec);

      track.style.animation = 'none';
      void track.offsetWidth;
      track.style.animation = `marquee-slide ${duration}s linear infinite`;
    });
  };

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init, { once: true });

  // Re-init on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => init(), 120);
  });
})();


// Web3Forms submission (no mail app, no backend required)
(function initContactSubmit(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const name = (document.getElementById('contact-name') || {}).value || '';
    const email = (document.getElementById('contact-email') || {}).value || '';
    const message = (document.getElementById('contact-message') || {}).value || '';

    // Web3Forms endpoint and payload
    const endpoint = 'https://api.web3forms.com/submit';
    const accessKey = '24dce459-12d8-48e0-8aad-6efd50bd347b';
    const payload = {
      access_key: accessKey,
      name: name,
      email: email,
      message: message,
      subject: `New message from ${name || 'Portfolio Visitor'}`,
    };

    const btn = document.getElementById('contact-send');
    const originalText = (btn || {}).innerText;
    if (btn) btn.innerText = 'Sending…';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data && (data.success || data.message === 'Submission successful')) {
        alert('Message sent successfully!');
        form.reset();
      } else {
        console.error('Web3Forms response:', data);
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Web3Forms error:', err);
      alert('Failed to send message. Please try again later.');
    } finally {
      if (btn) btn.innerText = originalText || 'Send Message';
    }
  });
})();


}); // Close DOMContentLoaded event listener