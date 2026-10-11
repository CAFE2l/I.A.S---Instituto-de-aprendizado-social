(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const counter = document.getElementById('counter');
  const chapter = document.getElementById('chapter');
  const progress = document.getElementById('progress');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const fullscreen = document.getElementById('fullscreen');
  const stage = document.getElementById('presentation');
  const questionAnswers = {
    experience: 'Como mostrar o que sei fazer antes da primeira oportunidade?',
    practice: 'Desafios reais transformam conteúdo em prática que pode ser explicada e compartilhada.',
    access: 'Equipamentos, espaço de colaboração e mentoria ajudam a abrir caminho para participar.'
  };
  const profileContent = {
    student: {
      context: 'PERSPECTIVA DO ESTUDANTE', title: 'Seu próximo passo começa aqui.',
      description: 'Aprenda, participe de desafios e registre o que construiu.',
      featureLabel: 'DESAFIO EM DESTAQUE', featureTitle: 'Ideias para cidades melhores', featureAction: 'Explorar a proposta ↗',
      sideLabel: 'SUA JORNADA', sideTitle: 'Portfólio', sideDescription: 'projetos e aprendizados',
      bottomLeft: '✳  Trilha de IA responsável', bottomRight: 'Comunidade →'
    },
    community: {
      context: 'PERSPECTIVA DA COMUNIDADE', title: 'Aprender também é compartilhar.',
      description: 'Troque experiências, faça perguntas e encontre pessoas com interesses em comum.',
      featureLabel: 'CONVERSA EM DESTAQUE', featureTitle: 'Como foi seu primeiro projeto?', featureAction: 'Participar da conversa ↗',
      sideLabel: 'PARA EXPLORAR', sideTitle: 'Grupos de estudo', sideDescription: 'ideias e experiências',
      bottomLeft: '◎  Fórum moderado', bottomRight: 'Compartilhar →'
    },
    partner: {
      context: 'PERSPECTIVA DE PARCEIROS', title: 'Proponha um desafio real.',
      description: 'Conecte estudantes a problemas, mentores, visitas e feedback.',
      featureLabel: 'COLABORAÇÃO', featureTitle: 'Desafio com propósito', featureAction: 'Conhecer possibilidades ↗',
      sideLabel: 'CONTRIBUA COM', sideTitle: 'Mentoria', sideDescription: 'orientação e repertório',
      bottomLeft: '↗  Parcerias transparentes', bottomRight: 'Conectar →'
    }
  };
  let current = 0;
  let touchStartX = null;
  let touchStartY = null;
  const pad = (value) => String(value).padStart(2, '0');

  function showSlide(index) {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    if (nextIndex === current && slides[current].classList.contains('active')) return;
    slides[current].classList.remove('active');
    current = nextIndex;
    slides[current].classList.add('active');
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      if (i !== current) slide.inert = true;
      else slide.inert = false;
    });
    counter.innerHTML = `${pad(current + 1)} <i>/</i> ${pad(slides.length)}`;
    chapter.textContent = slides[current].dataset.chapter || 'I.A.S.';
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }

  function isTypingTarget(target) {
    return target instanceof HTMLElement && (
      target.isContentEditable ||
      target.matches('input, textarea, select, button, [role="textbox"], [role="combobox"]')
    );
  }

  prev.addEventListener('click', () => showSlide(current - 1));
  next.addEventListener('click', () => showSlide(current + 1));

  document.querySelectorAll('.question-option').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.question-option').forEach((option) => {
        const selected = option === button;
        option.classList.toggle('selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      document.querySelector('#question-feedback p').textContent = questionAnswers[button.dataset.answer];
    });
  });

  const dashboard = document.getElementById('platform-card');
  document.querySelectorAll('.dash-nav').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.dash-nav').forEach((option) => {
        const selected = option === button;
        option.classList.toggle('selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      const content = profileContent[button.dataset.profile];
      for (const [key, value] of Object.entries(content)) {
        const element = document.getElementById(`dash-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`);
        if (element) element.textContent = value;
      }
    });
  });
  dashboard?.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = dashboard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    dashboard.style.transform = `perspective(1100px) rotateY(${-8 + x * 4}deg) rotateX(${2 - y * 4}deg)`;
  });
  dashboard?.addEventListener('pointerleave', () => { dashboard.style.transform = ''; });

  document.addEventListener('keydown', (event) => {
    if (isTypingTarget(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
      event.preventDefault();
      showSlide(current + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      showSlide(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1);
    } else if (event.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  });

  stage.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) showSlide(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  fullscreen.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await stage.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      fullscreen.setAttribute('aria-label', 'Tela cheia indisponível neste navegador');
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = Boolean(document.fullscreenElement);
    fullscreen.setAttribute('aria-label', isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia');
    fullscreen.title = isFullscreen ? 'Sair da tela cheia' : 'Tela cheia';
  });
  showSlide(0);
})();
