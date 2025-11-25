import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('sanaa');
    const collection = db.collection('craftsmen');

    if (req.method === 'GET') {
      const craftsmen = await collection.find({}).toArray();
      return res.status(200).json(craftsmen);
    }

    if (req.method === 'POST') {
      const data = req.body;
      const result = await collection.insertOne(data);
      return res.status(201).json(result.ops ? result.ops[0] : result);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Missing id' });
      }
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
