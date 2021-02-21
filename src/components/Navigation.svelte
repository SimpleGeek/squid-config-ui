<script>
    import Slider from './Slider.svelte';
    import DeviceManager from './BypassManager.svelte';
    import Whitelist from './Whitelist.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();

    // TODO: It would be nice to have the toggle state be
    // better in sync with the current theme.  Currently,
    // the toggle is off when in the "preferred" theme, whether
    // that be dark or light, and on when in the secondary theme.
    let toggleState = false;
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    function setThemeFromDefault() {
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
        toggleState = (currentTheme == 'dark');
    }

    function handleThemeToggle(event) {
        let goDark = event.detail.state;
        if (goDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    function navigate(dest) {
        dispatch('navigate', {
            destination: dest
        });
    }

    onMount(setThemeFromDefault);
</script>

<div class="topnav">
    <a href="#a" on:click={() => {navigate(DeviceManager)}}>Bypass</a>
    <a href="#a" on:click={() => {navigate(Whitelist)}}>Whitelist</a>
    <Slider on:toggle={handleThemeToggle} state={toggleState} />
</div> 