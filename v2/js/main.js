/**
 * Колибри Аптека — Main JavaScript
 * Плавный скролл, анимации при прокрутке, мобильное меню
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ====================
    // Дополняет CSS scroll-behavior для точного позиционирования
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Закрываем мобильное меню после клика
                nav.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ==================== ШАПКА: тень при скролле ====================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ==================== МОБИЛЬНОЕ МЕНЮ ====================
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen);
    });

    // ==================== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ====================
    // Intersection Observer — элементы появляются при входе в viewport
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимируем только один раз
            }
        });
    }, {
        threshold: 0.15,    // Срабатывает когда 15% элемента видно
        rootMargin: '0px 0px -40px 0px' // Небольшой отступ снизу
    });

    animatedElements.forEach(el => observer.observe(el));

    // ==================== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // ==================== ЗАГЛУШКИ: клик по документам и видео ====================
    document.querySelectorAll('.doc-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Документ будет доступен после загрузки на сервер.\n\nЗамените href="#" на реальный путь к PDF-файлу.');
        });
    });

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            alert('Видеоинструкция будет доступна после публикации.\n\nВставьте iframe с YouTube/VK или ссылку на видеофайл.');
        });
    });
});
