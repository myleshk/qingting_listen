<template>
    <div class="player">
        <h1>{{ current_chapter }}</h1>
    </div>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'Player',
        props: {
            current_chapter: String
        },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
