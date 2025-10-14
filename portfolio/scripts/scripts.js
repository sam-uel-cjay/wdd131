// ========== DOM ELEMENTS ==========
const themeButton = document.querySelector("#theme-toggle");
const contactForm = document.querySelector("#contact-form");
const messageBox = document.querySelector("#form-message");
const recentVisitors = JSON.parse(localStorage.getItem("recentVisitors")) || [];
const projectGrid = document.querySelector(".projects-grid");

//  Toggle between light and dark theme
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-theme");

  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeButton.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

//  Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeButton.textContent = "☀️ Light Mode";
  }
}

//  Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    messageBox.textContent = "⚠️ Please fill out all fields before submitting.";
    messageBox.style.color = "red";
    return;
  }

  recentVisitors.push(name);
  localStorage.setItem("recentVisitors", JSON.stringify(recentVisitors));

  messageBox.textContent = `✅ Thank you, ${name}! Your message has been sent successfully.`;
  messageBox.style.color = "green";

  contactForm.reset();
}

//  Show recent visitors
function showRecentVisitors() {
  if (recentVisitors.length > 0) {
    const visitorList = recentVisitors.map(v => `<li>${v}</li>`).join("");
    document.querySelector("#visitors").innerHTML = `<h3>Recent Visitors</h3><ul>${visitorList}</ul>`;
  }
}

//  Display projects using an array + loop + template literals
function displayProjects() {
  if (!projectGrid) return;

  const projects = [
    {
      title: "Study Assistant Bot",
      description: "A Python-based terminal assistant that manages study tasks, reminders, and quizzes. Includes API integration and will later become a web app.",
      image: "https://bairesdev.mo.cloudinary.net/blog/2023/06/Is-Python-good-for-software-development.jpg",
      link: "#"
    },
    {
      title: "Personal Portfolio Website",
      description: "A responsive, multi-page site designed from scratch to showcase my skills, experience, and contact information. Built with HTML, CSS, and JavaScript.",
      image: "images/porto.png",
      link: "#"
    },
    {
      title: "Rafting Company Website",
      description: "A clean, grid-based rafting website designed as part of WDD130 coursework, featuring About, Trips, and Contact pages.",
        image: "images/white water.png",
      link: "#"
    }
  ];

  let output = "";
  for (const project of projects) {
    output += `
      <article class="project-card">
        <img src="${project.image}" alt="${project.title} preview" loading="lazy">
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <a href="${project.link}" class="btn">View Project</a>
      </article>
    `;
  }

  projectGrid.innerHTML = output;
}

// ========== EVENT LISTENERS ==========
if (themeButton) themeButton.addEventListener("click", toggleTheme);
if (contactForm) contactForm.addEventListener("submit", handleFormSubmit);

// Run on page load
loadTheme();
showRecentVisitors();
displayProjects();
