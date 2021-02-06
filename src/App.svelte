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
		// TODO: It should be possible to click these notifications away somehow
		notificationMsg = event.detail.msg;
		notificationOn = true;
		// Remove toast after 8 seconds
		setTimeout(() => {
			notificationOn = false;
		}, 8000);
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