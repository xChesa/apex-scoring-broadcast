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
                <v-btn @click="eventId = undefined">Change</v-btn></v-card-title
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
                <v-checkbox label="Styled" v-model="displayChoices.styled" @change="updateDisplayView"></v-checkbox>
                <v-select
                  :items="displayOptions.round"
                  v-model="displayChoices.round"
                  @change="updateDisplayView"
                ></v-select>
                <v-select
                  :items="displayOptions.mode"
                  v-model="displayChoices.mode"
                  @change="
                    this.displayChoices.display = undefined;
                    this.displayChoices.display2 = undefined;
                    updateDisplayView;
                  "
                ></v-select>
                <v-select
                  v-if="displayChoices.mode"
                  :items="displayOptions.display[displayChoices.mode]"
                  v-model="displayChoices.display"
                  @change="updateDisplayView"
                ></v-select>
                <v-select
                  v-if="displayChoices.mode"
                  :items="displayOptions.display[displayChoices.mode]"
                  v-model="displayChoices.display2"
                  @change="updateDisplayView"
                  clearable
                ></v-select>

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
  data() {
    return {
      eventIdForm: undefined,
      eventId: undefined,
      round: 1,
      statsCode: undefined,
      skipFetch: false,
      displayChoices: {
        styled: true,
        mode: undefined,
        display: undefined,
        display2: undefined,
        round: "overall",
      },
      displayOptions: {
        mode: ["team", "player"],
        display: {
          team: [
            "score",
            "kills",
            "survivalTime",
            "damageDealt",
            "bestGame",
            "bestPlacement",
            "bestKills",
          ],
          player: ["kills", "damageDealt"],
        },
        round: ["overall", "1", "2", "3", "4", "5", "6"],
      },
    };
  },
  methods: {
    update() {
      this.$apex.generateStats(
        this.eventId,
        this.statsCode,
        this.round,
        this.skipFetch
      );
    },
    updateDisplayView() {
      console.log("UDPATING", JSON.stringify(this.displayChoices), this.eventId)
      this.$apex.setDisplayView(this.eventId, this.displayChoices);
    },
    async eventIdSet() {
      this.eventId = this.eventIdForm;
      let options = await this.$apex.getDisplayView(this.eventId);
      if(options) {
        this.displayChoices = options;
      }
    }
  },
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