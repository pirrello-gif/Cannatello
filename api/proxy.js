// api/proxy.js — Vercel Serverless Function
// Chiama proclubs.ea.com simulando una richiesta browser reale

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  const eaUrl = `https://proclubs.ea.com/api/fc${path}`;

  try {
    const response = await fetch(eaUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.ea.com/it-it/games/ea-sports-fc/clubs/overview',
        'Origin': 'https://www.ea.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    });

    if (!response.ok) {
      // Prova a leggere il body per debug
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({
        error: `EA API ${response.status}`,
        url: eaUrl,
        body: text.slice(0, 200),
      });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message, url: eaUrl });
  }
}
