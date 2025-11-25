import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('sanaa');
    const collection = db.collection('bookings');

    if (req.method === 'GET') {
      const bookings = await collection.find({}).toArray();
      return res.status(200).json(bookings);
    }

    if (req.method === 'POST') {
      const body = req.body;
      // إضافة التاريخ تلقائيًا
      body.date = new Date().toLocaleString();
      const result = await collection.insertOne(body);
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
    console.error('API error (bookings):', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
