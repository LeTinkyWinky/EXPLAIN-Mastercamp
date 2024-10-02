<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app">
    <NavBar/>
    <div id="main">
      <RouterView/> 
    </div>
  </div>
</template>

<style scoped>

#main {
  padding: 2.5rem 3.5rem;
  margin: 0 auto;
}

</style>
