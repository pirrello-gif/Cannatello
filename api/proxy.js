// api/proxy.js — Vercel Serverless Function
// Chiama proclubs.ea.com dal server, aggirando il blocco CORS/403

export default async function handler(req, res) {
  // CORS headers — permette al browser di chiamare questo proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Prende il path dall'query string: /api/proxy?path=/clubs/matches?platform=...
  const path = req.query.path;
  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  const eaUrl = `https://proclubs.ea.com/api/fc${path}`;

  try {
    const response = await fetch(eaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
        'Referer': 'https://www.ea.com/',
        'Origin': 'https://www.ea.com',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `EA API error: ${response.status} ${response.statusText}`,
        url: eaUrl,
      });
    }

    const data = await response.json();

    // Cache 5 minuti
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message, url: eaUrl });
  }
}
