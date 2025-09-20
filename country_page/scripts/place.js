function calculateWindChill(tempC, windKmh) {
  if (tempC <= 10 && windKmh > 4.8) {
    let windChill =
      13.12 +
      0.6215 * tempC -
      11.37 * Math.pow(windKmh, 0.16) +
      0.3965 * tempC * Math.pow(windKmh, 0.16);
    return windChill.toFixed(1);
  } else {
    return "N/A";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const temp = 10;
  const wind = 5;  
  document.getElementById("windchill").textContent = calculateWindChill(temp, wind) + " ℃";

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;
});