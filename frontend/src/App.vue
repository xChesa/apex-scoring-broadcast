<template>
    <router-view />
</template>

<script>

export default {
  name: 'App',
};
</script>

<style lang="scss">
.v-data-table tr:nth-child(odd){
  background: $second-tone;
}
.v-data-table tr:nth-child(even){
  background:$first-tone;
}
.theme--dark.v-toolbar.v-sheet{
  background: $first-tone!important;
}

.title-toolbar {
  height: 64px;
  background-color: $first-tone;
  font-size: 1.1em;
  line-height: 64px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 30px;
}

#app{
  background: black;
}
</style>