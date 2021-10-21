const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post");
require("dotenv").config();

const main = async () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  const port = 3000;
  const MONGO_URL = process.env.MONGO_URL;

  try {
    await mongoose.connect(MONGO_URL, { autoIndex: true });
  } catch (err) {
    return console.log("Erreur de connexion à la BDD avec l'erreur " + err);
  }

  console.log("Connected to database");
  app.get("/posts", async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
  });
  app.post("/posts", async (req, res) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    await post.save();
    res.send(post);
  });
  app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Post.findOne({ id: id });
    res.send(post);
  });
  app.delete("/posts/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const post = await Post.deleteOne({ _id: id });
    } catch (err) {
      return console.log("L'id indiqué ne correspond à aucun post");
    }

    res.send(post);
  });

  app.listen(port, () => {
    console.log(`Server has on the address : http://localhost:${port}`);
  });
};

main();
