// sidebar.js — floating collapsible sidebar with persistent open state
document.addEventListener("DOMContentLoaded", () => {
  const sideNav = document.getElementById("sideNav");
  const menuBtn = document.getElementById("menuBtn");
  if (!sideNav || !menuBtn) return;

  // ---- Data ---------------------------------------------------------------
  const sections = {
    "Section 1 — Basic Vocabulary": [
      "numbers",
      "ordinal_numbers",
      "fractions",
      "multiple_numbers",
      "month",
      "weekdays",
      "seasons",
      "time",
      "nature",
      "metals"
    ],
    "Section 2 — People and Pronouns": ["titles_of_address", "pronouns"],
    "Section 3 — Grammar and Structure": [
      "prepositions",
      "this_and_that",
      "suffix_in_subjective_case",
      "interrogatives",
      "suffix_in_objective_case",
      "ta",
      "su",
      "sho",
      "past_and_present",
      "auxiliary_is_being",
      "auxiliary_is_action"
    ],
    "Section 4 — Adjectives and Adverbs": [
      "adjectives",
      "adverbs_of_time",
      "adverbs_of_place",
      "adverbs_of_direction",
      "adverbs_of_quantity_and_degree",
      "adverbs_of_quantity_and_manner",
      "adverbs_of_certainty_and_necessity",
      "position_of_adverbs"
    ],
    "Section 5 — Common Expressions and Phrases": [
      "useful_phrases",
      "embassies_legations_and_consulates",
      "short_phrases_in_common_use",
      "meetings_and_convention",
      "interjectional_words_commonly_used"
    ],
    "Section 6 — Food and Daily Life": [
      "food",
      "vegetables",
      "fruits",
      "house",
      "house_work",
      "housework_equipment",
      "table_serving"
    ],
    "Section 7 — Occupations and Commerce": [
      "tradesman",
      "household_trades",
      "stores"
    ],
    "Section 8 — Glossary": [
      "glossary_of_conversational_vocabulary_and_short_phrases"
    ]
  };

  // ---- Persistence keys ---------------------------------------------------
  const KEYS = {
    NAV_OPEN: "sidenav:open",
    EXPANDED: "sidenav:expanded",
    ACTIVE: "sidenav:active"
  };

  const isDesktop = () => window.matchMedia("(min-width: 801px)").matches;

  const setNavOpen = (open, persist = true) => {
    sideNav.classList.toggle("open", open);
    if (persist) localStorage.setItem(KEYS.NAV_OPEN, String(open));
  };

  const getExpanded = () => {
    try { return JSON.parse(localStorage.getItem(KEYS.EXPANDED) || "[]"); }
    catch { return []; }
  };
  const setExpanded = (arr) => localStorage.setItem(KEYS.EXPANDED, JSON.stringify(arr));

  // ---- Initial open state -------------------------------------------------
  const persistedOpen = localStorage.getItem(KEYS.NAV_OPEN);
  if (persistedOpen === null) {
    setNavOpen(isDesktop(), true);
  } else {
    setNavOpen(persistedOpen === "true", false);
  }

  // ---- Build the sidebar --------------------------------------------------
  const navList = document.createElement("ul");
  sideNav.appendChild(navList);

  const expandedSet = new Set(getExpanded());

  Object.entries(sections).forEach(([sectionName, lessons], index) => {
    const sectionItem = document.createElement("li");
    sectionItem.className = "section-item";

    const sectionBtn = document.createElement("button");
    sectionBtn.textContent = sectionName;
    sectionBtn.className = "section-btn";
    sectionBtn.setAttribute("aria-expanded", expandedSet.has(index));
    sectionItem.appendChild(sectionBtn);

    const lessonList = document.createElement("ul");
    lessonList.className = "lesson-list hidden";

    lessons.forEach(topic => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.dataset.topic = topic;
      a.dataset.section = `section${index + 1}`;
      a.textContent = topic.replace(/_/g, " ");
      li.appendChild(a);
      lessonList.appendChild(li);
    });

    if (expandedSet.has(index)) {
      lessonList.classList.remove("hidden");
    }

    sectionItem.appendChild(lessonList);
    navList.appendChild(sectionItem);

    // Toggle expand/collapse
    sectionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isHidden = lessonList.classList.toggle("hidden");
      sectionBtn.setAttribute("aria-expanded", !isHidden);
      if (isHidden) {
        expandedSet.delete(index);
      } else {
        expandedSet.add(index);
      }
      setExpanded([...expandedSet]);
    });
  });

  // ---- Menu button toggles -----------------------------------------------
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const willOpen = !sideNav.classList.contains("open");
    setNavOpen(willOpen, true);
    if (willOpen) {
      const active = sideNav.querySelector("a.active");
      if (active) active.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // ---- Lesson click handler ----------------------------------------------
  sideNav.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-topic]");
    if (!link) return;
    e.preventDefault();

    sideNav.querySelectorAll("a.active").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    localStorage.setItem(KEYS.ACTIVE, JSON.stringify({
      section: link.dataset.section,
      topic: link.dataset.topic
    }));

    const holder = link.closest(".lesson-list");
    if (holder && holder.classList.contains("hidden")) holder.classList.remove("hidden");

    setNavOpen(true, true);
    requestAnimationFrame(() => setTimeout(() => setNavOpen(true, true), 0));
    link.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // ---- Close on outside click (mobile only) ------------------------------
  document.addEventListener("click", (e) => {
    if (isDesktop()) return;
    if (!sideNav.contains(e.target) && !menuBtn.contains(e.target)) {
      setNavOpen(false, true);
    }
  });

  // ---- Restore active link -----------------------------------------------
  try {
    const saved = JSON.parse(localStorage.getItem(KEYS.ACTIVE) || "null");
    if (saved) {
      const selector = `a[data-section="${saved.section}"][data-topic="${saved.topic}"]`;
      const a = sideNav.querySelector(selector);
      if (a) {
        a.classList.add("active");
        a.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  } catch {}

  // ---- Auto-open on resize -----------------------------------------------
  window.addEventListener("resize", () => {
    if (localStorage.getItem(KEYS.NAV_OPEN) === null) {
      setNavOpen(isDesktop(), false);
    }
  });
});