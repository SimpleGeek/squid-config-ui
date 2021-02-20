<style>
    * {box-sizing: border-box}

    /* Set a style for all buttons */
    button {
        color: var(--font-color);
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
        width: 100%;
        opacity: 0.9;
        font-size: 17px;
    }
    button:hover {
        opacity:1;
    }
    /* Float cancel and delete buttons and add an equal width */
    .cancelbtn, .deletebtn {
        float: left;
        width: 50%;
    }
    /* Add a color to the cancel button */
    .cancelbtn {
        background-color: var(--secondary-color);
    }
    /* Add a color to the delete button */
    .deletebtn {
        background-color: var(--accent-color);
    }
    /* Add padding and center-align text to the container */
    .container {
        padding: 16px;
        text-align: center;
    }
    /* The Modal (background) */
    .modal {
        display: block; /* Shown by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: var(--bg-color);
        padding-top: 50px;
    }
    /* Modal Content/Box */
    .modal-content {
        background-color: var(--primary-color);
        margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
        border: 1px solid #888;
        width: 40%; /* Could be more or less, depending on screen size */
    }
    /* The Modal Close Button (x) */
    .close {
        position: absolute;
        right: 35px;
        top: 15px;
        font-size: 40px;
        font-weight: bold;
        color: #f1f1f1;
    }
    .close:hover,
    .close:focus {
        color: #f44336;
        cursor: pointer;
    }
    /* Clear floats */
    .clearfix::after {
        content: "";
        clear: both;
        display: table;
    }
    @media screen and (max-width: 600px) {
        .modal-content {
            width: 80%;
        }
    }
    /* Change styles for cancel button and delete button on extra small screens */
    @media screen and (max-width: 300px) {
        .cancelbtn, .deletebtn {
            width: 100%;
        }
    }
</style>

<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Props
    export let title;
    export let prompt;
    export let affirmText;
    export let negativeText;    

    function exitModal() {
        dispatch('exit', {});
    }

    function btnAffirmativeClicked() {
        dispatch('affirmative', {});
    }

    function btnNegativeClicked() {
        dispatch('negative', {});
    }
</script>

<div id="modal" class="modal">
    <span on:click={exitModal} class="close" title="Close Modal">&times;</span>
    <form class="modal-content">
      <div class="container">
        <h1>{title}</h1>
        <p>{prompt}</p>
  
        <div class="clearfix">
          <button type="button" class="deletebtn" on:click={btnAffirmativeClicked}>{affirmText}</button>
          <button type="button" class="cancelbtn" on:click={btnNegativeClicked}>{negativeText}</button>
        </div>
      </div>
    </form>
</div>