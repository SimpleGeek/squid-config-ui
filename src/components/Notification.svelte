<script>
    import { fade, fly } from 'svelte/transition';

    export let msg;
</script>

<div class="notification"
     in:fly="{{y: 50, duration: 1200}}"
     out:fade>
    <p>{msg}</p>
</div>