document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    // === НАСТРОЙКИ ИКОНОК ДЛЯ КАЖДОЙ ТЕМЫ ===
    const themeIcons = {
        yarik: ['fa-car', 'fa-wrench', 'fa-gear', 'fa-oil-can', 'fa-cogs'],
        olya: ['fa-heart', 'fa-heart', 'fa-heart', 'fa-utensils', 'fa-spa', 'fa-crown'],
        andrey: ['fa-stethoscope', 'fa-pills', 'fa-heartbeat', 'fa-bolt', 'fa-plus-square'],
        andrey_m: ['fa-rocket', 'fa-gamepad', 'fa-star', 'fa-crosshairs', 'fa-bomb'],
        vanusha: ['fa-crown', 'fa-smile-wink', 'fa-heart', 'fa-tshirt', 'fa-shoe-prints'],
        nikita: ['fa-wifi', 'fa-satellite', 'fa-broadcast', 'fa-microchip', 'fa-antenna'],
        mikhail: ['fa-hammer', 'fa-beer', 'fa-axe', 'fa-shield', 'fa-skull']
    };

    // === ОБЩИЕ НАСТРОЙКИ ===
    let bgElements = [];

    function createBackgroundIcons(theme) {
        // Удаляем старые иконки
        bgElements.forEach(el => el.remove());
        bgElements = [];

        if (!theme) return;

        const icons = themeIcons[theme] || [];
        const container = document.body;

        // Создаём 15-20 иконок с разными размерами и позициями
        for (let i = 0; i < 20; i++) {
            const iconClass = icons[Math.floor(Math.random() * icons.length)];
            const el = document.createElement('i');
            el.className = `fas ${iconClass} bg-icon`;
            
            // Случайные размеры, позиции, повороты
            const size = 30 + Math.random() * 80; // от 30 до 110px
            const x = Math.random() * 100; // проценты
            const y = Math.random() * 100;
            const rotate = Math.random() * 360;
            const opacity = 0.04 + Math.random() * 0.08; // очень прозрачные
            
            el.style.cssText = `
                position: fixed;
                left: ${x}%;
                top: ${y}%;
                font-size: ${size}px;
                color: currentColor;
                opacity: ${opacity};
                transform: rotate(${rotate}deg);
                pointer-events: none;
                z-index: 0;
                transition: opacity 0.6s ease;
                text-shadow: 0 0 20px rgba(255,255,255,0.1);
            `;
            container.appendChild(el);
            bgElements.push(el);
        }
    }

    // Функция, которая устанавливает тему body и генерирует иконки
    function setBodyTheme(theme) {
        document.body.className = '';
        if (theme) {
            document.body.classList.add('theme-' + theme);
            createBackgroundIcons(theme);
        } else {
            createBackgroundIcons(null);
        }
    }

    // Устанавливаем начальную тему (активная вкладка при загрузке)
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const theme = activeTab.dataset.theme;
        setBodyTheme(theme);
    } else {
        // Если нет активной, ставим первую
        const firstTab = document.querySelector('.tab-content');
        if (firstTab) {
            const theme = firstTab.dataset.theme;
            setBodyTheme(theme);
        }
    }

    // Обработчики кликов по кнопкам
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.dataset.tab;
            const activeContent = document.getElementById(tabId);
            activeContent.classList.add('active');

            const theme = activeContent.dataset.theme;
            setBodyTheme(theme);
        });
    });
});