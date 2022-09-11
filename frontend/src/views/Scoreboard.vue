<template>
    <div>
        <div class="scoreboard-wrap"  :class="{ 'scoreboard-wrap-styled': styled, 'white-text': dark }">
            <div class="scoreboard-header-wrap">
                <div class="scoreboard-header"  :class="{ 'scoreboard-header-styled': styled }">
                    <div v-if="styled" class="scoreboard-header-backing"></div>
                    <div class="scoreboard-header-text">{{title}}</div>
                </div>
            </div>
            <score-table :showCharacters="showCharacters" :stats="stats" :display2="display2" :display="display" :mode="mode" :styled="styled"/>
        </div>
    </div>
</template>

<script>
import ScoreTable from "../components/ScoreTable.vue"
export default {
    components: {
        ScoreTable,
    },
    props: ["eventId", "round", "mode", "display", "display2", "styled", "dark", "header", "showCharacters"],
    data() {
        return {
            stats: [],
            interval: 0,
        }
    },

    methods: {
        async updateScores() {
            if(this.round && this.mode && this.display) {
                this.stats = await this.$apex.getStats(this.eventId, this.round);
                console.log(this.stats)
            }
        }
    },
    computed: {
        title() {
            if(this.header) {
                if(this.round == "overall") {
                    return "Leaderboard"
                } else {
                    return `Game ${this.round}`
                }
            } else {
                return " "
            }
        }
    },
    async mounted() {
        await this.$nextTick();
        this.updateScores();
        this.interval = setInterval(() => this.updateScores(), 3000);
    },
    destroyed() {
        clearInterval(this.interval);
    }
}
</script>

<style scoped>
.scoreboard-wrap {
  position: absolute;
  width: 1920px;
  height: 1080px;
}

.scoreboard-wrap-styled {
    background: black;
}

.scoreboard-header-wrap {
    position: absolute;
    top: 50px;
    height: 150px;
    width: 100%;
}

.white-text { 
    color: white;
}

.scoreboard-header {
    width: 40%;
    /* margin: auto; */
    font-family: "Heebo", sans-serif;
    font-size: 50px;
    line-height: 80px;
    text-align: center;
    position: relative;
}

.scoreboard-header-text {
    position: absolute;
    text-align: center;
    width: 100%;
}

.scoreboard-header-backing {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    border-top: 80px solid rgb(151, 11, 11);
    border-right: 40px solid transparent;
}

</style>