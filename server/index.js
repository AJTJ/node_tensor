// require("@tensorflow/tfjs-node");
require("dotenv/config");
const path = require("path");
require("@tensorflow/tfjs");
const useModel = require("@tensorflow-models/universal-sentence-encoder");

// create app
const express = require("express");
const app = express();

//middleware
app.use(express.static(path.join(__dirname, "..", "build")));

const port = 3030;
app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});

app.get("/meaning", (req, res) => {
  console.log("hit");
  res.send("42");
});

app.post("/text", (req, res) => {
  // Load the model.
  useModel.load().then((model) => {
    // Embed an array of sentences.
    console.log("body", req.body);
    const sentences = ["Hello.", "How are you?"];
    // model.embed(sentences).then((embeddings) => {
    // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    // So in this example `embeddings` has the shape [2, 512].
    // embeddings.print(true /* verbose */);
    // });
  });
});

// console.log(process.env.SECRET);

// app.use(express.static("/"));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });
