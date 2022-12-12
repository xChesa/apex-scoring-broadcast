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

#app{
  background: black;
}

</style>