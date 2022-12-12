<template>
    <v-app>
        <div class="public-wrapper">
            <div class="public-header">
                <div class="title">{{publicSettings.title}}</div>
            </div>
            <!-- <v-toolbar class="text-center">
                <div class="toolbar-link-container">
                    <router-link class="toolbar-link" :to="{ name: 'leaderboard.standings', params: $props }">Standings</router-link>
                </div>
            </v-toolbar> -->
            <router-view />
        </div>
        <div class="credit">Created by <a target="_blank" href="https://twitter.com/Double0_">@Double0negative</a></div>
    </v-app>
</template>

<script>
export default {
    props: ["organizer", "eventId"],
    data() {
        return {
            publicSettings: {}
        }
    },
    methods: {
        async refreshPublicOptions() {
            if (this.eventId) {
                let options = await this.$apex.getPublicSettings(this.organizer, this.eventId);
                if (options) {
                    this.publicSettings = options;
                }
            }
        }
    },
    async mounted() {
        await this.refreshPublicOptions();
    }
}
</script>
<style lang="scss">
body {
    background: black;
    width: 100%;
    height: 100%;
    font-family: "Heebo", sans-serif;
}

.public-header {
    height: 200px;
    color: white;
    background: $third-tone;
}

.toolbar-link-container {
    display: inline-block;
    margin: auto;
    height: 100%;
    vertical-align: baseline;
    display: flex;
}

.toolbar-link {
    padding: 0 20px;
    color: white!important;
    text-decoration: none;
    align-self: end;
    margin-bottom: -4px;
    height: 80%;
}

.router-link-active {
    border-bottom: 2px solid $primary;
}

.public-header {
    display: flex;
}

.public-header .title {
    width: 100%;
    align-self: center;
    text-align: center;
    font-size: 2em!important;
}

.credit {
    margin: 5px auto;
    
    a {
        color: $primary!important;

    }
}
</style>
