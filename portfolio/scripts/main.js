/* js/main.js
   Purpose: Provide required JS functionality for the portfolio:
   - render projects from an array (objects + array methods)
   - form validation + submission handling (DOM manipulation + conditional branching)
   - theme toggle persisted to localStorage
   - lazy-loading fallback using IntersectionObserver
   - all string HTML built using template literals
*/

// ---------- Data (objects + arrays) ----------
const projects = [
  {
    id: "studybot",
    title: "Study Assistant Bot",
    img: "https://bairesdev.mo.cloudinary.net/blog/2023/06/Is-Python-good-for-software-development.jpg",
    desc: "A Python-based personal study assistant that helps users organize tasks, take quizzes, and set reminders. Built with FastAPI, JSON storage, and SerpAPI integration.",
    url: "#"
  },
  {
    id: "portfolio",
    title: "Personal Portfolio Website",
    img: "images/porto.png",
    desc: "This responsive, multi-page site was designed from scratch to showcase my skills, experience, and contact information. Built with HTML, CSS, and JavaScript.",
    url: "#"
  },
  {
    id: "rafting",
    title: "Rafting Adventure Site",
    img: "images/white water.png",
    desc: "A class project focused on modern layout design using Grid and Flexbox, emphasizing usability and accessibility across devices.",
    url: "#"
  }
];

// ---------- Utility functions ----------
function qs(selector, scope = document) {
  return scope.querySelector(selector);
}
function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

// ---------- Render Projects (DOM manipulation + template literals) ----------
function renderProjects() {
  const grid = qs(".projects-grid");
  if (!grid) return; // page doesn't have projects grid
  const html = projects
    .map(p => {
      return `
        <article class="project-card" data-id="${p.id}">
          <img src="${p.img}" alt="${p.title} project preview" loading="lazy">
          <h2>${p.title}</h2>
          <p>${p.desc}</p>
          <a href="${p.url}" class="btn" aria-label="View ${p.title}">${p.url === '#' ? 'View Project' : 'View Project'}</a>
        </article>
      `;
    })
    .join("");
  grid.innerHTML = html;

  // Attach click handlers to project buttons (example DOM interaction)
  qsa(".project-card .btn", grid).forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const card = e.target.closest(".project-card");
      const id = card?.dataset?.id;
      showProjectModal(id);
    });
  });
}

// Example modal-ish function
function showProjectModal(id) {
  const p = projects.find(pr => pr.id === id);
  if (!p) {
    alert("Project not found.");
    return;
  }
  const content = `Project: ${p.title}\n\n${p.desc}\n\n(External link: ${p.url})`;
  alert(content);
}

// ---------- Form handling (validation, localStorage, DOM feedback) ----------
function handleContactForm() {
  const form = qs(".contact-form");
  if (!form) return;

  const name = qs("#name", form);
  const email = qs("#email", form);
  const subject = qs("#subject", form);
  const message = qs("#message", form);

  let feedback = qs("#formFeedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "formFeedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.style.marginTop = "1rem";
    form.appendChild(feedback);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameVal = name?.value.trim() || "";
    const emailVal = email?.value.trim() || "";
    const messageVal = message?.value.trim() || "";

    if (!nameVal || !emailVal || !messageVal) {
      feedback.innerHTML = `<p style="color:#c53030;">Please fill in the required fields (name, email, message).</p>`;
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      feedback.innerHTML = `<p style="color:#c53030;">Please enter a valid email address.</p>`;
      return;
    }

    const submission = {
      id: Date.now(),
      name: nameVal,
      email: emailVal,
      subject: subject?.value.trim() || "",
      message: messageVal,
      date: new Date().toISOString()
    };

    const key = "chijike_submissions";
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(submission);
    localStorage.setItem(key, JSON.stringify(existing));

    form.reset();
    feedback.innerHTML = `<p style="color:#00796B;">Thanks ${nameVal}! Your message was received locally. I'll get back to you soon.</p>`;

    setTimeout(() => {
      feedback.innerHTML = `
        <div style="padding:0.6rem;border-radius:6px;background:#f0fdf4;border:1px solid #c6f6d5;">
          <strong>Saved locally:</strong>
          <p>${submission.name} — ${submission.email}</p>
          <p>Message: ${submission.message.slice(0, 120)}${submission.message.length > 120 ? '…' : ''}</p>
        </div>
      `;
    }, 800);
  });
}

// ---------- Theme toggle ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("chijike_theme", theme);
}
function toggleTheme() {
  const current = localStorage.getItem("chijike_theme") || "light";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
}

// ---------- Lazy-load fallback ----------
function lazyLoadFallback() {
  const imgs = qsa("img[loading='lazy']");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset && img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: "200px 0px" });

    imgs.forEach(img => {
      io.observe(img);
    });
  }
}

// ---------- Small UI utility: show stored submissions ----------
function showStoredSubmissions() {
  const key = "chijike_submissions";
  const stored = JSON.parse(localStorage.getItem(key)) || [];
  if (!stored.length) return;
  const summary = stored.map(s => `• ${s.name} (${s.email}) — ${new Date(s.date).toLocaleString()}`);
  console.info("Local submissions:\n" + summary.join("\n"));
}

// ---------- Init ----------
function init() {
  renderProjects();
  handleContactForm();
  lazyLoadFallback();
  const savedTheme = localStorage.getItem("chijike_theme") || "light";
  applyTheme(savedTheme);
  const themeBtn = qs("#themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  showStoredSubmissions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
