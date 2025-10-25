// lessonLoader.js — fetches JSON lesson data and renders cards

document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("cardContainer");
  const sideNav = document.getElementById("sideNav");
  const header = document.getElementById("header");
  let lastScroll = 0;

  if (!cardContainer || !sideNav) return;

  // Hide header on scroll
  if (header) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }
      lastScroll = currentScroll;
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function loadLesson(section, topic) {
    const jsonPath = `../${section}/data/${topic}.json`;
    console.log("Loading:", jsonPath);
    cardContainer.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch(jsonPath, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.numbers)
        ? data.numbers
        : [];

      if (items.length === 0) {
        cardContainer.innerHTML = "<p>No data found.</p>";
        return;
      }

      cardContainer.innerHTML = items.map(item => `
        <div class="card">
          <h2>${escapeHtml(item.en || item.english || "")}</h2>
          <div class="jp">${escapeHtml(item.jp || item.japanese || "")}</div>
          ${item.romaji ? `<div class="romaji">${escapeHtml(item.romaji)}</div>` : ""}
        </div>
      `).join("");
    } catch (err) {
      console.error("Error loading:", err);
      cardContainer.innerHTML = `<p>Failed to load: ${escapeHtml(topic)}</p>`;
    }
  }

  sideNav.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-topic]");
    if (!link) return;

    e.preventDefault();
    document.querySelectorAll("#sideNav a.active").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    loadLesson(link.dataset.section, link.dataset.topic);
    sideNav.classList.remove("open");
  });

  // Default load
  loadLesson("section1", "numbers");
});
