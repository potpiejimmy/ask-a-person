import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="m-5 sm:m-10 flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Impressum</h1>
        <h2 className="text-lg font-bold">Anschrift</h2>
        <div>
            Thorsten Liese<br/>
            c/o MDC Management#375<br/>
            Welserstraße 3<br/>
            87463 Dietmannsried<br/>
        </div>
        <h2 className="text-lg font-bold">Kontakt</h2>
        <div>
            info@plauder.ai
        </div>
        <Link className='text-blue-800 dark:text-blue-300' to="/">Zurück</Link>
    </div>
  );
}   