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
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();

    import ListItem from './ListItem.svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import Util from '../JSUtil/util.js';
    import HttpHelper from '../JSUtil/httphelper.js';
    let util = new Util();
    let http = new HttpHelper();

    let domainName = null;
    let domains = null;
    const listId = 0;
    const endpoint = 'squid-configuration/whitelist-domains/' + listId;

    function clearInput() {
        domainName = null;
    }

    function filterDomains(domainList) {
        // Remove comments from list of domain names
        return domainList.filter(d => !d.startsWith('#'));
    }

    async function addDomain() {
        if (util.isEmptyOrSpaces(domainName)) {
            // TODO: Need to do more validation here
            alert('Domain name is invalid');
            return;
        }

        // Going to null while we're waiting on the call so that
        // we can trigger the loading spinner.
        domains = null;
        domains = await http.post(endpoint, {domainName: domainName}).then(r => filterDomains(r));
        clearInput();
    }

    async function getAllDomains() {
        domains = await http.get(endpoint).then(r => filterDomains(r));
    }

    onMount(getAllDomains);
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
{:else}
    <LoadingSpinner />
{/if}