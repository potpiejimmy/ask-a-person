import React, { useRef } from 'react';
import AskAPi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { IoHourglassOutline } from "react-icons/io5";
import Disclaimer from './components/Disclaimer';
import PoweredBy from './components/PoweredBy';

interface PersonContext {
  checked: boolean;
  loading: boolean;
  response: string;
  followup: string;
  warning: string;
  history?: { question?: string, response?: string }[];
}

const DUMMY_RESPONSES = false;
const GENERIC_ERROR_MESSAGE = "Das hat leider ich nicht geklappt. Bitte versuche es erneut.";

function App() {

  const bottomAnchor = useRef<HTMLDivElement>(null)
  function scrollToBottom() {
    setTimeout(()=>bottomAnchor.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  const personContextDefault: PersonContext = {
    checked: false,
    loading: false,
    response: "",
    followup: "",
    warning: ""
  };

  const availablePersons: { [key: string]: { name: string; info: string, partei: string } } = {
    "merz": {
      name: "Friedrich Merz",
      info: "https://www.merz.cdu.de/",
      partei: "CDU"
    },
    "scholz": {
      name: "Olaf Scholz",
      info: "https://olaf-scholz.spd.de/start",
      partei: "SPD"
    },
    "weidel": {
      name: "Alice Weidel",
      info: "https://www.afd.de/alice-weidel",
      partei: "AfD"
    },
    "habeck": {
      name: "Robert Habeck",
      info: "https://www.gruene.de/leute/robert-habeck",
      partei: "Die Grünen"
    }
  }

  const personContext: { [key: string]: PersonContext } = {};
  const setPersonContext: { [key: string]: React.Dispatch<React.SetStateAction<PersonContext>> } = {};
  [personContext["merz"], setPersonContext["merz"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["scholz"], setPersonContext["scholz"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["weidel"], setPersonContext["weidel"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["habeck"], setPersonContext["habeck"]] = React.useState<PersonContext>(personContextDefault);

  const [disclaimerDismissed, setDisclaimerDismissed] = React.useState<boolean>(false);
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

    try {
      let res = await askCheckBot(question);
      if (res.answer === 'Ja') {
        setQuestion("");
        setAcceptedQuestion(question);
        performQuestionToAll(question);
      }
      setCheckResult(res.answer);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setWarningMessage(GENERIC_ERROR_MESSAGE);
      setLoading(false);
    }
  }

  function isAnythingLoading() {
    return loading || Object.keys(personContext).some(key => personContext[key].loading);
  }

  async function onkeydown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isAnythingLoading()) return;
      checkQuestion();
    }
  }

  async function followUpKeyDown(key: string, event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (personContext[key].loading) return;
      performFollowUpQuestion(key);
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
      setPersonContext[person]({...personContextDefault, checked: true, loading: true, response: "..."});

      try {
        let response = await api.ask(DUMMY_RESPONSES ? "dummy" : person, question);

        setPersonContext[person]({...personContextDefault, checked: true, loading: false, response: response.answer});
        scrollToBottom();
      } catch (e) {
        console.error(e);
        setWarningMessage(GENERIC_ERROR_MESSAGE);
        setPersonContext[person]({...personContextDefault, checked: true, loading: false, response: ""});
      }
  }

  async function performFollowUpQuestion(key: string) {
    let q = personContext[key].followup;
    if (q.trim().length === 0) return;
    setPersonContext[key]({...personContext[key], loading: true, warning: ""});

    try {
      let check = await askCheckBot(q);
      if (check.answer === 'Ja') {

        setPersonContext[key]({...personContext[key], loading: true, followup: "", warning: "", history: [...(personContext[key].history || []), {
          question: q,
          response: "..."
        }]});
        scrollToBottom();

        let res = await api.ask(DUMMY_RESPONSES ? "dummy" : key, q, [
          { question: acceptedQuestion, response: personContext[key].response }, /* initial question and response */
          ...(personContext[key].history || [])  /* Note that history is still old here without the last ... entry */
        ]);
        setPersonContext[key]({...personContext[key], loading: false, followup: "", warning: "", history: [...(personContext[key].history || []), {
          question: q,
          response: res.answer
        }]});
      } else {
        setPersonContext[key]({...personContext[key], warning: "Die eingegebene Frage ist leider nicht gültig."});
      }
      scrollToBottom();
    } catch (e) {
      console.error(e);
      setPersonContext[key]({...personContext[key], loading: false, followup: "", warning: GENERIC_ERROR_MESSAGE});
    }
  }

  async function personSelected(key: string, checked: boolean) {
    if (checked) {
      if (acceptedQuestion.length > 0) {
        performQuestion(key, acceptedQuestion);
      } else {
        if (acceptedQuestion.length === 0 && question.trim().length > 0) {
          setWarningMessage("Bitte drücke Enter auf dem Eingabefeld, um die Frage abzusenden");
        }
        setPersonContext[key]({...personContextDefault, checked: true, loading: false});
      }
    } else {
      setPersonContext[key](personContextDefault);
    }
  }

  return (
    <div className="m-5 sm:m-10 flex flex-col gap-5">

      {DUMMY_RESPONSES && <div className="text-red-700 dark:text-red-300">Dummy responses are enabled</div>}

      {!disclaimerDismissed && <Disclaimer onClick={()=>setDisclaimerDismissed(true)}/>}

      <div className="flex flex-row gap-3">
        <img src="/logo192.png" alt="Logo" className="w-16 h-16"/>
        <div className='text-xl'>
          Bald sind Wahlen in Deutschland. Hier kannst du dich auf eine völlig neue Art und Weise informieren, ohne stundenlange Interviews oder Fernsehsendungen ansehen zu müssen.
          Stelle einfach deine Fragen direkt an die Spitzenkandidaten der Parteien und führe ein Gespräch mit ihnen.
        </div>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <p className="grow input-container">
          <textarea readOnly={isAnythingLoading()} autoFocus onKeyDown={onkeydown} value={question} onChange={e=>setQuestion(e.target.value)}
                 name="text" id="question" className="input" placeholder="Gib hier deine Frage ein"></textarea>
        </p>
        {loading && <IoHourglassOutline size={40}/>}
      </div>

      {checkResult.length > 0 && !loading && !isQuestionValid() && <div className="text-red-700 dark:text-red-300">Die eingegebene Frage ist leider nicht gültig.</div>}
      {warningMessage.length>0 && <div className="text-red-700 dark:text-red-300">{warningMessage}</div>}

      <div className='text-lg'>Wähle aus, an wen du die Frage stellen möchtest. Du kannst mehrere Politiker auswählen und dann die Antworten vergleichen:</div>
      <div className="flex flex-row gap-3 flex-wrap">
        {Object.keys(availablePersons).map((key) => (
          <div key={key} className='grow basis-0 min-w-40'>
            <Checkbox id={key} disabled={personContext[key].loading}
                    label={availablePersons[key].name}
                    info={availablePersons[key].info}
                    subInfo={availablePersons[key].partei}
                    checked={personContext[key].checked}
                    onChange={checked => personSelected(key, checked)}/>
          </div>
        ))}
      </div>

      {acceptedQuestion.length > 0 && 
        <div className='responseCard p-5 flex flex-col gap-2'>
          <div>
            <div className="font-bold">Frage:</div>
          </div>
          <div className='text-2xl'>
            {acceptedQuestion}
          </div>
        </div>
      }
      <div className="flex flex-row gap-3 flex-wrap">
        { Object.entries(personContext).filter(([k,v])=>v.checked).map(([key,ctx]) => (
          <div key={key} className="grow basis-0 flex flex-col gap-3 min-w-40 responseCard p-5">

            <PoweredBy name={availablePersons[key].name}/>
            
            <div className="whitespace-pre-line">
              {ctx.response}
            </div>
            
            {!ctx.history && !ctx.loading && acceptedQuestion.length > 0 && personContext[key].response.length > 0 &&
              <div>
                <a href="/" className='text-blue-800 dark:text-blue-300' onClick={event=>{setPersonContext[key]({...personContext[key], history: []}); event.preventDefault();}}>Gespräch fortführen ➤</a>
              </div>
            }

            {ctx.history && ctx.history.length > 0 && ctx.history.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="font-bold">Deine Frage:</div>
                    <div>{item.question}</div>
                    <PoweredBy name={availablePersons[key].name}/>
                    <div className="whitespace-pre-line">{item.response}</div>
                  </div>
                ))
            }

            {ctx.history &&
              <div>
                <textarea readOnly={personContext[key].loading} autoFocus onKeyDown={e=>followUpKeyDown(key, e)} value={personContext[key].followup} onChange={e => setPersonContext[key]({...personContext[key], followup: e.target.value})}
                      name="text" id="question" className="input" placeholder="Gib hier deine Folgefrage ein"></textarea>
                {personContext[key].warning.length > 0 && <div className="text-red-700 dark:text-red-300">{personContext[key].warning}</div>}
              </div>
            }
          </div>
        ))}
      </div>
      <div ref={bottomAnchor}></div>
    </div>
  );
}

export default App;
