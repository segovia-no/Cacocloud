<script setup lang="ts">

</script>

<template>
  <q-header elevated class="bg-red-8 text-white" height-hint="98">

    <q-toolbar>
      <q-toolbar-title shrink>
        <q-avatar class="q-mr-sm">
          <img src="cacologo.png">
        </q-avatar>
        <span>
          <strong>Caco</strong>Cloud_
        </span>
      </q-toolbar-title>

      <q-tabs align="left" class="navbaritems">
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/explore" label="Explore" />
        <q-route-tab to="/search" label="Search" />
      </q-tabs>

    </q-toolbar>
  </q-header>
</template>

<style scoped lang="scss">
.navbaritems {

  a:hover {
    color: white;
    background-color: $red-5;
  }

}
</style>
