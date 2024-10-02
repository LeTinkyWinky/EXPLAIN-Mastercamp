<template>
    <header>
        <nav>
        <RouterLink to="/">
            EXPLAIN - Classification de brevets
        </RouterLink>
        <!-- <a href="https://efrei-projets-transverses.notion.site/Solution-Factory-quipes-fili-re-DS-EXPLAIN-EXplainable-Patent-Learning-for-Artificial-INtelli-5f9d903a52f349829381879ffef47d50" target="_blank">
            À propos
        </a> -->
        </nav>
    </header>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  components: {
    RouterLink
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  font-size: 1.2em;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

header {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-header);
}
</style>