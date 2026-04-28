export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { story } = req.body;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Tu es le créateur d'Altérego. Réponds UNIQUEMENT en JSON valide sans markdown:\n{"piece_name":"Nom 2-3 mots","essence":"2-3 phrases","themes":["t1","t2","t3"],"patches":[{"symbol":"◈","name":"Nom","description":"Lien"}]}\nGénère 6 patchs (symboles: ◈ ✦ ◆ ◇ ❖ ◉ ▲ ○ ✧ ◐). Histoire: "${story}"`
        }]
      })
    });
    
    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('');
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
