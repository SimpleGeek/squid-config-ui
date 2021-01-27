<style>
    input {
        width: 198px;
        margin-left: 2%;
    }

    button {
        margin-left: 2%;
    }

    .control-container {
        justify-content: center;
        align-items: center;
    }

    @media all and (max-width: 500px) {
        .control-container {
            flex-direction: column;
            align-items: center;
        }
        
        button, input {
            margin-left: 0%;
            margin-top: 2%;
            width: 198px;
        }
    }
</style>

<script>
    import ListItem from './ListItem.svelte';
    import Util from '../JSUtil/util.js';
    let util = new Util();

    let domainName = null;
    let domains = null;
    const listId = 0;
    const baseUrl = 'http://192.168.1.49:8080/squid-configuration/whitelist-domains/';

    function clearInput() {
        domainName = null;
    }

    function filterDomains(domains) {
        // Remove comments from return
        return domains.filter(d => !d.startsWith('#'));
    }

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
                if (!response.ok) {
                    // TODO: This needs to be better.  A lot better.
                    console.log(JSON.stringify(response));
                    alert('We had a server error.  Check the logs.');
                }
                return response.json();
            })
            .then((json) => {
                return filterDomains(json);
            })
            .catch(err => console.log(err));
        
        clearInput();
    }
</script>

<div class="control-container">
    <label for="domain">New domain:</label>
    <input id="domain" type="text" bind:value={domainName}>
    <button on:click={addDomain}>Add</button>
</div>
{#if domains != null}
    <ul class="scrollable-list">
        {#each domains as domain}
            <ListItem 
                displayValue={domain.slice(1, domain.length)}
                dataValue={domain}
            />
        {/each}
    </ul>
{/if}