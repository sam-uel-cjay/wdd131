function calculateWindChill(t, v) {
  return (t <= 10 && v > 4.8) ? (13.12 + 0.6215*t - 11.37*Math.pow(v,0.16) + 0.3965*t*Math.pow(v,0.16)).toFixed(1) : "N/A";
}

document.addEventListener("DOMContentLoaded", () => {
  const temp = 10;
  const wind = 5;  
  document.getElementById("windchill").textContent = calculateWindChill(temp, wind) + " ℃";

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;
});
