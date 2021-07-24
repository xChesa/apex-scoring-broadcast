<template>
  <div class="overall-wrap">
    <div class="table-wrap">
      <div class="row-wrap">
        <div class="column" v-for="score in sortedScores" :key="score.name" sm="6">
          <div class="score-wrap">
            <div class="score-item score-index">&nbsp;{{ score.index }}&nbsp; </div>
            <div class="score-item score-name">&nbsp;{{ score.name }}&nbsp;</div>
            <div class="score-item score-value">&nbsp;{{ score[display] }}&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

const pad_array = function(arr,len,fill) {
  return arr.concat(Array(len).fill(fill)).slice(0,len);
}

export default {
  props: ["scores", "display"],
  computed: {
    sortedScores() {
      let scores = pad_array(this.scores, 20, {});

      if (this.display != "score") {
        scores = scores.sort((a, b) => {
          return b[this.display] - a[this.display];
        });
      }

      scores.forEach((score, index) => {
        if(score.name) score.index = index + 1;
      });


      let start = scores.slice(0, 10 );
      let end = scores.slice(10,20);
      return _.zip(start, end).flat();
    },
  },
};
</script>

<style scoped>
.overall-wrap {
  position: absolute;
  width: 1920px;
  height: 1080px;
}

.column {
    display: inline-block;
    width: 50%;
}
.score-item {
    display: inline-block;
    height: 55px;
    margin-bottom: 16px;
    /* border: 1px solid black; */
}
.score-index {
    width: 55px;
    text-align: center;
}
.score-name {
    width: 385px;
    margin-left: 15px;
}
.score-value {
    width: 125px;
    margin-left: 15px;
}
.table-wrap {
    position: relative;
    top: 280px;
    left: 350px;
    width: 1260px;
    height: 710px;
    /* background-color: rgba(255, 0, 0, .5); */
    font-family: 'Kanit', sans-serif;
    font-size: 30px;
}
.row-wrap {
  height: 100%;
  width: 100%;
}
</style>
