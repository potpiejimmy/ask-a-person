import React from 'react';
import AskAPi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { GoInfo } from "react-icons/go";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiNoEntry } from "react-icons/bi";
import { IoHourglassOutline } from "react-icons/io5";

interface PersonContext {
  checked: boolean;
  loading: boolean;
  response: string;
}

function App() {

  const personContextDefault: PersonContext = {
    checked: false,
    loading: false,
    response: ""
  };

  const availablePersons: { [key: string]: { name: string; info: string } } = {
    "habeck": {
      name: "Robert Habeck",
      info: "https://www.gruene.de/leute/robert-habeck"
    },
    "weidel": {
      name: "Alice Weidel",
      info: "https://www.afd.de/alice-weidel"
    },
    "scholz": {
      name: "Olaf Scholz",
      info: "https://olaf-scholz.spd.de/start"
    },
    "merz": {
      name: "Friedrich Merz",
      info: "https://www.merz.cdu.de/"
    }
  }

  const personContext: { [key: string]: PersonContext } = {};
  const setPersonContext: { [key: string]: React.Dispatch<React.SetStateAction<PersonContext>> } = {};
  [personContext["habeck"], setPersonContext["habeck"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["weidel"], setPersonContext["weidel"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["scholz"], setPersonContext["scholz"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["merz"], setPersonContext["merz"]] = React.useState<PersonContext>(personContextDefault);

  const [question, setQuestion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [acceptedQuestion, setAcceptedQuestion] = React.useState<string>("");
  const [checkResult, setCheckResult] = React.useState<string>("");

  let api = new AskAPi();

  async function checkQuestion() {
    setLoading(true);
    setCheckResult("");
    let res = await api.ask("checkbot", question);
    if (res.answer === 'Ja') {
      setQuestion("");
      setAcceptedQuestion(question);
      performQuestionToAll(question);
    }
    setCheckResult(res.answer);
    setLoading(false);
  }

  async function onkeydown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkQuestion();
    }
  }

  function isQuestionValid() {
    return checkResult === 'Ja';
  }

  async function performQuestionToAll(question: string) {
    Object.keys(personContext).forEach(key => {
      if (personContext[key].checked) {
        performQuestion(key, question);
      }
    });
  }

  async function performQuestion(person: string, question: string) {
      setLoading(true);

      setPersonContext[person]({checked: true, loading: true, response: "..."});

      let response = await api.ask(person/*"dummy"*/, question)

      setPersonContext[person]({checked: true, loading: false, response: response.answer});

      setLoading(false);
  }

  async function personSelected(key: string, checked: boolean) {
    let loading = false;
    if (checked) {
      if (acceptedQuestion.length > 0) {
        loading = true;
        performQuestion(key, acceptedQuestion);
      } else {
        setPersonContext[key]({checked: true, loading: false, response: ""});
      }
    } else {
      setPersonContext[key](personContextDefault);
    }
  }

  return (
    <div className="m-10 flex flex-col gap-5">
      <div>Stelle deine Frage an</div>
      <div className="flex flex-row gap-3 flex-wrap">
        {Object.keys(availablePersons).map((key) => (
          <div key={key}>
            <div className='flex flex-row items-center'>
              <Checkbox id={key} disabled={personContext[key].loading} label={availablePersons[key].name} checked={personContext[key].checked} onChange={checked => personSelected(key, checked)}/>
              <a href={availablePersons[key].info} target="_blank"><GoInfo/></a>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-3 items-center">
        <p className="grow input-container">
          <textarea readOnly={loading} autoFocus onKeyDown={onkeydown} value={question} onChange={e=>setQuestion(e.target.value)}
                 name="text" id="question" className="input" placeholder="Gib hier deine Frage ein"></textarea>
        </p>
        <div>
          {loading ? <IoHourglassOutline size={40}/> : (isQuestionValid() ? <FaRegCheckCircle size={40}/> : <BiNoEntry size={40}/>)}
        </div>
      </div>
      {acceptedQuestion.length > 0 && <div className="font-bold">Frage:</div>}
      <div className='text-2xl'>
        {acceptedQuestion}
      </div>
      <div className="flex flex-row gap-3">
        { Object.entries(personContext).filter(([k,v])=>v.checked).map(([key,ctx]) => (
          <div key={key} className="grow basis-0 flex flex-col gap-3">
            <div className="font-bold">{availablePersons[key].name}</div>
            <div className="whitespace-pre-line">
              {ctx.response}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
