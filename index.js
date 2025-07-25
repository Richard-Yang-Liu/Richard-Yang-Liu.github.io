// ========== EmailJS ==========

document.addEventListener('DOMContentLoaded', function() {
  emailjs.init({ publicKey: "7YivLSnBuL9Ur_HE0" });

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const submitTime = document.getElementById('submit-time');
      if (submitTime) {
        submitTime.value = new Date().toLocaleString();
      }

      emailjs.sendForm('richard_yang', 'index_reply', this)
        .then(() => {
          showSuccessModal();
          form.reset();
        }, (error) => {
          alert('Failed: ' + error.text);
        });
    });
  }

  // ========== Bottom ==========

  const tabBtns = document.querySelectorAll('.tab_btn');
  const tabPanels = document.querySelectorAll('.tab_panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        if (panel.id === 'tab-' + tabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      setTimeout(() => {
        if (document.getElementById('tab-hobbies')?.classList.contains('active')) {
          startHobbiesFlip();
        } else {
          stopHobbiesFlip();
        }
      }, 200);

      if (tabId === 'achievement') {
        expandGlassCertCards();
      }
    });
  });

  // ========== Skills Cycle ==========

  let animated = false;
  let tagsOpened = false;
  const section = document.getElementById('career');

  function animateCircles() {
    if (animated) return;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      document.querySelectorAll('.circle_progress').forEach((circle, idx) => {
        const percent = parseInt(circle.dataset.percent, 10) || 0;
        const svg = circle.querySelector('svg');
        const gradId = `circleGradient${idx}`;
        if (!svg.querySelector(`#${gradId}`)) {
          const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
          grad.setAttribute("id", gradId);
          grad.setAttribute("x1", "0%");
          grad.setAttribute("x2", "100%");
          grad.innerHTML = `<stop offset="0%" stop-color="#49fbd5"/><stop offset="100%" stop-color="#38b8fc"/>`;
          defs.appendChild(grad);
          svg.prepend(defs);
        }
        const circleBar = svg.querySelector('.circle_bar');
        const text = svg.querySelector('.circle_percent');
        const circumference = 2 * Math.PI * 44;
        circleBar.setAttribute("stroke", `url(#${gradId})`);
        let current = 0;
        text.textContent = "0%";
        circleBar.style.strokeDasharray = circumference;
        circleBar.style.strokeDashoffset = circumference;
        const step = Math.max(1, Math.ceil(percent / 50));
        const interval = setInterval(() => {
          current += step;
          if (current >= percent) {
            text.textContent = percent + "%";
            circleBar.style.strokeDashoffset = circumference * (1 - percent / 100);
            clearInterval(interval);
          } else {
            text.textContent = current + "%";
            circleBar.style.strokeDashoffset = circumference * (1 - current / 100);
          }
        }, 18);
      });
      animated = true;
    }
  }

  function handleTagsExpand() {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    if (Math.abs(sectionCenter - viewportCenter) < window.innerHeight * 0.25) {
      if (!tagsOpened) {
        document.querySelectorAll('.skills_circle_card').forEach(card => card.classList.add('active'));
        tagsOpened = true;
      }
    } else {
      if (tagsOpened) {
        document.querySelectorAll('.skills_circle_card').forEach(card => card.classList.remove('active'));
        tagsOpened = false;
      }
    }
  }

  window.addEventListener("scroll", () => {
    animateCircles();
    handleTagsExpand();
  });
  animateCircles();
  handleTagsExpand();

  // ========== Hobby ==========

  let hobbiesFlipInterval = null;
  let currentFlipIdx = 0;
  const flipDelay = 1750;

  function startHobbiesFlip() {
    const hobbiesPanel = document.getElementById('tab-hobbies');
    if (!hobbiesPanel?.classList.contains('active')) return;
    const items = hobbiesPanel.querySelectorAll('.hobby_picture_item .hobby_picture_inner');
    if (!items.length) return;
    clearInterval(hobbiesFlipInterval);
    items.forEach(i => i.style.transform = 'rotateY(0deg)');
    currentFlipIdx = 0;
    hobbiesFlipInterval = setInterval(() => {
      items.forEach(i => i.style.transform = 'rotateY(0deg)');
      items[currentFlipIdx].style.transform = 'rotateY(180deg)';
      currentFlipIdx = (currentFlipIdx + 1) % items.length;
    }, flipDelay);
  }
  function stopHobbiesFlip() {
    clearInterval(hobbiesFlipInterval);
    hobbiesFlipInterval = null;
  }

  setTimeout(() => {
    if (document.getElementById('tab-hobbies')?.classList.contains('active')) {
      startHobbiesFlip();
    }
  }, 300);

  // ========== Achinevement ==========

  function expandGlassCertCards() {
    const cert = document.querySelector('.glass-cert-container');
    cert?.classList.remove('expanded');
    setTimeout(() => {
      cert?.classList.add('expanded');
    }, 30);
  }

  // ========== Hire Me Cards ==========

  const cards = document.querySelectorAll('.hireCard');
  if (cards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          } else {
            entry.target.classList.remove('active');
          }
        });
      },
      { threshold: 0.85 }
    );
    cards.forEach(card => observer.observe(card));
  }

});


// ========== Send Email ==========

function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
      // 聚焦关闭按钮提升可访问性
      const closeBtn = document.getElementById('close-modal-btn');
      if (closeBtn) closeBtn.focus();
    }, 10);
    document.body.style.overflow = 'hidden';
  }
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 200);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('close-modal-btn');
  if (closeBtn) closeBtn.onclick = closeSuccessModal;
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.addEventListener('click', function(e){
      if (e.target === modal) closeSuccessModal();
    });
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSuccessModal();
});


// ========== Last Modified ==========

document.addEventListener('DOMContentLoaded', function () {
  const mod = document.getElementById('last-mod-date');
  if (mod) {
    mod.textContent = new Date(document.lastModified).toLocaleString();
  }
});
