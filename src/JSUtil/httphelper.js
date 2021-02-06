export default class HttpHelper {
    constructor() {
        this.BASE_URL = 'http://192.168.1.49:8080/';
        // TODO: Need to implement an actual login
        // where you retrieve these credentials at some point.
        this.user = 'admin';
        this.password = 'somepass';
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
        
        // TODO: Get JWT
        
        let fetchSettings = {
            method: reqMethod,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        };
        if (body != null) {
            Object.defineProperty(fetchSettings, 'body', {
                value: JSON.stringify(body),
                writable: false
            });
        }

        return fetch(fullUrl, fetchSettings)
        .then((response) => {
            if (!response.ok) {
                if (response.status == 401) {
                    // Access was denied, we need to get
                    // a new token, and retry the request.
                } else {
                    // TODO: This needs to be better.  A lot better.
                    console.log(JSON.stringify(response));
                    alert('We had a server error.  Check the logs.');
                }
            }
            return response.json();
        })
        .then((json) => {
            console.log('Resp: ' + JSON.stringify(json)); // TODO: Debugging only
            return json;
        })
        .catch(err => console.log(err));
    }
}