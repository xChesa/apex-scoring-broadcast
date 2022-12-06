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
          <v-col sm="12">
          <v-card>
            <v-card-text>
              <v-tabs v-model="tabs">
                <v-tab>
                  Game Manager
                </v-tab>
                <v-tab>
                  Broadcast Settings
                </v-tab>
                <v-tab>
                  Public Settings
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tabs">
                <v-tab-item>
                  <game-tab :organizer="organizer" :eventId="eventId"></game-tab>
                </v-tab-item>
                <v-tab-item>
                  <broadcast-tab :organizer="organizer" :eventId="eventId"></broadcast-tab>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
          </v-col>        
        </template>
      </v-row>
    </v-container>
  </v-app>
</template>


<script>
import GameTab from "../components/admin/GameTab.vue"
import BroadcastTab from "../components/admin/BroadcastTab.vue"

export default {
  components: {
    BroadcastTab,
    GameTab,
  },
  props: ["organizer", "eventId"],
  data() {
    return {
      eventIdForm: undefined,
      apiKeyForm: undefined,
      usernameForm: undefined,
      loginFailed: false,
      tabs: undefined,
    };
  },
  methods: {
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
    },
  },
  async mounted() {
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

</style>