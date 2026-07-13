/* ============================================================
   КОЛИБРИ АПТЕКА — СКРИПТЫ ЛЕНДИНГА
   Без внешних зависимостей, чистый Vanilla JS.
   Разделы:
   1. Текущий год в подвале
   2. Прогресс-бар скролла + состояние шапки при скролле
   3. Мобильное меню (бургер)
   4. Плавное закрытие меню при клике по ссылке
   5. Reveal-анимации по IntersectionObserver
   6. Кнопка «наверх»
   7. Анимация заполнения индикаторов на панели аналитики (hero)
   8. Обработка отправки формы (демо, без бэкенда)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. Текущий год в подвале
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ----------------------------------------------------------
     2. Прогресс-бар скролла + фон шапки при прокрутке
  ---------------------------------------------------------- */
  const progressBar = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTopBtn');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = progress + '%';
    if (header) header.classList.toggle('is-scrolled', scrollTop > 24);
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', scrollTop > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ----------------------------------------------------------
     3. Мобильное меню (бургер)
  ---------------------------------------------------------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !mainNav.classList.contains('is-open');
    mainNav.classList.toggle('is-open', isOpen);
    burgerBtn.classList.toggle('is-open', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => toggleMenu());

    /* -------------------------------------------------------
       4. Закрываем меню при клике по любой ссылке навигации
    ------------------------------------------------------- */
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(true));
    });
  }


  /* ----------------------------------------------------------
     5. Reveal-анимации при появлении элементов в зоне видимости
  ---------------------------------------------------------- */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }


  /* ----------------------------------------------------------
     6. Кнопка «наверх»
  ---------------------------------------------------------- */
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     7. Анимация заполнения полос-индикаторов на hero-панели.
     По умолчанию ширина .dash-bar-fill задана инлайн-стилем
     (см. index.html), но чтобы полосы «наливались» при первом
     появлении карточки в зоне видимости, а не сразу при
     загрузке страницы, временно обнуляем их и восстанавливаем
     по срабатыванию наблюдателя.
  ---------------------------------------------------------- */
  const dashCard = document.querySelector('.dash-card');

  if (dashCard && 'IntersectionObserver' in window) {
    const bars = dashCard.querySelectorAll('.dash-bar-fill');
    const targetWidths = Array.from(bars).map((bar) => bar.style.width);
    bars.forEach((bar) => { bar.style.width = '0%'; });

    const dashObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          bars.forEach((bar, i) => {
            // небольшая задержка для более выразительного «наполнения»
            setTimeout(() => { bar.style.width = targetWidths[i]; }, 120 * i);
          });
          dashObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    dashObserver.observe(dashCard);
  }


  /* ----------------------------------------------------------
     8. Обработка отправки формы обратной связи
     Бэкенд не подключён — это демонстрационная обработка.
     Для реальной интеграции замените блок на fetch() к своему
     API или сервису (Formspree, собственный обработчик и т.д.).
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('[name="name"]');
      const contactInput = contactForm.querySelector('[name="contact"]');

      if (!nameInput.value.trim() || !contactInput.value.trim()) {
        formNote.textContent = 'Заполните имя и способ связи, пожалуйста.';
        formNote.style.color = '#E8483C';
        return;
      }

      // Здесь в реальном проекте выполняется отправка на сервер, например:
      // fetch('/api/lead', { method: 'POST', body: new FormData(contactForm) })

      formNote.style.color = 'var(--status-ok)';
      formNote.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      contactForm.reset();
    });
  }

});
