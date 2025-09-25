<template>
  <div v-if="doc">
    <h2>{{ doc.title }}</h2>
    <form @submit.prevent="updateDoc">
      <label>Title</label>
      <input v-model="title" required />

      <label>Contents</label>
      <textarea v-model="content" required></textarea>

      <div class="button-group">
        <button type="submit">Update</button>
        <router-link to="/"><button type="button">Back</button></router-link>
      </div>
    </form>
  </div>
  <p v-else>Document could not be found.</p>
</template>

<script>
import api from "../services/api";

export default {
  name: "DocView",
  data() {
    return {
      doc: null,
      title: "",
      content: "",
    };
  },
  async mounted() {
    await this.fetchDoc();
  },

  watch: {
    "$route.params.id": "fetchDoc",
  },

  methods: {
    async fetchDoc() {
      const res = await api.get(`/${this.$route.params.id}`);
      console.log("API response:", res);
      this.doc = res.data.data;
      this.title = this.doc.title;
      this.content = this.doc.content;
    },

    async updateDoc() {
      await api.post("/update", {
        id: this.$route.params.id,
        title: this.title,
        content: this.content,
      });
      await this.fetchDoc();
      alert("Document updated!");
    },
  },
};
</script>
