/**
 * SYS.ROOT // HUO_JIAN_JIE CORE ENGINE v2.0
 * Enhanced: Matrix Rain, Boot Sequence, Skill Bars, Particle Nexus, 3D Radar
 */
document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. ENHANCED BOOT SEQUENCE
    // =============================================
    const bootLogs = [
        'LOADING KERNEL MODULES...',
        'MOUNTING FILESYSTEM: /dev/sda1',
        'INITIALIZING NEURAL NETWORK...',
        'CONNECTING TO NEXUS GRID...',
        'IDENTITY VERIFICATION: OK',
        'SYSTEM READY.',
    ];
    const bootTextEl = document.getElementById('boot-text');
    const bootProgressEl = document.getElementById('boot-progress');
    const bootLogEl = document.getElementById('boot-log');
    const bootLoader = document.getElementById('boot-loader');

    let logIndex = 0;
    const logInterval = setInterval(() => {
        if (logIndex >= bootLogs.length) {
            clearInterval(logInterval);
            return;
        }
        const line = document.createElement('div');
        line.className = 'boot-log-line';
        line.textContent = '> ' + bootLogs[logIndex];
        bootLogEl.appendChild(line);
        if (bootTextEl) bootTextEl.textContent = bootLogs[logIndex];
        logIndex++;
        if (bootProgressEl) bootProgressEl.style.width = (logIndex / bootLogs.length * 100) + '%';
    }, 280);

    setTimeout(() => {
        if (bootLoader) bootLoader.classList.add('fade-out');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        initTypewriter();
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        initMatrixRain();
    }, 2200);

    // =============================================
    // 2. SCROLL REVEAL
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

    // =============================================
    // 3. HUD TIME
    // =============================================
    let lastFrameTime = performance.now();
    let fpsFrameCount = 0;
    let currentFps = 60;

    function updateSysTime() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const ms = Math.floor(now.getMilliseconds() / 100);
        const timeEl = document.getElementById('sys-time');
        if (timeEl) timeEl.innerText = `${h}:${m}:${s}.${ms}`;

        fpsFrameCount++;
        const now2 = performance.now();
        if (now2 - lastFrameTime >= 1000) {
            currentFps = fpsFrameCount;
            fpsFrameCount = 0;
            lastFrameTime = now2;
            const fpsEl = document.getElementById('fps-counter');
            if (fpsEl) fpsEl.textContent = currentFps + ' FPS';
        }
        requestAnimationFrame(updateSysTime);
    }
    updateSysTime();

    // =============================================
    // 4. CUSTOM CYBER CURSOR
    // =============================================
    const cursor = document.getElementById('cyber-cursor');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
    });

    document.querySelectorAll('a, button, .contact-card, .project-card, .honor-card-3d, .skill-bar-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // =============================================
    // 5. TYPEWRITER
    // =============================================
    const roles = ["BACKEND_ARCHITECT", "AI_MODEL_INTEGRATOR", "LINUX_GEEK", "KNOWLEDGE_GRAPH_ENG", "FULL_STACK_BUILDER"];
    const typeTarget = document.querySelector('.typewriter-target');
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function initTypewriter() {
        if (!typeTarget) return;
        const currentRole = roles[roleIndex];
        if (isDeleting) charIndex--; else charIndex++;
        typeTarget.innerText = currentRole.substring(0, charIndex);
        let speed = isDeleting ? 25 : 75;
        if (!isDeleting && charIndex === currentRole.length) { isDeleting = true; speed = 2200; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 450; }
        setTimeout(initTypewriter, speed);
    }

    // =============================================
    // 6. SKILL BAR ANIMATION
    // =============================================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.skill-bar-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('animated');
                        const targetVal = parseInt(item.dataset.val || 0);
                        const pctEl = item.querySelector('.skill-pct');
                        if (!pctEl) return;
                        let start = 0;
                        const duration = 1200;
                        const startTime = performance.now();
                        function count(now) {
                            const elapsed = now - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.round(eased * targetVal);
                            pctEl.textContent = current + '%';
                            if (progress < 1) requestAnimationFrame(count);
                        }
                        requestAnimationFrame(count);
                    }, i * 120);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

    // =============================================
    // 7. 3D TILT CARD
    // =============================================
    document.querySelectorAll('.js-tilt').forEach(card => {
        const glare = card.querySelector('.card-glare');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2, cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -10;
            const rotY = ((x - cx) / cx) * 10;
            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
            if (glare) {
                glare.style.opacity = '1';
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 60%)`;
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            if (glare) glare.style.opacity = '0';
        });
    });

    // =============================================
    // 8. KNOWLEDGE GRAPH PARTICLE NEXUS
    // =============================================
    class NexusEngine {
        constructor() {
            this.canvas = document.getElementById('nexus-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouseX = mouseX;
            this.mouseY = mouseY;
            this.resize();
            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.init();
        }

        init() {
            this.particles = [];
            const count = Math.floor((this.canvas.width * this.canvas.height) / 14000);
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 1.5 + 0.5,
                    isCore: Math.random() > 0.94,
                    pulse: Math.random() * Math.PI * 2,
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const len = this.particles.length;

            for (let i = 0; i < len; i++) {
                const p = this.particles[i];
                p.x += p.vx; p.y += p.vy;
                p.pulse += 0.02;

                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                const pulseSize = p.isCore ? (p.size * 2.5 + Math.sin(p.pulse) * 0.8) : p.size;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
                this.ctx.fillStyle = p.isCore ? '#ff00ea' : 'rgba(0, 243, 255, 0.8)';
                this.ctx.fill();

                if (p.isCore) {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, pulseSize * 3, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(255, 0, 234, 0.05)';
                    this.ctx.fill();
                }

                for (let j = i + 1; j < len; j++) {
                    const p2 = this.particles[j];
                    const dx = p.x - p2.x, dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
                        this.ctx.lineWidth = p.isCore || p2.isCore ? 1 : 0.4;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }

                const dxM = p.x - this.mouseX, dyM = p.y - this.mouseY;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);
                if (distM < 160) {
                    p.x += dxM * 0.015; p.y += dyM * 0.015;
                    const alpha = (0.6 - distM / 270);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 0, 234, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouseX, this.mouseY);
                    this.ctx.stroke();
                }
            }
            requestAnimationFrame(() => this.animate());
        }
    }
    new NexusEngine();

    // =============================================
    // 9. MATRIX RAIN EFFECT
    // =============================================
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテト';
        const fontSize = 13;
        const cols = Math.floor(canvas.width / fontSize);
        const drops = Array(cols).fill(1);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        function drawMatrix() {
            ctx.fillStyle = 'rgba(1, 2, 8, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = fontSize + 'px Fira Code';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const brightness = Math.random();
                if (brightness > 0.97) {
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = `rgba(0, 243, 255, ${0.3 + brightness * 0.4})`;
                }
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 50);
    }

    // =============================================
    // 10. 3D SKILL RADAR (ANIMATED, RESPONSIVE)
    // =============================================
    function drawSkillRadar() {
        const canvas = document.getElementById('skill-radar');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // 根据容器宽度动态设置 canvas 尺寸
        function getSize() {
            const maxSize = window.innerWidth <= 380 ? 240 : window.innerWidth <= 768 ? 280 : 420;
            return Math.min(maxSize, canvas.parentElement.clientWidth || maxSize);
        }

        function setCanvasSize() {
            const size = getSize();
            canvas.width = size;
            canvas.height = size;
        }
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const data = [
            { label: 'Python/C++', val: 95 },
            { label: 'GraphRAG', val: 88 },
            { label: 'OCR/AI', val: 92 },
            { label: 'Linux', val: 95 },
            { label: 'Data Viz', val: 85 },
            { label: 'Architecture', val: 88 }
        ];
        const sides = data.length;
        const angleStep = (Math.PI * 2) / sides;
        let rotation = 0;
        let animScale = 0;
        let started = false;

        function getPoint(r, angle, cx, cy) {
            return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
        }

        function render() {
            const size = canvas.width;
            const cx = size / 2;
            const cy = size / 2;
            const radius = size * 0.33;
            const labelRadius = radius + size * 0.07;
            const fontSize = Math.max(10, Math.floor(size * 0.032));

            ctx.clearRect(0, 0, size, size);
            if (animScale < 1) animScale = Math.min(animScale + 0.02, 1);
            rotation += 0.003;

            for (let level = 1; level <= 5; level++) {
                const r = (radius / 5) * level;
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const p = getPoint(r, i * angleStep + rotation, cx, cy);
                    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${0.05 + level * 0.06})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                if (level === 5) {
                    ctx.fillStyle = 'rgba(0, 243, 255, 0.02)';
                    ctx.fill();
                }
            }

            ctx.font = `bold ${fontSize}px Rajdhani`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < sides; i++) {
                const angle = i * angleStep + rotation;
                const pOuter = getPoint(radius, angle, cx, cy);

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(pOuter.x, pOuter.y);
                ctx.strokeStyle = 'rgba(0, 243, 255, 0.18)';
                ctx.lineWidth = 0.5;
                ctx.stroke();

                const pText = getPoint(labelRadius, angle, cx, cy);
                ctx.fillStyle = 'rgba(200, 230, 240, 0.85)';
                ctx.fillText(data[i].label, pText.x, pText.y);
            }

            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const r = (data[i].val / 100) * radius * animScale;
                const p = getPoint(r, i * angleStep + rotation, cx, cy);
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 0, 234, 0.18)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 0, 234, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            for (let i = 0; i < sides; i++) {
                const r = (data[i].val / 100) * radius * animScale;
                const p = getPoint(r, i * angleStep + rotation, cx, cy);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = '#00f3ff';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 243, 255, 0.15)';
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ff00ea';
            ctx.fill();

            requestAnimationFrame(render);
        }

        const radarObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                started = true;
                render();
                radarObserver.disconnect();
            }
        });
        radarObserver.observe(canvas);
    }
    drawSkillRadar();

    // =============================================
    // 11. EMAIL REVEAL
    // =============================================
    const emailTrigger = document.getElementById('email-trigger');
    const cyberToast = document.getElementById('cyber-toast');

    if (emailTrigger && cyberToast) {
        const toastMsg = cyberToast.querySelector('.toast-msg');
        const emailDisplay = emailTrigger.querySelector('.email-masked');
        let revealed = false;

        emailTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const myEmail = '2825191095@qq.com';

            if (emailDisplay) {
                emailDisplay.textContent = myEmail;
                emailDisplay.classList.add('email-revealed');
            }
            const arrow = emailTrigger.querySelector('.contact-arrow');
            if (arrow) arrow.textContent = '✓';
            revealed = true;

            navigator.clipboard.writeText(myEmail).then(() => {
                toastMsg.innerText = `SYS.MSG: [ ${myEmail.toUpperCase()} ] COPIED TO CLIPBOARD`;
                cyberToast.classList.add('show');
                setTimeout(() => cyberToast.classList.remove('show'), 3500);
            }).catch(() => {
                toastMsg.innerText = `SYS.MSG: EMAIL DECRYPTED. COPY MANUALLY.`;
                cyberToast.classList.add('show');
                setTimeout(() => cyberToast.classList.remove('show'), 3500);
            });
        });
    }

    // =============================================
    // 12. NAV ACTIVE STATE ON SCROLL
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.style.color = 'var(--cyan)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => sectionObserver.observe(section));
});
