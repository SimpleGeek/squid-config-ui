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
    import Util from '../JSUtil/util.js';
    const dispatch = createEventDispatcher();
    const http = new HttpHelper($userCredentials.username, $userCredentials.password);
    const util = new Util();

    const endpoint = 'squid-configuration/schedule-bypass';
    let minutes;

    async function refreshBypassList() {
        let numSeconds = 5;
        await getCurrentBypassList();
        await setTimeout(refreshBypassList, numSeconds*1000);
    }

    function clearInput() {
        minutes = null;
    }

    function convertTo12Hr(hours) {
        let returnObj = {};
        
        if (hours >= 12 && hours <= 23) {
            returnObj.meridianInd = 'PM';
        } else {
            returnObj.meridianInd = 'AM';
        }

        if (hours > 12) {
            returnObj.hours = (hours - 12);
        } else {
            returnObj.hours = hours;
        }
        
        return returnObj;
    }

    function formatTimeForDisplay(time) {
        let hourObj = convertTo12Hr(time[3]);
        return hourObj.hours + ':' + (time[4].toString().length > 1 ? time[4] : '0' + time[4]) + ' ' + hourObj.meridianInd
                + ' on ' + time[1] + '/' + time[2] + '/' + time[0];
    }

    async function handleRequestBypass(e) {
        if (e.keyCode == 13) {
            // Enter key pressed
            await requestBypass();
        }
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

    onMount(refreshBypassList);
</script>

<div class="control-container">
    <div>
        <label for="minutes">Open minutes:</label>
        <!-- svelte-ignore a11y-autofocus -->
        <input id="minutes" type="number" bind:value={minutes} on:keypress={handleRequestBypass} autofocus>
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