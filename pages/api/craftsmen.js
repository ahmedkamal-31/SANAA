import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sanaa");

  if (req.method === "GET") {
    const craftsmen = await db.collection("craftsmen").find().toArray();
    return res.json(craftsmen);
  }

  if (req.method === "POST") {
    const data = req.body;
    const result = await db.collection("craftsmen").insertOne(data);
    return res.status(201).json(result);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const result = await db.collection("craftsmen").deleteOne({ id });
    return res.status(200).json(result);
  }
}
