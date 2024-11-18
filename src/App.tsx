import React from 'react';
import AskAPi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { GoInfo } from "react-icons/go";

function App() {

  const availablePersons: { [key: string]: { name: string; info: string } } = {
    habeck: {
      name: "Robert Habeck",
      info: "https://www.gruene.de/leute/robert-habeck"
    },
    weidel: {
      name: "Alice Weidel",
      info: "https://www.afd.de/alice-weidel"
    }
  }

  const personSelectionDef: { [key: string]: boolean } = {
    habeck: true,
    weidel: false
  }

  const [question, setQuestion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [responseTitle, setResponseTitle] = React.useState<string>("");
  const [responseContents, setResponseContents] = React.useState<any[]>([]);
  const [personSelection, setPersonSelection] = React.useState(personSelectionDef);

  let api = new AskAPi();

  async function onkeyup(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setLoading(true);
      setQuestion("");

      let responses: { key: string; response: Promise<any> }[] = [];

      Object.keys(personSelection).forEach(async key => {
        if (personSelection[key]) {
          responses.push({
            key: key,
            response: api.ask(key, question)
          })
        }
      });

      setResponseTitle(question);
      setResponseContents(responses.map(r => { return { key: r.key, response: "..." }}));

      let answers = await Promise.all(responses.map(r => r.response));

      setResponseContents(answers.map((answer,index) => { return { key: responses[index].key, response: answer.answer }}));
      setLoading(false);
    }
  }

  function getSelectedPersonsCount(): number {
    return Object.keys(personSelection).filter(key => personSelection[key]).length;
  }

  return (
    <div className="mx-10 my-14 flex flex-col gap-3">
      <div>
        <p className="input-container">
            <input disabled={getSelectedPersonsCount()===0} readOnly={loading} autoFocus onKeyUp={onkeyup} onChange={e=>setQuestion(e.target.value)}
                   type="text" placeholder="Gib hier deine Frage ein" name="text" id="text" className="input-field"/>
            <label className="input-label">Deine Frage:</label>
        </p>
      </div>
      <div>Stelle deine Frage an</div>
      {Object.keys(availablePersons).map((key) => (
          <div key={key}>
            <div className='flex flex-row items-center'>
              <Checkbox id={key} label={availablePersons[key].name} checked={personSelection[key]} onChange={checked => setPersonSelection({...personSelection, [key]: checked})}/>
              <a href={availablePersons[key].info}><GoInfo/></a>
            </div>
          </div>
        )
      )}
      {responseTitle.length > 0 && <div className="font-bold">Frage:</div>}
      <div>
        {responseTitle}
      </div>
        <div className="flex flex-row gap-3">
          {responseContents.length > 0 && responseContents.map((content, index) => (
            <div key={index} className="grow basis-0 flex flex-col gap-3">
              <div className="font-bold">{availablePersons[content.key].name}</div>
              <div className="whitespace-pre-line">
                {content.response}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default App;
