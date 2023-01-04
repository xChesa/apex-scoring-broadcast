<template>
    <v-container>
        <div class="overall-wrapper">

            <v-toolbar class="text-center">
                <div class="toolbar-link-container">
                    <router-link class="toolbar-link"
                        :to="{ name: 'tournament.stats.charts', params: $props }">Cumulative Charts</router-link>
                    <router-link class="toolbar-link"
                        :to="{ name: 'tournament.stats.game-charts', params: $props }">Game Charts</router-link>

                </div>
            </v-toolbar>

            <div class="leaderboard-wrap">
                <router-view :stats="stats"></router-view>
            </div>
        </div>
    </v-container>
</template>

<script>

export default {
    props: ["organizer", "eventId"],

    data() {
        return {
            stats: [],
            gameList: []
        }
    },
    methods: {
        async updateStats() {
            this.stats = await this.$apex.getStats(this.organizer, this.eventId, "stacked");
        },
        getDate(timestamp) {
            return Intl.DateTimeFormat(navigator.language, { month: 'short', day: 'numeric', year: "numeric" }).format(new Date(timestamp))
        },
        getTime(timestamp) {
            return Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric", hour12: true, timeZoneName: "short" }).format(new Date(timestamp));
        }
    },
    watch: {
        game() {
            this.updateStats();
        }
    },
    mounted() {
        this.updateStats();
    }
}
</script>

<style scoped lang="scss">
.overall-wrapper {
    background: $third-tone;
    max-width: 1200px !important;
    margin: auto;
}

.date {
    text-transform: capitalize;
}

.map {
    font-size: .8em;
}

.sub {
    font-size: .6em;
    opacity: .7;
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