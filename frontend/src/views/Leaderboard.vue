<template>
    <div class="overall-wrapper">
        <div class="leaderboard-wrap">
            <v-row no-gutters>
                <v-col cols="12" sm="3">
                    <div class="game-select-wrap">
                        <div v-for="r in gameList" :class="{ 'selected-game': r == game }" class="game-select" @click="setGame(r)" :key="r">
                            {{ getGameName(r) }}
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" sm="9">
                    <div class="leaderboard-container" v-for="(team, index) in stats.teams" :key="team.id">
                        <leaderboard-entry :index="(index + 1)" :team="team"></leaderboard-entry>
                    </div>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import LeaderboardEntry from '../components/leaderboard/LeaderboardEntry.vue';
export default {
    props: ["organizer", "eventId", "game"],
    components: {
        LeaderboardEntry
    },
    data() {
        return {
            stats: [],
            gameList: ["overall", "1", "2", "3", "4", "5", "6"]
        }
    },
    methods: {
        async updateStats() {
            let {count} = await this.$apex.getGameCount(this.organizer, this.eventId);
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
            this.$router.replace({ "name": "leaderboard", params: { game, organizer: this.organizer, eventId: this.eventId } });
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

<style scoped>
.overall-wrapper {
    background: black;
}
.game-select {
    background: rgb(38, 31, 31);
    color: white;
    text-align: center;
    padding: 3px;
    margin: 3px 7px;
    cursor: pointer;
}

.selected-game {
    background: rgb(151, 11, 11);
}

.leaderboard-wrap {
    max-width: 1000px;
    padding: 30px;
    margin: auto;
}
.leaderboard-container {
    flex-grow: 1;
}
</style>