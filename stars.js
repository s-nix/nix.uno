const stars = document.getElementById('stars');
const STAR_COUNT = 100;

const starData = [];

function makeStar() {
    const s = document.createElement('span');
    s.className = 'star';

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const depth = 0.2 + Math.random() * 0.8; // 0.2 (far) -> 1 (near)

    s.style.left = x + 'px';
    s.style.top = y + 'px';

    // Staggered twinkle
    s.style.animationDelay = (Math.random() * 10) + 's';
    s.style.animationDuration = (Math.random() * 5 + 5) + 's';

    stars.appendChild(s);
    starData.push({ el: s, x, y, depth, tx: 0, ty: 0 });
}

for (let i = 0; i < STAR_COUNT; i++) makeStar();

// Parallax + glow
let mouseX = 0, mouseY = 0;
let raf = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!raf) raf = requestAnimationFrame(updateStars);
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (!raf) raf = requestAnimationFrame(updateStars);
    }
});

function updateStars() {
    raf = 0;

    const nx = (mouseX / window.innerWidth - 0.5) * 2;   // -1..1
    const ny = (mouseY / window.innerHeight - 0.5) * 2;  // -1..1
    const parallax = 10; // px max shift
    const glowR = 100;   // px glow radius
    const glowR2 = glowR * glowR;

    for (const s of starData) {
        // depth-based parallax offset
        s.tx = nx * parallax * s.depth;
        s.ty = ny * parallax * s.depth;
        s.el.style.setProperty('--tx', s.tx.toFixed(1) + 'px');
        s.el.style.setProperty('--ty', s.ty.toFixed(1) + 'px');

        // proximity glow to cursor (uses actual on-screen position with parallax)
        const dx = (s.x + s.tx) - mouseX;
        const dy = (s.y + s.ty) - mouseY;
        const d2 = dx * dx + dy * dy;

        if (d2 < glowR2) {
            const t = 1 - d2 / glowR2; // 0..1
            s.el.style.filter = `brightness(${1 + t})`;
            s.el.style.boxShadow = `0 0 ${6 + 8 * t}px 2px rgba(255,255,255,${0.3 + 0.5 * t})`;
        } else {
            s.el.style.filter = '';
            s.el.style.boxShadow = '';
        }
    }
}

// Re-position stars on resize
window.addEventListener('resize', () => {
    for (const s of starData) {
        s.x = Math.random() * window.innerWidth;
        s.y = Math.random() * window.innerHeight;
        s.el.style.left = s.x + 'px';
        s.el.style.top = s.y + 'px';
    }
});