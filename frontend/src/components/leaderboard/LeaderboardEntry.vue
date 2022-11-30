<template>
    <div>
        <div class="entry-wrapper">
            <div class="entry-index">{{ index }}</div>
            <div class="entry-main">
                <div class="entry-header">
                    <v-row >
                        <v-col sm="9">{{ team.name }}</v-col>
                        <v-col sm="1">{{ team.overall_stats.score }}</v-col>
                        <v-col sm="1">{{ team.overall_stats.teamPlacement }}</v-col>
                        <v-col sm="1">{{ team.overall_stats.kills }}</v-col>
                    </v-row>
                </div>
                <div class="entry-players">
                    <v-row no-gutters>
                        <v-col v-for="player in team.player_stats" :key="player.id">
                            {{ player.name }} - {{ player.kills }}
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["index", "team"],
}
</script>

<style scoped>
.entry-wrapper {
    display: flex;
    color: white;
    margin-bottom: 5px;
}
.entry-index {
    width: 40px;
    font-size: 2em;
    text-align: center;
    background: rgb(151, 11, 11);
    line-height: 2.3em;
}

.entry-main {
    flex-grow: 1;
    background: rgb(38, 31, 31);
}

.entry-header {
    height: 45px;
    padding: 10px;
    font-size: 1.4em;
}

.entry-players {
    background: rgb(30, 25, 25);
    font-size: .6em;
}


.entry-players .col {
    border: 1px solid rgb(20, 10, 10);
    border-left: none;
    border-bottom: none;
    padding: 8px;
}
</style>