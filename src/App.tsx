import React from 'react';
import AskAPi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { GoInfo } from "react-icons/go";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiNoEntry } from "react-icons/bi";

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
    habeck: false,
    weidel: false
  }

  const [question, setQuestion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [responseTitle, setResponseTitle] = React.useState<string>("");
  const [responseContents, setResponseContents] = React.useState<any>({});
  const [personSelection, setPersonSelection] = React.useState(personSelectionDef);
  const [checkResult, setCheckResult] = React.useState<string>("");

  let api = new AskAPi();

  async function checkQuestion() {
    setLoading(true);
    setCheckResult("");
    setResponseTitle("");
    setResponseContents({});
    setPersonSelection(personSelectionDef);
    let res = await api.ask("checkbot", question);
    if (res.answer === 'Ja') {
      setQuestion("");
      setResponseTitle(question);
    }
    setCheckResult(res.answer);
    setLoading(false);
  }

  async function onkeyup(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      checkQuestion();
    }
  }

  function isQuestionValid() {
    return checkResult === 'Ja';
  }

  async function performQuestion(person: string) {
      setLoading(true);

      setResponseContents({
        ...responseContents,
        [person]: {answer: "..."}
      });

      let response = await api.ask(person, responseTitle)

      setResponseContents({
        ...responseContents,
        [person]: response
      });

      setLoading(false);
  }

  async function personSelected(key: string, checked: boolean) {
    setPersonSelection({...personSelection, [key]: checked});
    if (checked) {
      performQuestion(key);
    } else {
      delete responseContents[key];
      setResponseContents(responseContents);
    }
  }

  return (
    <div className="mx-10 my-14 flex flex-col gap-3">
      <div>
        <p className="input-container">
            <input readOnly={loading} autoFocus onKeyUp={onkeyup} value={question} onChange={e=>setQuestion(e.target.value)}
                   type="text" placeholder="Gib hier deine Frage ein" name="text" id="text" className="input-field"/>
            <label className="input-label">Deine Frage:</label>
        </p>
      </div>
      {checkResult &&
        <div>
          Fragen-Check: {isQuestionValid() ? <FaRegCheckCircle size={40}/> : <BiNoEntry size={40}/>}
        </div>
      }
      {responseTitle.length > 0 && <div className="font-bold">Frage:</div>}
      <div>
        {responseTitle}
      </div>
      {isQuestionValid() &&
        <div className="flex flex-col gap-3">
          <div>Stelle diese Frage an</div>
          {Object.keys(availablePersons).map((key) => (
              <div key={key}>
                <div className='flex flex-row items-center'>
                  <Checkbox id={key} disabled={!isQuestionValid() || loading} label={availablePersons[key].name} checked={personSelection[key]} onChange={checked => personSelected(key, checked)}/>
                  <a href={availablePersons[key].info}><GoInfo/></a>
                </div>
              </div>
            )
          )}
        </div>
      }
      <div className="flex flex-row gap-3">
        {Object.keys(responseContents).map((key) => (
          <div key={key} className="grow basis-0 flex flex-col gap-3">
            <div className="font-bold">{availablePersons[key].name}</div>
            <div className="whitespace-pre-line">
              {responseContents[key].answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
