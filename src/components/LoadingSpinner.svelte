<style>
    .loading {
        display: flex;
        justify-content: center;
    }

    .loading::after {
        content: "";
        width: 50px;
        height: 50px;
        border: 10px solid var(--primary-color);
        border-top-color: var(--accent-color);
        border-radius: 50%;
        animation: loading 1s ease infinite;
    }

    @keyframes loading {
        to {
            transform: rotate(1turn);
        }
    }
</style>
<div class="loading loading--full-height"></div>