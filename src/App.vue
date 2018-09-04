<template>
    <div id="app" class="container">
        <Account></Account>
        <img alt="Vue logo" src="./assets/logo.png"/>
        <Source></Source>
        <List></List>
        <Player></Player>
    </div>
</template>

<script>
    import Account from './components/Account.vue'
    import Source from './components/Source.vue'
    import List from './components/List.vue'
    import Player from './components/Player.vue'

    export default {
        name: 'app',
        components: {
            Account,
            List,
            Player,
            Source
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
