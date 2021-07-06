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

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(100, 100, 100, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalMessage = styled.div`
  font-size: 30px;
  font-weight: bolder;
  background-color: wheat;
  height: 150px;
  width: 150px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingModal = () => {
  return (
    <ModalContainer>
      <ModalMessage>Loading</ModalMessage>
    </ModalContainer>
  );
};

const App = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [outcome, setOutcome] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question, answer }),
    };

    setIsLoading(true);

    fetch("/comparison_scores", requestOptions)
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);
        setOutcome(data);
      });
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
        Write a question and an answer and receive a score from the
        universal-sentence-encoder on how closely it thinks your answer matches
        the question.
      </Explanation>

      <Form disabled={isLoading} onSubmit={(e) => handleSubmit(e)}>
        <InputWrapper>
          <Label>Your Question:</Label>
          <TextInput
            disabled={isLoading}
            placeholder="Write Something!"
            onChange={(e) => handleQuestionChange(e)}
            type="text"
            value={question}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Your Answer:</Label>
          <TextInput
            disabled={isLoading}
            placeholder="Write Something!"
            onChange={(e) => handleAnswerChange(e)}
            type="text"
            value={answer}
          />
        </InputWrapper>
        <InputButton disabled={isLoading} type="submit" value="submit" />
      </Form>
      <Outcome>
        <Label>Answer Score (Out of 10):</Label>
        <QAOutcome>
          {outcome?.question && <div>Q: {outcome?.question}</div>}
          {outcome?.answer && <div>A: {outcome?.answer}</div>}
        </QAOutcome>
        {outcome?.scores && <OutcomeScore>{outcome?.scores}</OutcomeScore>}
      </Outcome>
      {isLoading && <LoadingModal />}
    </Project>
  );
};

export default App;
