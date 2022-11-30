<template>
    <div class="overall-wrapper">
        <div class="leaderboard-wrap">
            <v-row no-gutters>
                <v-col cols="12" sm="3">
                    <div class="round-select-wrap">
                        <div v-for="r in roundList" :class="{ 'selected-round': r == round }" class="round-select" @click="setRound(r)" :key="r">
                            {{ getRoundName(r) }}
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
    props: ["organizer", "eventId", "round"],
    components: {
        LeaderboardEntry
    },
    data() {
        return {
            stats: [],
            roundList: ["overall", "1", "2", "3", "4", "5", "6"]
        }
    },
    methods: {
        async updateStats() {
            let {count} = await this.$apex.getRoundCount(this.organizer, this.eventId);
            this.roundList = this.buildRoundList(count);

            this.stats = await this.$apex.getStats(this.organizer, this.eventId, this.round);
        },
        getRoundName(round) {
            if (round != "overall") {
                return "Game " + round;
            }
            return "Overall";
        },
        setRound(round) {
            this.$router.replace({ "name": "leaderboard", params: { round, organizer: this.organizer, eventId: this.eventId } });
        },
        buildRoundList(count) {
            return new Array(count + 1).fill({}).map((i, index) => index == 0 ? "overall" : index);
        }
    },
    watch: {
        round() {
            this.updateStats();
        }
    },
    mounted() {
        console.log(this.organizer, this.eventId, this.round)
        if (!this.round) {
            this.setRound("overall");
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
.round-select {
    background: rgb(38, 31, 31);
    color: white;
    text-align: center;
    padding: 3px;
    margin: 3px 7px;
    cursor: pointer;
}

.selected-round {
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