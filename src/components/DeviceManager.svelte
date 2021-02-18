<style>
    .control-container {
        margin-left: 27%;
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
    import Util from '../JSUtil/util.js';
    import ListItem from './ListItem.svelte';

    let util = new Util();

    let devices = [
        {name: "Zaya's phone"},
        {name: "Isaiah's laptop"},
        {name: "Sarah's laptop"},
        {name: "Seth's PC"},
        {name: "Noah's phone"}
    ];

    /* TODO: Implement once API spec received
    onMount(async function() {
        const response = await fetch(url, options);
        devices = await response.json();
    });
    */

    /*
    function removeElementFromArray(array, index) {
        array[index] = array[array.length - 1];
        array.pop();
        return array;
    }
    */

    let selectedDevices = [];
    function handleDeviceSelection(event) {
        let selDevice = {name: event.detail.dataValue};
        let selDeviceIndex = util.checkIfElementExistsInArray(selectedDevices, selDevice, (d) => {return d.name});
        if (selDeviceIndex == null) {
            // The device is not selected, so add it to selectedDevices
            selectedDevices.push(selDevice);
        } else {
            // The device is selected, so remove it from selectedDevices
            selectedDevices = util.removeElementFromArray(selectedDevices, selDeviceIndex);
        }
    }
</script>

<ul>
    {#each devices as device}
        <ListItem 
            displayValue={device.name}
            dataValue={device.name}
            on:click={handleDeviceSelection}
        />
    {/each}
</ul>
<div class="control-container">
    <div>
        <label for="minutes">Open minutes:</label>
        <input id="minutes" type="number">
    </div>
    <button>Add</button>
</div>