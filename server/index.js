import express from "express";
import 'dotenv/config';
import authRoutes from "./src/routes/auth.routes.js";
import businessRoute from "./src/routes/business.route.js";

const app = express()
app.use(express.json())


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/business', businessRoute);
app.get("/", async (req,res) => {
  res.send("Welcome to the Bookie API! This is the main entry point.")
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Running in http://localhost:${PORT}/`)});