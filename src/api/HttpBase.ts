export default class HttpBase {

    requestOptions() {
        return { headers: {
            "Content-Type": "application/json"
        } };
    }

    async handleResponse(response: Promise<Response>): Promise<any> {
        return new Promise<any>(async (resolve,reject) => {
            try {
                let res = await response;
                let body = null;
                try { body = await res.json(); }
                catch (e) { body = null; }
                if (!res.status || res.status >= 400) {
                    let error = body.error.message || body.message || body;
                    reject(JSON.stringify(error) || "HTTP error")
                }
                resolve(body);
            } catch (e) {
                reject(e);
            }
        })
    }

    async get(path: string): Promise<any> {
        return this.handleResponse(fetch(process.env.REACT_APP_API_URL + path, this.requestOptions()));
    }

    async post(path: string, body: any): Promise<any> {
        return this.handleResponse(fetch(process.env.REACT_APP_API_URL + path, {
            ...this.requestOptions(),
            method: 'POST',
            body: JSON.stringify(body)
        }));
    }

}
