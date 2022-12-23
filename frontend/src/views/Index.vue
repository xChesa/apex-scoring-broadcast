<template>
    <v-app>
        <div class="public-wrapper">
            <nav-bar></nav-bar>
            <div class="public-header">
                <div class="title">Apex Tournament Stats</div>
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
