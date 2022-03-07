<template>
  <v-app>
    <v-container>
      <v-row>
        <template v-if="!eventId">
          <v-col sm="12" lg="12">
            <v-card>
              <v-card-title>Event ID</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="eventIdForm"
                  label="Event ID"
                  @v-on:keyup.enter="eventIdSet"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue" @click="eventIdSet">Go</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col sm="12" lg="12">
            <v-card>
              <v-card-title
                >Event: {{ eventId }}
                <v-btn @click="eventIdForm = undefined; eventIdSet()" color="blue" class="ma-2">Change</v-btn></v-card-title
              >
            </v-card>
          </v-col>
          <v-col sm="12" lg="6">
            <v-card>
              <v-card-title>Apex Scoring</v-card-title>
              <v-card-text>
                <v-text-field v-model="round" label="round"></v-text-field>
                <v-text-field
                  v-model="statsCode"
                  label="EA API Key"
                ></v-text-field>
                <v-switch
                  v-model="skipFetch"
                  label="Skip retriving stats from EA"
                ></v-switch>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue" @click="update">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col sm="12" lg="6">
            <v-card>
              <v-card-title>Display</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-checkbox label="Styled" v-model="displayChoices.styled"></v-checkbox>
                  </v-col>
                  <v-col cols="4">
                    <v-checkbox label="Light Text" v-model="displayChoices.dark"></v-checkbox>
                  </v-col>
                  <v-col cols="4">
                    <v-checkbox label="Show Header" v-model="displayChoices.header"></v-checkbox>
                  </v-col>
                </v-row>
                <v-select
                  :items="displayOptions.round"
                  v-model="displayChoices.round"
                ></v-select>
                <v-select
                  :items="displayOptions.mode"
                  v-model="displayChoices.mode"
                  @change="
                    this.displayChoices.display = undefined;
                    this.displayChoices.display2 = undefined;
                  "
                ></v-select>
                <v-select
                  v-if="displayChoices.mode"
                  :items="displayOptions.display[displayChoices.mode]"
                  v-model="displayChoices.display"
                ></v-select>
                <v-select
                  v-if="displayChoices.mode"
                  :items="displayOptions.display[displayChoices.mode]"
                  v-model="displayChoices.display2"
                  clearable
                ></v-select>
                <v-btn @click="updateDisplayView" color="blue" class="ma-2">Update</v-btn>

                <div v-if="eventId" class="display-wrapper">
                  <router-link target="_blank" :to="{name: 'display', params: {eventId}}" ><display class="display-viewport" :eventId="this.eventId"></display></router-link>
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
import Display from "./Display.vue";
export default {
  components: {
    Display,
  },
  props: ["eventId"],
  data() {
    return {
      eventIdForm: undefined,
      round: 1,
      statsCode: undefined,
      skipFetch: false,
      displayChoices: {
        styled: true,
        mode: undefined,
        display: undefined,
        display2: undefined,
        header: true,
        round: "overall",
        dark: false,
      },
      displayOptions: {
        mode: ["team", "player"],
        display: {
          team: [
            "score",
            "kills",
            "damageDealt",
            "bestGame",
            "bestPlacement",
            "bestKills",
            "revivesGiven",
            "headshots",
            "assists",
            "respawnsGiven",
            "hits",
            "knockdowns",
            "shots",
            "accuracy"
          ],
          player: [
            "kills", 
            "damageDealt", 
            "survivalTime",
            "revivesGiven",
            "headshots",
            "assists",
            "respawnsGiven",
            "hits",
            "knockdowns",
            "shots",
            "accuracy",
          ],
        },
        round: ["overall", "1", "2", "3", "4", "5", "6"],
      },
    };
  },
  methods: {
    update() {
      this.$apex.generateStats(
        this.eventId,
        this.statsCode.trim(),
        this.round,
        this.skipFetch
      );
    },
    updateDisplayView() {
      console.log("UDPATING", JSON.stringify(this.displayChoices), this.eventId)
      this.$apex.setDisplayView(this.eventId, this.displayChoices);
    },
    async eventIdSet() {
      this.$router.replace({"name": "admin", params: {eventId: this.eventIdForm}});
    }
  },
  async mounted() {
    if(this.eventId) {
      let options = await this.$apex.getDisplayView(this.eventId);
      if(options) {
        this.displayChoices = options;
      }
    }
  }
};
</script>
<style scoped>
.display-viewport {
  transform: scale(.43);
  transform-origin: left;
}

.display-viewport >>> .scoreboard-wrap {
  border: 4px solid #333;
} 

.display-wrapper {
  position: relative;
  height: 465px;
}
</style>