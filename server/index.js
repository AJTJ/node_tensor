require("dotenv/config");
// require("@tensorflow/tfjs-node");
require("@tensorflow/tfjs");
const path = require("path");
const bodyParser = require("body-parser");
const useModel = require("@tensorflow-models/universal-sentence-encoder");

// create app
const express = require("express");
const app = express();

//middleware
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(bodyParser.json());

const port = 4000;
app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});

app.get("/meaning", (req, res) => {
  console.log("hit");
  res.send("42");
});

app.post("/text", (req, res) => {
  console.log("the req", req.body);
  // Load the model.
  useModel.load().then((model) => {
    // Embed an array of sentences.
    const sentences = [req.body.text];
    model.embed(sentences).then((embeddings) => {
      // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
      embeddings.print(true /* verbose */);
    });
  });
});

// console.log(process.env.SECRET);

// app.use(express.static("/"));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });
