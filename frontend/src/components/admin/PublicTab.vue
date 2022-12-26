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
                <v-form><v-text-field solo :value="publicUrl" readonly></v-text-field></v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: ["eventId", "organizer"],
    data() {
        return {
            publicData: {},
            publicUrl: undefined,
        }
    },
    computed: {
        publicFullUrl() {
           return window.location.origin + this.$router.resolve({ name: 'standings', params: { eventId: this.eventId, organizer: this.organizer, game: "overall" } }).href;
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
        },
        async getShortLink() {
            let {hash} = await this.$apex.getShortLink(this.publicFullUrl);
            return `${window.location.origin}/${hash}`;
        }
    },
    async mounted() {
        await this.refreshPublicOptions();
        this.publicUrl = this.publicFullUrl;
        this.publicUrl = await this.getShortLink();
    }
}
</script>