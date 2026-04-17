export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { base64 } = req.body;

  if (!base64) {
    return res.status(400).json({ error: "base64 ausente" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `Extrai dados de pedidos de venda JK Equipamentos / Sinmag Brasil.
Retorne SOMENTE JSON válido sem texto extra, backticks ou markdown.
Campos (null se não encontrado):
{
  "remetente": "jk" ou "sinmag",
  "numPedido": "número do pedido",
  "vendedor": "nome do vendedor",
  "frete": "FOB" ou "CIF",
  "destNome": "razão social do cliente",
  "destCNPJ": "CNPJ formatado",
  "destContato": "contato e telefone",
  "destEndereco": "endereço completo com CEP",
  "equipamento": "descrição do produto",
  "peso": null,
  "volumes": "1",
  "dimC": null,
  "dimA": null,
  "dimL": null,
  "valorNF": "valor total como 0.000,00",
  "numeroNF": null
}`,
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
              { type: "text", text: "Extraia os dados." },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro Anthropic:", err);
    return res.status(500).json({ error: "Erro ao chamar API" });
  }
}
