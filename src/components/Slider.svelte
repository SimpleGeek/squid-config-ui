<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let state = false;
    function handleClick() {
        // Toggle switch state
        state = !state;

        // Forward event to parent for handling
        dispatch('toggle', {
            state: state
        });
    }
</script>

<label class="switch">
    <input type="checkbox">
    <span class="slider" on:click={handleClick}></span>
</label>