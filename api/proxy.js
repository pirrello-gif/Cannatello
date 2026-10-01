export default async function handler(req, res) {
  const { type } = req.query;
  const matchType = type === 'playoff' ? 'playoffMatch' : 'leagueMatch';
  const url = `https://proclubs.ea.com/api/fc/clubs/matches?matchType=${matchType}&platform=common-gen5&clubIds=552863`;
  
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.ea.com/games/ea-sports-fc/pro-clubs',
        'Origin': 'https://www.ea.com',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'Connection': 'keep-alive'
      }
    });
    
    const text = await r.text();
    
    // Debug: return status and first 200 chars if not JSON
    if (!r.ok || text.trim().startsWith('<')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json({ 
        debug: true, 
        status: r.status, 
        preview: text.slice(0, 300) 
      });
    }
    
    const data = JSON.parse(text);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(200).json(data);
  } catch(e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: e.message });
  }
}
