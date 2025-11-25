import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sanaa");

  if (req.method === "GET") {
    const bookings = await db.collection("bookings").find().toArray();
    return res.json(bookings);
  }

  if (req.method === "POST") {
    const body = req.body;
    body.date = new Date().toLocaleString();
    const result = await db.collection("bookings").insertOne(body);
    return res.status(201).json(result);
  }
}
