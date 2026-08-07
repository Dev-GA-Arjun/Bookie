import express from "express";

const app = express()
app.use(express.json())

app.get("/", async (req,res) => {
  res.send("Welcome to the Blogify API! This is the main entry point.")
})

app.listen(3000, () => {console.log("Running in http://localhost:3000/")});