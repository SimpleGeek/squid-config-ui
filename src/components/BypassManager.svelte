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
        }

        .control-container {
            margin-left: 0%;
        }
    }
</style>

<script>
    import { onMount } from 'svelte';
    import ListItem from './ListItem.svelte';
    import HttpHelper from '../JSUtil/httphelper.js';
    const http = new HttpHelper();

    const endpoint = 'squid-configuration/schedule-bypass';
    let minutes;

    function clearInput() {
        minutes = null;
    }

    function formatTimeForDisplay(time) {
        let arr = time.toString().split(',');
        return arr[3] + ':' + arr[4] + ' on ' + arr[1] + '/' + arr[2] + '/' + arr[0];
    }

    async function requestBypass() {
        if (minutes == null || minutes < 1) {
            alert('Number of minutes is invalid');
        }

        await http.post(endpoint, {minutes: minutes});

        clearInput();

        await getCurrentBypassList();
    }

    let currentBypassList = null;

    async function getCurrentBypassList() {
        let resp = await http.get(endpoint);

        if (resp.success) {
            currentBypassList = resp.json;
        }
    }

    async function cancelBypass() {

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
                deletable={true}
                on:delete={cancelBypass}
            />
        {/each}
    </ul>
{:else}
    <p>There are currently no active bypasses</p>
{/if}