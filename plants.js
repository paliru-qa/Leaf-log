import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      const plants = await kv.get(`household:${id}`);
      return res.status(200).json({ plants: plants || null });
    } catch (err) {
      console.error('KV get failed', err);
      return res.status(500).json({ error: 'KV read failed' });
    }
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const { id, plants } = body || {};
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      await kv.set(`household:${id}`, plants);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('KV set failed', err);
      return res.status(500).json({ error: 'KV write failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
