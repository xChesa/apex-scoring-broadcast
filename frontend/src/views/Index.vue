<template>
    <v-app>
        <div class="public-wrapper">
            <nav-bar></nav-bar>
            <div class="public-header">
                <div class="title">Apex Tournament Stats</div>
            </div>

            <div class="recent-wrapper">
                <div class="title-toolbar mb-5 text-center text-uppercase">Recent Tournaments</div>
                <v-row>
                    <v-col cols="3" v-for="match in latest" :key="match.id">
                        <div  >
                            <div class="title-toolbar text-center text-uppercase">{{ getName(match) }}</div>
                            <div class="top-team" :class="'team-' + (index + 1)" v-for="(team, index) in match.top3"
                                :key="team.id">
                                <div class="entry-index">
                                    <div class="entry-index-text">{{ index + 1 }}</div>
                                </div>
                                <div class="team-name"> {{ team.name }}</div>
                                <div class="team-score"> {{ team.score }}</div>
                            </div>
                            <div class="view-more"><router-link :to="{ name: 'tournament.standings', params: { eventId: match.eventId, organizer: match.organizer, game: 'overall' }}">View More</router-link></div>
                        </div>
                    </v-col>
                </v-row>
            </div>


        </div>
        <div class="credit">Created by <a target="_blank" href="https://twitter.com/Double0_">@Double0negative</a></div>
    </v-app>
</template>

<script>
import NavBar from "../components/NavBar.vue"
export default {
    props: ["organizer", "eventId"],
    components: {
        NavBar,
    },
    data() {
        return {
            latest: []
        }
    },
    methods: {
        async refreshRecent() {
            let latest = await this.$apex.getLatest();
            console.log(latest)
            if (latest) {
                this.latest = latest;
            }
        },
        getName(match) {
            return match.title || `${match.organizer} - ${match.eventId}`;
        }
    },
    async mounted() {
        await this.refreshRecent();
    }
}
</script>
<style lang="scss" scoped>
@media only screen and (max-width: 860px) {
    .row {
        justify-content: center;
    }
    .col {
        max-width: 40vw;
        min-width: 40vw;
    }
}

@media only screen and (max-width: 414px) {
    .row {
        flex-direction: column;
        align-items: center;
    }
    .col {
        max-width: 100vw;
    }
}

body {
    background: black;
    width: 100%;
    height: 100%;
    font-family: "Heebo", sans-serif;
}

.recent-wrapper {
    margin: 30px auto;
    max-width: 1400px;
}

.public-header {
    height: 150px;
    color: white;
    background: $third-tone;
}

.top-team {
    height: fit-content;
    line-height: 50px;
    font-size: 1.2em;
    width: 100%;
    display: flex;
    background-color: $second-tone;
    margin: 3px 0px;
}

.team-name {
    padding-left: 10px;
    flex: 1;
}

.view-more {
    height: 25px;
    background: $second-tone;
    font-size: .9em;
    text-align: center;
}

.view-more a {
    text-decoration: none;
    color: $primary!important;
}

.team-score {
    padding-right: 30px;
}

.entry-index {
    width: 40px;
    text-align: center;
}

.team-1 .entry-index {
    background-color: rgba(255, 200, 0, .3);
}

.team-2 .entry-index {
    background-color: rgba(200, 200, 200, .3);
}

.team-3 .entry-index {
    background-color: rgba(88, 54, 7, 0.3);
}


.public-header {
    display: flex;
}

.public-header .title {
    width: 100%;
    align-self: center;
    text-align: center;
    font-size: 2em !important;
}

.credit {
    margin: 5px auto;

    a {
        color: $primary !important;

    }
}
</style>
