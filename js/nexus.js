/**
 * SYS.ROOT // HUO_JIAN_JIE CORE ENGINE
 * Includes Particle Nexus, 3D Radar, Boot Sequence, and Interactive DOM mapping.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 4. SCROLL REVEAL OBSERVER (优化了触发阈值) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    
    // --- 1. SYSTEM BOOT SEQUENCE (修复了动画提前加载的问题) ---
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        initTypewriter();
        
        // 等待遮罩消失后，再绑定滚动显现，确保首屏动画正常滑出
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }, 2000);

    // --- 2. HUD TIME SYNCHRONIZATION ---
    function updateSysTime() {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0] + ':' + Math.floor(now.getMilliseconds() / 100);
        document.getElementById('sys-time').innerText = timeStr;
        requestAnimationFrame(updateSysTime);
    }
    updateSysTime();

    // --- 3. CUSTOM CYBER CURSOR ---
    const cursor = document.getElementById('cyber-cursor');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // --- 5. TYPEWRITER EFFECT (HERO SECTION) ---
    const roles = ["BACKEND_ARCHITECT", "AI_MODEL_INTEGRATOR", "LINUX_GEEK", "KNOWLEDGE_GRAPH_ENG"];
    const typeTarget = document.querySelector('.typewriter-target');
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function initTypewriter() {
        const currentRole = roles[roleIndex];
        if (isDeleting) charIndex--; else charIndex++;
        
        typeTarget.innerText = currentRole.substring(0, charIndex);
        let speed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true; speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 500;
        }
        setTimeout(initTypewriter, speed);
    }

    // --- 6. 3D VANILLA TILT EFFECT (HONOR CARD) ---
    document.querySelectorAll('.js-tilt').forEach(card => {
        const glare = card.querySelector('.card-glare');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12; 
            const rotateY = ((x - centerX) / centerX) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            glare.style.opacity = '0';
        });
    });

    // --- 7. KNOWLEDGE GRAPH PARTICLE NEXUS (CANVAS ENGINE) ---
    class NexusEngine {
        constructor() {
            this.canvas = document.getElementById('nexus-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.init();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.init();
        }

        init() {
            this.particles = [];
            const count = Math.floor((this.canvas.width * this.canvas.height) / 12000);
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    isCore: Math.random() > 0.95
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                p.x += p.vx; p.y += p.vy;

                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.isCore ? p.size * 2 : p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.isCore ? '#ff00ea' : '#00f3ff';
                this.ctx.fill();

                for (let j = i + 1; j < this.particles.length; j++) {
                    let p2 = this.particles[j];
                    let dx = p.x - p2.x, dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 - dist/800})`;
                        this.ctx.lineWidth = p.isCore || p2.isCore ? 1 : 0.5;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }

                let dxM = p.x - mouseX, dyM = p.y - mouseY;
                let distM = Math.sqrt(dxM*dxM + dyM*dyM);
                if (distM < 150) {
                    p.x += dxM * 0.02; p.y += dyM * 0.02;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 0, 234, ${0.5 - distM/300})`;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(mouseX, mouseY);
                    this.ctx.stroke();
                }
            }
            requestAnimationFrame(() => this.animate());
        }
    }
    new NexusEngine();

    // --- 8. MATH-DRIVEN 3D SKILL RADAR ---
    function drawSkillRadar() {
        const canvas = document.getElementById('skill-radar');
        const ctx = canvas.getContext('2d');
        const cx = 200, cy = 200, radius = 130;
        
        const data = [
            { label: 'Python/C++', val: 95 },
            { label: 'GraphRAG/Neo4j', val: 88 },
            { label: 'PaddleOCR/AI', val: 92 },
            { label: 'Ubuntu/Linux', val: 95 },
            { label: 'Data Analysis', val: 85 },
            { label: 'Architecture', val: 88 }
        ];
        const sides = data.length;
        const angleStep = (Math.PI * 2) / sides;
        let rotation = 0; 

        function getPoint(r, angle) {
            return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rotation += 0.002; 

            ctx.lineWidth = 1;
            for (let level = 1; level <= 5; level++) {
                let r = (radius / 5) * level;
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    let p = getPoint(r, i * angleStep + rotation);
                    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${level * 0.1})`;
                ctx.stroke();
            }

            ctx.font = '14px Rajdhani';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            for (let i = 0; i < sides; i++) {
                let angle = i * angleStep + rotation;
                let pOuter = getPoint(radius, angle);
                
                ctx.beginPath();
                ctx.moveTo(cx, cy); ctx.lineTo(pOuter.x, pOuter.y);
                ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
                ctx.stroke();
                
                let pText = getPoint(radius + 25, angle);
                ctx.fillStyle = '#e0f2fe';
                ctx.fillText(data[i].label, pText.x, pText.y);
            }

            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                let r = (data[i].val / 100) * radius;
                let p = getPoint(r, i * angleStep + rotation);
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            
            ctx.fillStyle = 'rgba(255, 0, 234, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#ff00ea';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = '#00f3ff';
            for (let i = 0; i < sides; i++) {
                let r = (data[i].val / 100) * radius;
                let p = getPoint(r, i * angleStep + rotation);
                ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
            }

            requestAnimationFrame(render);
        }
        
        const radarObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                render();
                radarObserver.disconnect();
            }
        });
        radarObserver.observe(canvas);
    }
    
    drawSkillRadar();

    // --- 9. DATA EXTRACTION: EMAIL REVEAL & COPY LOGIC ---
    const emailTrigger = document.getElementById('email-trigger');
    const cyberToast = document.getElementById('cyber-toast');
    
    if (emailTrigger && cyberToast) {
        const toastMsg = cyberToast.querySelector('.toast-msg');
        
        emailTrigger.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const myEmail = '2825191095@qq.com';
            const upperEmail = myEmail.toUpperCase();
            
            emailTrigger.innerText = upperEmail;
            emailTrigger.setAttribute('data-text', upperEmail);
            emailTrigger.classList.add('email-revealed');
            
            navigator.clipboard.writeText(myEmail).then(() => {
                toastMsg.innerText = `SYS.MSG: [ ${upperEmail} ] COPIED TO CLIPBOARD`;
                cyberToast.classList.add('show');
                
                setTimeout(() => {
                    cyberToast.classList.remove('show');
                }, 3500);
            }).catch(err => {
                toastMsg.innerText = `SYS.MSG: DATA DECRYPTED. PLEASE COPY MANUALLY.`;
                toastMsg.style.color = '#ff00ea';
                cyberToast.classList.add('show');
                setTimeout(() => cyberToast.classList.remove('show'), 3500);
            });
        });
    }
});