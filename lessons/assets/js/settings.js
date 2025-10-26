// settings.js — controls column layout + credits popup

document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const cardContainer = document.getElementById("cardContainer");
  const creditsBtn = document.getElementById("creditsBtn");
  const creditsModal = document.getElementById("creditsModal");
  const closeModal = document.querySelector(".modal .close");

  // 🔹 Toggle right settings panel
  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("open");
  });

  // 🔹 Click outside to close the panel
  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      settingsPanel.classList.remove("open");
    }
  });

  // 🔹 Change grid column layout when clicking images
  document.querySelectorAll(".column-options img").forEach((img) => {
    img.addEventListener("click", () => {
      const cols = img.dataset.cols;
      cardContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

      // Save column preference
      localStorage.setItem("lesson:columns", cols);
    });
  });

  // 🔹 Load saved column layout on startup
  const savedCols = localStorage.getItem("lesson:columns");
  if (savedCols) {
    cardContainer.style.gridTemplateColumns = `repeat(${savedCols}, 1fr)`;
  }

  // 🔹 Credits modal open/close
  creditsBtn.addEventListener("click", () => {
    creditsModal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    creditsModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === creditsModal) {
      creditsModal.style.display = "none";
    }
  });
});
