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
        system: `Você extrai dados de pedidos de venda da JK Equipamentos / Sinmag Brasil.
Retorne SOMENTE um JSON válido. Sem texto antes ou depois. Sem backticks. Sem markdown.

Estrutura exata (use null se não encontrado):
{
  "remetente": "jk" ou "sinmag" (leia o cabeçalho da empresa emissora),
  "numPedido": "número do pedido de venda",
  "vendedor": "nome do vendedor",
  "frete": "FOB" ou "CIF" (pegue só a modalidade, ignore texto extra como 'J7'),
  "destNome": "nome ou razão social do cliente/destinatário",
  "destCNPJ": "CPF ou CNPJ do cliente — procure pelas labels CPF:, CNPJ:, CPF/CNPJ:",
  "destEmail": "endereço de email do cliente — procure pela label Email: ou E-mail:",
  "destContato": "telefone do cliente — procure pela label Telefone:",
  "destEndereco": "endereço completo de entrega do cliente com CEP",
  "itens": [
    {
      "equipamento": "descrição de UM único produto — copie exatamente como está na coluna Descrição",
      "qtd": "quantidade como número inteiro",
      "valorNF": "valor total deste item com desconto, formato 0.000,00"
    }
  ]
}

REGRA CRÍTICA para itens: cada linha da tabela de produtos vira UM objeto separado no array itens.
Exemplo: se a tabela tem 3 linhas de produto, itens terá 3 objetos.
NUNCA concatene descrições de produtos diferentes num mesmo objeto.`,
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
