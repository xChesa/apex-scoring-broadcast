<template>
    <v-container>
        <div class="overall-wrapper">

            <v-toolbar class="text-center">
                <div class="toolbar-link-container">
                    <router-link class="toolbar-link"
                        :to="{ name: 'leaderboard.standings', params: $props }">Standings</router-link>
                    <router-link class="toolbar-link"
                        :to="{ name: 'leaderboard.player-standings', params: $props }">Player
                        Standings</router-link>
                    <router-link class="toolbar-link" :to="{ name: 'leaderboard.team-standings', params: $props }">Team
                        Standings</router-link>
                </div>
            </v-toolbar>

            <div class="leaderboard-wrap">
                <v-row no-gutters>
                    <v-col cols="12" sm="2">
                        <div class="game-select-wrap">
                            <div v-for="r in gameList" :class="{ 'selected-game': r == game }" class="game-select"
                                @click="setGame(r)" :key="r">
                                {{ getGameName(r) }}
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="10">
                        <router-view :stats="stats"></router-view>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>

export default {
    props: ["organizer", "eventId", "game"],

    data() {
        return {
            stats: [],
            gameList: ["overall", "1", "2", "3", "4", "5", "6"]
        }
    },
    methods: {
        async updateStats() {
            let { count } = await this.$apex.getGameCount(this.organizer, this.eventId);
            this.gameList = this.buildGameList(count);

            this.stats = await this.$apex.getStats(this.organizer, this.eventId, this.game);
        },
        getGameName(game) {
            if (game != "overall") {
                return "Game " + game;
            }
            return "Overall";
        },
        setGame(game) {
            this.$router.replace({ params: { game, organizer: this.organizer, eventId: this.eventId } });
        },
        buildGameList(count) {
            return new Array(count + 1).fill({}).map((i, index) => index == 0 ? "overall" : index);
        }
    },
    watch: {
        game() {
            this.updateStats();
        }
    },
    mounted() {
        if (!this.game) {
            this.setGame("overall");
        } else {
            this.updateStats();
        }
    }
}
</script>

<style scoped lang="scss">
.overall-wrapper {
    background: $third-tone;
    max-width: 1200px !important;
    margin: auto;
}

.game-select {
    background: $first-tone;
    color: white;
    text-align: center;
    padding: 3px;
    margin: 3px 7px;
    cursor: pointer;
}

.selected-game {
    background: $primary;
}

.leaderboard-wrap {
    padding: 30px;
    margin: auto;
}
</style>