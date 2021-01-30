<script>
	import Navigation from './components/Navigation.svelte';
	import Notification from './components/Notification.svelte';
	import Whitelist from './components/Whitelist.svelte';

	let activeComponent = Whitelist;

	function handleNavigation(event) {
		activeComponent = event.detail.destination;
	}

	let notificationOn = false;
	let notificationMsg = null;
	function displayNotification(event) {
		notificationMsg = event.detail.msg;
		notificationOn = true;
	}
</script>

<Navigation on:navigate={handleNavigation} />
{#if notificationOn}
	<Notification msg={notificationMsg} />
{/if}
<main class="container">
	<svelte:component this={activeComponent} 
		on:navigate={handleNavigation} 
		on:notify={displayNotification}
	/>
</main>