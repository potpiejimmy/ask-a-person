import React from 'react';
import AskAPi from './api/AskApi';
import './App.css';

function App() {

  const [question, setQuestion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [responseTitle, setResponseTitle] = React.useState<string>("");
  const [responseContent, setResponseContent] = React.useState<string>("");

  let api = new AskAPi();

  async function onkeyup(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setLoading(true);
      setResponseTitle(question);
      setResponseContent("...");
      setQuestion("");

      let response = await api.ask(question);
      setResponseContent(response.answer);
      setLoading(false);
    }
  }

  return (
    <div className="m-10 flex flex-col gap-3">
      <div>
        Frag <a href="https://www.gruene.de/ueber-uns/robert-habeck">Robert Habeck</a>:
      </div>
      <div>
        <input readOnly={loading} autoFocus name="Question" id="question" value={question} className="input" type="email" size={60} onKeyUp={onkeyup} onChange={e=>setQuestion(e.target.value)}/>
      </div>
      {responseTitle.length > 0 && <div className="font-bold">Frage:</div>}
      <div>
        {responseTitle}
      </div>
      {responseContent.length > 0 && <div className="font-bold">Antwort:</div>}
      <div className="whitespace-pre-line">
        {responseContent}
      </div>
    </div>
  );
}

export default App;
