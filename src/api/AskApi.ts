import HttpBase from "./HttpBase";

export default class AskApi extends HttpBase {

    async ask(question: string): Promise<any> {
        return this.post("/", { question });
    }

}
