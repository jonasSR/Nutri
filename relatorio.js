// ── RELATÓRIO SEMANAL · relatorio.js ──
// Lê métricas do Firebase e gera HTML do relatório
// Roda manual por enquanto — depois vira Cron Job na Hostinger

// ─────────────────────────────────────────
// CONFIGURAÇÕES
// ─────────────────────────────────────────
const EMAIL_GABY = 'email_da_gaby@gmail.com'; // trocar
const SEU_NOME   = 'Seu Nome';
const SEU_WPP    = '55119XXXXXXXX';

// ─────────────────────────────────────────
// CALCULAR SEMANA PASSADA
// ─────────────────────────────────────────
function getDatasSemanPassada() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();

  const inicio = new Date(hoje);
  inicio.setDate(hoje.getDate() - diaSemana - 6);
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date(hoje);
  fim.setDate(hoje.getDate() - diaSemana);
  fim.setHours(23, 59, 59, 999);

  return { inicio, fim };
}

function toDocId(date) {
  return date.toISOString().split('T')[0];
}

function formatar(date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// ─────────────────────────────────────────
// LER MÉTRICAS DO FIREBASE
// ─────────────────────────────────────────
async function lerMetricasSemana() {
  const { inicio, fim } = getDatasSemanPassada();

  const totais = {
    visitantes: 0, leads: 0,
    cliques_whatsapp: 0, agendamentos: 0,
    origens: { instagram: 0, google: 0, direto: 0, facebook: 0, outro: 0 }
  };

  for (let i = 0; i < 7; i++) {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + i);
    const docId = toDocId(dia);

    try {
      const snap = await db.collection('metricas').doc(docId).get();
      if (!snap.exists) continue;
      const d = snap.data();

      totais.visitantes       += d.visitantes       || 0;
      totais.leads            += d.leads            || 0;
      totais.cliques_whatsapp += d.cliques_whatsapp || 0;
      totais.agendamentos     += d.agendamentos     || 0;

      for (const k of Object.keys(totais.origens)) {
        totais.origens[k] += d[`origens.${k}`] || 0;
      }
    } catch (e) { /* dia sem dados */ }
  }

  return { totais, inicio, fim };
}

// ─────────────────────────────────────────
// GERAR HTML DO RELATÓRIO
// ─────────────────────────────────────────
function gerarHTML({ totais, inicio, fim }) {
  const totalVisitantes = totais.visitantes || 1;
  const taxa = ((totais.leads / totalVisitantes) * 100).toFixed(1);
  const totalOrigens = Object.values(totais.origens).reduce((a,b) => a+b, 0) || 1;

  const pct = (v) => Math.round((v / totalOrigens) * 100);

  const melhor = Object.entries(totais.origens).sort((a,b) => b[1]-a[1])[0];
  const labels = { instagram:'Instagram', google:'Google', direto:'Acesso direto', facebook:'Facebook', outro:'Outros' };

  let insight = '';
  if (totais.leads === 0) {
    insight = 'Nenhum lead essa semana. Poste mais no Instagram com o link do site na bio.';
  } else if (parseFloat(taxa) > 10) {
    insight = `Taxa de ${taxa}% acima da média! ${labels[melhor[0]]} foi a melhor origem.`;
  } else {
    insight = `${labels[melhor[0]]} trouxe mais visitantes. Considere um novo depoimento ou atualizar o CTA do site.`;
  }

  const origemHTML = Object.entries(totais.origens).map(([k, v]) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-family:Arial,sans-serif;">
      <span style="width:80px;font-size:13px;color:#2D2520;">${labels[k]}</span>
      <div style="flex:1;height:6px;background:#E8E4DF;border-radius:100px;overflow:hidden;">
        <div style="width:${pct(v)}%;height:100%;background:#8A9E7B;border-radius:100px;"></div>
      </div>
      <span style="font-size:12px;color:#8A7F78;width:32px;text-align:right;">${pct(v)}%</span>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px 10px;background:#F5F2ED;font-family:Georgia,serif;color:#2D2520;">
<div style="max-width:560px;margin:0 auto;">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#8A9E7B,#4A6B40);border-radius:20px 20px 0 0;padding:40px 32px;text-align:center;">
    <div style="font-size:40px;margin-bottom:12px;">🌿</div>
    <h1 style="color:white;font-size:22px;font-weight:400;margin:0;">Relatório Semanal</h1>
    <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;font-style:italic;">
      Semana de ${formatar(inicio)} a ${formatar(fim)}
    </p>
  </div>

  <!-- BODY -->
  <div style="background:white;padding:32px;">
    <p style="font-size:15px;line-height:1.7;margin-bottom:24px;">
      Oi, <strong style="color:#8A9E7B;">Gaby!</strong> Aqui está o resumo do seu site essa semana 💚
    </p>

    <!-- MÉTRICAS -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      ${[
        ['👁', totais.visitantes, 'Visitantes', false],
        ['📥', totais.leads, 'Leads captados', true],
        ['💬', totais.cliques_whatsapp, 'Cliques WhatsApp', false],
        ['📅', totais.agendamentos, 'Agendamentos', true]
      ].map(([emoji, val, label, dest]) => `
        <div style="background:#FAF7F2;border-radius:14px;padding:16px;border-left:4px solid ${dest?'#C4785A':'#8A9E7B'};">
          <div style="font-size:22px;margin-bottom:6px;">${emoji}</div>
          <div style="font-size:28px;font-weight:700;color:#1A1612;line-height:1;">${val}</div>
          <div style="font-size:11px;color:#8A7F78;text-transform:uppercase;letter-spacing:0.08em;margin-top:4px;font-family:Arial,sans-serif;">${label}</div>
        </div>`).join('')}
    </div>

    <!-- TAXA DE CONVERSÃO -->
    <div style="background:#FAF7F2;border-radius:14px;padding:16px 20px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:13px;color:#8A7F78;font-family:Arial,sans-serif;">Taxa de conversão (visitantes → leads)</span>
        <strong style="font-size:18px;color:#C4785A;">${taxa}%</strong>
      </div>
      <div style="height:8px;background:#E8E4DF;border-radius:100px;overflow:hidden;">
        <div style="width:${Math.min(taxa, 100)}%;height:100%;background:linear-gradient(90deg,#8A9E7B,#C4785A);border-radius:100px;"></div>
      </div>
    </div>

    <!-- ORIGENS -->
    <div style="font-size:11px;color:#8A7F78;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;margin:20px 0 10px;">
      📊 De onde vieram seus visitantes
    </div>
    ${origemHTML}

    <!-- INSIGHT -->
    <div style="background:linear-gradient(135deg,#f0f4ed,#faf7f2);border-radius:14px;padding:16px 20px;margin:20px 0;border:1px solid rgba(138,158,123,0.2);">
      <div style="font-size:11px;color:#8A9E7B;text-transform:uppercase;letter-spacing:0.1em;font-family:Arial,sans-serif;margin-bottom:6px;">✦ Insight da semana</div>
      <p style="font-size:14px;color:#2D2520;line-height:1.6;font-style:italic;margin:0;">${insight}</p>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#1A1612;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center;">
    <p style="color:rgba(250,247,242,0.5);font-size:12px;font-family:Arial,sans-serif;line-height:1.6;margin:0;">
      Desenvolvido por <strong style="color:rgba(250,247,242,0.8);">${SEU_NOME}</strong><br>
      WhatsApp: ${SEU_WPP}
    </p>
  </div>

</div>
</body>
</html>`;
}

// ─────────────────────────────────────────
// GERAR E ABRIR RELATÓRIO
// ─────────────────────────────────────────
async function gerarRelatorio() {
  const btn = document.getElementById('btn-relatorio');
  if (btn) { btn.textContent = 'Gerando...'; btn.disabled = true; }

  const dados = await lerMetricasSemana();
  const html  = gerarHTML(dados);

  // Abre numa nova aba — você copia e cola no email pra ela
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();

  if (btn) { btn.textContent = 'Gerar Relatório'; btn.disabled = false; }
}

window.gerarRelatorio = gerarRelatorio;
