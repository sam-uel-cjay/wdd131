const currentYear = document.getElementById("currentyear");
const lastModified = document.getElementById("lastModified");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modified: ${document.lastModified}`;