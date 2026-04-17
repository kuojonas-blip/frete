module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { base64 } = req.body || {};

  if (!base64) {
    return res.status(400).json({ error: "base64 ausente" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY não configurada" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: `Extrai dados de pedidos de venda JK Equipamentos / Sinmag Brasil.
Retorne SOMENTE JSON válido sem texto extra, backticks ou markdown.
Campos (null se não encontrado):
{
  "remetente": "jk" ou "sinmag",
  "numPedido": "número do pedido",
  "vendedor": "nome do vendedor",
  "frete": "FOB" ou "CIF",
  "destNome": "razão social ou nome do cliente",
  "destCNPJ": "CNPJ ou CPF do cliente — procure no campo CNPJ, CPF ou Inscrição",
  "destEmail": "email do cliente",
  "destContato": "nome do contato e telefone separados por ponto ou barra",
  "destEndereco": "endereço completo de entrega com CEP",
  "itens": [
    {
      "equipamento": "descrição completa de UM produto/equipamento — NÃO junte produtos diferentes",
      "qtd": "quantidade deste item",
      "valorNF": "valor total deste item como 0.000,00",
      "numeroNF": null
    }
  ]
}

IMPORTANTE: o campo itens deve ter UMA entrada por linha do pedido. Se o pedido tem 3 produtos, itens deve ter 3 objetos.`,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64,
                },
              },
              { type: "text", text: "Extraia os dados deste pedido." },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
};
