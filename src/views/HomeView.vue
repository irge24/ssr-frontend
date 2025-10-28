<template>
  <div class="home">
    <h1>All documents</h1>

    <!-- List all available documents -->
    <ul>
      <li
        v-for="doc in docs"
        :key="doc._id"
      >
        <!-- Link to open each document -->
        <router-link :to="`/doc/${doc._id}`">
          {{ doc.title }}
        </router-link>
      </li>
    </ul>

    <!-- Button to create a new document -->
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
      docs: [],  // List of all documents
    };
  },

  // Fetch documents when the page is created
  async created() {
    try {
    const res = await api.get("/posts");                   // Get all documents from the server
    this.docs = res.data.data;                             // Save the data in docs array
    } catch (err) {
      console.error("Failed to fetch docs:", err);
    }
  },
};
</script>
