export default class HttpHelper {
    constructor() {
        this.BASE_URL = 'http://192.168.1.49:8080/';
        this.currentToken = '';
        this.MAX_RETRIES = 3;
        this.numRetries = 0;
    }

    get(endpoint, requestParams) {
        return this.request(endpoint, 'GET', requestParams);
    }

    post(endpoint, requestParams) {
        return this.post(endpoint, requestParams, null);
    }

    post(endpoint, requestParams, body) {
        return this.request(endpoint, 'POST', requestParams, body);
    }

    delete(endpoint, requestParams) {
        return this.request(endpoint, 'DELETE', requestParams);
    }

    request(endpoint, reqMethod, requestParams) {
        return this.request(endpoint, reqMethod, requestParams, null);
    }

    request(endpoint, reqMethod, requestParams, body) {
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
        
        // TODO
        console.log('Headers:');
        for (let h of headers.entries()) {
            console.log(h[0] + ': ' + h[1]);
        }

        let fetchSettings = {
            method: reqMethod,
            //headers: {"Content-type": "application/json; charset=UTF-8"} TODO: Get rid of this later
            headers: headers
        };

        if (body != null) {
            Object.defineProperty(fetchSettings, 'body', {
                value: JSON.stringify(body),
                writable: false
            });
        }

        return fetch(fullUrl, fetchSettings)
        .then((response) => {
            // If anything other than a 401 occurs, reset the retry count.
            if (!response.ok) {
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
                    this.currentToken = this.getToken().then(t => {return t.text()});
                    console.log("Retrying with this token:\n" + this.currentToken);
                    this.request(endpoint, reqMethod, requestParams, body);
                } else {
                    // TODO: This needs to be better.  A lot better.
                    console.log(JSON.stringify(response));
                    alert('We had a server error.  Check the logs.');
                    this.numRetries = 0;
                }
            } else {
                this.numRetries = 0;
            }
            return response.json();
        })
        .then((json) => {
            console.log('Resp: ' + JSON.stringify(json)); // TODO: Debugging only
            return json;
        })
        .catch(err => console.log(err));
    }

    getToken() {
        // Get JWT
        let jwt = null;
        let authReqHeaders = new Headers();
        authReqHeaders.append("Accept", "application/json");
        authReqHeaders.append("Content-Type", "application/json");

        // TODO: Longterm, we really don't want the username and password in plain
        // text.  Those should be entered by the user.
        jwt = fetch(this.BASE_URL + "/squid-configuration/authenticate?user=admin&password=somepass",
        {
            method: 'POST',
            headers: authReqHeaders,
            redirect: 'follow'
        })
        .then(response => response.text())
        .then((result) => { 
            console.log("Here's the response from the auth service: " + result); // TODO: Remove later
            return result;
        })
        .catch(error => console.log('error', error));
        return jwt;
    }
}