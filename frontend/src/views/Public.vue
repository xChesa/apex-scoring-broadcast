<template>
    <v-app>
        <div class="public-wrapper">
            <div class="public-header">
                Public Leaderboard
            </div>
            <router-view />
        </div>
    </v-app>
</template>

<script>
export default {

}
</script>
<style>
body {
    background: black;
    width: 100%;
    height: 100%;
    font-family: "Heebo", sans-serif;
}

.public-header {
    height: 200px;
    color: white;
    font-size: 4em;
    background: rgb(151, 11, 11);
}
</style>
