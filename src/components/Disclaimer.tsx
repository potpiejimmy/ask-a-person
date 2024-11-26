import React from 'react';
import './Disclaimer.css';

interface DisclaimerProps {
    onClick: () => void;
    closeable: boolean;
    insufficientMsg: string;
}

export default function Disclaimer(props: DisclaimerProps) {

    return (
        <div className='alertcardOuter'>
            <div className="alertcard">
                <div className="text-content">
                    <p className="alertcard-heading">Wichtiger Hinweis</p>
                    <p className="alertcard-content">
                        Die auf dieser Website gegebenen Antworten stammen nicht von den echten Personen, sondern werden von einer
                        Künstlichen Intelligenz (KI) erzeugt, die auf Basis öffentlich zugänglicher Reden, Interviews und Aussagen
                        trainiert wurde.
                        Die KI versucht, die Antworten so zu generieren, dass sie den tatsächlichen Meinungen und Ausdrucksweisen
                        der Personen entsprechen, jedoch kann dies nicht hundertprozentig garantiert werden.
                        <br/><br/>
                        Wenn eine Antwort mit dem Satz "<i>{props.insufficientMsg}</i>" beginnt, bedeutet dies, dass die KI aus den
                        Trainingsdaten heraus keine spezifische Antwort auf die gestellte Frage ableiten konnte. In diesem Fall fällt
                        die Antwort allgemeiner aus oder es wird keine Antwort auf die Frage gegeben.
                    </p>
                    {props.closeable &&
                        <button className="exit-btn" onClick={()=>props.onClick()}>
                            <svg fill="none" viewBox="0 0 15 15" height="15" width="15">
                                <path
                                strokeLinecap="round"
                                strokeWidth="2"
                                stroke="black"
                                d="M1 14L14 1"
                                ></path>
                                <path
                                strokeLinecap="round"
                                strokeWidth="2"
                                stroke="black"
                                d="M1 1L14 14"
                                ></path>
                            </svg>
                        </button>
                    }
                </div>
            </div>
        </div>
   );
}
