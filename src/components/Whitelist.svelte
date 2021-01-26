<style>
    button, input {
        margin-top: 9px;
        width: 198px;
    }

    select {
        margin-top: 9px;
    }

    p {
        max-width: 440px;
    }

    .column-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 25%;
        width: 440px;
    }

    @media all and (max-width: 500px) {
        .column-container {
            margin-left: 75%;
        }

        p {
            max-width: 250px;
        }
    }
</style>

<script>
    import Util from '../JSUtil/util.js';
    let util = new Util();

    let domainName = null;
    let domains = null;
    const listId = 0;
    const baseUrl = 'http://192.168.1.49:8080/squid-configuration/whitelist-domains/';

    async function addDomain() {
        if (util.isEmptyOrSpaces(domainName)) {
            // TODO: Need to do more validation here
            alert('Domain name is invalid');
            return;
        }

        domains = await fetch(baseUrl + listId + '?domainName=' + domainName, {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then((response) => {
                console.log(response.status);
                if (!response.ok) {
                    // TODO: This needs to be better.  A lot better.
                    console.log(JSON.stringify(response));
                    alert('We had a server error.  Check the logs.');
                }
                return response.json();
            })
            .then((json) => {
                console.log(json);
                return json;
            })
            .catch(err => console.log(err));
    }
</script>

<div class="column-container">
    <h2>Whitelist Manager</h2>
    <label for="domain">New domain:</label>
    <input id="domain" type="text" bind:value={domainName}>
    {#if domains != null}
        <select multiple>
            {#each domains as domain}
                <option>{domain}</option>
            {/each}
        </select>
    {/if}
    <button on:click={addDomain}>Add</button>
</div>
