<style>
    .column-container {
        align-items: center;
        margin-left: 0%;
    }

    button, input {
        width: 300px;
    }

    input {
        margin-bottom: 2%;
    }
</style>

<script>
    import { userCredentials } from '../stores/userstore.js';
    import { createEventDispatcher } from 'svelte';
    import Util from '../JSUtil/util.js';
    const dispatch = createEventDispatcher();
    let util = new Util();

    let username = null;
    let password = null;
    
    async function handleLogin(e) {
        if (e.keyCode == 13) {
            // Enter key was pressed
            await login();
        }
    }

    async function login() {
        if (util.isEmptyOrSpaces(username)) {
            alert('Enter a username');
            return;
        } else if (util.isEmptyOrSpaces(password)) {
            alert('Enter a password');
            return;
        }

        let authReqHeaders = new Headers();
        authReqHeaders.append("Accept", "application/json");
        authReqHeaders.append("Content-Type", "application/json");

        const response = await fetch("http://192.168.1.49:8080/squid-configuration/authenticate?user=" 
                                        + username + "&password=" + password,
        {
            method: 'POST',
            headers: authReqHeaders,
            redirect: 'follow'
        });
        
        if (response.ok) {
            // Login was successful
            $userCredentials.username = username;
            $userCredentials.password = password;
            dispatch('login', {});
        } else {
            // Login failed
            username = null;
            password = null;
            alert('Username or password was incorrect');
        }
    }
</script>

<div class="column-container">
    <h2>Login</h2>
    <!-- svelte-ignore a11y-autofocus -->
    <input placeholder="Username" type="text" bind:value={username} on:keypress={handleLogin} autofocus>
    <input placeholder="Password" type="password" bind:value={password} on:keypress={handleLogin}>
    <button type="submit" on:click={login}>Login</button>
</div>