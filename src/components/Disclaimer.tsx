import React from 'react';
import './Disclaimer.css';

interface DisclaimerProps {
    onClick: () => void;
}

export default function Disclaimer(props: DisclaimerProps) {

    return (
        <div className='alertcardOuter'>
            <div className="alertcard">
                <div className="text-content">
                    <p className="alertcard-heading">Achtung, Prototyp</p>
                    <p className="alertcard-content">
                    Diese Website dient nur zu Demonstrationszwecken. Alle dargestellten Inhalte und Personen sind frei erfunden.
                    </p>
                    {/*<a href="#" className="alertcard-link">Mehr Infos</a>*/}
                    <button className="exit-btn" onClick={()=>props.onClick()}>
                    <svg fill="none" viewBox="0 0 15 15" height="15" width="15">
                        <path
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="black"
                        d="M1 14L14 1"
                        ></path>
                        <path
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="black"
                        d="M1 1L14 14"
                        ></path>
                    </svg>
                    </button>
                </div>
            </div>
        </div>
   );
}
