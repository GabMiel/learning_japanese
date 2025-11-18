// lessonLoader.js — dynamic base path for GitHub Pages
document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("cardContainer");
  const sideNav = document.getElementById("sideNav");
  const header = document.getElementById("header");
  const headerTitle = header?.querySelector("h1");
  let lastScroll = 0;

  if (!cardContainer || !sideNav) return;

  // Create lesson header
  let lessonHeader = document.querySelector(".lesson-header");
  if (!lessonHeader) {
    lessonHeader = document.createElement("div");
    lessonHeader.className = "lesson-header";
    cardContainer.parentElement.insertBefore(lessonHeader, cardContainer);
  }

  // Hide header on scroll
  if (header) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      header.classList.toggle("hidden", currentScroll > lastScroll && currentScroll > 50);
      lastScroll = currentScroll;
    });
  }

  // Sanitize HTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Detect base path dynamically
  const basePath = `${window.location.origin}/learning_japanese/lessons`;

  // Load lesson data
  async function loadLesson(section, topic) {
    const jsonPath = `${basePath}/${section}/data/${topic}.json`;
    console.log("Loading JSON:", jsonPath);

    cardContainer.innerHTML = `<div class="loading-spinner"></div>`;
    lessonHeader.innerHTML = "";

    try {
      const res = await fetch(jsonPath, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const allowHtml = data.title === "Lesson 31: Position of Adverbs";

      // Determine if lesson data is nested (like letters)
      const nestedKey = Object.keys(data).find(
        k => typeof data[k] === "object" && !Array.isArray(data[k])
      );

      let lettersData = nestedKey ? data[nestedKey] : data;
      const letters = Object.keys(lettersData);
      if (letters.length === 0) {
        cardContainer.innerHTML = "<p>No data found.</p>";
        return;
      }

      const lessonTitle = escapeHtml(data.title || `Lesson: ${topic}`);
      lessonHeader.innerHTML = `<h1 class="lesson-title">${lessonTitle}</h1>`;

      // Build cards HTML
      let cardsHtml = "";
      letters.forEach(letter => {
        const items = lettersData[letter];
        if (!Array.isArray(items)) return;

        items.forEach((item, idx) => {
          cardsHtml += `
            <div class="card" data-sound="${item.sound || ""}">
              ${idx === 0 && nestedKey ? `<div class="letter-label">${letter}</div>` : ""}
              <h2>${allowHtml ? item.en || "" : escapeHtml(item.en || "")}</h2>
              <div class="jp">${allowHtml ? item.jp || "" : escapeHtml(item.jp || "")}</div>
              ${item.romaji ? `<div class="romaji">${escapeHtml(item.romaji)}</div>` : ""}
            </div>
          `;
        });
      });

      cardContainer.innerHTML = cardsHtml;

      // Attach click events for sound
      cardContainer.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
          const soundFile = card.dataset.sound;
          if (soundFile) {
            const audioPath = `${basePath}/${section}/sounds/${soundFile}`;
            const audio = new Audio(audioPath);
            audio.play().catch(err => console.warn("Sound play error:", err));
          }
          card.classList.add("clicked");
          setTimeout(() => card.classList.remove("clicked"), 200);
        });
      });

    } catch (err) {
      console.error("Error loading:", err);
      cardContainer.innerHTML = `<p>Failed to load: ${escapeHtml(topic)}</p>`;
    }
  }

  // Sidebar click handler
  sideNav.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-topic]");
    if (!link) return;

    e.preventDefault();

    const sectionBtn = link.closest(".section-item")?.querySelector(".section-btn");
    if (sectionBtn && headerTitle) headerTitle.textContent = sectionBtn.textContent;

    document.querySelectorAll("#sideNav a.active").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    localStorage.setItem("sidenav:active", JSON.stringify({
      section: link.dataset.section,
      topic: link.dataset.topic,
    }));

    loadLesson(link.dataset.section, link.dataset.topic);
    sideNav.classList.remove("open");
  });

  // Restore last active lesson
  try {
    const saved = JSON.parse(localStorage.getItem("sidenav:active") || "null");
    if (saved) {
      const sectionLink = sideNav.querySelector(`a[data-topic="${saved.topic}"]`);
      if (sectionLink) {
        const sectionBtn = sectionLink.closest(".section-item")?.querySelector(".section-btn");
        if (sectionBtn && headerTitle) headerTitle.textContent = sectionBtn.textContent;
        loadLesson(saved.section, saved.topic);
        return;
      }
    }
  } catch (e) {
    console.warn("Failed to restore saved lesson:", e);
  }

  // Default load
  if (headerTitle) headerTitle.textContent = "Section 1 — Basic Vocabulary";
  loadLesson("section1", "numbers");
});