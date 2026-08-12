document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    // Функция, которая устанавливает тему для body
    function setBodyTheme(theme) {
        // Удаляем все классы тем с body
        document.body.className = '';
        if (theme) {
            document.body.classList.add('theme-' + theme);
        }
    }

    // Устанавливаем начальную тему (активная вкладка при загрузке)
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const theme = activeTab.dataset.theme;
        setBodyTheme(theme);
    }

    // Обработчики кликов по кнопкам
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активные классы
            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            // Активируем текущую кнопку и вкладку
            this.classList.add('active');
            const tabId = this.dataset.tab;
            const activeContent = document.getElementById(tabId);
            activeContent.classList.add('active');

            // Меняем тему body
            const theme = activeContent.dataset.theme;
            setBodyTheme(theme);
        });
    });
});