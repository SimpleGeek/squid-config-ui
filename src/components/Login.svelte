<style>
    h2 {
        margin-left: 25%;
    } 

    button, input {
        width: 300px;
    }

    input {
        margin-bottom: 2%;
    }
</style>

<script>
    import Util from '../JSUtil/util.js';
    let util = new Util();

    let username = null;
    let password = null;
    
    function login() {
        if (util.isEmptyOrSpaces(username)) {
            alert('Enter a username');
            return;
        } else if (util.isEmptyOrSpaces(password)) {
            alert ('Enter a password');
            return;
        }

        
    }
</script>

<div class="column-container">
    <h2>Login</h2>
    <input placeholder="Username" type="text" bind:value={username}>
    <input placeholder="Password" type="text" bind:value={password}>
    <button on:click={login}>Login</button>
</div>