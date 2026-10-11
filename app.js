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
  const demoContent = document.getElementById('demo-content');
  const demoState = { page: 'home', detail: null, category: 'Todos', query: '', composing: false, posts: [] };
  const workshopData = [
    { title: 'IA com responsabilidade', tag: 'TECNOLOGIA', description: 'Explore como verificar respostas, reconhecer vieses e proteger dados.', duration: '60 min · exemplo', steps: ['Perguntas melhores', 'Checagem de fontes', 'Uso responsável'], location: 'Local a definir pela organização', schedule: 'Data e horário a confirmar', rules: ['Respeitar as pessoas e as diferentes ideias', 'Colaborar e participar das atividades', 'Usar equipamentos e ferramentas com responsabilidade'], partners: 'Empresas parceiras: divulgação após confirmação' },
    { title: 'Do problema ao protótipo', tag: 'CRIAÇÃO', description: 'Transforme uma necessidade da comunidade em uma ideia testável.', duration: '90 min · exemplo', steps: ['Entender o contexto', 'Rascunhar soluções', 'Compartilhar aprendizados'], location: 'Local a definir pela organização', schedule: 'Data e horário a confirmar', rules: ['Respeitar as pessoas e as diferentes ideias', 'Colaborar e participar das atividades', 'Usar equipamentos e ferramentas com responsabilidade'], partners: 'Empresas parceiras: divulgação após confirmação' },
    { title: 'Portfólio em prática', tag: 'CARREIRA', description: 'Conte a história de um projeto, suas decisões e o que aprendeu.', duration: '45 min · exemplo', steps: ['Escolher um projeto', 'Registrar o processo', 'Apresentar resultados'], location: 'Local a definir pela organização', schedule: 'Data e horário a confirmar', rules: ['Respeitar as pessoas e as diferentes ideias', 'Colaborar e participar das atividades', 'Usar equipamentos e ferramentas com responsabilidade'], partners: 'Empresas parceiras: divulgação após confirmação' }
  ];
  const forumData = [
    { category: 'Projetos', title: 'Como vocês organizam as ideias do grupo?', replies: 8, text: 'Um espaço de exemplo para compartilhar métodos de colaboração, protótipos e aprendizados.' },
    { category: 'IA', title: 'Que passos ajudam a conferir uma resposta da IA?', replies: 12, text: 'Uma conversa demonstrativa sobre fontes, contexto, vieses e responsabilidade.' },
    { category: 'Estudos', title: 'Vamos montar um grupo de estudos?', replies: 5, text: 'Exemplo de tópico para combinar temas de estudo e trocar referências.' }
  ];
  const portfolioData = [
    { title: 'Mapa de ideias para o bairro', tag: 'PROJETO · EXEMPLO', text: 'Pesquisa colaborativa para identificar necessidades locais e organizar propostas iniciais.' },
    { title: 'Protótipo de serviço digital', tag: 'PROJETO · EXEMPLO', text: 'Uma jornada de telas criada para explicar uma solução e receber feedback.' },
    { title: 'Diário de aprendizagem', tag: 'PROCESSO · EXEMPLO', text: 'Registro de tentativas, decisões e próximos passos ao longo de uma trilha.' }
  ];
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
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

  const network = document.getElementById('ias-network');
  let selectedEcoNode = '';
  function highlightEcoNode(nodeName) {
    network?.classList.toggle('network-engaged', Boolean(nodeName));
    network?.querySelectorAll('.eco-node').forEach((node) => {
      const active = node.dataset.ecoNode === nodeName;
      node.classList.toggle('connected', active);
      node.setAttribute('aria-pressed', String(active && selectedEcoNode === nodeName));
    });
    network?.querySelectorAll('.eco-network [data-connection]').forEach((path) => {
      path.classList.toggle('active', path.dataset.connection === nodeName);
    });
  }
  network?.querySelectorAll('.eco-node').forEach((node) => {
    const name = node.dataset.ecoNode;
    node.addEventListener('pointerenter', () => highlightEcoNode(name));
    node.addEventListener('pointerleave', () => highlightEcoNode(selectedEcoNode));
    node.addEventListener('focus', () => highlightEcoNode(name));
    node.addEventListener('blur', () => highlightEcoNode(selectedEcoNode));
    node.addEventListener('click', () => {
      selectedEcoNode = selectedEcoNode === name ? '' : name;
      highlightEcoNode(selectedEcoNode);
    });
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        node.click();
      }
    });
  });

  const dashboard = document.getElementById('platform-card');
  function demoPage(page) {
    demoState.page = page;
    demoState.detail = null;
    demoState.composing = false;
    document.querySelectorAll('.demo-tab').forEach((tab) => {
      const selected = tab.dataset.page === page;
      tab.classList.toggle('active', selected);
      if (selected) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
    });
    renderDemo();
  }
  function renderDemo() {
    if (!demoContent) return;
    const button = (label, action, extra = '') => `<button type="button" class="demo-action ${extra}" data-action="${action}">${label}</button>`;
    const cards = (items, type) => `<div class="demo-list">${items.map((item, index) => `<article class="demo-item"><small>${item.tag || item.category || 'EXEMPLO'}</small><h4>${item.title}</h4><p>${item.description || item.text}</p><div class="demo-item-foot"><span>${item.duration || `${item.replies} respostas · exemplo`}</span>${button('Ver detalhes ↗', `${type}:${index}`, 'demo-link')}</div></article>`).join('')}</div>`;
    if (demoState.detail?.type === 'workshop') {
      const item = workshopData[demoState.detail.index];
      demoContent.innerHTML = `<div class="demo-heading">${button('← Workshops', 'back')}<small>WORKSHOP DEMONSTRATIVO · INFORMAÇÕES A CONFIRMAR</small><h3>${item.title}</h3><p>${item.description}</p></div><div class="workshop-facts"><div><small>LOCAL DO EVENTO</small><b>${item.location}</b></div><div><small>DATA E HORÁRIO</small><b>${item.schedule}</b></div><div><small>EMPRESAS PARCEIRAS</small><b>${item.partners}</b></div></div><div class="demo-detail workshop-rules"><b>Regras sugeridas · exemplo</b><ol>${item.rules.map((rule) => `<li>${rule}</li>`).join('')}</ol></div><div class="demo-detail"><b>O que explorar</b><ol>${item.steps.map((step) => `<li>${step}</li>`).join('')}</ol><span>Conteúdo demonstrativo · nenhuma inscrição será enviada</span></div>`;
    } else if (demoState.detail?.type === 'thread') {
      const item = demoState.detail.item;
      demoContent.innerHTML = `<div class="demo-heading">${button('← Comunidade', 'back')}<small>${escapeHTML(item.category.toUpperCase())} · TÓPICO DE EXEMPLO</small><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p></div><div class="demo-detail"><b>Conversa demonstrativa</b><p>Use este espaço para imaginar a troca de ideias, referências e feedback entre participantes.</p><span>${item.replies} respostas fictícias para fins de demonstração</span></div>`;
    } else if (demoState.detail?.type === 'project') {
      const item = portfolioData[demoState.detail.index];
      demoContent.innerHTML = `<div class="demo-heading">${button('← Portfólio', 'back')}<small>${item.tag}</small><h3>${item.title}</h3><p>${item.text}</p></div><div class="demo-detail"><b>O que este registro pode mostrar</b><ol><li>O desafio e o contexto</li><li>As decisões tomadas em equipe</li><li>O que foi aprendido e pode vir depois</li></ol><span>Projeto fictício · sem dados pessoais</span></div>`;
    } else if (demoState.page === 'home') {
      demoContent.innerHTML = `<div class="demo-welcome"><small>UM ESPAÇO PARA FAZER E COMPARTILHAR</small><h3>Aprender junto abre caminhos.</h3><p>Explore atividades, conversas e projetos em uma só comunidade.</p></div><div class="demo-home-grid"><button class="demo-feature" data-action="go:workshops"><span>01 · APRENDER</span><b>Workshops e trilhas</b><i>Descobrir atividades ↗</i></button><button class="demo-feature community-feature" data-action="go:community"><span>02 · TROCAR</span><b>Ideias em comunidade</b><i>Entrar na conversa ↗</i></button><div class="demo-progress-card"><small>JORNADA ILUSTRATIVA</small><b>Seu próximo passo</b><div class="demo-progress"><i></i></div><span>2 de 5 etapas · exemplo</span></div></div>`;
    } else if (demoState.page === 'workshops') {
      demoContent.innerHTML = `<div class="demo-heading"><small>APRENDER FAZENDO · EXEMPLOS</small><h3>Escolha por onde começar.</h3><p>Atividades demonstrativas, com objetivos claros e espaço para praticar.</p></div>${cards(workshopData, 'workshop')}`;
    } else if (demoState.page === 'community') {
      const categories = ['Todos', 'Projetos', 'IA', 'Estudos'];
      const query = demoState.query.toLocaleLowerCase('pt-BR');
      const posts = [...demoState.posts, ...forumData].filter((item) => (demoState.category === 'Todos' || item.category === demoState.category) && `${item.title} ${item.category}`.toLocaleLowerCase('pt-BR').includes(query));
      demoContent.innerHTML = `<div class="demo-heading"><small>TROCAS COM RESPEITO · EXEMPLOS</small><h3>Uma comunidade que aprende junto.</h3><p>Busque um assunto ou abra um tópico demonstrativo.</p></div><div class="demo-tools"><label class="demo-search">⌕ <input type="search" id="demo-search" placeholder="Buscar conversas" aria-label="Buscar conversas"></label><div class="demo-filters" role="group" aria-label="Filtrar conversas">${categories.map((category) => `<button type="button" data-category="${category}" class="${demoState.category === category ? 'selected' : ''}">${category}</button>`).join('')}</div>${button(demoState.composing ? 'Fechar formulário' : '+ Novo tópico', 'compose')}</div>${demoState.composing ? `<form class="demo-compose"><label>Título <input name="title" required maxlength="70" placeholder="O que você quer compartilhar?"></label><label>Categoria <select name="category"><option>Projetos</option><option>IA</option><option>Estudos</option></select></label><label>Mensagem <textarea name="text" required maxlength="240" placeholder="Escreva uma ideia ou pergunta"></textarea></label><p>Prévia local: não será enviada nem salva ao fechar a página.</p><button type="submit" class="demo-action">Adicionar à prévia</button></form>` : ''}<div class="demo-list">${posts.length ? posts.map((item, index) => `<article class="demo-item"><small>${escapeHTML(item.category.toUpperCase())} · EXEMPLO</small><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.text)}</p><div class="demo-item-foot"><span>${item.replies} respostas demonstrativas</span>${button('Abrir conversa ↗', `thread:${index}`,'demo-link')}</div></article>`).join('') : '<p class="demo-empty">Nenhuma conversa encontrada nesta demonstração.</p>'}</div>`;
      const search = document.getElementById('demo-search');
      if (search) { search.value = demoState.query; search.addEventListener('input', () => { demoState.query = search.value; const cursor = search.selectionStart; renderDemo(); const nextSearch = document.getElementById('demo-search'); nextSearch.focus(); nextSearch.setSelectionRange(cursor, cursor); }); }
    } else if (demoState.page === 'portfolio') {
      demoContent.innerHTML = `<div class="demo-heading"><small>PROCESSO VISÍVEL · EXEMPLOS</small><h3>Projetos que contam uma jornada.</h3><p>Registros fictícios de prática, colaboração e descoberta.</p></div>${cards(portfolioData, 'project')}`;
    } else {
      demoContent.innerHTML = `<div class="demo-heading"><small>PERFIL DEMONSTRATIVO</small><h3>Estudante de exemplo</h3><p>Interesses: tecnologia, comunidade e criação colaborativa.</p></div><div class="demo-profile-grid"><div class="demo-detail"><b>Trilha de aprendizagem</b><div class="demo-progress"><i></i></div><p>2 de 5 etapas · progresso fictício</p><span>Um retrato ilustrativo, sem perfil real ou dados pessoais.</span></div><div class="demo-detail"><b>Próximos passos</b><ol><li>Participar de um workshop</li><li>Registrar um projeto</li><li>Compartilhar uma descoberta</li></ol></div></div>`;
    }
  }
  document.querySelectorAll('.demo-tab').forEach((tab) => tab.addEventListener('click', () => demoPage(tab.dataset.page)));
  demoContent?.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action], [data-category]');
    if (!target) return;
    if (target.dataset.category) { demoState.category = target.dataset.category; renderDemo(); return; }
    const action = target.dataset.action;
    if (action === 'back') { demoState.detail = null; renderDemo(); }
    else if (action === 'compose') { demoState.composing = !demoState.composing; renderDemo(); if (demoState.composing) demoContent.querySelector('[name="title"]')?.focus(); }
    else if (action.startsWith('go:')) demoPage(action.slice(3));
    else if (action.startsWith('workshop:')) { demoState.detail = { type: 'workshop', index: Number(action.split(':')[1]) }; renderDemo(); }
    else if (action.startsWith('project:')) { demoState.detail = { type: 'project', index: Number(action.split(':')[1]) }; renderDemo(); }
    else if (action.startsWith('thread:')) { const visible = [...demoState.posts, ...forumData].filter((item) => (demoState.category === 'Todos' || item.category === demoState.category) && `${item.title} ${item.category}`.toLocaleLowerCase('pt-BR').includes(demoState.query.toLocaleLowerCase('pt-BR'))); demoState.detail = { type: 'thread', item: visible[Number(action.split(':')[1])] }; renderDemo(); }
  });
  demoContent?.addEventListener('submit', (event) => {
    if (!event.target.matches('.demo-compose')) return;
    event.preventDefault();
    const form = new FormData(event.target);
    demoState.posts.unshift({ title: String(form.get('title')), category: String(form.get('category')), text: String(form.get('text')), replies: 0 });
    demoState.composing = false; demoState.category = 'Todos'; demoState.query = ''; renderDemo();
  });
  demoContent?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (demoState.composing || demoState.detail)) { demoState.composing = false; demoState.detail = null; renderDemo(); }
  });
  renderDemo();
  dashboard?.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = dashboard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    dashboard.style.transform = `perspective(1100px) rotateY(${-8 + x * 4}deg) rotateX(${2 - y * 4}deg)`;
  });
  dashboard?.addEventListener('pointerleave', () => { dashboard.style.transform = ''; });

  const photoCards = document.querySelectorAll('.photo-card');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    photoCards.forEach((card, index) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${-y * 5}deg`);
        card.style.setProperty('--tilt-y', `${x * 5}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
      card.style.setProperty('--tilt-z', index ? '1deg' : '-1deg');
    });
  }

  const aiExplanations = {
    person: ['A pessoa conduz.', 'A IA apoia o trabalho; o estudante continua responsável pelo julgamento e pelas decisões.'],
    knowledge: ['Conhecimento exige contexto.', 'Sugestões da IA precisam ser compreendidas, verificadas e relacionadas a fontes confiáveis.'],
    responsibility: ['Responsabilidade humana.', 'Autoria, privacidade, transparência e avaliação crítica orientam o uso da tecnologia.']
  };
  const aiSystem = document.getElementById('ai-system');
  const aiInsight = document.getElementById('ai-insight');
  let selectedConcept = '';
  function showAiConcept(concept) {
    const [title, text] = aiExplanations[concept] || ['IA amplia possibilidades.', 'Compreender, verificar e decidir continuam sendo responsabilidades humanas.'];
    aiInsight.innerHTML = `<b>${title}</b><span>${text}</span>`;
    aiSystem?.classList.toggle('has-focus', Boolean(concept));
    aiSystem?.querySelectorAll('.ai-node').forEach((node) => {
      const active = node.dataset.concept === concept;
      node.classList.toggle('active', active);
      node.setAttribute('aria-pressed', String(active && selectedConcept === concept));
    });
    aiSystem?.querySelectorAll('.ai-links path').forEach((path) => path.classList.toggle('active', path.dataset.link === concept));
  }
  aiSystem?.querySelectorAll('.ai-node').forEach((node) => {
    const concept = node.dataset.concept;
    node.addEventListener('pointerenter', () => showAiConcept(concept));
    node.addEventListener('focus', () => showAiConcept(concept));
    node.addEventListener('pointerleave', () => showAiConcept(selectedConcept));
    node.addEventListener('blur', () => showAiConcept(selectedConcept));
    node.addEventListener('click', () => {
      selectedConcept = selectedConcept === concept ? '' : concept;
      showAiConcept(selectedConcept);
    });
  });
  aiSystem?.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || selectedConcept) return;
    const rect = aiSystem.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    aiSystem.style.setProperty('--tilt-x', `${-y * 3}deg`);
    aiSystem.style.setProperty('--tilt-y', `${x * 3}deg`);
  });
  aiSystem?.addEventListener('pointerleave', () => { aiSystem.style.removeProperty('--tilt-x'); aiSystem.style.removeProperty('--tilt-y'); });

  const partnerDetails = [
    ['Projetos digitais internos', 'Desenvolver soluções digitais para necessidades institucionais, com escopo definido, revisão e acompanhamento.', 'Contribuição possível: protótipos, documentação ou melhorias acordadas.', 'Limite: acesso, publicação e uso definidos pela instituição.'],
    ['Materiais institucionais', 'Organizar recursos e materiais que apoiem a comunicação e as atividades de aprendizagem.', 'Contribuição possível: pesquisa, estruturação e produção de materiais.', 'Limite: conteúdo revisado e aprovado antes de qualquer uso institucional.'],
    ['Comunicação visual', 'Criar materiais consistentes com a identidade visual institucional.', 'Contribuição possível: propostas visuais para projetos e ações autorizadas.', 'Limite: publicação depende de revisão e aprovação institucional.'],
    ['Mentoria e desafios', 'Explorar desafios orientados, receber feedback e desenvolver competências em ambiente supervisionado.', 'Contribuição possível: compartilhar contexto, orientar e oferecer devolutivas.', 'Limite: escopo transparente, acompanhamento e regras aplicáveis.']
  ];
  const partnerScene = document.querySelector('.partner-scene');
  const partnerDetail = document.getElementById('partner-detail');
  let selectedPartner = -1;
  function selectPartner(index) {
    selectedPartner = index;
    partnerScene?.querySelectorAll('.partner-card').forEach((card) => {
      const active = Number(card.dataset.partner) === index;
      card.classList.toggle('selected', active);
      card.setAttribute('aria-pressed', String(active));
    });
    partnerScene?.querySelectorAll('.partner-lines path').forEach((path) => path.classList.toggle('active', Number(path.dataset.link) === index));
    if (index < 0) {
      partnerDetail.classList.remove('open');
      partnerDetail.innerHTML = '<b>Colaboração com propósito</b><span>Selecione uma área para explorar exemplos de contribuição, escopo e acompanhamento.</span><button type="button" data-partner-close aria-label="Fechar detalhes">×</button>';
      return;
    }
    const [title, objective, contribution, boundary] = partnerDetails[index];
    partnerDetail.innerHTML = `<b>${title}</b><p>${objective}</p><span><strong>Possibilidade:</strong> ${contribution}</span><span><strong>Limites:</strong> ${boundary}</span><button type="button" data-partner-close aria-label="Fechar detalhes">×</button>`;
    partnerDetail.classList.add('open');
  }
  partnerScene?.querySelectorAll('.partner-card').forEach((card) => card.addEventListener('click', () => selectPartner(Number(card.dataset.partner))));
  partnerDetail?.addEventListener('click', (event) => { if (event.target.closest('[data-partner-close]')) selectPartner(-1); });
  document.querySelector('.partnership')?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && selectedPartner >= 0) { const previous = selectedPartner; selectPartner(-1); partnerScene.querySelector(`[data-partner="${previous}"]`)?.focus(); }
  });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    partnerScene?.querySelectorAll('.partner-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--card-x', `${-y * 4}deg`);
        card.style.setProperty('--card-y', `${x * 4}deg`);
      });
      card.addEventListener('pointerleave', () => { card.style.removeProperty('--card-x'); card.style.removeProperty('--card-y'); });
    });
  }

  const phaseInfo = [
    ['Preparar uma base responsável', 'Alinhar público, áreas de atuação, regras, responsabilidades e recursos disponíveis.', 'Escuta inicial, escopo definido e responsabilidades documentadas.', 'Avançar quando houver condições, pessoas responsáveis e limites claros.'],
    ['Testar em pequena escala', 'Realizar uma atividade piloto, como workshop ou hackathon, e recolher feedback.', 'Participação, aprendizados, feedback e pontos de melhoria observados.', 'Revisar aprendizados e capacidade antes de decidir os próximos passos.'],
    ['Conectar recursos e pessoas', 'Organizar uma presença digital, calendário de atividades e comunidade moderada.', 'Acessibilidade dos recursos, qualidade das interações e necessidades de moderação.', 'Avançar conforme recursos, participação e acompanhamento forem sustentáveis.'],
    ['Evoluir com evidências', 'Ampliar atividades, mentoria, portfólios e parcerias de forma gradual.', 'Experiências documentadas, competências desenvolvidas e feedback das pessoas envolvidas.', 'Revisar continuamente o que funciona e ajustar a proposta.']
  ];
  const roadmap = document.getElementById('roadmap-steps');
  const roadmapDetail = document.getElementById('roadmap-detail');
  let selectedPhase = 0;
  function selectPhase(index) {
    selectedPhase = index;
    roadmap?.querySelectorAll('.roadmap-step').forEach((step) => {
      const active = Number(step.dataset.phase) === index;
      step.classList.toggle('selected', active);
      step.setAttribute('aria-pressed', String(active));
    });
    const activePath = roadmap?.querySelector('.track-active');
    if (activePath) activePath.style.strokeDasharray = `${[18, 41, 68, 100][index]} 100`;
    const [title, activity, evidence, criteria] = phaseInfo[index];
    roadmapDetail.innerHTML = `<div><small>FASE ${String(index + 1).padStart(2, '0')} · EXEMPLO</small><b>${title}</b></div><p><strong>Atividade:</strong> ${activity}</p><p><strong>Evidências a acompanhar:</strong> ${evidence}</p><p><strong>Critério ilustrativo:</strong> ${criteria}</p>`;
  }
  roadmap?.querySelectorAll('.roadmap-step').forEach((step) => {
    const index = Number(step.dataset.phase);
    step.addEventListener('click', () => selectPhase(index));
    step.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); selectPhase(index); }
    });
  });
  selectPhase(0);

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
    } else if (event.key === 'Escape' && demoState.detail) {
      demoState.detail = null; renderDemo();
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
