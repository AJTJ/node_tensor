require("@tensorflow/tfjs");
// import * as tf from "@tensorflow/tfjs"
import * as dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import express from "express";
import { ModelOutput } from "@tensorflow-models/universal-sentence-encoder/dist/use_qna";

dotenv.config();
if (!process.env.PORT) {
  process.exit(1);
}
const port: number = parseInt(process.env.PORT as string, 10);
const app = express();

//middleware
app.use(express.static(path.join(__dirname, "..", "..", "build")));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});

interface InputInterface {
  queries: string[];
  responses: string[];
}

app.post("/comparison_scores", (req, res) => {
  use.loadQnA().then((model) => {
    const input: InputInterface = {
      queries: [req.body.question],
      responses: [req.body.answer],
    };

    let scores: number[] = [];
    const embeddings: ModelOutput = model.embed(input);
    // the type system is off, these should only be embedded arrays
    const embed_query: any = embeddings["queryEmbedding"].arraySync();
    const embed_responses: any = embeddings["responseEmbedding"].arraySync();
    for (let i = 0; i < input["queries"].length; i++) {
      for (let j = 0; j < input["responses"].length; j++) {
        {
          let dotProductResult = dotProduct(embed_query[i], embed_responses[j]);
          if (!!dotProductResult) {
            scores.push(dotProductResult);
          }
        }
      }
    }
    res.send({ question: req.body.question, answer: req.body.answer, scores });
  });

  const dotProduct = (xs: number[], ys: number[]) => {
    const sum = (xs: number[]) =>
      xs ? xs.reduce((a, b) => a + b, 0) : undefined;

    return xs.length === ys.length
      ? sum(zipWith((a: number, b: number) => a * b, xs, ys))
      : undefined;
  };

  const zipWith = (
    f: (a: number, b: number) => number,
    xs: number[],
    ys: number[]
  ) => {
    const ny = ys.length;
    return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
  };
});
