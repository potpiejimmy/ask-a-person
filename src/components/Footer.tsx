import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className='flex flex-col gap-2 py-5'>
        <hr></hr>
        <div className='flex flex-row gap-5'>
            <Link to='/'>Home</Link>
            <Link to="/about">Impressum</Link>
            <a href="/privacy.html">Datenschutzerklärung</a>
        </div>
    </div>
);
}
