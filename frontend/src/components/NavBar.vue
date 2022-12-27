<template>
    <v-toolbar>
        <div class="toolbar-link-container">
            <router-link class="toolbar-link" :to="{ name: 'index', params: $props }">Home</router-link>

        </div>
        <div class="toolbar-right-container">
            <router-link class="toolbar-link" :to="{ name: 'admin', params: $props }">Tournament Manager</router-link>
        </div>
    </v-toolbar>
</template>

<style lang="scss" scoped>
.toolbar-link-container,
.toolbar-right-container,
.container {
    display: inline-block;
    height: 100%;
    vertical-align: baseline;
    display: flex;
}

.toolbar-link-container {
    flex: 1;
}

.toolbar-link {
    padding: 0 20px;
    color: white !important;
    text-decoration: none;
    align-self: end;
    margin-bottom: -4px;
    height: 80%;
}

.router-link-exact-active {
    border-bottom: 2px solid $primary;
}
</style>