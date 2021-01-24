<script>
    import Slider from './Slider.svelte';
    import DeviceManager from './DeviceManager.svelte';
    import Whitelist from './Whitelist.svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleThemeToggle(event) {
        let goDark = event.detail.state;
        if (goDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    function navigate(dest) {
        dispatch('navigate', {
            destination: dest
        });
    }
</script>

<div class="topnav">
    <a href="#a" on:click={() => {navigate(DeviceManager)}}>Devices</a>
    <a href="#a" on:click={() => {navigate(Whitelist)}}>Whitelist</a>
    <Slider on:toggle={handleThemeToggle}/>
</div> 