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

  const { id } = req.method === 'GET' ? req.query : (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const key = `household:${id}:plants`;

  try {
    if (req.method === 'GET') {
      const plants = await redis.get(key);
      return res.status(200).json({ plants: plants || [] });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const plants = (body && body.plants) || [];
      await redis.set(key, plants);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Redis plants error', err);
    return res.status(500).json({ error: String(err) });
  }
}
