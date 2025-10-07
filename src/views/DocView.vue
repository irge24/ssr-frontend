<template>
  <div v-if="doc">
    <h2>{{ doc.title }}</h2>
    <form @submit.prevent="updateDoc">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        required
      >

      <label for="content">Contents</label>
      <textarea
        id="content"
        v-model="content"
        required
      />

      <div class="button-group">
        <button type="submit">
          Update
        </button>
        <router-link to="/">
          <button type="button">
            Back
          </button>
        </router-link>
      </div>
    </form>
  </div>
  <p v-else>
    Document could not be found.
  </p>
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

  watch: {
    "$route.params.id": "fetchDoc",
  },
  async mounted() {
    await this.fetchDoc();
  },

  methods: {
    async fetchDoc() {
      const res = await api.get(`/${this.$route.params.id}`);
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
