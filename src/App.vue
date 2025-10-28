<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">
          Home
          <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
          <router-link v-if="!isLoggedIn" to="/register">Register</router-link>
          <button v-if="isLoggedIn" @click="logout">Logout</button>
        </router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Check if use has a saved token (logged in)
      isLoggedIn: !!localStorage.getItem("token")
    };
  },
  methods: {
    // Log out user and remove token
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
  watch: {
    // Update login state when route changes
    $route() {
      this.isLoggedIn = !!localStorage.getItem("token");
    },
  },
};
</script>

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
