<style>
    button.delete-button {
        position: absolute;
        bottom: 0.5px;
        right: 0px;
    }

    li {
        position: relative;
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