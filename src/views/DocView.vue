<template>
  <div v-if="doc">
    <h2>{{ doc.title }}</h2>
    <form @submit.prevent="updateDoc">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        required
      />

      <label for="content">Contents</label>
      
      <!-- Code  editor if type is 'code' -->
      <div v-if="doc.type === 'code'">
        <Codemirror
          v-model="content"
          :options="cmOptions"
          :value="content"
          :key="doc?._id"
          @change="onEditorChange"
          style="height: 400px; border: 1px solid #ccc; border-radius: 8px; font-size: 35px;"
        />

        <!-- Run code -->
        <label>Code output:</label>
        <pre>{{ output }}</pre>

        <div class="button-group-run">
          <button type="button" @click="runCode">Run Code</button>
        </div>
      </div>

      <!-- Plain textarea if type is 'text' -->
      <textarea
        v-else
        id="content"
        v-model="content"
        required
      ></textarea>

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
import Codemirror from "codemirror-editor-vue3";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/midnight.css";
import api from "../services/api";

export default {
  name: "DocView",
  components: { Codemirror },
  data() {
    return {
      doc: null, // The document fetched from backend
      title: "",
      content: "",
      output: "",
      /* CodeMirror configuration options */
      cmOptions: {
        value: "",
        mode: "javascript",
        theme: "midnight",
        lineNumbers: true,
        lineWrapping: true,
      },
    };
  },

  /* Watch for changes in the routes document ID. */
  watch: {
    "$route.params.id": "fetchDoc",
  },

  /* Fetch the document as soon as component is mounted. */
  async mounted() {
    await this.fetchDoc();
  },

  methods: {
    /* Fetches a document from the API using the route param ID. */
    async fetchDoc() {
      try {
        const res = await api.get(`/${this.$route.params.id}`);
        this.doc = res.data.data;
        this.title = this.doc.title;
        this.content = this.doc.content;
      } catch (err) {
        console.error("Failed to fetch document:", err);
        this.doc = null;
      }
    },

    /* Sends an update request to the API to save changes made to the current document. */
    async updateDoc() {
      try {
        await api.post("/update", {
          id: this.$route.params.id,
          title: this.title,
          content: this.content,
        });
        await this.fetchDoc();
        alert("Document updated!");
      } catch (err) {
        console.error("Failed to update document:", err);
        alert("Could not update document.");
      }
    },

    /* Updates the local content when the CodeMirror editor changes. */
    onEditorChange(value) {
      this.content = value;
    },

    /* Runs the JavaScript code typed into the CodeMirror editor. */
    async runCode() {
      const code = this.content?.trim();
      if (!code) {
        this.output = "Code is empty!";
        return;
      }

      try {
        const res = await fetch("https://execjs.emilfolino.se/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: btoa(code) }),
        });
        const data = await res.json();
        const decoded = atob(data.data);

        /* Display output or error message if there's and error. */
        if (decoded.toLowerCase().includes("error")) {
          this.output = "⚠️ There was an error in your code. Please check your syntax.";
        } else {
          this.output = decoded;
        }

      } catch (err) {
        console.error("Error running code:", err);
        this.output = "Error executing code.";
      }
    },
  },
};
</script>
