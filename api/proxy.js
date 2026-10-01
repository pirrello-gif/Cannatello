export default async function handler(req, res) {
  const { type } = req.query;
  const matchType = type === 'playoff' ? 'playoffMatch' : 'leagueMatch';
  const url = `https://proclubs.ea.com/api/fc/clubs/matches?matchType=${matchType}&platform=common-gen5&clubIds=552863`;
  
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://www.ea.com/'
      }
    });
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
