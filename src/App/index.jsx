import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Project = styled.div`
  margin: 0 auto;
  max-width: 1000px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 20px;
  padding: 20px 0;
`;

const Explanation = styled.div`
  padding: 0 50px 40px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Outcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

const InputWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  padding: 10px;
`;

const TextInput = styled.input`
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid black;
`;

const InputButton = styled.input`
  border-radius: 25px;
  border: 1px solid black;
  margin-top: 20px;
  padding: 5px 10px;
`;

const OutcomeScore = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 10px 0;
`;

const QAOutcome = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    max-width: 200px;
    padding: 0 20px;
  }
`;

const App = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [outcome, setOutcome] = useState("");

  useEffect(() => {
    // fetch("/meaning")
    //   .then((r) => r.json())
    //   .then((data) => {
    //     console.log({ data });
    //     setMeaning(data);
    //   });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question, answer }),
    };

    fetch("/comparison_scores", requestOptions)
      .then((r) => r.json())
      .then((data) => setOutcome(data));
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  return (
    <Project>
      <Title>Question/Answer match!</Title>
      <Explanation>
        Write a question and an answer and see how closely the
        universal-sentence-encoder scores your answer, in terms of closely it
        matches the question.
      </Explanation>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <InputWrapper>
          <Label>Your Question:</Label>
          <TextInput
            placeholder="Write Something!"
            onChange={(e) => handleQuestionChange(e)}
            type="text"
            value={question}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Your Answer:</Label>
          <TextInput
            placeholder="Write Something!"
            onChange={(e) => handleAnswerChange(e)}
            type="text"
            value={answer}
          />
        </InputWrapper>
        <InputButton type="submit" value="submit" />
      </Form>
      <Outcome>
        <Label>Answer Score (Out of 10):</Label>
        <QAOutcome>
          {outcome?.question && <div>Q: {outcome?.question}</div>}
          {outcome?.answer && <div>A: {outcome?.answer}</div>}
        </QAOutcome>
        {outcome?.scores && <OutcomeScore>{outcome?.scores}</OutcomeScore>}
      </Outcome>
    </Project>
  );
};

export default App;
