import { Redis } from '@upstash/redis';

function getRedis() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export default async function handler(req, res) {
  const redis = getRedis();
  if (!redis) {
    return res.status(500).json({
      error: 'Не знайдено змінні середовища для Upstash Redis (перевір Project Settings → Environment Variables у Vercel).'
    });
  }

  if (req.method === 'GET') {
    const { id, plantId } = req.query;
    if (!id || !plantId) return res.status(400).json({ error: 'Missing id or plantId' });
    try {
      const photo = await redis.get(`household:${id}:photo:${plantId}`);
      return res.status(200).json({ photo: photo || null });
    } catch (err) {
      console.error('Redis photo get failed', err);
      return res.status(500).json({ error: String(err) });
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
        await redis.set(`household:${id}:photo:${plantId}`, photo);
      } else {
        await redis.del(`household:${id}:photo:${plantId}`);
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Redis photo set failed', err);
      return res.status(500).json({ error: String(err) });
    }
  }

  if (req.method === 'DELETE') {
    const { id, plantId } = req.query;
    if (!id || !plantId) return res.status(400).json({ error: 'Missing id or plantId' });
    try {
      await redis.del(`household:${id}:photo:${plantId}`);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Redis photo delete failed', err);
      return res.status(500).json({ error: String(err) });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
