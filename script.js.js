document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем active у всех кнопок и вкладок
            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            // Добавляем active нажатой кнопке
            this.classList.add('active');

            // Показываем соответствующую вкладку
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
});