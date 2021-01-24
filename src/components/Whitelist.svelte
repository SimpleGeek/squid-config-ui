<style>
    button, input {
        margin-top: 9px;
        width: 198px;
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
    let resp = null;

    function addDomain() {
        if (resp == null) {
            resp = 'This is a really long response just to see what the styling does.';
        } else {
            resp = null;
        }
    }
</script>

<div class="column-container">
    <h2>Whitelist Manager</h2>
    <label for="domain">New domain:</label>
    <input id="domain" type="text">
    {#if resp != null}
        <p>{resp}</p>
    {/if}
    <button on:click={addDomain}>Add</button>
</div>
