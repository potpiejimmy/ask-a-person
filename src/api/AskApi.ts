import HttpBase from "./HttpBase";

export default class AskApi extends HttpBase {

    async ask(person: string, question: string): Promise<any> {
        return this.post("/ask", { person, question });
    }

}
