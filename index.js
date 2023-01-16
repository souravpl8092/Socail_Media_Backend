const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/User.route");
const { postRouter } = require("./routes/Post.route");
const { authenticate } = require("./middlwares/authenticate.middleware");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Home Page");
});

app.use("/users", userRouter);

app.use(authenticate);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log("Trouble connecting to the DB");
    console.log(err);
  }
  console.log(`Running at ${process.env.port} Port`);
});
