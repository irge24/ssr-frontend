<template>
  <div>
    <h2>Create a new document</h2>
    <form @submit.prevent="createDoc">
      <label>Title</label>
      <input v-model="title" required />

      <label>Contents</label>
      <textarea v-model="content" required></textarea>

      <div class="button-group">
        <button type="submit">Create</button>
        <router-link to="/"><button type="button">Back</button></router-link>
      </div>
    </form>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "NewDocView",
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    async createDoc() {
      try {
        await api.post("/", {
          title: this.title,
          content: this.content,
        });
        this.title = "";
        this.content = "";
        alert("Document created!");
        this.$router.push("/");
      } catch (err) {
        console.error("Failed to create document:", err);
        alert("Could not create document.");
      }
    },
  },
};
</script>
