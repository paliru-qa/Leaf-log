import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id, plantId } = req.query;
    if (!id || !plantId) return res.status(400).json({ error: 'Missing id or plantId' });
    try {
      const photo = await kv.get(`household:${id}:photo:${plantId}`);
      return res.status(200).json({ photo: photo || null });
    } catch (err) {
      console.error('KV photo get failed', err);
      return res.status(500).json({ error: 'KV read failed' });
    }
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const { id, plantId, photo } = body || {};
    if (!id || !plantId) return res.status(400).json({ error: 'Missing id or plantId' });
    try {
      if (photo) {
        await kv.set(`household:${id}:photo:${plantId}`, photo);
      } else {
        await kv.del(`household:${id}:photo:${plantId}`);
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('KV photo set failed', err);
      return res.status(500).json({ error: 'KV write failed' });
    }
  }

  if (req.method === 'DELETE') {
    const { id, plantId } = req.query;
    if (!id || !plantId) return res.status(400).json({ error: 'Missing id or plantId' });
    try {
      await kv.del(`household:${id}:photo:${plantId}`);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('KV photo delete failed', err);
      return res.status(500).json({ error: 'KV delete failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
