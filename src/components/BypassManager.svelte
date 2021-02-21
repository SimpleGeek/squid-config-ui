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
    import HttpHelper from '../JSUtil/httphelper.js';
    const http = new HttpHelper();

    const endpoint = 'squid-configuration/schedule-bypass';
    let minutes;

    function clearInput() {
        minutes = null;
    }

    async function requestBypass() {
        if (minutes == null || minutes < 1) {
            alert('Number of minutes is invalid');
        }

        await http.post(endpoint, {minutes: minutes});

        clearInput();
    }
</script>

<div class="control-container">
    <div>
        <label for="minutes">Open minutes:</label>
        <input id="minutes" type="number" bind:value={minutes}>
    </div>
    <button on:click={requestBypass}>Add</button>
</div>