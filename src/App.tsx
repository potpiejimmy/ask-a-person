import React from 'react';
import AskAPi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { FaRegCheckCircle } from "react-icons/fa";
import { BiNoEntry } from "react-icons/bi";
import { IoHourglassOutline } from "react-icons/io5";

interface PersonContext {
  checked: boolean;
  loading: boolean;
  response: string;
}

const DUMMY_RESPONSES = false;

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
  const [warningMessage, setWarningMessage] = React.useState<string>("");
  const [acceptedQuestion, setAcceptedQuestion] = React.useState<string>("");
  const [checkResult, setCheckResult] = React.useState<string>("");

  let api = new AskAPi();

  async function askCheckBot(question: string): Promise<{answer: string}> {
    if (DUMMY_RESPONSES) {
      return new Promise(resolve => setTimeout(() => resolve({answer: question.length>2 ? 'Ja' : "Nein"}), 1000));
    } else {
      return api.ask("checkbot", question);
    }
  }

  async function checkQuestion() {
    if (question.trim().length === 0) return;
    setLoading(true);
    setWarningMessage("");
    setCheckResult("");
    let res = await askCheckBot(question);
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

      let response = await api.ask(DUMMY_RESPONSES ? "dummy" : person, question);

      setPersonContext[person]({checked: true, loading: false, response: response.answer});

      setLoading(false);
  }

  async function personSelected(key: string, checked: boolean) {
    if (checked) {
      if (acceptedQuestion.length > 0) {
        performQuestion(key, acceptedQuestion);
      } else {
        if (acceptedQuestion.length === 0 && question.trim().length > 0) {
          setWarningMessage("Bitte drücke Enter auf dem Eingabefeld, um die Frage abzusenden");
        } else {
          setPersonContext[key]({checked: true, loading: false, response: ""});
        }
      }
    } else {
      setPersonContext[key](personContextDefault);
    }
  }

  return (
    <div className="m-10 flex flex-col gap-5">
      <div className='text-xl'>Bald sind Wahlen! Informiere dich jetzt und stelle Fragen an die Kandidaten der Parteien:</div>
      <div className="flex flex-row gap-3 items-center">
        <p className="grow input-container">
          <textarea readOnly={loading} autoFocus onKeyDown={onkeydown} value={question} onChange={e=>setQuestion(e.target.value)}
                 name="text" id="question" className="input" placeholder="Gib hier deine Frage ein"></textarea>
        </p>
        <div>
          {loading ? <IoHourglassOutline size={40}/> : (isQuestionValid() ? <FaRegCheckCircle size={40}/> : <BiNoEntry size={40}/>)}
        </div>
      </div>

      {checkResult.length > 0 && !loading && !isQuestionValid() && <div className="text-red-700">Die eingegebene Frage ist leider nicht gültig.</div>}
      {warningMessage.length>0 && <div className="text-red-700">{warningMessage}</div>}

      <div className='text-lg'>Wähle aus, an wen du die Frage stellen möchtest:</div>
      <div className="flex flex-row gap-3 flex-wrap">
        {Object.keys(availablePersons).map((key) => (
          <div key={key}>
            <Checkbox id={key} disabled={personContext[key].loading} label={availablePersons[key].name} info={availablePersons[key].info} checked={personContext[key].checked} onChange={checked => personSelected(key, checked)}/>
          </div>
        ))}
      </div>

      {acceptedQuestion.length > 0 && <div className="font-bold">Frage:</div>}
      <div className='text-2xl'>
        {acceptedQuestion}
      </div>
      <div className="flex flex-row gap-3 flex-wrap">
        { Object.entries(personContext).filter(([k,v])=>v.checked).map(([key,ctx]) => (
          <div key={key} className="grow basis-0 flex flex-col gap-3 min-w-40">
            <div className="font-bold">{availablePersons[key].name}:</div>
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
