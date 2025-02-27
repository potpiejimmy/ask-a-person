import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="h-full p-5 sm:p-10 flex flex-col gap-5">
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

        <h2 className="text-lg font-bold">Lizenzen</h2>
        <div>
            Bildmaterial: <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons | CC BY-SA 4.0</a><br/>
        </div>

        <div className='flex grow'/>
        <Footer/>
    </div>
  );
}   