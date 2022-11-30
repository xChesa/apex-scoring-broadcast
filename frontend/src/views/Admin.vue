<template>
  <v-app>
    <v-container>
      <v-row>
        <template v-if="!eventId">
          <v-col sm="12" lg="12">
            <v-card>
              <v-card-title>Tournament Admin</v-card-title>
              <v-card-text>
                <v-text-field v-model="usernameForm" label="Username" @v-on:keyup="loginFailed = false"></v-text-field>
                <v-text-field v-model="apiKeyForm" label="API Key" @v-on:keyup="loginFailed = false"></v-text-field>
                <v-text-field v-model="eventIdForm" label="Tournament ID" @v-on:keyup="loginFailed = false" @v-on:keyup.enter="login"></v-text-field>

                <v-alert v-show="loginFailed" dense type="error">
                  Invalid API key
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue" @click="login">Go</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col sm="12" lg="12">
            <v-card>
              <v-card-title>Tournament: {{ eventId }}
                <v-btn @click="changeEvent()" color="blue" class="ma-2">Change</v-btn>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col sm="12" lg="6">
            <v-card>
              <v-card-title>Apex Scoring</v-card-title>
              <v-card-text>
                <v-combobox v-model="round" label="Game" :items="[1, 2, 3, 4, 5, 6]"></v-combobox>
                <v-text-field v-model="statsCode" label="Apex Stats Code"></v-text-field>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Game Selector
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div class="game-select">
                        <h3>Most Recent</h3>
                        <game-select v-if="games" @click="selectedGame = games[0].match_start"
                          :selected="selectedGame == games[0].match_start" :game="games[0]"></game-select>
                        <h3>Other Games</h3>
                        <template v-if="games">
                          <game-select @click="selectedGame = game.match_start" v-for="game in games.slice(1)"
                            :selected="selectedGame == game.match_start" :key="game.start_time" :game="game">
                          </game-select>
                        </template>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Advanced Options
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-text-field v-model.number="killPoints" label="Kill Points"></v-text-field>
                      <v-text-field v-model="placementPoints" label="Placement Points"></v-text-field>
                      <v-switch v-model="skipFetch" label="Dont pull stats, refresh only"></v-switch>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

              </v-card-text>
              <v-card-actions>
                <v-btn color="blue" @click="update">Add Game</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col sm="12" lg="6">
            <v-card>
              <v-card-title>Display</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="3">
                    <v-checkbox label="Styled" v-model="displayChoices.styled"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox label="Light Text" v-model="displayChoices.dark"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox label="Show Header" v-model="displayChoices.header"></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-checkbox label="Show Characters" v-model="displayChoices.showCharacters"></v-checkbox>
                  </v-col>
                </v-row>
                <v-select :items="displayOptions.round" v-model="displayChoices.round"></v-select>
                <v-select :items="displayOptions.mode" v-model="displayChoices.mode" @change="
  this.displayChoices.display = undefined;
this.displayChoices.display2 = undefined;
                "></v-select>
                <v-select v-if="displayChoices.mode" :items="displayOptions.display[displayChoices.mode]"
                  v-model="displayChoices.display"></v-select>
                <v-select v-if="displayChoices.mode" :items="displayOptions.display[displayChoices.mode]"
                  v-model="displayChoices.display2" clearable></v-select>
                <v-btn @click="updateDisplayView" color="blue" class="ma-2">Update</v-btn>

                <div v-if="eventId" class="display-wrapper">
                  <router-link target="_blank" :to="{ name: 'broadcast', params: { eventId } }">
                    <broadcast class="display-viewport" :organizer="organizer" :eventId="this.eventId"></broadcast>
                  </router-link>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-app>
</template>


<script>
import Broadcast from "./Broadcast.vue";
import GameSelect from "../components/admin/GameSelect.vue";
import { displayOptions } from "../utils/statsUtils";
export default {
  components: {
    Broadcast,
    GameSelect,
  },
  props: ["organizer", "eventId"],
  data() {
    return {
      eventIdForm: undefined,
      apiKeyForm: undefined,
      usernameForm: undefined,
      loginFailed: false,
      round: 1,
      statsCode: undefined,
      skipFetch: false,
      games: undefined,
      selectedGame: 0,
      showGameSelect: false,
      placementPoints: "12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0",
      killPoints: 1,
      displayChoices: {
        styled: true,
        mode: undefined,
        display: undefined,
        display2: undefined,
        header: true,
        round: "overall",
        dark: false,
      },
      displayOptions,
    };
  },
  methods: {
    update() {
      this.$apex.generateStats(
        this.eventId,
        this.statsCode.trim(),
        this.round,
        this.selectedGame,
        this.skipFetch,
        this.killPoints,
        this.placementPoints.split(",").map(n => parseInt(n)),
      );
    },
    updateDisplayView() {
      this.$apex.setDisplayView(this.organizer, this.eventId, this.displayChoices);
    },
    async login() {
      let valid = await this.$apex.checkApiKey(this.usernameForm, this.apiKeyForm);

      if (valid) {
        localStorage.setItem("organizer-key", this.apiKeyForm);
        localStorage.setItem("organizer-username", this.usernameForm);
        localStorage.setItem("eventId", this.eventIdForm);

        this.$router.replace({ "name": "admin", params: { organizer: this.usernameForm, eventId: this.eventIdForm } });
      } else {
        this.loginFailed = true;
        setTimeout(() => this.loginFailed = false, 3000);
      }
    },
    changeEvent() {
      localStorage.removeItem("eventId");

      this.$router.replace({ "name": "admin", params: { eventId: undefined } });
    }
  },
  watch: {
    async statsCode() {
      this.games = await this.$apex.getStatsFromCode(this.statsCode);
      if (this.games) {
        this.selectedGame = this.games[0].match_start;
      }
    }
  },
  async mounted() {
    if (this.eventId) {
      let options = await this.$apex.getDisplayView(this.organizer, this.eventId);
      if (options) {
        this.displayChoices = options;
      }
    }

    this.apiKeyForm = localStorage.getItem("organizer-key");
    this.usernameForm = localStorage.getItem("organizer-username");

    if (localStorage.getItem("eventId")) {
      this.eventIdForm = localStorage.getItem("eventId");

      await this.login();
    }
  }
};
</script>
<style scoped>
.display-viewport {
  transform: scale(.43);
  transform-origin: left;
}

.display-viewport>>>.scoreboard-wrap {
  border: 4px solid #333;
}

.display-wrapper {
  position: relative;
  height: 465px;
}

.game-select {
  max-height: 500px;
  overflow: auto;
}
</style>