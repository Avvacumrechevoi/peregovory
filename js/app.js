(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ---- Mode Tabs ---- //

  const tabs = $$('.mode-tab');
  const panels = $$('.mode-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;

      tabs.forEach(t => t.classList.remove('mode-tab--active'));
      tab.classList.add('mode-tab--active');

      panels.forEach(p => {
        p.classList.remove('mode-content--active');
        if (p.dataset.content === mode) {
          p.classList.add('mode-content--active');
        }
      });
    });
  });

  // ---- Modal ---- //

  const modal = $('#scenarioModal');
  const modalBackdrop = $('#modalBackdrop');
  const modalClose = $('#modalClose');
  const modalTitle = $('#modalTitle');
  const modalDesc = $('#modalDesc');
  const modalIcon = $('#modalIcon');
  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');

  function openModal(card) {
    const title = card.querySelector('.card__title')?.textContent || '';
    const desc = card.querySelector('.card__desc')?.textContent || '';
    const iconEl = card.querySelector('.card__icon');

    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    modalIcon.className = 'modal__icon';
    if (iconEl) {
      modalIcon.className = iconEl.className.replace('card__icon', 'modal__icon');
      modalIcon.innerHTML = iconEl.innerHTML;
    }

    chatMessages.innerHTML = `
      <div class="chat__welcome">
        <p><strong>${title}</strong></p>
        <p>${desc}</p>
        <p style="margin-top:8px;">Напишите сообщение, чтобы начать тренировку.</p>
      </div>
    `;

    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => chatInput.focus(), 300);
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  // Card clicks
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    if (card.closest('.modal')) return;
    openModal(card);
  });

  // ---- Chat Simulation ---- //

  const responses = [
    'Отлично! Давайте разберём эту ситуацию подробнее. Какова ваша основная цель в этих переговорах?',
    'Хороший вопрос. Попробуйте подумать, какие интересы стоят за позицией вашего оппонента.',
    'Рекомендую начать с определения зоны возможного соглашения (ZOPA). Что является минимально приемлемым результатом для вас?',
    'Интересный подход! Обратите внимание на технику «расширения пирога» — возможно, есть способ создать дополнительную ценность для обеих сторон.',
    'Давайте проработаем вашу BATNA (лучшую альтернативу). Что произойдёт, если переговоры зайдут в тупик?',
    'Важный момент! Эмоции часто мешают рациональному ведению переговоров. Попробуйте использовать технику «отделения людей от проблемы».',
    'Отличная стратегия. Теперь подумайте, какие уступки вы готовы сделать и что хотите получить взамен.',
    'Это распространённая ситуация. Предлагаю использовать метод принципиальных переговоров по Фишеру и Юри.',
  ];

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat__message chat__message--${type}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat__message chat__message--ai typing-wrapper';
    el.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    const typing = showTyping();

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      typing.remove();
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(response, 'ai');
    }, delay);
  }

  chatSend.addEventListener('click', sendMessage);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  // ---- Keyboard Navigation ---- //

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('modal--open')) return;

    const activeTab = $('.mode-tab--active');
    const idx = tabs.indexOf(activeTab);

    if (e.key === 'ArrowRight' && idx < tabs.length - 1) {
      tabs[idx + 1].click();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      tabs[idx - 1].click();
    }
  });
})();
