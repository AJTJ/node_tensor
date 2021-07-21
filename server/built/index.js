"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@tensorflow/tfjs");
// import * as tf from "@tensorflow/tfjs"
var dotenv = __importStar(require("dotenv"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var use = __importStar(require("@tensorflow-models/universal-sentence-encoder"));
var express_1 = __importDefault(require("express"));
dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}
var port = parseInt(process.env.PORT, 10);
var app = express_1.default();
//middleware
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "build")));
app.use(body_parser_1.default.json());
app.listen(port, function () {
    console.log("Started at http://localhost:" + port);
});
app.post("/comparison_scores", function (req, res) {
    use.loadQnA().then(function (model) {
        var input = {
            queries: [req.body.question],
            responses: [req.body.answer],
        };
        var scores = [];
        var embeddings = model.embed(input);
        // the type system is off, these should only be embedded arrays
        var embed_query = embeddings["queryEmbedding"].arraySync();
        var embed_responses = embeddings["responseEmbedding"].arraySync();
        for (var i = 0; i < input["queries"].length; i++) {
            for (var j = 0; j < input["responses"].length; j++) {
                {
                    var dotProductResult = dotProduct(embed_query[i], embed_responses[j]);
                    if (!!dotProductResult) {
                        scores.push(dotProductResult);
                    }
                }
            }
        }
        res.send({ question: req.body.question, answer: req.body.answer, scores: scores });
    });
    var dotProduct = function (xs, ys) {
        var sum = function (xs) {
            return xs ? xs.reduce(function (a, b) { return a + b; }, 0) : undefined;
        };
        return xs.length === ys.length
            ? sum(zipWith(function (a, b) { return a * b; }, xs, ys))
            : undefined;
    };
    var zipWith = function (f, xs, ys) {
        var ny = ys.length;
        return (xs.length <= ny ? xs : xs.slice(0, ny)).map(function (x, i) { return f(x, ys[i]); });
    };
});
