<style>
    .control-container {
        margin-left: 50%;
    }

    button {
        margin-left: 2%;
    }

    @media all and (max-width: 500px) {
        .control-container input {
            margin-top: 5%;
            width: 100%;
        }

        button {
            margin-left: 0%;
            margin-top: 5%;
            width: 100%;
        }

        .control-container {
            margin-left: 0%;
        }

        ul.scrollable-list {
            height: 70px;
        }
    }
</style>

<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import ListItem from './ListItem.svelte';
    import { userCredentials } from '../stores/userstore.js';
    import HttpHelper from '../JSUtil/httphelper.js';
    const dispatch = createEventDispatcher();
    const http = new HttpHelper($userCredentials.username, $userCredentials.password);

    const endpoint = 'squid-configuration/schedule-bypass';
    let minutes;

    function clearInput() {
        minutes = null;
    }

    function formatTimeForDisplay(time) {
        let arr = time.toString().split(',');
        // Is this bad?  Yes.  It works, though.
        // TODO: Use real JS date formatting here at some point.
        return arr[3] + ':' + (arr[4].length > 1 ? arr[4] : '0' + arr[4]) + ' on '
                + arr[1] + '/' + arr[2] + '/' + arr[0];
    }

    async function requestBypass() {
        if (minutes == null || minutes < 1) {
            alert('Number of minutes is invalid');
        }

        let resp = await http.post(endpoint, {minutes: minutes});
        if (resp.success) {
            dispatch('notify', {
                msg: 'Successfully added bypass'
            });
        } else {
            dispatch('notify', {
                msg: 'Failed to add bypass'
            });
        }

        clearInput();

        await getCurrentBypassList();
    }

    let currentBypassList = null;

    async function getCurrentBypassList() {
        let resp = await http.get(endpoint);

        if (resp.success) {
            currentBypassList = resp.json;
        } else {
            alert('There was an error getting the current bypass list.');
        }
    }

    async function cancelBypass() {
        let resp = await http.delete(endpoint);

        if (resp.success) {
            dispatch('notify', {
                msg: 'Successfully canceled bypass'
            });
        } else {
            dispatch('notify', {
                msg: 'Failed to cancel bypass'
            });
        }

        await getCurrentBypassList();
    }

    onMount(getCurrentBypassList);
</script>

<div class="control-container">
    <div>
        <label for="minutes">Open minutes:</label>
        <input id="minutes" type="number" bind:value={minutes}>
    </div>
    <button on:click={requestBypass}>Add</button>
</div>

{#if currentBypassList != null && currentBypassList.length > 0}
    <ul class="scrollable-list">
        {#each currentBypassList as bypass}
            <ListItem
                displayValue={'Bypass expires at ' + formatTimeForDisplay(bypass.executeTime)}
                dataValue={bypass.id}
            />
        {/each}
    </ul>
    <button on:click={cancelBypass}>Cancel All</button>
{:else}
    <p>There are currently no active bypasses</p>
{/if}