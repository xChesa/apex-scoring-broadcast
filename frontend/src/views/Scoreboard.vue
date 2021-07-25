<template>
    <div class="wrap">
        <score-table :scores="computedScores" :display="display"/>
    </div>
</template>

<script>
import ScoreTable from "../components/ScoreTable.vue"
export default {
    components: {
        ScoreTable,
    },
    props: ["eventId", "round", "mode", "display"],
    data() {
        return {
            stats: undefined,
            interval: 0,
        }
    },
    computed: {
        computedScores() {
            return (this.stats || []).map(stat => stat[this.computedMode]).flat();
        },
        computedMode() {
            let modeMap = {
                team: "overall_stats",
                player: "player_stats"
            }
            return modeMap[this.mode];
        }
    },
    methods: {
        async updateScores() {
            this.stats = await this.$apex.getStats(this.eventId, this.round);
        }
    },
    created() {
        this.updateScores();
        this.interval = setInterval(this.updateScores(), 3000);
    },
    destroyed() {
        clearInterval(this.interval);
    }
}
</script>

<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    /* background-image: url("/scoring.png"); */
}
</style>