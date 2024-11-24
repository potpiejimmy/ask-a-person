import React from "react";
import AskApi from "../api/AskApi";
import './History.css';

export default function History() {

    const [mrq, setMrq] = React.useState([]);

    React.useEffect(() => {
        const api = new AskApi();

        api.getHistory().then((data) => {
            // most recent first
            data.sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
            setMrq(data);
        });
    }, []);

    return (
        <div className="m-10 flex flex-col gap-10">
            <div className="text-xl">Most recent questions asked</div>

            <table className="histTable table-auto text-left">
                <thead>
                    <tr className="border-b dark:border-gray-700">
                        <th>Timestamp [UTC]</th>
                        <th>Client</th>
                        <th>Target</th>
                        <th>Question</th>
                    </tr>
                </thead>
                <tbody>
                    {mrq.map((q: any) => (
                        <tr key={q.timestamp} className="border-b dark:border-gray-700">
                            <td>{q.timestamp.substr(0,19).replace("T", " ")}</td>
                            <td>{q.clientid}</td>
                            <td>{q.person}</td>
                            <td>{q.question}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}