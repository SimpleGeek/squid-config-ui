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
            width: 100%;
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
    import { userCredentials } from '../stores/userstore.js';
    import HttpHelper from '../JSUtil/httphelper.js';
    let util = new Util();
    let http = new HttpHelper($userCredentials.username, $userCredentials.password);

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

    function formatDomainForDisplay(d) {
        // Domain names are returned from
        // the whitelist with some metacharacters,
        // so we need to trim those off.
        return d.slice(1, d.length);
    }

    function filterDomains(domainList) {
        // Remove comments from list of domain names
        return domainList.filter(d => !d.startsWith('#'));
    }

    async function handleAddDomain(e) {
        if (e.keyCode == 13) {
            // Enter key was pressed
            await addDomain();
        }
    }

    async function addDomain() {
        if (util.isEmptyOrSpaces(domainName)) {
            alert('Domain name is invalid');
            return;
        }

        domains = null;
        let resp = await http.post(endpoint, {domainName: domainName});
        if (resp.success) {
            dispatch('notify', {
                msg: 'Added ' + domainName + ' successfully'
            });
            domains = filterDomains(resp.json);
        } else {
            await getAllDomains();
            dispatch('notify', {
                msg: 'Failed to add ' + domainName
            });
        }
        clearInput();
    }

    async function getAllDomains() {
        let resp = await http.get(endpoint);
        domains = filterDomains(resp.json);
    }

    function showConfirmation(event) {
        domainToDelete = event.detail.dataValue;
        displayConfirmation = true;
    }

    function hideConfirmation(event) {
        clearInput();
    }

    async function deleteDomain(event) {
        domains = null;
        let resp = await http.delete(endpoint, {domainName: domainToDelete});
        if (resp.success) {
            dispatch('notify', {
                msg: 'Deleted ' + formatDomainForDisplay(domainToDelete) + ' successfully'
            });
            domains = filterDomains(resp.json);
        } else {
            await getAllDomains();
            dispatch('notify', {
                msg: 'Failed to delete ' + formatDomainForDisplay(domainToDelete)
            });
        }
        clearInput();
    }

    onMount(getAllDomains);
</script>

<div class="control-container">
    <label for="domain">New domain:</label>
    <input id="domain" type="text" bind:value={domainName} on:keypress={handleAddDomain}>
    <button on:click={addDomain}>Add</button>
</div>

{#if domains != null}
    <ul class="scrollable-list">
        {#each domains as domain}
            <ListItem
                displayValue={formatDomainForDisplay(domain)}
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
        prompt={'Are you sure you want to delete ' + formatDomainForDisplay(domainToDelete) + ' from the whitelist?'}
        affirmText={'Yes'}
        negativeText={'No'}
        on:exit={hideConfirmation}
        on:negative={hideConfirmation}
        on:affirmative={deleteDomain}
    />
{/if}
