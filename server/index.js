import express from "express";
import 'dotenv/config';
import authRoutes from "./src/routes/auth.routes.js";

const app = express()
app.use(express.json())


app.use('/api/v1/auth', authRoutes);
app.get("/", async (req,res) => {
  res.send("Welcome to the Bookie API! This is the main entry point.")
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Running in http://localhost:${PORT}/`)});