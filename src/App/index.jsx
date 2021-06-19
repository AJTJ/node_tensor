import React, { useEffect, useState } from "react";

const App = () => {
  const [meaning, setMeaning] = useState(undefined);
  const [text, setText] = useState("Write something!");
  const [colorGrid, setColorGrid] = useState("Write something!");

  useEffect(() => {
    fetch("/meaning")
      .then((r) => r.json())
      .then((data) => {
        console.log({ data });
        setMeaning(data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/text")
      .then((r) => r.json())
      .then((data) => setColorGrid(data));
  };

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.value);
  };

  return (
    <>
      <div>
        <div>What is the meaning of life?</div>
        {meaning && <div>{meaning}</div>}
      </div>
      <div>
        <form onSubmit={(e) => handleSubmit()}>
          <input onChange={(e) => handleChange(e)} type="text" value={text} />
          <input type="submit" value="submit" />
        </form>
      </div>
      <div>{colorGrid}</div>
    </>
  );
};

export default App;

// const requestOptions = {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   credentials: "include",
//   body: JSON.stringify({ user_name: "Billy", password: "Secret" }),
// };
