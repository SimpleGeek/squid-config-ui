<script>
	import Navigation from './components/Navigation.svelte';
	import Whitelist from './components/Whitelist.svelte';

	let activeComponent = Whitelist;

	function handleNavigation(event) {
		activeComponent = event.detail.destination;
	}
</script>

<Navigation on:navigate={handleNavigation} />
<main class="container">
	<svelte:component this={activeComponent} on:navigate={handleNavigation} />
</main>