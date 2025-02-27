import React, { useRef } from 'react';
import AskApi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { IoHourglassOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoSendOutline } from "react-icons/io5";
import Disclaimer from './components/Disclaimer';
import PoweredBy from './components/PoweredBy';
import { useSearchParams } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import ResponseMsg from './components/ResponseMsg';
import Footer from './components/Footer';

interface PersonContext {
  checked: boolean;
  loading: boolean;
  response: string;
  insufficient: boolean;
  followup: string;
  warning: string;
  history?: { question?: string, response?: string, insufficient: boolean }[];
}

const DUMMY_RESPONSES = false;

const GENERIC_ERROR_MESSAGE = "Das hat leider ich nicht geklappt. Die Anzahl der Aufrufe pro Minute ist beschränkt. Bitte versuche es erneut.";
const INSUFFICIENT_INFORMATION = "Dazu habe ich momentan keine ausreichenden Informationen.";

function App() {

  const questionAnchor = useRef<HTMLDivElement>(null);
  const bottomAnchor = useRef<HTMLDivElement>(null);
  function scrollToQuestion() { scrollToAnchor(questionAnchor); }
  function scrollToBottom() { scrollToAnchor(bottomAnchor); }
  function scrollToAnchor(anchor: React.RefObject<HTMLDivElement>) {
      setTimeout(()=>anchor.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  const personContextDefault: PersonContext = {
    checked: false,
    loading: false,
    response: "",
    insufficient: false,
    followup: "",
    warning: ""
  };

  const [ searchParams ] = useSearchParams();

  let clientId = searchParams.get('client');
  if (clientId) localStorage.setItem("clientId", clientId);
  if (localStorage.getItem("clientId") === null) {
    localStorage.setItem("clientId", Math.random().toString(36).substring(2));
  }

  let groupId = searchParams.get('group');

  let availablePersons: { [key: string]: { name: string; credit: string, partei: string } } = {};
  let availableSuggestions: string[] = [];
  let introText = "";
  const personContext: { [key: string]: PersonContext } = {};
  const setPersonContext: { [key: string]: React.Dispatch<React.SetStateAction<PersonContext>> } = {};

  if (groupId === "us2024") {

    introText = "Hier sind einige interessante Personen aus den USA, die du befragen kannst. Wähle einfach eine Person aus und stelle deine Frage auf deutsch oder auf englisch. Viel Spaß!";
    availablePersons = {
      "musk": {
        name: "Elon Musk",
        credit: "https://x.com/elonmusk",
        partei: "Unternehmer"
      }
    };

    availableSuggestions = [
      "Was sind Ihre größten Hoffnungen und Ängste hinsichtlich der Entwicklung von künstlicher Intelligenz, und wie könnte die Menschheit Ihrer Meinung nach sicherstellen, dass KI uns nützt, anstatt uns zu gefährden?",
      "Welche Herausforderungen bei der Kolonisierung des Mars betrachten Sie als am schwierigsten zu lösen: die technischen, die biologischen oder die gesellschaftlichen?",
      "Wie stellen Sie sich die Zukunft des autonomen Fahrens vor, und was sind Ihrer Meinung nach die größten Hürden, bevor diese Technologie weltweit akzeptiert wird?",
      "Gibt es eine Technologie oder einen Ansatz zur Energiegewinnung, den die Öffentlichkeit derzeit unterschätzt, aber Ihrer Meinung nach das Potenzial hat, die Welt zu verändern?",
      "Bei all Ihren Projekten und Ihrem enormen Arbeitspensum: Wie priorisieren Sie Ihre Zeit und vermeiden Burnout?",
      "Wie sollte Ihrer Meinung nach das internationale Weltraumrecht in einer Ära privater Raumfahrtunternehmen weiterentwickelt werden, um fairen Zugang und Frieden im Weltraum zu gewährleisten?",
      "Wie gehen Sie mit der Verantwortung um, dass Ihre Technologien (Tesla, SpaceX, Neuralink) das Potenzial haben, die Gesellschaft radikal zu verändern, sowohl positiv als auch negativ?",
      "Was sind Ihrer Meinung nach die ethischen Grenzen der Gehirn-Computer-Schnittstellen, und wie planen Sie, diese Grenzen zu respektieren?",
      "Wie fördern Sie Innovation in Ihren Teams, und welche Rolle spielt Ihrer Meinung nach die Risikobereitschaft bei disruptiven Technologien?",
      "Was ist das ultimative Ziel Ihrer verschiedenen Unternehmungen? Gibt es eine übergreifende Vision, die all Ihre Projekte miteinander verbindet?",
    ];

  } else {

    introText = "Bald sind Wahlen in Deutschland. Hier kannst du dich auf eine völlig neue Art und Weise informieren, ohne stundenlange Interviews oder Fernsehsendungen ansehen zu müssen. Stelle einfach deine Fragen direkt an die Spitzenkandidaten der Parteien und führe ein Gespräch mit ihnen.";
    availablePersons = {
      "merz": {
        name: "Friedrich Merz",
        credit: "Credit: Steffen Prößdorf | License: CC BY-SA 4.0",
        partei: "CDU"
      },
      "scholz": {
        name: "Olaf Scholz",
        credit: "Credit: Steffen Prößdorf | License: CC BY-SA 4.0",
        partei: "SPD"
      },
      "weidel": {
        name: "Alice Weidel",
        credit: "Credit: Schlappal | License: CC BY-SA 4.0",
        partei: "AfD"
      },
      "habeck": {
        name: "Robert Habeck",
        credit: "Credit: Stephan Röhl | License: CC BY-SA 4.0",
        partei: "Die Grünen"
      },
      "lindner": {
        name: "Christian Lindner",
        credit: "Credit: Sandro Halank | License: CC BY-SA 4.0",
        partei: "FDP"
      },
      "wagenknecht": {
        name: "Sahra Wagenknecht",
        credit: "Credit: Raimond Spekking | License: CC BY-SA 4.0",
        partei: "BSW"
      }
    };

    availableSuggestions = [
      "Welche drei Maßnahmen würden Sie als erstes als Bundeskanzler umsetzen? Bitte kurz antworten.",
      "Was sind die zentralen Punkte Ihrer Energie- und Klimapolitik?",
      "Was wollen Sie dagegen tun, dass die Reichen immer reicher und die Armen immer ärmer werden in Deutschland?",
      "Wie können wir unser Bildungssystem verbessern?",
      "Wie wollen Sie den Wirtschaftsstandort Deutschland stärken und Arbeitsplätze in einer zunehmend digitalen und globalisierten Welt sichern?",
      "Welche Maßnahmen planen Sie gegen die steigenden Miet- und Immobilienpreise in vielen deutschen Städten?",
      "Wie wollen Sie die Herausforderungen in der Asylpolitik angehen und gleichzeitig die Integration von Migrantinnen und Migranten fördern?",
      "Was möchten Sie zur Digitalisierung sagen?",
      "Wie wollen Sie das deutsche Gesundheitssystem nachhaltiger, effizienter und gerechter gestalten?",
      "Wie wollen Sie Deutschland in einer sich wandelnden geopolitischen Lage positionieren, insbesondere in Bezug auf die EU, die USA und China?",
    ];
  }

  // us2024
  [personContext["musk"], setPersonContext["musk"]] = React.useState<PersonContext>(personContextDefault);

  // default
  [personContext["merz"], setPersonContext["merz"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["scholz"], setPersonContext["scholz"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["weidel"], setPersonContext["weidel"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["habeck"], setPersonContext["habeck"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["lindner"], setPersonContext["lindner"]] = React.useState<PersonContext>(personContextDefault);
  [personContext["wagenknecht"], setPersonContext["wagenknecht"]] = React.useState<PersonContext>(personContextDefault);

  const [question, setQuestion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [warningMessage, setWarningMessage] = React.useState<string>("");
  const [acceptedQuestion, setAcceptedQuestion] = React.useState<string>("");
  const [checkResult, setCheckResult] = React.useState<string>("");
  const [suggestionsVisible, setSuggestionsVisible] = React.useState<boolean>(false);

  let api = new AskApi();

  function filteredSuggestions(): string[] {
    if (question.trim().length === 0) return availableSuggestions;
    let terms = question.trim().split(/\s+/);
    let filtered = availableSuggestions.filter(s => terms.some(word => s.toLowerCase().includes(word.toLowerCase())));
    if (filtered.length === 0) return availableSuggestions;
    return filtered;
  }

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
    setSuggestionsVisible(false);
    setWarningMessage("");
    setCheckResult("");

    try {
      let res = await askCheckBot(question);
      if (res.answer === 'Ja') {
        setQuestion("");
        setAcceptedQuestion(question);
        performQuestionToAll(question);
        scrollToQuestion();
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

  async function onMainQuestionInput(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isAnythingLoading()) return;
      checkQuestion();
    }
  }

  async function onFollowupQuestionInput(key: string, event: React.KeyboardEvent<HTMLTextAreaElement>) {
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
      setPersonContext[person]({...personContextDefault, checked: true, loading: true, response: ""});

      try {
        let response = await api.ask(DUMMY_RESPONSES ? "dummy" : person, question);

        setPersonContext[person]({...personContextDefault, checked: true, loading: false, response: response.answer, insufficient: response.answer.startsWith(INSUFFICIENT_INFORMATION)});
        scrollToQuestion();
      } catch (e) {
        console.error(e);
        setPersonContext[person]({...personContextDefault, checked: true, loading: false, response: "", warning: GENERIC_ERROR_MESSAGE});
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
          response: "",
          insufficient: false
        }]});
        scrollToBottom();

        let res = await api.ask(DUMMY_RESPONSES ? "dummy" : key, q, [
          { question: acceptedQuestion, response: personContext[key].response }, /* initial question and response */
          ...(personContext[key].history || [])  /* Note that history is still old here without the last ... entry */
        ]);
        setPersonContext[key]({...personContext[key], loading: false, followup: "", warning: "", history: [...(personContext[key].history || []), {
          question: q,
          response: res.answer,
          insufficient: res.answer.startsWith(INSUFFICIENT_INFORMATION)
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
        scrollToQuestion();
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
    <div className="h-full p-5 sm:p-10 flex flex-col gap-5">

      {DUMMY_RESPONSES && <div className="text-red-700 dark:text-red-300">Dummy responses are enabled</div>}

      <div className="flex flex-row gap-5 items-center">
        <img src="/logo192.png" alt="Logo" className="w-14 h-14"/>
        <div className='text-xl font-bold'>
          Plauder.ai — Sprich mit denen, die sonst unerreichbar sind.<br/>
          Virtuell. Persönlich. Faszinierend echt.
        </div>
      </div>
      <div className='text-lg'>
        {introText}
      </div>

      <div className='text-lg'>Wähle aus, an wen du die Frage stellen möchtest. Du kannst mehrere Personen auswählen und dann die Antworten vergleichen:</div>
      <div className="flex flex-row gap-3 flex-wrap">
        {Object.keys(availablePersons).map((key) => (
          <div key={key} className='grow basis-0 min-w-40'>
            <Checkbox id={key} disabled={personContext[key].loading}
                    label={availablePersons[key].name}
                    credit={availablePersons[key].credit}
                    subInfo={availablePersons[key].partei}
                    checked={personContext[key].checked}
                    onChange={checked => personSelected(key, checked)}/>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row gap-3 items-center">
          <p className="grow input-container">
            <textarea readOnly={isAnythingLoading()} onKeyDown={onMainQuestionInput} value={question} onChange={e=>setQuestion(e.target.value)}
                  name="text" id="question" className="input" placeholder="Gib hier deine Frage ein"></textarea>
          </p>
          {!loading && <IoSendOutline size={40} className='cursor-pointer' onClick={()=>checkQuestion()}/>}
          {loading && <IoHourglassOutline size={40}/>}
        </div>
        {!suggestionsVisible && availableSuggestions.length > 0 && !isAnythingLoading() && <a href="/" className='text-blue-800 dark:text-blue-300' onClick={event=>{setSuggestionsVisible(true); event.preventDefault();}}>Zeige mir Vorschläge für Fragen an ➤</a>}
        {suggestionsVisible && availableSuggestions.length > 0 && !isAnythingLoading() &&
          <div className='p-2 border border-gray-300 dark:border-gray-700 h-60 overflow-y-scroll'>
            <div className='flex flex-col'>
              <div className='flex flex-row'>
                <div className='p-2 grow'>
                  Wähle eine Frage aus (du kannst im Eingabefeld nach Stichpunkten filtern):
                </div>
                <div>
                  <IoClose size={20} className='cursor-pointer' onClick={()=>setSuggestionsVisible(false)}/>
                </div>
              </div>
              {filteredSuggestions().map((suggestion, idx) =>
                <div key={idx} className='p-2 text-blue-900 dark:text-blue-200 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-800' onClick={()=>{
                    setSuggestionsVisible(false);
                    setQuestion("");
                    setWarningMessage("");
                    setAcceptedQuestion(suggestion);
                    performQuestionToAll(suggestion);
                  }}>
                  <div className='flex flex-row items-center gap-2'>
                    <div>{suggestion}</div>
                  </div>
                </div>
              )}
            </div>
          </div>}
      </div>

      {checkResult.length > 0 && !loading && !isQuestionValid() && <div className="text-red-700 dark:text-red-300">Die eingegebene Frage ist leider nicht gültig.</div>}
      {warningMessage.length>0 && <div className="text-red-700 dark:text-red-300">{warningMessage}</div>}

      <Disclaimer closeable={false} insufficientMsg={INSUFFICIENT_INFORMATION}/>

      {acceptedQuestion.length > 0 && 
        <div ref={questionAnchor} className='responseCard p-5 flex flex-col gap-2'>
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
            
            <ResponseMsg response={ctx.response} insufficient={ctx.insufficient} insufficientMsg={INSUFFICIENT_INFORMATION}/>

            {!ctx.history && ctx.loading && <ThreeDot color="#aaa" size="medium" text="" textColor="" />}
            
            {!ctx.history && !ctx.loading && acceptedQuestion.length > 0 && personContext[key].response.length > 0 &&
              <div>
                <a href="/" className='text-blue-800 dark:text-blue-300' onClick={event=>{setPersonContext[key]({...personContext[key], history: []}); event.preventDefault();}}>Gespräch fortführen ➤</a>
              </div>
            }

            {ctx.history && ctx.history.length > 0 && ctx.history.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div ref={bottomAnchor}></div>
                    <div className="font-bold">Deine Frage:</div>
                    <div>{item.question}</div>
                    <PoweredBy name={availablePersons[key].name}/>
                    <ResponseMsg response={item.response || ''} insufficient={item.insufficient} insufficientMsg={INSUFFICIENT_INFORMATION}/>
                    {ctx.loading && ctx.history && idx === ctx.history.length-1 && <ThreeDot color="#aaa" size="medium" text="" textColor="" />}
                  </div>
                ))
            }

            {ctx.history &&
              <div>
                <textarea readOnly={personContext[key].loading} autoFocus onKeyDown={e=>onFollowupQuestionInput(key, e)} value={personContext[key].followup} onChange={e => setPersonContext[key]({...personContext[key], followup: e.target.value})}
                      name="text" id="question" className="input" placeholder="Gib hier deine Folgefrage ein"></textarea>
              </div>
            }
            {personContext[key].warning.length > 0 && <div className="text-red-700 dark:text-red-300">{personContext[key].warning}</div>}
          </div>
        ))}
      </div>

      <div className='flex grow'/>
      <Footer/>

    </div>
  );
}

export default App;
