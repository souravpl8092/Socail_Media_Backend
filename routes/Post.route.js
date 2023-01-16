const express = require("express");
const { PostModel } = require("../models/Post.model");
const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const device_search = req.query.device;
  const device1_search = req.query.device1;
  const device2_search = req.query.device2;
  if (device_search) {
    try {
      const posts = await PostModel.find({ device: device_search });
      res.send(posts);
    } catch (error) {
      console.log(err);
      res.send({ err: "Something went wrong" });
    }
  } else if (device1_search && device2_search) {
    try {
      const posts = await PostModel.find({
        $and: [{ device: device1_search }, { device: device2_search }],
      });
      res.send(posts);
    } catch (error) {
      console.log(err);
      res.send({ err: "Something went wrong" });
    }
  } else {
    let query = req.query;
    try {
      const posts = await PostModel.find(query);
      res.send(posts);
    } catch (error) {
      console.log(err);
      res.send({ err: "Something went wrong" });
    }
  }
  //res.send("All the posts");
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_post = new PostModel(payload);
    await new_post.save();
    res.send("Created the post");
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const post = await PostModel.findOne({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req !== userID_in_post) {
      res.send({ msg: "You are not authorised" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Updated the post");
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.findOne({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req !== userID_in_post) {
      res.send({ msg: "You are not authorised" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send("Delete the post");
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

module.exports = { postRouter };
