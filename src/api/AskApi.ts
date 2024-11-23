import HttpBase from "./HttpBase";

export default class AskApi extends HttpBase {

    async ask(person: string, question: string, history?: { question?: string, response?: string }[]): Promise<any> {
        return this.post("/ask", { person, question, history, clientid: localStorage.getItem("clientId") });
    }

}
