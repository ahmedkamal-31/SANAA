import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export default function handler(req, res) {
  try {
    const json = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(json);

    if (req.method === 'GET') {
      res.status(200).json(db.craftsmen);
    } else if (req.method === 'POST') {
      const body = req.body;
      const newId = Math.max(0, ...db.craftsmen.map(c => c.id)) + 1;
      const item = { id: newId, ...body };
      db.craftsmen.push(item);

      try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      } catch (err) {
        console.warn('Write failed (Vercel limitation):', err);
      }

      res.status(201).json(item);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      db.craftsmen = db.craftsmen.filter(c => c.id !== id);

      try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      } catch (err) {
        console.warn('Write failed (Vercel limitation):', err);
      }

      res.status(200).json({ ok: true });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error reading db.json:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
}
