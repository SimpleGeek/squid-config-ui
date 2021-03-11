<script>
	import Navigation from './components/Navigation.svelte';
	import Notification from './components/Notification.svelte';
	import BypassManager from './components/BypassManager.svelte';
	import Login from './components/Login.svelte';

	let activeComponent = BypassManager;

	function handleNavigation(event) {
		activeComponent = event.detail.destination;
	}

	let notificationOn = false;
	let notificationMsg = null;
	function displayNotification(event) {
		// TODO: It should be possible to click these notifications away somehow
		// TODO: Also need to fix the issue with replacing the notification message
		// without resetting the timeout.
		notificationMsg = event.detail.msg;
		notificationOn = true;
		// Remove toast after 8 seconds
		setTimeout(() => {
			notificationOn = false;
		}, 8000);
	}

	let loggedIn = false;
	function handleLogin(event) {
		loggedIn = true;
	}
</script>

<Navigation on:navigate={handleNavigation} />
{#if notificationOn}
	<Notification msg={notificationMsg} />
{/if}
<main class="container">
	{#if loggedIn}
		<svelte:component this={activeComponent} 
			on:navigate={handleNavigation} 
			on:notify={displayNotification}
		/>
	{:else}
		<Login on:login={handleLogin}/>
	{/if}
</main>