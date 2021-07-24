<template>
    <v-container>
      <v-row>
        <v-col offset-md="2" md="8">
          <v-card>
            <v-card-title>Apex Scoring</v-card-title>
            <v-card-text>
              <v-text-field v-model="eventId" label="Event ID"></v-text-field>
              <v-text-field v-model="round" label="round"></v-text-field>
              <v-text-field v-model="statsCode" label="EA API Key"></v-text-field>
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
      </v-row>
    </v-container>
</template>


<script>
export default {
  data() {
    return {
      eventId: undefined,
      round: 1,
      statsCode: undefined,
      skipFetch: false,
    };
  },
  methods: {
      update() {
          this.$apex.generateStats(this.eventId, this.statsCode, this.round, this.skipFetch);
      }
  }
};
</script>
