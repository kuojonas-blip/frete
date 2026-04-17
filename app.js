// ══════════════════════════════════════════════════════
// LISTA DE EQUIPAMENTOS (estado)
// ══════════════════════════════════════════════════════
const equipamentos = [];
let editandoIndex = null;

// ══════════════════════════════════════════════════════
// REMETENTES
// ══════════════════════════════════════════════════════
const REMETENTES = {
  jk: {
    nome: "JK Equipamentos Eletro Eletrônicos Ltda",
    cnpj: "38.826.901/0001-00",
    endereco: "Rua Tailândia, N°152 - Vila Friburgo - São Paulo/SP",
    cep: "CEP: 04782-053",
  },
  sinmag: {
    nome: "Sinmag Brasil Equipamentos Ltda",
    cnpj: "30.227.575/0001-02",
    endereco: "Alameda dos Aicás, N°395 - Indianópolis - São Paulo/SP",
    cep: "CEP: 04086-001",
  },
};

let remetenteAtual = "jk";
let freteAtual = "FOB";

function setRemetente(tipo) {
  remetenteAtual = tipo;
  document.getElementById("btnJK").classList.toggle("active", tipo === "jk");
  document.getElementById("btnSinmag").classList.toggle("active", tipo === "sinmag");
  const r = REMETENTES[tipo];
  document.getElementById("remetenteBox").innerHTML =
    `<strong>${r.nome}</strong><br>CNPJ: ${r.cnpj}<br>${r.endereco} — ${r.cep}`;
}

function setFrete(tipo) {
  freteAtual = tipo;
  document.getElementById("btnFOB").classList.toggle("active", tipo === "FOB");
  document.getElementById("btnCIF").classList.toggle("active", tipo === "CIF");
}

// ══════════════════════════════════════════════════════
// CATÁLOGO (medidas engradado)
// ══════════════════════════════════════════════════════
const EQUIPAMENTOS_CATALOGO = [
  { modelo: "SM-370A",   desc: "Laminadora SM-370A",                          peso: 99,   c: "0,76", l: "0,75", a: "0,68" },
  { modelo: "SM-520S",   desc: "Laminadora SM-520S montada",                  peso: 110,  c: "1,50", l: "0,90", a: "1,20" },
  { modelo: "SM-520S-D", desc: "Laminadora SM-520S desmontada",               peso: 200,  c: "1,35", l: "1,00", a: "2,15" },
  { modelo: "SM-520F",   desc: "Laminadora SM-520F montada",                  peso: 200,  c: "1,35", l: "1,00", a: "2,15" },
  { modelo: "SM-520F-D", desc: "Laminadora SM-520F desmontada",               peso: 200,  c: "1,35", l: "1,00", a: "2,15" },
  { modelo: "SM-630E",   desc: "Laminadora SM-630E montada",                  peso: null, c: null,   l: null,   a: null   },
  { modelo: "SM-630E-D", desc: "Laminadora SM-630E desmontada",               peso: 350,  c: "1,60", l: "1,10", a: "1,50" },
  { modelo: "SM2-08E",   desc: "Amassadeira SM2-08E",                         peso: 45,   c: "0,65", l: "0,55", a: "0,40" },
  { modelo: "SM2-10",    desc: "Amassadeira SM2-10",                          peso: 130,  c: null,   l: null,   a: null   },
  { modelo: "SM2-25T",   desc: "Amassadeira SM2-25T",                         peso: 180,  c: "1,35", l: "1,00", a: "2,15" },
  { modelo: "SM2-50T",   desc: "Amassadeira SM2-50T",                         peso: 350,  c: "1,30", l: "0,70", a: "1,40" },
  { modelo: "SM2-80T",   desc: "Amassadeira SM2-80T (engradada)",             peso: 475,  c: "1,40", l: "0,90", a: "1,60" },
  { modelo: "J7",        desc: "Batedeira J7",                                peso: 18,   c: "0,31", l: "0,45", a: "0,51" },
  { modelo: "SM-201S",   desc: "Batedeira SM-201S",                           peso: 110,  c: "0,65", l: "0,55", a: "0,95" },
  { modelo: "SM-401S",   desc: "Batedeira SM-401S",                           peso: 120,  c: "0,70", l: "0,60", a: "1,10" },
  { modelo: "SM-BX20",   desc: "Batedeira SM-BX20",                           peso: 131,  c: "0,70", l: "0,60", a: "1,10" },
  { modelo: "SM-BX40",   desc: "Batedeira SM-BX40",                           peso: 131,  c: "0,70", l: "0,60", a: "1,10" },
  { modelo: "SM705EE",   desc: "Forno SM705EE",                               peso: 200,  c: "1,10", l: "0,90", a: "0,90" },
  { modelo: "SM710EE",   desc: "Forno SM710EE",                               peso: null, c: null,   l: null,   a: null   },
  { modelo: "DC36-AS",   desc: "Câmara Climática DC36-AS",                    peso: 225,  c: "1,50", l: "1,00", a: "2,10" },
  { modelo: "SM-330",    desc: "Divisora Boleadora SM-330",                   peso: 369,  c: null,   l: null,   a: null   },
  { modelo: "SM-430",    desc: "Divisora Boleadora SM-430",                   peso: null, c: null,   l: null,   a: null   },
  { modelo: "SM-936",    desc: "Divisora Boleadora SM-936",                   peso: null, c: null,   l: null,   a: null   },
  { modelo: "SM-1136",   desc: "Divisora Boleadora SM-1136",                  peso: null, c: null,   l: null,   a: null   },
  { modelo: "SE-943F",   desc: "SE-943F - Forno Elétrico Lastro 9,2kw 220V", peso: null, c: null,   l: null,   a: null   },
];

function norm(s) { return s.toLowerCase().replace(/[-_\s]/g, ""); }

function filtrarEquip(val) {
  const dd = document.getElementById("equipDropdown");
  if (val.length < 2) { dd.style.display = "none"; return; }
  const q = norm(val);
  const matches = EQUIPAMENTOS_CATALOGO.filter(
    (e) => norm(e.modelo).includes(q) || norm(e.desc).includes(q)
  ).slice(0, 8);
  if (!matches.length) { dd.style.display = "none"; return; }
  dd.innerHTML = matches.map((e) => {
    const info = e.peso
      ? `<span>${e.peso}kg${e.c ? " · " + e.c + "×" + e.l + "×" + e.a + "m" : ""}</span>`
      : "";
    return `<div class="equip-item" onmousedown="selecionarDoDropdown('${e.modelo}')">${e.desc}${info}</div>`;
  }).join("");
  dd.style.display = "block";
}

function fecharDropdown() {
  document.getElementById("equipDropdown").style.display = "none";
}

function selecionarDoDropdown(modelo) {
  const e = EQUIPAMENTOS_CATALOGO.find((x) => x.modelo === modelo);
  if (!e) return;
  document.getElementById("equipamento").value = e.desc;
  fecharDropdown();
  let preencheu = false;
  if (e.peso) { document.getElementById("peso").value = e.peso; preencheu = true; }
  if (e.c)    { document.getElementById("dimC").value = e.c;    preencheu = true; }
  if (e.l)    { document.getElementById("dimL").value = e.l;    preencheu = true; }
  if (e.a)    { document.getElementById("dimA").value = e.a;    preencheu = true; }
  document.getElementById("equipOk").style.display = preencheu ? "block" : "none";
}

function tentarAutoEquip(desc) {
  if (!desc) return;
  const q = norm(desc);
  const match = EQUIPAMENTOS_CATALOGO.find(
    (e) => q.includes(norm(e.modelo)) || norm(e.desc).includes(q)
  );
  if (match) selecionarDoDropdown(match.modelo);
}

// ══════════════════════════════════════════════════════
// ADICIONAR / EDITAR EQUIPAMENTO
// ══════════════════════════════════════════════════════
document.getElementById("btnAdicionarEquip").addEventListener("click", function () {
  const desc = document.getElementById("equipamento").value.trim();
  if (!desc) {
    alert("Preencha a descrição do equipamento.");
    document.getElementById("equipamento").focus();
    return;
  }

  const item = {
    desc:      desc,
    peso:      document.getElementById("peso").value.trim(),
    volumes:   document.getElementById("volumes").value.trim() || "1",
    dimC:      document.getElementById("dimC").value.trim(),
    dimA:      document.getElementById("dimA").value.trim(),
    dimL:      document.getElementById("dimL").value.trim(),
    valorNF:   document.getElementById("valorNF").value.trim(),
    numeroNF:  document.getElementById("numeroNF").value.trim(),
    embalagem: document.getElementById("embalagem").value,
    descarga:  document.getElementById("descarga").value,
  };

  if (editandoIndex !== null) {
    equipamentos[editandoIndex] = item;
    cancelarEdicao();
  } else {
    equipamentos.push(item);
    limparCamposEquip();
  }

  renderTabela();
});

function limparCamposEquip() {
  ["equipamento", "peso", "dimC", "dimA", "dimL", "valorNF", "numeroNF"].forEach(
    (id) => { document.getElementById(id).value = ""; }
  );
  document.getElementById("volumes").value = "1";
  document.getElementById("embalagem").selectedIndex = 0;
  document.getElementById("descarga").selectedIndex = 0;
  document.getElementById("equipOk").style.display = "none";
}

function cancelarEdicao() {
  editandoIndex = null;
  const btn = document.getElementById("btnAdicionarEquip");
  btn.textContent = "Adicionar equipamento";
  btn.classList.remove("btn-salvando");
  limparCamposEquip();
}

// ══════════════════════════════════════════════════════
// TABELA — RENDER
// ══════════════════════════════════════════════════════
function renderTabela() {
  const tbody = document.getElementById("tabelaEquipBody");
  tbody.innerHTML = "";
  const total = equipamentos.length;

  equipamentos.forEach(function (item, index) {
    const dims = [item.dimC, item.dimA, item.dimL].filter(Boolean);
    const dimStr = dims.length === 3 ? `${item.dimC}×${item.dimA}×${item.dimL}m` : dims.join("×") || "—";

    const tr = document.createElement("tr");
    if (editandoIndex === index) tr.classList.add("linha-editando");

    tr.innerHTML = `
      <td>${item.desc}</td>
      <td>${item.peso ? item.peso + " kg" : "—"}</td>
      <td>${item.volumes}</td>
      <td>${dimStr}</td>
      <td>${item.valorNF ? "R$ " + item.valorNF : "—"}</td>
      <td>${item.numeroNF || "—"}</td>
      <td>${item.embalagem}</td>
      <td>${item.descarga}</td>
      <td class="td-acoes">
        <button type="button" class="btn-mover"
          onclick="moverEquip(${index}, -1)"
          ${index === 0 ? "disabled" : ""}
          title="Mover para cima">▲</button>
        <button type="button" class="btn-mover"
          onclick="moverEquip(${index}, 1)"
          ${index === total - 1 ? "disabled" : ""}
          title="Mover para baixo">▼</button>
        <button type="button" class="btn-editar" onclick="editarEquip(${index})">Editar</button>
        <button type="button" class="btn-remover" onclick="removerEquip(${index})">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.moverEquip = function (index, dir) {
  const novo = index + dir;
  if (novo < 0 || novo >= equipamentos.length) return;
  [equipamentos[index], equipamentos[novo]] = [equipamentos[novo], equipamentos[index]];
  renderTabela();
};

window.editarEquip = function (index) {
  const item = equipamentos[index];
  document.getElementById("equipamento").value = item.desc;
  document.getElementById("peso").value        = item.peso;
  document.getElementById("volumes").value     = item.volumes;
  document.getElementById("dimC").value        = item.dimC;
  document.getElementById("dimA").value        = item.dimA;
  document.getElementById("dimL").value        = item.dimL;
  document.getElementById("valorNF").value     = item.valorNF;
  document.getElementById("numeroNF").value    = item.numeroNF;
  document.getElementById("embalagem").value   = item.embalagem;
  document.getElementById("descarga").value    = item.descarga;
  document.getElementById("equipOk").style.display = "none";

  editandoIndex = index;
  const btn = document.getElementById("btnAdicionarEquip");
  btn.textContent = "Salvar alterações";
  btn.classList.add("btn-salvando");

  renderTabela();

  document.getElementById("equipamento").focus();
  document.getElementById("equipamento").scrollIntoView({ behavior: "smooth", block: "center" });
};

window.removerEquip = function (index) {
  equipamentos.splice(index, 1);
  if (editandoIndex === index) cancelarEdicao();
  renderTabela();
};

// ══════════════════════════════════════════════════════
// PDF
// ══════════════════════════════════════════════════════
const pdfZone = document.getElementById("pdfZone");

pdfZone.addEventListener("dragover", (e) => { e.preventDefault(); pdfZone.classList.add("drag-over"); });
pdfZone.addEventListener("dragleave", () => pdfZone.classList.remove("drag-over"));
pdfZone.addEventListener("drop", (e) => {
  e.preventDefault(); pdfZone.classList.remove("drag-over");
  const f = e.dataTransfer.files[0];
  if (f?.type === "application/pdf") processarPDF(f);
});
document.getElementById("pdfInput").addEventListener("change", (e) => {
  if (e.target.files[0]) processarPDF(e.target.files[0]);
});

async function processarPDF(file) {
  pdfZone.style.display = "none";
  document.getElementById("loadingBar").style.display = "block";
  document.getElementById("pdfOk").style.display = "none";

  const base64 = await toBase64(file);
  const pdfOk = document.getElementById("pdfOk");

  try {
    const res = await fetch("/api/extrair-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64 }),
    });

    const data = await res.json();

    // Mostra erro real da API se houver
    if (data.error) {
      throw new Error(data.error);
    }

    // Extrai texto da resposta
    const text = data.content?.find((b) => b.type === "text")?.text;
    if (!text) throw new Error("Resposta vazia da API");

    const fields = JSON.parse(text.replace(/```json|```/g, "").trim());

    // Remetente e frete
    if (fields.remetente === "sinmag") setRemetente("sinmag"); else setRemetente("jk");
    if (fields.frete === "CIF") setFrete("CIF"); else setFrete("FOB");

    // Destinatário e referência
    ["numPedido", "vendedor", "destNome", "destCNPJ", "destEmail", "destContato", "destEndereco"].forEach((id) => {
      if (fields[id]) {
        const el = document.getElementById(id);
        if (el) { el.value = fields[id]; el.classList.add("auto-filled"); }
      }
    });

    // Adiciona itens do pedido direto na tabela
    const itens = Array.isArray(fields.itens) && fields.itens.length > 0
      ? fields.itens
      : fields.equipamento ? [{ equipamento: fields.equipamento, qtd: fields.volumes || "1", valorNF: fields.valorNF || "", numeroNF: fields.numeroNF || "" }]
      : [];

    itens.forEach((it) => {
      if (!it.equipamento) return;
      const q = norm(it.equipamento);
      const match = EQUIPAMENTOS_CATALOGO.find(
        (e) => q.includes(norm(e.modelo)) || norm(e.desc).includes(q)
      );
      const item = {
        desc:      it.equipamento,
        peso:      (match && match.peso) ? String(match.peso) : "",
        volumes:   it.qtd || "1",
        dimC:      (match && match.c) ? match.c : "",
        dimA:      (match && match.a) ? match.a : "",
        dimL:      (match && match.l) ? match.l : "",
        valorNF:   it.valorNF || "",
        numeroNF:  it.numeroNF || "",
        embalagem: "Caixa de madeira",
        descarga:  "Com descarga",
      };
      equipamentos.push(item);
    });

    if (itens.length > 0) renderTabela();

    // Mensagem de sucesso
    pdfOk.style.cssText = "";
    document.getElementById("pdfOkText").textContent =
      `✓ Pedido nº ${fields.numPedido || "—"} importado. Revise a tabela e complete o que faltar.`;

  } catch (err) {
    console.error("Erro PDF:", err);
    pdfOk.style.background = "#fff1f2";
    pdfOk.style.borderColor = "#fca5a5";
    pdfOk.style.color = "#dc2626";
    document.getElementById("pdfOkText").textContent = "⚠ " + (err.message || "Erro ao processar. Preencha manualmente.");
    pdfZone.style.display = "block";
  }

  document.getElementById("loadingBar").style.display = "none";
  document.getElementById("pdfOk").style.display = "flex";
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Erro ao ler arquivo"));
    r.readAsDataURL(file);
  });
}

// ══════════════════════════════════════════════════════
// VALIDAÇÃO
// ══════════════════════════════════════════════════════
const OBRIGATORIOS_DEST = ["destNome", "destCNPJ", "destEndereco"];

function validar() {
  let ok = true;

  OBRIGATORIOS_DEST.forEach((id) => {
    const el = document.getElementById(id);
    const campo = el.closest(".campo");
    if (!el.value.trim()) {
      el.classList.add("invalid");
      if (campo) campo.classList.add("has-error");
      ok = false;
    } else {
      el.classList.remove("invalid");
      if (campo) campo.classList.remove("has-error");
    }
  });

  if (equipamentos.length === 0) {
    alert("Adicione pelo menos um equipamento antes de gerar a mensagem.");
    document.getElementById("equipamento").scrollIntoView({ behavior: "smooth", block: "center" });
    ok = false;
  }

  if (!ok && equipamentos.length > 0) {
    document.querySelector(".campo.has-error input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return ok;
}

OBRIGATORIOS_DEST.forEach((id) => {
  document.getElementById(id)?.addEventListener("input", function () {
    if (this.value.trim()) {
      this.classList.remove("invalid");
      this.closest(".campo")?.classList.remove("has-error");
    }
  });
});

// ══════════════════════════════════════════════════════
// GERAR MENSAGEM
// ══════════════════════════════════════════════════════
function gerarMensagem() {
  if (!validar()) return;

  const v = (id) => document.getElementById(id).value.trim();
  const r = REMETENTES[remetenteAtual];

  let msg = "";
  msg += `Remetente:\n`;
  msg += `*${r.nome}*\n`;
  msg += `CNPJ: ${r.cnpj}\n`;
  msg += `Endereço para coleta: ${r.endereco}\n`;
  msg += `${r.cep}\n\n`;
  msg += `ENTREGA ${freteAtual}\n\n`;
  msg += `Destinatário:\n`;
  msg += `*${v("destNome")}*\n`;
  msg += `CNPJ: ${v("destCNPJ")}\n`;
  if (v("destContato")) msg += `Contato: ${v("destContato")}\n`;
  if (v("destEmail")) msg += `E-mail: ${v("destEmail")}\n`;
  msg += `Endereço para entrega: ${v("destEndereco")}\n`;

  equipamentos.forEach(function (item, i) {
    const multi = equipamentos.length > 1;
    msg += `\n`;
    if (multi) msg += `— Item ${i + 1} —\n`;
    msg += `Conteúdo/Equipamento: ${item.desc}\n`;
    if (item.peso) msg += `Peso: ${item.peso}kg\n`;
    const dims = [];
    if (item.dimC) dims.push(`Comprimento: ${item.dimC}m`);
    if (item.dimA) dims.push(`Altura: ${item.dimA}m`);
    if (item.dimL) dims.push(`Largura: ${item.dimL}m`);
    if (dims.length) msg += `Medidas:\n${dims.join("\n")}\n`;
    if (item.valorNF) msg += `Valor da nota: R$ ${item.valorNF}\n`;
    if (item.numeroNF) msg += `NF nº: ${item.numeroNF}\n`;
    msg += `Quantidade de volumes: ${item.volumes}\n`;
    msg += `Tipo de Material e Embalagem: ${item.embalagem}\n`;
    msg += `*${item.descarga}*`;
  });

  const ref = [];
  if (v("numPedido")) ref.push(`Ref. Pedido nº ${v("numPedido")}`);
  if (v("vendedor"))  ref.push(`Vendedor: ${v("vendedor")}`);
  if (ref.length) msg += `\n\n${ref.join(" — ")}`;

  document.getElementById("msgPreview").textContent = msg;
  document.getElementById("charCount").textContent = msg.length + " caracteres";
  document.getElementById("previewWrap").style.display = "block";
  document.getElementById("previewWrap").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ══════════════════════════════════════════════════════
// COPIAR / WHATSAPP / TOAST
// ══════════════════════════════════════════════════════
function copiarMsg() {
  navigator.clipboard
    .writeText(document.getElementById("msgPreview").textContent)
    .then(() => showToast("✓ Mensagem copiada!"));
}

function abrirWhatsApp() {
  const msg = document.getElementById("msgPreview").textContent;
  window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
}

function showToast(txt) {
  const t = document.getElementById("toast");
  t.textContent = txt;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ══════════════════════════════════════════════════════
// LIMPAR TUDO
// ══════════════════════════════════════════════════════
function limparForm() {
  equipamentos.length = 0;
  editandoIndex = null;
  renderTabela();
  cancelarEdicao();

  ["destNome", "destCNPJ", "destEmail", "destContato", "destEndereco", "numPedido", "vendedor"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = "";
    el.classList.remove("auto-filled", "invalid");
    el.closest(".campo")?.classList.remove("has-error");
  });

  document.getElementById("previewWrap").style.display = "none";
  document.getElementById("pdfOk").style.display = "none";
  document.getElementById("pdfZone").style.display = "block";
  document.getElementById("pdfInput").value = "";

  setRemetente("jk");
  setFrete("FOB");
}
