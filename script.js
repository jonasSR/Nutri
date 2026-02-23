// ── CHATBOT ──
let chatOpen = false;
let isTyping = false;
let chatStarted = false;

const responses = {
  "quanto custa": {
    text: "Os valores variam conforme o plano escolhido 💚\n\n• Consulta avulsa: R$150\n• Plano mensal (4 retornos): R$480\n• Plano trimestral: R$1.200\n\nQuer que eu te passe mais detalhes sobre algum plano?",
    replies: ["Quero o plano mensal", "Plano trimestral", "Como funciona a consulta?"]
  },
  "plano mensal": {
    text: "Ótima escolha! O plano mensal inclui:\n\n✅ 1 consulta inicial completa\n✅ 3 retornos de acompanhamento\n✅ Cardápio personalizado\n✅ Suporte pelo WhatsApp\n✅ Ajustes ilimitados no plano\n\nTudo por R$480/mês. Quer agendar?",
    replies: ["Quero agendar!", "Tem atendimento online?", "Ver plano trimestral"]
  },
  "plano trimestral": {
    text: "O plano trimestral é o mais completo 🏆\n\nInclui tudo do plano mensal mais:\n\n✅ Prioridade no agendamento\n✅ Análise de exames inclusa\n✅ Plano de suplementação\n✅ Acesso ao grupo VIP de receitas\n\nTudo por R$1.200 (equivale a R$400/mês — você economiza R$240).\n\nQuer garantir sua vaga?",
    replies: ["Quero agendar!", "Quero o mensal", "Como funciona?"]
  },
  "como funciona": {
    text: "É bem simples! Funciona assim:\n\n1️⃣ Você agenda sua consulta\n2️⃣ Preenche a anamnese antes\n3️⃣ Consulta de 1h com a Gaby\n4️⃣ Recebe seu plano alimentar\n5️⃣ Suporte contínuo pelo WhatsApp\n\nQuer agendar agora? 😊",
    replies: ["Quero agendar!", "Quanto custa?", "Tem online?"]
  },
  "online": {
    text: "Sim! A Gaby atende tanto online quanto presencial 💻\n\nO atendimento online é pelo Google Meet ou Zoom e funciona muito bem — você recebe tudo pelo digital mesmo, cardápio, orientações e suporte pelo WhatsApp.\n\nPrefere presencial ou online?",
    replies: ["Quero online", "Quero presencial", "Agendar agora"]
  },
  "presencial": {
    text: "Ótimo! O atendimento presencial é em São Paulo 📍\n\nO endereço completo é passado após o agendamento. As consultas têm duração de 1 hora e o ambiente é super acolhedor 🌿\n\nQuer agendar?",
    replies: ["Quero agendar!", "Quanto custa?", "Tem estacionamento?"]
  },
  "estacionamento": {
    text: "Sim, tem estacionamento no prédio e também opções na rua bem pertinho 🚗\n\nQuer agendar sua consulta?",
    replies: ["Quero agendar!", "Ver planos"]
  },
  "primeira consulta": {
    text: "Na primeira consulta a Gaby faz uma avaliação completa:\n\n🔍 Histórico alimentar\n🩺 Análise de exames\n🎯 Definição dos seus objetivos\n📋 Início do plano personalizado\n\nA consulta dura em torno de 1 hora e você já sai com orientações práticas!\n\nQuer agendar?",
    replies: ["Quero agendar!", "Quanto custa?", "Tem online?"]
  },
  "exames": {
    text: "Não é obrigatório levar exames na primeira consulta, mas se você tiver exames recentes (hemograma, glicemia, colesterol, tireoide) é bem-vindo trazer 📄\n\nA Gaby analisa tudo e adapta o plano de acordo com seus resultados.\n\nQuer agendar?",
    replies: ["Quero agendar!", "Como funciona?"]
  },
  "emagrecer": {
    text: "Esse é um dos focos principais da Gaby! 💪\n\nO diferencial aqui é que o emagrecimento é feito de forma saudável e sustentável — sem passar fome, sem cortar tudo que você gosta.\n\nMuitas pacientes relatam resultados já nas primeiras semanas, com mais energia e disposição também.\n\nQuer começar?",
    replies: ["Quero agendar!", "Quanto custa?", "Ver resultados"]
  },
  "ganhar massa": {
    text: "A Gaby também atende quem quer ganhar massa muscular! 💪\n\nO plano inclui adequação calórica, timing de proteínas, sugestão de suplementação e ajustes conforme sua evolução nos treinos.\n\nVocê treina ou vai começar agora?",
    replies: ["Já treino", "Vou começar", "Quanto custa?"]
  },
  "treino": {
    text: "Perfeito! Com o treino já em andamento, o plano nutricional fica ainda mais eficiente 🏋️\n\nA Gaby vai sincronizar a alimentação com sua rotina de treinos para maximizar os resultados. Quer agendar?",
    replies: ["Quero agendar!", "Quanto custa?"]
  },
  "diabetes": {
    text: "Sim, a Gaby tem experiência com nutrição para diabéticos e pré-diabéticos 🩺\n\nO acompanhamento nutricional faz uma diferença enorme no controle glicêmico — muitos pacientes conseguem reduzir medicação com orientação médica após o acompanhamento.\n\nQuer agendar uma consulta?",
    replies: ["Quero agendar!", "Como funciona?", "Quanto custa?"]
  },
  "pos parto": {
    text: "A nutrição pós-parto é super delicada e a Gaby tem muito cuidado com esse momento 👶\n\nO plano leva em conta a amamentação, a recuperação do corpo e o emagrecimento saudável sem comprometer sua energia e a produção de leite.\n\nQuer conversar com a Gaby sobre isso?",
    replies: ["Quero agendar!", "Quanto custa?"]
  },
  "crianca": {
    text: "A Gaby atende nutrição infantil sim! 👧👦\n\nA consulta é feita com os pais e a abordagem é sempre lúdica e sem pressão — o objetivo é criar uma relação saudável com a comida desde cedo.\n\nQuer saber mais?",
    replies: ["Quero agendar!", "Quanto custa?", "Como funciona?"]
  },
  "resultado": {
    text: "Os resultados variam de pessoa para pessoa, mas em geral as pacientes relatam:\n\n📉 Perda de peso consistente a partir do 1º mês\n⚡ Mais energia e disposição em 2-3 semanas\n😴 Melhora no sono e no humor\n🎯 Redução de medidas mesmo sem balança baixar muito\n\nO mais importante é que os resultados são duradouros porque a abordagem muda hábitos, não só o cardápio.\n\nQuer começar?",
    replies: ["Quero agendar!", "Quanto custa?"]
  },
  "whatsapp": {
    text: "Que ótimo! Vou te redirecionar para o WhatsApp da Gaby agora 🎉\n\nEla responde rápido e vai confirmar o horário disponível.\n\nAté já! 💚",
    replies: [],
    action: () => window.open('https://wa.me/5500000000000?text=Olá Gaby! Quero agendar minha consulta!', '_blank')
  },
  "agendar": {
    text: "Que ótimo! Vou te redirecionar para o WhatsApp da Gaby agora 🎉\n\nEla vai confirmar o horário disponível e te enviar o link do formulário de anamnese.\n\nAté já!",
    replies: [],
    action: () => window.open('https://wa.me/5500000000000?text=Olá Gaby! Quero agendar minha consulta!', '_blank')
  },
  "voltar": {
    text: "Claro! O que você gostaria de saber? 😊",
    replies: ["Quanto custa?", "Como funciona?", "Tem atendimento online?", "Quero agendar!"]
  },
  "default": {
    text: "Entendi! Para tirar essa dúvida com mais detalhes, o melhor é falar diretamente com a Gaby 😊\n\nEla responde rápido pelo WhatsApp!",
    replies: ["Falar no WhatsApp", "Quanto custa?", "Como funciona?"]
  }
};

const welcomeMessage = "Olá! 🌿 Sou a Ana, assistente da Gaby Maia.\n\nPosso te ajudar com informações sobre consultas, valores e como funciona o atendimento. O que você gostaria de saber?";

const initialReplies = ["Quanto custa?", "Como funciona?", "Quero emagrecer", "Quero agendar!"];

// ── TOGGLE ──
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatWindow').classList.toggle('open', chatOpen);
  document.getElementById('chatIconOpen').style.display = chatOpen ? 'none' : 'flex';
  document.getElementById('chatIconClose').style.display = chatOpen ? 'flex' : 'none';

  if (chatOpen && !chatStarted) {
    chatStarted = true;
    const preview = document.getElementById('chat-preview');
    if (preview) preview.remove();
    setTimeout(() => {
      showTyping(() => addBotMessage(welcomeMessage, initialReplies));
    }, 500);
  }
}

// ── MENSAGENS ──
function addBotMessage(text, replies = []) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg msg-bot';
  div.innerHTML = `${text.replace(/\n/g, '<br>')}<div class="msg-time">${getTime()}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  setReplies(replies);
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg msg-user';
  div.innerHTML = `${text}<div class="msg-time">${getTime()}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  setReplies([]);
}

function showTyping(callback) {
  const msgs = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
    callback();
  }, 1400);
}

function setReplies(replies) {
  const qr = document.getElementById('quickReplies');
  qr.innerHTML = '';
  replies.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply';
    btn.textContent = r;
    btn.onclick = () => handleQuickReply(r);
    qr.appendChild(btn);
  });
}

// ── PROCESSAR ──
function handleQuickReply(text) {
  addUserMessage(text);
  processResponse(text.toLowerCase());
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserMessage(text);
  processResponse(text.toLowerCase());
}

function processResponse(text) {
  let found = null;

  if (text.includes('custa') || text.includes('valor') || text.includes('preço') || text.includes('planos')) found = 'quanto custa';
  else if (text.includes('trimestral'))                                                                       found = 'plano trimestral';
  else if (text.includes('mensal') || text.includes('plano'))                                                found = 'plano mensal';
  else if (text.includes('funciona') || text.includes('como'))                                               found = 'como funciona';
  else if (text.includes('presencial'))                                                                       found = 'presencial';
  else if (text.includes('online') || text.includes('remoto'))                                               found = 'online';
  else if (text.includes('estacionamento'))                                                                   found = 'estacionamento';
  else if (text.includes('primeira') || text.includes('primeira consulta'))                                  found = 'primeira consulta';
  else if (text.includes('exame'))                                                                            found = 'exames';
  else if (text.includes('emagrec') || text.includes('perder peso') || text.includes('perda'))               found = 'emagrecer';
  else if (text.includes('massa') || text.includes('musculo') || text.includes('hipertrofia'))               found = 'ganhar massa';
  else if (text.includes('treino') || text.includes('academia') || text.includes('já treino'))               found = 'treino';
  else if (text.includes('diabet') || text.includes('glicemia') || text.includes('açúcar'))                  found = 'diabetes';
  else if (text.includes('parto') || text.includes('gestante') || text.includes('amamentação'))              found = 'pos parto';
  else if (text.includes('criança') || text.includes('filho') || text.includes('infantil'))                  found = 'crianca';
  else if (text.includes('result') || text.includes('quanto tempo') || text.includes('funciona mesmo'))      found = 'resultado';
  else if (text.includes('whatsapp') || text.includes('falar') || text.includes('contato'))                  found = 'whatsapp';
  else if (text.includes('agendar') || text.includes('marcar') || text.includes('consulta'))                 found = 'agendar';
  else if (text.includes('voltar') || text.includes('início') || text.includes('menu'))                     found = 'voltar';

  const response = found ? responses[found] : responses['default'];

  showTyping(() => {
    addBotMessage(response.text, response.replies);
    if (response.action) setTimeout(response.action, 800);
  });
}

function getTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── PREVIEW DO CHAT ──
setTimeout(() => {
  if (!chatStarted) {
    const preview = document.createElement('div');
    preview.id = 'chat-preview';
    preview.style.cssText = `
      position: fixed; bottom: 90px; right: 2rem;
      background: white; border-radius: 16px 16px 4px 16px;
      padding: 0.8rem 1.1rem; font-size: 0.85rem;
      box-shadow: 0 8px 32px rgba(26,22,18,0.15);
      z-index: 199; cursor: pointer;
      animation: msgIn 0.4s ease;
      font-family: 'DM Sans', sans-serif;
      color: #2D2520; max-width: 220px;
    `;
    preview.innerHTML = '🌿 Olá! Posso te ajudar a agendar uma consulta?';
    preview.onclick = () => { preview.remove(); toggleChat(); };
    document.body.appendChild(preview);
    setTimeout(() => { if (preview) preview.remove(); }, 6000);
  }
}, 3000);