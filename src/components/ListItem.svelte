<style>
    button.delete-button {
        position: absolute;
        bottom: 0px;
        right: 0px;
    }

    li {
        position: relative;
    }

    @media all and (max-width: 500px) {
        button.delete-button {
            height: 100%;
            width: 30px;
            padding: 2px 2px 2px 2px;
        }
    }
</style>

<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let dataValue;
    export let displayValue;
    export let selectable = false;
    export let deletable = false;

    let selected = false;

    function handleClick() {
        if (selectable) {
            selected = !selected;
        }
        dispatch('click', {
            dataValue: dataValue
        });
    }

    function handleDeletion() {
        if (deletable) {
            dispatch('delete', {
                dataValue: dataValue
            });
        }
    }
</script>

<li class:selected on:click={handleClick}>
    {displayValue}
    {#if deletable}
        <button class="delete-button" on:click={handleDeletion}>X</button>
    {/if}
</li>