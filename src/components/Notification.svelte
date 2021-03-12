<script>
    import { fade, fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let msg;

    function handleClick() {
        dispatch('dismiss', {});
    }
</script>

<div class="notification"
     in:fly="{{y: 50, duration: 1200}}"
     out:fade
     on:click={handleClick}>
    <p>{msg}</p>
</div>