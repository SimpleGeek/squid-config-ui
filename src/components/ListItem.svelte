<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let dataValue;
    export let displayValue;

    let selected = false;

    function handleClick() {
        selected = !selected;
        dispatch('click', {
            dataValue: dataValue
        });
    }
</script>

<li class:selected on:click={handleClick}>{displayValue}</li>