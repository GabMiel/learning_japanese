const button = document.getElementById('sparkleButton');

button.addEventListener('click', () => {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // Create sparkle effect
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const hue = Math.random() * 360;
    const size = 25 + Math.random() * 40;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = `radial-gradient(circle, hsl(${hue} 100% 75%) 0%, transparent 85%)`;

    const x = Math.random() * screenW;
    const y = Math.random() * screenH;
    particle.style.left = `${x - size / 2}px`;
    particle.style.top = `${y - size / 2}px`;

    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }

  // Go to Lesson 1 after sparkles
  setTimeout(() => {
    window.location.href = "lessons/section1/section1.html";
  }, 1000);
});
