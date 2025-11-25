import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  craftId: String,
  craftName: String,
  user: String,
  date: { type: String, default: () => new Date().toLocaleString() },
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const bookings = await Booking.find({});
    return res.status(200).json(bookings);
  }

  if (req.method === "POST") {
    const body = req.body;
    const newBooking = new Booking(body);
    await newBooking.save();
    return res.status(201).json(newBooking);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    await Booking.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
