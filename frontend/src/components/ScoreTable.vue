<template>
  <div class="overall-wrap" :class="{ 'overall-wrap-styled': styled }">
    <div class="table-wrap">
      <div class="row-wrap">
        <div class="column" v-for="index in 2" :key="index">
          <div class="score-wrap table-header">
            <div class="score-item score-index">
              <div>&nbsp;#&nbsp;</div>
            </div>
            <div class="score-item score-name">
              <div>{{ mode == "team" ? "Team Name" : "Player Name" }}</div>
            </div>
            <div class="score-item score-value">
              &nbsp;{{ display2 }}&nbsp;
            </div>
            <div class="score-item score-value">
              &nbsp;{{ display }}&nbsp;
            </div>
          </div>
        </div>
        <div
          class="column"
          v-for="score in sortedScores"
          :key="score.name"
          sm="6"
        >
          <div class="score-wrap">
            <div
              class="score-item score-index"
              :class="{ 'score-index-styled': styled }"
            >
              <div>&nbsp;{{ score.index }}&nbsp;</div>
            </div>
            <div v-if="mode == 'team'" class="score-item score-name" :class="{ 'score-name-styled': styled }" >
              <div>{{score.teamName }}</div>
              <div class="score-player-names" v-if="mode == 'team'">
                <span v-for="player in getPlayers(score.index - 1)" :key="player">{{ player }} &nbsp;</span>
              </div>
            </div>
            <div v-else class="score-item score-name score-player-name" :class="{ 'score-name-styled': styled }" >
              <div>{{score.playerName }}</div>
            </div>
             <div class="score-item score-value" :class="{ 'score-value-styled': styled }" >
              &nbsp;{{ score[display2] }}&nbsp;
            </div>
            <div
              class="score-item score-value"
              :class="{ 'score-value-styled': styled }"
            >
              &nbsp;{{ score[display] }}&nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
const invertSort = ["position", "bestPlacment"]

const pad_array = function (arr, len, fill) {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
};

export default {
  props: ["stats", "display", "display2", "styled", "mode"],
  computed: {
    sortedScores() {
      let scores = pad_array(this.scores, 20, {});
      let sort = this.display;
      if (this.display == "score") {
        sort = scores[0].position ? "position" : "score"
      }

      scores = scores.sort((a, b) => {
        if(invertSort.includes(sort))
          return a[sort] - b[sort];
        else
        return b[sort] - a[sort];
      });
      

      scores.forEach((score, index) => {
        if (score.teamName || score.playerName) score.index = index + 1;
      });

      let start = scores.slice(0, 10);
      let end = scores.slice(10, 20);
      return _.zip(start, end).flat();
    },
    scores() {
      return (this.stats || []).map((stat) => stat[this.computedMode]).flat();
    },
    computedMode() {
      let modeMap = {
        team: "overall_stats",
        player: "player_stats",
      };
      return modeMap[this.mode];
    },
  },
  methods: {
    getPlayers(index) {
      return this.stats[index].player_stats.map((stat) => stat.playerName);
    },
  },
};
</script>

<style scoped>
.overall-wrap {
  font-family: "Heebo", sans-serif;
  width: 100%;
}

.overall-wrap-styled {
  color: white;
}
.table-header .score-item {
  color: white;
  height: 23px;
  line-height: 20px;
  font-size: 18px;
}

.score-wrap {
  margin: auto;
  width: 640px;
}

.column {
  display: inline-block;
  width: 50%;
}
.score-item {
  display: inline-block;
  height: 70px;
  margin-bottom: 0px;
  padding: 5px;
  overflow: hidden;
  /* border: 1px solid black; */
}
.score-player-name {
  line-height: 55px;
}

.score-index {
  width: 55px;
  line-height: 65px;
  text-align: center;
}

.score-name {
  width: 385px;
  padding-left: 10px;
  font-size: 25px;
}
.score-index-styled {
  background-color: rgb(151, 11, 11);
}
.score-name-styled {
  background: rgb(38, 31, 31);
}
.score-value-styled {
  background: rgb(38, 31, 31);
}
.score-player-names {
  font-size: 17px;
  font-weight: 300;
}
.score-value {
  width: 100px;
  padding-right: 15px;
  line-height:65px;
  text-align: right;
}
.table-wrap {
  position: relative;
  top: 200px;
  width: 1400px;
  height: 710px;
  margin: auto;
  /* background-color: rgba(255, 0, 0, .5); */
  font-size: 30px;
  font-weight: 400;
}
.row-wrap {
  height: 100%;
  width: 100%;
}
</style>
