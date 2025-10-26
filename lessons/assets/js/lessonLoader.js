// lessonLoader.js — fixed version (2-column layout preserved + sound path fixed)

document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("cardContainer");
  const sideNav = document.getElementById("sideNav");
  const header = document.getElementById("header");
  const headerTitle = header?.querySelector("h1");
  let lastScroll = 0;

  if (!cardContainer || !sideNav) return;

  // 🔹 Create a separate container for the lesson title
  let lessonHeader = document.querySelector(".lesson-header");
  if (!lessonHeader) {
    lessonHeader = document.createElement("div");
    lessonHeader.className = "lesson-header";
    cardContainer.parentElement.insertBefore(lessonHeader, cardContainer);
  }

  // 🔹 Hide header on scroll
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
    console.log("Loading JSON:", jsonPath);
    cardContainer.innerHTML = "<p>Loading...</p>";
    lessonHeader.innerHTML = "";

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

      const lessonTitle = escapeHtml(data.title || `Lesson: ${topic}`);
      lessonHeader.innerHTML = `<h1 class="lesson-title">${lessonTitle}</h1>`;

      // 🔹 Render cards
      cardContainer.innerHTML = items
        .map(
          (item) => `
        <div class="card" data-sound="${item.sound || ""}">
          <h2>${escapeHtml(item.en || item.english || "")}</h2>
          <div class="jp">${escapeHtml(item.jp || item.japanese || "")}</div>
          ${
            item.romaji
              ? `<div class="romaji">${escapeHtml(item.romaji)}</div>`
              : ""
          }
        </div>
      `
        )
        .join("");

      // 🔹 Add sound playback
      cardContainer.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => {
          const soundFile = card.dataset.sound;
          if (soundFile) {
            const audioPath = `../section1/sounds/${soundFile}`;
            console.log("🔊 Playing sound:", audioPath);
            const audio = new Audio(audioPath);
            audio.play().catch((err) => console.warn("Sound play error:", err));
          } else {
            console.warn("⚠️ No sound file found for this card.");
          }

          // Card animation
          card.classList.add("clicked");
          setTimeout(() => card.classList.remove("clicked"), 200);
        });
      });
    } catch (err) {
      console.error("Error loading:", err);
      cardContainer.innerHTML = `<p>Failed to load: ${escapeHtml(topic)}</p>`;
    }
  }

  // 🔹 Sidebar click handler
  sideNav.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-topic]");
    if (!link) return;

    e.preventDefault();

    const sectionBtn = link.closest(".section-item")?.querySelector(".section-btn");
    if (sectionBtn && headerTitle) {
      headerTitle.textContent = sectionBtn.textContent;
    }

    document.querySelectorAll("#sideNav a.active").forEach((a) => a.classList.remove("active"));
    link.classList.add("active");

    localStorage.setItem(
      "sidenav:active",
      JSON.stringify({ section: link.dataset.section, topic: link.dataset.topic })
    );

    loadLesson(link.dataset.section, link.dataset.topic);
    sideNav.classList.remove("open");
  });

  // 🔹 Restore last active lesson
  try {
    const saved = JSON.parse(localStorage.getItem("sidenav:active") || "null");
    if (saved) {
      const sectionLink = sideNav.querySelector(`a[data-topic="${saved.topic}"]`);
      if (sectionLink) {
        const sectionBtn = sectionLink.closest(".section-item")?.querySelector(".section-btn");
        if (sectionBtn && headerTitle) {
          headerTitle.textContent = sectionBtn.textContent;
        }
        loadLesson(saved.section, saved.topic);
        return;
      }
    }
  } catch (e) {
    console.warn("Failed to restore saved lesson:", e);
  }

  // 🔹 Default load
  if (headerTitle) headerTitle.textContent = "Section 1 — Basic Vocabulary";
  loadLesson("section1", "numbers");
});
