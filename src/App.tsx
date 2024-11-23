import React, { useRef } from 'react';
import AskAPi from './api/AskApi';
import './App.css';
import { Checkbox } from './components/Checkbox';
import { IoHourglassOutline } from "react-icons/io5";
import Disclaimer from './components/Disclaimer';
import PoweredBy from './components/PoweredBy';
import { useSearchParams } from 'react-router-dom';

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
    followup: "",
    warning: ""
  };

  const [ searchParams ] = useSearchParams();
  let groupId = searchParams.get('group');

  let availablePersons: { [key: string]: { name: string; info: string, partei: string } } = {};
  let availableSuggestions: string[] = [];
  const personContext: { [key: string]: PersonContext } = {};
  const setPersonContext: { [key: string]: React.Dispatch<React.SetStateAction<PersonContext>> } = {};

  if (groupId === "us2024") {

    availablePersons = {
      "musk": {
        name: "Elon Musk",
        info: "https://x.com/elonmusk",
        partei: "Unternehmer"
      }
    };

    availableSuggestions = [];

  } else {

    availablePersons = {
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
      },
      "lindner": {
        name: "Christian Lindner",
        info: "https://www.fdp.de/person/christian-lindner",
        partei: "FDP"
      },
      "wagenknecht": {
        name: "Sahra Wagenknecht",
        info: "https://bsw-vg.de/",
        partei: "BSW"
      }
    };

    availableSuggestions = [
      "Welche drei konkreten Maßnahmen wollen Sie als erstes umsetzen, um den CO2-Ausstoß in Deutschland zu senken?",
      "Soll der Atomausstieg überdacht werden, um die Energiewende abzusichern?",
      "Wollen Sie den Mindestlohn weiter erhöhen, und wenn ja, auf welchen Betrag?",
      "Welche Maßnahmen planen Sie, um Schulen besser digital auszustatten?",
      "Wie wollen Sie die deutsche Wirtschaft krisenfest machen?",
      "Unterstützen Sie eine Mietpreisbremse, und wie effektiv ist diese Ihrer Meinung nach?",
      "Wie stehen Sie zu einer gerechteren Verteilung von Geflüchteten innerhalb der EU?",
      "Wie garantieren Sie flächendeckendes Glasfaser-Internet bis 2030?",
      "Wie wollen Sie das Verhältnis Deutschlands zu den USA und China in Einklang bringen?",
      "Wie stehen Sie zur Einführung einer höheren CO2-Bepreisung, und wie soll diese sozial abgefedert werden?",
      "Welche Rolle sehen Sie für die deutsche Industrie im Klimaschutz, und wie wollen Sie diese unterstützen?",
      "Planen Sie Verbote wie das Aus für Verbrennungsmotoren oder eher Anreize für klimafreundliche Technologien?",
      "Wie garantieren Sie, dass Deutschland nicht seine Klimaziele durch den Import von „dreckigen“ Produkten aus dem Ausland verfehlt?",
      "Wie wollen Sie den Ausbau von Wind- und Solarenergie beschleunigen?",
      "Was planen Sie, um den steigenden Strombedarf durch Elektromobilität und Digitalisierung zu decken?",
      "Wie wollen Sie die Abhängigkeit Deutschlands von fossilen Energieimporten wie Gas oder Öl verringern?",
      "Wie garantieren Sie, dass Energie für Bürger und Unternehmen bezahlbar bleibt?",
      "Welche Maßnahmen planen Sie gegen Kinderarmut in Deutschland?",
      "Wie wollen Sie bezahlbare Gesundheitsversorgung für alle sichern?",
      "Welche Schritte wollen Sie unternehmen, um prekäre Arbeitsverhältnisse wie Befristungen oder Leiharbeit einzuschränken?",
      "Wie wollen Sie die Renten stabilisieren, ohne die junge Generation zu überlasten?",
      "Wie wollen Sie den Lehrermangel in Deutschland kurzfristig und langfristig lösen?",
      "Sind Sie für die Einführung bundesweit einheitlicher Bildungsstandards?",
      "Was wollen Sie tun, um Kinder aus sozial schwachen Familien gezielt zu fördern?",
      "Wie soll berufliche Bildung im Zeitalter der Digitalisierung gestärkt werden?",
      "Welche Maßnahmen planen Sie, um kleine und mittelständische Unternehmen zu entlasten?",
      "Welche Branchen sehen Sie als zentral für die Zukunft, und wie wollen Sie diese fördern?",
      "Sind Sie für oder gegen eine Vermögenssteuer, um öffentliche Investitionen zu finanzieren?",
      "Wie wollen Sie den Übergang von traditionellen Industrien zur klimafreundlichen Wirtschaft sozialverträglich gestalten?",
      "Was wollen Sie tun, um den Bau von bezahlbarem Wohnraum zu beschleunigen?",
      "Sollen Bauvorschriften gelockert werden, um Wohnungsbau zu erleichtern?",
      "Wie wollen Sie Leerstand in Städten bekämpfen?",
      "Planen Sie eine stärkere Förderung von genossenschaftlichem oder sozialem Wohnungsbau?",
      "Welche Maßnahmen planen Sie, um Fachkräfte aus dem Ausland besser nach Deutschland zu holen?",
      "Wie wollen Sie Integration in Schulen und auf dem Arbeitsmarkt fördern?",
      "Soll es ein vereinfachtes Einwanderungsgesetz geben, und wie könnte es aussehen?",
      "Wie wollen Sie die Balance zwischen humanitärer Aufnahme und der Kontrolle von Zuwanderung gewährleisten?",
      "Was wollen Sie tun, um die digitale Verwaltung endlich voranzubringen?",
      "Wie stehen Sie zur Besteuerung von Tech-Konzernen, die in Deutschland Milliarden verdienen?",
      "Wie fördern Sie digitale Kompetenzen in Schulen und der Arbeitswelt?",
      "Was planen Sie, um Datenschutz und IT-Sicherheit in einer vernetzten Gesellschaft zu gewährleisten?",
      "Wie wollen Sie den Fachkräftemangel in der Pflege und bei Ärzten bekämpfen?",
      "Unterstützen Sie eine Reform der privaten und gesetzlichen Krankenversicherung, und wie soll diese aussehen?",
      "Wie wollen Sie die psychische Gesundheit stärker in die Gesundheitsversorgung integrieren?",
      "Was planen Sie, um lange Wartezeiten bei Fachärzten zu reduzieren?",
      "Wie stehen Sie zur Einführung eines staatlich regulierten Arzneimittelpreises?",
      "Welche konkreten Vorschläge haben Sie zur Stärkung der EU und ihrer Handlungsfähigkeit?",
      "Soll Deutschland eine aktivere Rolle in internationalen Friedensmissionen spielen?",
      "Wie wollen Sie die europäische Abhängigkeit von China in Schlüsselbereichen reduzieren?",
      "Sind Sie für eine Erhöhung der Verteidigungsausgaben im Rahmen der NATO-Ziele?",
      "Wie wollen Sie die EU besser gegen Cyberangriffe und Desinformation schützen?",
      "Wie kann illegale Migration effektiv bekämpft werden?",
      "Wie wollen Sie die EU-Beitrittsverhandlungen mit der Türkei und anderen Ländern gestalten?",
      "Wollen Sie straffällige Migranten schneller abschieben, und wie soll das funktionieren?",
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

  const [disclaimerDismissed, setDisclaimerDismissed] = React.useState<boolean>(false);
  const [question, setQuestion] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [warningMessage, setWarningMessage] = React.useState<string>("");
  const [acceptedQuestion, setAcceptedQuestion] = React.useState<string>("");
  const [checkResult, setCheckResult] = React.useState<string>("");
  const [suggestionsVisible, setSuggestionsVisible] = React.useState<boolean>(false);

  let api = new AskAPi();

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
      setSuggestionsVisible(false);
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
        scrollToQuestion();
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

      <div className="flex flex-col">
        <div className="flex flex-row gap-3 items-center">
          <p className="grow input-container">
            <textarea readOnly={isAnythingLoading()} autoFocus onKeyDown={onkeydown} value={question} onChange={e=>setQuestion(e.target.value)}
                  name="text" id="question" className="input" placeholder="Gib hier deine Frage ein"
                  onFocus={()=>setSuggestionsVisible(true)}></textarea>
          </p>
          {loading && <IoHourglassOutline size={40}/>}
        </div>
        {suggestionsVisible && availableSuggestions.length > 0 && !isAnythingLoading() &&
          <div className='p-2 border border-gray-300 dark:border-gray-700 h-40 overflow-y-scroll'>
            <div className='flex flex-col'>
              <div className='p-2'>
                Oder wähle eine Frage aus (du kannst auch nach Stichpunkten filtern):
              </div>
              {filteredSuggestions().map((suggestion, idx) =>
                <div key={idx} className='p-2 text-blue-900 dark:text-blue-200 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-800' onClick={()=>{
                    setSuggestionsVisible(false);
                    setQuestion("");
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
