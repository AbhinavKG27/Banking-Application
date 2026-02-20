const checkBalanceBtn = document.getElementById('checkBalanceBtn');
const balanceOutput = document.getElementById('balanceOutput');
const dashMessage = document.getElementById('dashMessage');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const launchConfetti = () => {
  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    size: Math.random() * 7 + 2,
    speedY: Math.random() * 4 + 2,
    speedX: Math.random() * 2 - 1,
    color: `hsl(${Math.random() * 360}, 90%, 60%)`,
    rotation: Math.random() * 360,
  }));

  let frames = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += 6;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    frames += 1;
    if (frames < 120) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  animate();
};

checkBalanceBtn.addEventListener('click', async () => {
  dashMessage.textContent = '';
  balanceOutput.textContent = '';

  const response = await fetch('/api/user/balance', {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    dashMessage.textContent = data.message || 'Unable to fetch balance.';
    return;
  }

  balanceOutput.textContent = `Your balance is: ₹${Number(data.balance).toLocaleString('en-IN')}`;
  launchConfetti();
});
