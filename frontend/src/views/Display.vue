<template>
  <scoreboard
    :eventId="eventId"
    :styled="displayOptions.styled"
    :mode="displayOptions.mode"
    :round="displayOptions.round"
    :display="displayOptions.display"
    :display2="displayOptions.display2"
  ></scoreboard>
</template>
<script>
import Scoreboard from "./Scoreboard.vue";

export default {
  components: { Scoreboard },
  compoents: {
    Scoreboard,
  },
  props: ["eventId"],
  data() {
    return {
      displayOptions: {},
      interval: 0,
    };
  },
  methods: {
    async update() {
      this.displayOptions = await this.$apex.getDisplayView(this.eventId);
    },
  },
  mounted() {
    this.interval = setInterval(() => this.update(), 1000);
    this.update();
  },
  destroyed() {
    clearInterval(this.interval);
  },
};
</script>