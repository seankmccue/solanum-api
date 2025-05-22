require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const serverless = require("serverless-http");
const PORT = process.env.PORT || 5000;

const app = express();

app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});

app.use(cors());

const gardenSchema = new mongoose.Schema({
  name: String,
  mission: String,
  location: String,
  instagram: String,
  email: String
});

const Gardens = mongoose.models.Garden || mongoose.model("Garden", gardenSchema, "Gardens");

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = true;
}

app.get("/api/garden", async (req, res) => {
  try {
    await connectToDatabase();
    const gardens = await Gardens.find();
    res.json(gardens);
  } catch (err) {
    console.error("❌ Error fetching gardens:", err);
    res.status(500).json({ error: "Failed to fetch gardens" });
  }
});

// module.exports = serverless(app);
