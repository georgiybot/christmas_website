document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.5;
    const prankMusic = document.getElementById('prankMusic');
    prankMusic.volume = 1.0;
    bgMusic.play().then(() => {
        bgMusic.muted = true;
    }).catch((error) => {
        console.log('Autoplay был предотвращен:', error);
    });
    const musicControl = document.getElementById('musicControl');
    let isPlaying = false;
    musicControl.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicControl.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.muted = false;
            bgMusic.play();
            musicControl.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
    const snowflakesContainer = document.querySelector('.snowflakes');
    const snowflakeSymbols = ['❅', '❆', '❄'];
    const numberOfSnowflakes = 100;
    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 10}s`;
        snowflake.style.fontSize = `${Math.random() * 1.5 + 0.5}em`;
        snowflake.style.opacity = Math.random();
        snowflakesContainer.appendChild(snowflake);
    }
    const buttons = document.querySelectorAll('.effect-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const effect = button.getAttribute('data-effect');
            if (effect === 'firework') {
                createFirework();
            } else if (effect === 'sparkle') {
                createSparkle();
            } else if (effect === 'snow') {
                createSnow();
            }
        });
    });
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        document.body.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
        });
    }
    function createSnow() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 10}s`;
        snowflake.style.fontSize = `${Math.random() * 1.5 + 0.5}em`;
        snowflake.style.opacity = Math.random();
        snowflakesContainer.appendChild(snowflake);
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    class Firework {
        constructor(x, y, targetY) {
            this.x = x;
            this.y = y;
            this.targetY = targetY;
            this.speed = Math.random() * 3 + 2;
            this.angle = Math.random() * Math.PI * 2;
            this.hue = Math.random() * 360;
            this.particles = [];
            this.exploded = false;
        }
        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.explode();
                    this.exploded = true;
                }
            }
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.isDead());
        }
        explode() {
            const particleCount = 100;
            for (let i = 0; i < particleCount; i++) {
                this.particles.push(new Particle(this.x, this.y, this.hue));
            }
        }
        draw(ctx) {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.fill();
            }
            this.particles.forEach(particle => particle.draw(ctx));
        }
    }
    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.speed = Math.random() * 5 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.gravity = 0.05;
            this.velocityX = Math.cos(this.angle) * this.speed;
            this.velocityY = Math.sin(this.angle) * this.speed;
            this.friction = 0.95;
            this.hue = hue;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
        }
        update() {
            this.velocityX *= this.friction;
            this.velocityY *= this.friction;
            this.velocityY += this.gravity;
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.alpha -= this.decay;
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
            ctx.restore();
        }
        isDead() {
            return this.alpha <= 0;
        }
    }
    let fireworks = [];
    const maxFireworks = 1000;
    function animate() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        fireworks.forEach(firework => firework.update());
        fireworks.forEach(firework => firework.draw(ctx));
        fireworks = fireworks.filter(firework => !firework.exploded || firework.particles.length > 0);
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('click', (e) => {
        if (fireworks.length < maxFireworks) {
            const x = e.clientX;
            const y = canvas.height;
            const targetY = Math.random() * canvas.height / 2;
            fireworks.push(new Firework(x, y, targetY));
        }
    });
    setInterval(() => {
        if (fireworks.length < maxFireworks) {
            const x = Math.random() * canvas.width;
            const y = canvas.height;
            const targetY = Math.random() * canvas.height / 2;
            fireworks.push(new Firework(x, y, targetY));
        }
    }, 3000);
    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const targetY = Math.random() * canvas.height / 2;
        if (fireworks.length < maxFireworks) {
            fireworks.push(new Firework(x, y, targetY));
        }
    }
    setTimeout(triggerMatrixPrank, 7500);
    function triggerMatrixPrank() {
        const prankOverlay = document.getElementById('prankOverlay');
        const matrixPrankCanvas = document.getElementById('matrixPrankCanvas');
        const mapCanvas = document.getElementById('mapCanvas');
        const prankMessages = document.getElementById('prankMessages');
        prankOverlay.style.display = 'flex';
        setTimeout(() => {
            prankOverlay.style.opacity = '1';
        }, 50);
        matrixPrankCanvas.width = window.innerWidth;
        matrixPrankCanvas.height = window.innerHeight;
        const ctxMatrix = matrixPrankCanvas.getContext('2d');
        const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%';
        const fontSize = 16;
        const columns = Math.floor(matrixPrankCanvas.width / fontSize);
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * matrixPrankCanvas.height / fontSize;
        }
        const matrixInterval = setInterval(() => {
            ctxMatrix.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctxMatrix.fillRect(0, 0, matrixPrankCanvas.width, matrixPrankCanvas.height);
            ctxMatrix.fillStyle = '#0F0';
            ctxMatrix.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                ctxMatrix.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > matrixPrankCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 33);
        prankMusic.currentTime = 20;
        prankMusic.play().then(() => {
            bgMusic.pause();
        }).catch((error) => {
            console.log('Ошибка при воспроизведении prank музыки:', error);
        });
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;
                fetch(`https://ipapi.co/${ip}/json/`)
                    .then(response => response.json())
                    .then(location => {
                        const latitude = location.latitude;
                        const longitude = location.longitude;
                        displayMessages(ip, latitude, longitude, prankOverlay, matrixInterval);
                        downloadIPFile(ip);
                    })
                    .catch(error => {
                        console.error('Ошибка при получении геолокации:', error);
                        displayMessages(ip, null, null, prankOverlay, matrixInterval);
                    });
            })
            .catch(error => {
                console.error('Ошибка при получении IP:', error);
                displayMessages('Не удалось определить IP', null, null, prankOverlay, matrixInterval);
            });
    }
    function displayMessages(ip, lat, lon, overlay, matrixInterval) {
        const ipMessage = document.getElementById('ipMessage');
        ipMessage.textContent = `Твой айпи: ${ip}`;
        ipMessage.style.opacity = '1';
        setTimeout(() => {
        }, 4000);
        setTimeout(() => {
            clearInterval(matrixInterval);
            const ctxMatrix = document.getElementById('matrixPrankCanvas').getContext('2d');
            ctxMatrix.clearRect(0, 0, window.innerWidth, window.innerHeight);
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                ipMessage.textContent = '';
                prankMusic.pause();
                prankMusic.currentTime = 0;
                bgMusic.play();
            }, 2000);
        }, 14000);
    }
    function downloadIPFile(ip) {
        const blob = new Blob([`Твой IP: ${ip}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'your_ip.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    getUserIP();
});
