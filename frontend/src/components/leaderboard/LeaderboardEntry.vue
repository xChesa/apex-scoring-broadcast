<template>
    <div>
        <div class="entry-wrapper">
            <div class="entry-index">
                <v-row><v-col>{{ index }}</v-col></v-row>
            </div>
            <div class="entry-main">
                <div class="entry-header">
                    <v-row >
                        <v-col sm="9">{{ team.name }}</v-col>
                        <v-col sm="1">{{ team.overall_stats.score }}</v-col>
                        <v-col sm="1">{{ team.overall_stats.teamPlacement }}</v-col>
                        <v-col sm="1">{{ team.overall_stats.kills }}</v-col>
                    </v-row>
                </div>
                <!-- <div class="entry-players entry-sub">
                    <v-row no-gutters>
                        <v-col v-for="player in team.player_stats" :key="player.id">
                            {{ player.name }} - {{ player.kills }}
                        </v-col>
                    </v-row>
                </div> -->
                <!-- <div class="entry-expanded entry-sub">
                    <v-row>
                        <v-col>
                            <div>&nbsp;</div>
                            <div v-for="key in statsToShow" :key="key" class="text-right pr-5 text-capitalize">{{getDisplayName(key)}}</div>
                        </v-col>
                        <v-col v-for="player in team.player_stats" :key="player.id">
                            <div  class="table-header">{{player.name}}</div>
                            <div v-for="key in statsToShow" :key="key">{{player[key]}}&nbsp;</div>
                        </v-col>
                        <v-col>
                            <div>Team</div>
                            <div v-for="key in statsToShow" :key="key">{{team.overall_stats[key]}}&nbsp;</div>
                        </v-col>
                    </v-row>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { displayOptions, getDisplayName } from '../../utils/statsUtils';
export default {
    props: ["index", "team"],
    data() {
        return {
            statsToShow: displayOptions.display.player,
        }
    },
    methods: {
        getDisplayName
    }
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
    font-size: 1.2em;
    padding: 10px;
    text-align: center;
    background: rgb(151, 11, 11);
}

.entry-main {
    flex-grow: 1;
    background: rgb(38, 31, 31);
}

.entry-header {
    padding: 10px;
    font-size: 1.2em;
}

.entry-sub {
    background: rgb(30, 25, 25);
    font-size: .7em;
}

.table-header {
    font-size: 1.2em;
}


.entry-players .col {
    border: 1px solid rgb(20, 10, 10);
    border-left: none;
    border-bottom: none;
    padding: 8px;
}
</style>