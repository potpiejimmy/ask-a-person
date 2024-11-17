import React from 'react';
import AskAPi from './api/AskApi';
import './App.css';

function App() {

  const [question, setQuestion] = React.useState<string>("");
  const [responseTitle, setResponseTitle] = React.useState<string>("");
  const [responseContent, setResponseContent] = React.useState<string>("");

  let api = new AskAPi();

  async function onkeyup(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      console.log("Enter");
      setResponseTitle(question);
      setQuestion("");

      let response = await api.ask(question);
      setResponseContent(response.answer);
    }
  }

  return (
    <div className="m-10 flex flex-col gap-3">
      <div>
        Frag <a href="https://www.gruene.de/ueber-uns/robert-habeck">Robert Habeck</a>:
      </div>
      <div>
        <input autoFocus name="Question" id="question" value={question} className="input" type="email" size={60} onKeyUp={onkeyup} onChange={e=>setQuestion(e.target.value)}/>
      </div>
      {responseTitle.length > 0 && <div>Frage:</div>}
      <div>
        {responseTitle}
      </div>
      {responseContent.length > 0 && <div>Antwort:</div>}
      <div>
        {responseContent}
      </div>
    </div>
  );
}

export default App;
