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
    import Modal from './Modal.svelte';
    import Util from '../JSUtil/util.js';
    import HttpHelper from '../JSUtil/httphelper.js';
    let util = new Util();
    let http = new HttpHelper();

    let displayConfirmation = false;
    let domainToDelete = '';

    let domainName = null;
    let domains = null;
    const listId = 0;
    const endpoint = 'squid-configuration/whitelist-domains/' + listId;

    function clearInput() {
        domainName = null;
        domainToDelete = '';
        displayConfirmation = false;
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

        domains = null;
        domains = await http.post(endpoint, {domainName: domainName}).then(r => filterDomains(r));
        clearInput();
    }

    async function getAllDomains() {
        domains = await http.get(endpoint).then(r => filterDomains(r));
    }

    function showConfirmation(event) {
        domainToDelete = event.detail.dataValue;
        showConfirmation = true;
    }

    function hideConfirmation(event) {
        clearInput();
    }

    async function deleteDomain(event) {
        domains = null;
        domains = await http.delete(endpoint, {domainName: domainToDelete}).then(r => filterDomains(r));
        clearInput();
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
                deletable={true}
                on:delete={showConfirmation}
            />
        {/each}
    </ul>
{:else}
    <LoadingSpinner />
{/if}

{#if displayConfirmation}
    <Modal 
        title={'Confirm Deletion'}
        prompt={'Are you sure you want to delete ' + domainToDelete + ' from the whitelist?'}
        affirmText={'Yes'}
        negativeText={'No'}
        on:exitModal={hideConfirmation}
        on:btnNegativeClicked={hideConfirmation}
        on:btnAffirmativeClicked={deleteDomain}
    />
{/if}