document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       1. 滚动渐近显现 (Scroll Reveal Animation)
       使用 IntersectionObserver 实现高性能滚动监听
       =================================================== */
    const observerOptions = {
        threshold: 0.15, // 元素露出 15% 时触发
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // 触发后停止监听该元素
            }
        });
    }, observerOptions);

    // 获取所有带有 reveal 类的 section 或元素
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    /* ===================================================
       2. 动态粒子网络背景 (Canvas Particle Network)
       =================================================== */
    class ParticleNetwork {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null };
            
            this.init();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createParticles();
        }

        init() { this.resize(); }

        createParticles() {
            this.particles = [];
            // 减少粒子密度，避免过于杂乱影响阅读
            const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 2 + 1
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
                this.ctx.fill();

                for (let j = i; j < this.particles.length; j++) {
                    let p2 = this.particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 - distance/1000})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }

                if (this.mouse.x != null) {
                    let dxMouse = p.x - this.mouse.x;
                    let dyMouse = p.y - this.mouse.y;
                    let distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
                    if (distMouse < 150) {
                        p.x += dxMouse * 0.03;
                        p.y += dyMouse * 0.03;
                    }
                }
            }
            requestAnimationFrame(() => this.animate());
        }
    }
    new ParticleNetwork('canvas-bg');

    /* ===================================================
       3. 终端打字机特效 (Terminal Emulator)
       =================================================== */
    class TerminalEmulator {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.sequence = [
                { text: "Initializing environment...", type: 'system', delay: 500 },
                { text: "System Boot [OK] | User Data [Loaded]", type: 'system', delay: 400 },
                { text: "cat resume_intro.md", type: 'command', delay: 400 },
                { text: "你好，我是霍建杰，一名寻找前端/后端开发实习机会的软件工程专业学生。\n在日常开发中，无论是穿梭于 Linux 服务器的底层命令行，还是解决算法模型的落地应用，我都乐在其中。\n我崇尚极客精神，代码不仅仅是工作，更是我重构世界的工具。如果您正在寻找一位踏实且具有钻研精神的实习生，我将是非常合适的人选。", type: 'response', delay: 800 },
                { text: "./check_status.sh", type: 'command', delay: 500 },
                { text: "Status: [ READY_FOR_INTERNSHIP ]", type: 'system', delay: 300 }
            ];
            this.run();
        }

        sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

        async typeText(element, text, speed = 25) {
            for (let char of text) {
                if (char === '\n') {
                    element.innerHTML += '<br><br>';
                } else {
                    element.innerHTML += char;
                }
                await this.sleep(speed + Math.random() * 20);
            }
        }

        async run() {
            this.container.innerHTML = '';
            for (let step of this.sequence) {
                await this.sleep(step.delay);
                const line = document.createElement('div');
                line.style.marginBottom = '12px';
                
                if (step.type === 'system') {
                    line.style.color = '#8892b0';
                    line.innerHTML = `[SYS] ${step.text}`;
                    this.container.appendChild(line);
                } else if (step.type === 'command') {
                    line.innerHTML = `<span class="prompt">root@sys-core:~$</span> <span class="command"></span>`;
                    this.container.appendChild(line);
                    const cmdSpan = line.querySelector('.command');
                    await this.typeText(cmdSpan, step.text, 40);
                } else if (step.type === 'response') {
                    line.style.borderLeft = '2px solid var(--text-dark)';
                    line.style.paddingLeft = '15px';
                    line.style.color = 'var(--text-main)';
                    this.container.appendChild(line);
                    await this.typeText(line, step.text, 15);
                }
            }
            const cursorLine = document.createElement('div');
            cursorLine.innerHTML = `<span class="prompt">root@sys-core:~$</span> <span class="cursor"></span>`;
            this.container.appendChild(cursorLine);
        }
    }
    
    // 当终端模块滚动进入视口时，才开始打字动画，提升体验
    const terminalObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            new TerminalEmulator('terminal-content');
            terminalObserver.disconnect();
        }
    }, { threshold: 0.5 });
    terminalObserver.observe(document.querySelector('.terminal-box'));

});