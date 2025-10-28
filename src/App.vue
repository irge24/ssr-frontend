<script setup>
import TextEditor from './components/TextEditor.vue'
</script>

<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link>
      </nav>
    </header>

    <main>
      <h2>TextEditor</h2>
      <TextEditor/>

      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  font-size: 1.8rem;
  margin: 0 10px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>