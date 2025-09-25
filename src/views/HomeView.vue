<template>
  <div class="home">
    <h1>All documents</h1>
    <ul>
      <li v-for="doc in docs" :key="doc._id">
        <router-link :to="`/doc/${doc._id}`">{{ doc.title }}</router-link>
      </li>
    </ul>

    <router-link to="/new">
      <button>Create a new document</button>
    </router-link>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "HomeView",
  data() {
    return {
      docs: [],
    };
  },
  async created() {
    try {
    const res = await api.get("/");
    this.docs = res.data.data;
    } catch (err) {
      console.error("Failed to fetch docs:", err);
    }
  },
};
</script>
