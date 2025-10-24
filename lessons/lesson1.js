const numbers = [
  { english: "One", japanese: "一", romaji: "Ichi" },
  { english: "Two", japanese: "二", romaji: "Ni" },
  { english: "Three", japanese: "三", romaji: "San" },
  { english: "Four", japanese: "四", romaji: "Shi" },
  { english: "Five", japanese: "五", romaji: "Go" },
  { english: "Six", japanese: "六", romaji: "Roku" },
  { english: "Seven", japanese: "七", romaji: "Shichi" },
  { english: "Eight", japanese: "八", romaji: "Hachi" },
  { english: "Nine", japanese: "九", romaji: "Kyū" },
  { english: "Ten", japanese: "十", romaji: "Jū" }
];

const container = document.getElementById("cardContainer");

numbers.forEach(num => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h2>${num.english}</h2>
    <p class="jp">${num.japanese}</p>
    <p class="romaji">${num.romaji}</p>
  `;
  container.appendChild(card);
});

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sideNav').classList.toggle('open');
});
