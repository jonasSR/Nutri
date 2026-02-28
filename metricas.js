// ── MÉTRICAS COMPLETAS · metricas.js ──
// Rastreia: visitantes, origem, cliques WhatsApp, agendamentos
// Salva tudo no Firebase Firestore
// Requer: Firebase SDK já carregado no HTML

// ─────────────────────────────────────────
// CONFIGURAÇÃO FIREBASE
// Substitua com suas credenciais
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "SUA_API_KEY",
  authDomain:        "SEU_PROJETO.firebaseapp.com",
  projectId:         "SEU_PROJETO",
  storageBucket:     "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId:             "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ─────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────
const hoje     = () => new Date().toISOString().split('T')[0]; // "2026-02-23"
const inc      = firebase.firestore.FieldValue.increment(1);
const serverTs = firebase.firestore.FieldValue.serverTimestamp;

function detectarOrigem() {
  const utm = new URLSearchParams(window.location.search).get('utm_source');
  if (utm) return utm;
  const ref = document.referrer.toLowerCase();
  if (ref.includes('instagram')) return 'instagram';
  if (ref.includes('google'))    return 'google';
  if (ref.includes('facebook'))  return 'facebook';
  if (ref.includes('whatsapp'))  return 'whatsapp';
  if (ref === '')                return 'direto';
  return 'outro';
}

// ─────────────────────────────────────────
// 1. REGISTRAR VISITA
// ─────────────────────────────────────────
async function registrarVisita() {
  const origem = detectarOrigem();
  try {
    await db.collection('metricas').doc(hoje()).set({
      visitantes: inc,
      [`origens.${origem}`]: inc,
      atualizado: serverTs()
    }, { merge: true });
  } catch (e) { console.warn('Métrica visita:', e); }
}

// ─────────────────────────────────────────
// 2. REGISTRAR CLIQUE NO WHATSAPP
// ─────────────────────────────────────────
async function registrarWhatsapp() {
  try {
    await db.collection('metricas').doc(hoje()).set({
      cliques_whatsapp: inc,
      atualizado: serverTs()
    }, { merge: true });
  } catch (e) { console.warn('Métrica whatsapp:', e); }
}

// ─────────────────────────────────────────
// 3. REGISTRAR AGENDAMENTO
// ─────────────────────────────────────────
async function registrarAgendamento() {
  try {
    await db.collection('metricas').doc(hoje()).set({
      agendamentos: inc,
      atualizado: serverTs()
    }, { merge: true });
  } catch (e) { console.warn('Métrica agendamento:', e); }
}

// ─────────────────────────────────────────
// 4. REGISTRAR LEAD (isca digital)
// ─────────────────────────────────────────
async function registrarLead(nome, email) {
  try {
    // Salva o lead completo
    await db.collection('leads').add({
      nome,
      email,
      origem: detectarOrigem(),
      data: serverTs(),
      dia: hoje(),
      sequencia_dia: 0 // controle da sequência de emails
    });

    // Incrementa contador do dia
    await db.collection('metricas').doc(hoje()).set({
      leads: inc,
      atualizado: serverTs()
    }, { merge: true });

    return true;
  } catch (e) {
    console.warn('Métrica lead:', e);
    return false;
  }
}

// ─────────────────────────────────────────
// 5. VINCULAR AOS ELEMENTOS DO SITE
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Registra visita automaticamente
  registrarVisita();

  // Botões de WhatsApp — adicione data-whatsapp em todos
  // Ex: <button data-whatsapp onclick="...">Falar com a Patrícia</button>
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    el.addEventListener('click', () => {
      registrarWhatsapp();
      registrarAgendamento(); // WhatsApp = intenção de agendamento
    });
  });

});

// Exporta pra usar no formulário de captação
window.patriciaMetrics = { registrarLead, registrarWhatsapp, registrarAgendamento };
