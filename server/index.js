require("dotenv/config");
const path = require("path");
const bodyParser = require("body-parser");
require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

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
  res.send("42");
});

app.post("/comparison_scores", (req, res) => {
  use.loadQnA().then((model) => {
    const input = {
      queries: [req.body.question],
      responses: [req.body.answer],
    };

    let scores = [];
    const embeddings = model.embed(input);
    const embed_query = embeddings["queryEmbedding"].arraySync();
    const embed_responses = embeddings["responseEmbedding"].arraySync();
    for (let i = 0; i < input["queries"].length; i++) {
      for (let j = 0; j < input["responses"].length; j++) {
        scores.push(dotProduct(embed_query[i], embed_responses[j]));
      }
    }
    console.log({ scores });
    res.send({ question: req.body.question, answer: req.body.answer, scores });
  });

  const dotProduct = (xs, ys) => {
    const sum = (xs) => (xs ? xs.reduce((a, b) => a + b, 0) : undefined);

    return xs.length === ys.length
      ? sum(zipWith((a, b) => a * b, xs, ys))
      : undefined;
  };

  const zipWith = (f, xs, ys) => {
    const ny = ys.length;
    return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
  };
});
