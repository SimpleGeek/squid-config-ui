export default class HttpHelper {
    constructor() {
        this.BASE_URL = 'http://192.168.1.49:8080/';
        this.currentToken = '';
        this.MAX_RETRIES = 3;
        this.numRetries = 0;
    }

    async get(endpoint) {
        return await this.get(endpoint, null);
    }

    async get(endpoint, requestParams) {
        return await this.request(endpoint, 'GET', requestParams);
    }

    async post(endpoint, requestParams) {
        return await this.post(endpoint, requestParams, null);
    }

    async post(endpoint, requestParams, body) {
        return await this.request(endpoint, 'POST', requestParams, body);
    }

    async delete(endpoint, requestParams) {
        return await this.request(endpoint, 'DELETE', requestParams);
    }

    async request(endpoint, reqMethod, requestParams) {
        return await this.request(endpoint, reqMethod, requestParams, null);
    }

    async request(endpoint, reqMethod, requestParams, body) {
        if (endpoint.startsWith('/')) {
            endpoint = endpoint.slice(1, endpoint.length);
        }
        if (endpoint.endsWith('/')) {
            endpoint = endpoint.slice(0, endpoint.length - 1);
        }

        let fullUrl = this.BASE_URL + endpoint;
        if (requestParams != null) {
            let isFirst = true;
            for (let [key, value] of Object.entries(requestParams)) {
                if (isFirst) {
                    fullUrl += '?';
                } else {
                    fullUrl += '&';
                }

                fullUrl += key + "=" + encodeURIComponent(value);

                isFirst = false;
            }
        }
        
        let headers = new Headers();
        headers.append("Content-type", "application/json; charset=UTF-8");
        headers.append("Authorization", "Bearer " + this.currentToken);
        
        let fetchSettings = {
            method: reqMethod,
            headers: headers
        };

        if (body != null) {
            Object.defineProperty(fetchSettings, 'body', {
                value: JSON.stringify(body),
                writable: false
            });
        }

        const response = await fetch(fullUrl, fetchSettings);
        let json = {};
        let statusCode = 200;
        let success = true;
        // If anything other than a 401 occurs, reset the retry count.
        if (!response.ok) {
            success = false;
            statusCode = response.status;
            if (response.status == 401) {
                // Access was denied, we need to get
                // a new token, and retry the request.
                if (this.numRetries >= this.MAX_RETRIES) {
                    // We've hit our maximum retries against the auth service.
                    // Bad!  Don't DoS the server, quit trying.
                    console.log('Hit maximum number of authorization request retries.  ' +
                    'Number of retries: ' + this.MAX_RETRIES);
                    return null;
                }
                this.numRetries++;
                await this.getToken();
                json = await this.request(endpoint, reqMethod, requestParams, body);
                return json;
            } else {
                console.log(JSON.stringify(response));
                alert('We had a server error.  Check the logs.');
                this.numRetries = 0;
            }
        } else {
            this.numRetries = 0;
            json = await response.json();
        }
        return {json: json, success: success, status: statusCode};
    }

    async getToken() {
        // Get JWT
        let authReqHeaders = new Headers();
        authReqHeaders.append("Accept", "application/json");
        authReqHeaders.append("Content-Type", "application/json");

        // TODO: Longterm, we really don't want the username and password in plain
        // text.  Those should be entered by the user.
        const response = await fetch(this.BASE_URL + "/squid-configuration/authenticate?user=admin&password=somepass",
        {
            method: 'POST',
            headers: authReqHeaders,
            redirect: 'follow'
        });
        this.currentToken = await response.text();
    }
}