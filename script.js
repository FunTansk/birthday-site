document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. ТАЙМЕР ДО ДНЯ РОЖДЕНИЯ
    // =============================================
    const birthday = new Date(2026, 7, 11); // 11 августа 2026 (месяцы 0-11)
    const timerEl = document.getElementById('birthday-timer');
    const timerText = document.getElementById('timer-text');

    function updateTimer() {
        const now = new Date();
        const diff = birthday - now;
        if (diff > 0) {
            const days = Math.floor(diff / (1000*60*60*24));
            const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
            const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
            timerText.textContent = `До дня рождения: ${days}д ${hours}ч ${mins}м`;
            timerEl.style.display = 'block';
        } else {
            timerEl.style.display = 'none';
        }
    }
    updateTimer();
    setInterval(updateTimer, 60000);

    // =============================================
    // 2. ФОНОВОЕ ВИДЕО
    // =============================================
    const bgVideo = document.getElementById('bg-video');
    const videoSources = {
        yarik: 'videos/yarik/bg.mp4',
        olya: 'videos/olya/bg.mp4',
        andrey: 'videos/andrey/bg.mp4',
        andrey_m: 'videos/andrey_m/bg.mp4',
        vanusha: 'videos/vanusha/bg.mp4',
        nikita: 'videos/nikita/bg.mp4',
        mikhail: 'videos/mikhail/bg.mp4'
    };

    function setVideo(theme) {
        const src = videoSources[theme];
        if (src) {
            bgVideo.src = src;
            bgVideo.load();
            bgVideo.play().catch(e => console.log('Видео не загружено'));
            bgVideo.style.opacity = '0.4';
        } else {
            bgVideo.style.opacity = '0';
        }
    }

    // =============================================
    // 3. ЧАСТИЦЫ (партиклы) на canvas
    // =============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleTheme = '';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(theme) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = 2 + Math.random() * 5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = 0.2 + Math.random() * 0.4;
            this.theme = theme;
            this.color = this.getColor();
        }
        getColor() {
            const colors = {
                yarik: '#e0a343',
                olya: '#f7a1c4',
                andrey: '#2ecc71',
                andrey_m: '#ff7700',
                vanusha: '#ff3b8a',
                nikita: '#6fcf97',
                mikhail: '#d4a017'
            };
            return colors[this.theme] || '#ffffff';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles(theme) {
        particleTheme = theme;
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(theme));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    // =============================================
    // 4. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК + ОБНОВЛЕНИЕ ВСЕГО
    // =============================================
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    let allAudios = []; // для кеширования
    let playedAudios = new Set(); // для конфетти

    function switchTab(tabId) {
        // Убираем активные классы
        buttons.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        // Активируем текущие
        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');

        // Меняем тему body
        document.body.className = 'theme-' + tabId;

        // Видео
        setVideo(tabId);

        // Частицы
        initParticles(tabId);
    }

    // Обработчики кнопок
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // =============================================
    // 5. КАРУСЕЛЬ (для каждой вкладки)
    // =============================================
    function initCarousels() {
        document.querySelectorAll('.carousel-container').forEach(container => {
            const track = container.querySelector('.carousel-track');
            const slides = track.querySelectorAll('.carousel-slide');
            const prevBtn = container.querySelector('.carousel-btn.prev');
            const nextBtn = container.querySelector('.carousel-btn.next');
            const dotsContainer = container.querySelector('.carousel-dots');
            let currentIndex = 0;
            const total = slides.length;

            // Создаём точки
            dotsContainer.innerHTML = '';
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('span');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }

            function goTo(index) {
                if (index < 0) index = total - 1;
                if (index >= total) index = 0;
                currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                // Обновляем точки
                dotsContainer.querySelectorAll('span').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            function next() { goTo(currentIndex + 1); }
            function prev() { goTo(currentIndex - 1); }

            // Клик по области (левый/правый край)
            container.addEventListener('click', function(e) {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width / 3) prev();
                else if (x > rect.width * 2 / 3) next();
            });

            // Кнопки
            if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
            if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

            // Автопрокрутка (пауза при наведении)
            let autoplay = setInterval(next, 5000);
            container.addEventListener('mouseenter', () => clearInterval(autoplay));
            container.addEventListener('mouseleave', () => { autoplay = setInterval(next, 5000); });

            // Свайп для тачей
            let startX = 0;
            container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
            container.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) next();
                    else prev();
                }
            });
        });
    }

    // =============================================
    // 6. АУДИО ПЛЕЕРЫ (кастомные + кеширование)
    // =============================================
    function initPlayers() {
        document.querySelectorAll('.player').forEach(playerContainer => {
            const audio = playerContainer.querySelector('audio');
            const playBtn = playerContainer.querySelector('.play-pause');
            const progressFill = playerContainer.querySelector('.progress-fill');
            const progressBar = playerContainer.querySelector('.progress-bar');
            const currentTimeSpan = playerContainer.querySelector('.current-time');
            const durationSpan = playerContainer.querySelector('.duration');

            // Кешируем аудио
            const src = audio.src;
            if (!allAudios.find(a => a.src === src)) {
                allAudios.push(audio);
            }

            function updateTime() {
                const cur = audio.currentTime;
                const dur = audio.duration || 0;
                currentTimeSpan.textContent = formatTime(cur);
                if (dur) {
                    durationSpan.textContent = formatTime(dur);
                    progressFill.style.width = (cur / dur * 100) + '%';
                }
            }

            function formatTime(t) {
                const min = Math.floor(t / 60);
                const sec = Math.floor(t % 60);
                return `${min}:${sec.toString().padStart(2, '0')}`;
            }

            audio.addEventListener('loadedmetadata', updateTime);
            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('ended', function() {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                // Если это последнее непрослушанное — конфетти
                if (!playedAudios.has(src)) {
                    playedAudios.add(src);
                    if (playedAudios.size === allAudios.length) {
                        launchConfetti(200);
                    }
                }
            });

            playBtn.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    audio.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });

            progressBar.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audio.currentTime = percent * audio.duration;
            });

            // При первом воспроизведении отмечаем как прослушанное
            audio.addEventListener('play', function() {
                if (!playedAudios.has(src)) {
                    playedAudios.add(src);
                    if (playedAudios.size === allAudios.length) {
                        setTimeout(() => launchConfetti(200), 1000);
                    }
                }
            });
        });
    }

    // =============================================
    // 7. КОНФЕТТИ
    // =============================================
    let confettiLaunched = false;

    function launchConfetti(count = 150) {
        if (confettiLaunched) return;
        confettiLaunched = true;
        confetti({
            particleCount: count,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => { confettiLaunched = false; }, 5000);
    }

    // Конфетти при первом открытии (спустя 2 сек)
    setTimeout(() => {
        launchConfetti(100);
    }, 2000);

    // =============================================
    // 8. ИНИЦИАЛИЗАЦИЯ
    // =============================================
    // Запускаем активную вкладку
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const theme = activeTab.dataset.theme;
        switchTab(theme);
        initParticles(theme);
        animateParticles();
    } else {
        // Если нет активной — ставим первую
        const first = document.querySelector('.tab-content');
        if (first) {
            const theme = first.dataset.theme;
            switchTab(theme);
            initParticles(theme);
            animateParticles();
        }
    }

    // Инициализируем карусели и плееры
    initCarousels();
    initPlayers();

    // =============================================
    // 9. ПОДПИСИ К ФОТО (уже есть в HTML)
    // =============================================
    // (ничего делать не нужно)
});