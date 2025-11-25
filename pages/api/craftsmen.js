import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

const CraftsmanSchema = new mongoose.Schema({
  name: String,
  job: String,
  rating: Number,
  distance: String,
  reviews: [String],
});

const Craftsman =
  mongoose.models.Craftsman || mongoose.model("Craftsman", CraftsmanSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const craftsmen = await Craftsman.find({});
    return res.status(200).json(craftsmen);
  }

  if (req.method === "POST") {
    const body = req.body;
    const newCraftsman = new Craftsman(body);
    await newCraftsman.save();
    return res.status(201).json(newCraftsman);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    await Craftsman.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
