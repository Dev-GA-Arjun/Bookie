import express from "express";
import 'dotenv/config';


const app = express()
app.use(express.json())

import routes from "./src/routes/index.js";
import errorHandler from "./src/middleware/error.middleware.js";


app.use('/api/v1', routes);
app.use(errorHandler);

app.get("/", async (req,res) => {
  res.send("Welcome to the Bookie API! This is the main entry point.")
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Running in http://localhost:${PORT}/`)});