<template>
    <v-container>

        <v-row>
            <v-col sm="12" lg="6">
                <v-card>
                    <v-card-title>Settings</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="publicData.title" label="Title"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="setPublicSettings" color="blue">Submit</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-card>
            <v-card-title>Link</v-card-title>
            <v-card-text>
                <v-form><v-text-field solo :value="publicLink" readonly></v-text-field></v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: ["eventId", "organizer"],
    data() {
        return {
            publicData: {}
        }
    },
    computed: {
        publicLink() {
            return window.location.origin + this.$router.resolve({ name: 'leaderboard', params: { eventId: this.eventId, organizer: this.organizer, game: "overall" } }).href;
        }
    },
    methods: {
        setPublicSettings() {
            this.$apex.setPublicSettings(this.organizer, this.eventId, this.publicData);
        },
        async refreshPublicOptions() {
            if (this.eventId) {
                let options = await this.$apex.getPublicSettings(this.organizer, this.eventId);
                if (options) {
                    this.publicData = options;
                }
            }
        }
    },
    async mounted() {
        await this.refreshPublicOptions();
    }
}
</script>