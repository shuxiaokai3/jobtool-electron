const { net } = require("electron").remote;


class HttpClient {
    constructor() {
        this.instance = null;
    }
    request(url, options) {
        if (typeof url !== "string") {
            throw new Error("请求url必须为字符串");
        }
        const headers = options.headers;
        const requestOptions = {
            url: url,
            method: options.method,
        };
    
        this.instance = net.request(requestOptions);
        // for(let i in headers) {
        //     request.setHeader(i, headers[i]);
        // }
    
        return new Promise((resolve, reject) => {
            this.instance.on("response", (response) => {
                // console.log(response, "res")
                response.on("data", (data) => {
                    resolve({
                        data,
                        response
                    });
                });
            });
            this.instance.on("abort", () => {
                console.log("abort")
            });
            this.instance.on("error", (error) => {
                reject(error);
            });
            this.instance.on("finish", () => {
                console.log("finish")
            });
            this.instance.end();
        })
    }
    stop () {
        if (this.instance) {
            this.instance.abort();
        }
    }
}


export default HttpClient;




