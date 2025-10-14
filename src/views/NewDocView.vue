<template>
  <div>
    <h2>Create a new document</h2>
    <form @submit.prevent="createDoc">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        required
      >

      <label for="type">Type</label>
      <select id="type" v-model="type">
        <option value="text">Text</option>
        <option value="code">Code</option>
      </select>

      <label for="content">Contents</label>

      <!-- Code editor if type 'code' -->
      <div v-if="type === 'code'">
        <Codemirror
          v-model="content"
          :options="cmOptions"
          @change="onEditorChange"
          style="height: 500px; border: 1px solid #ccc; border-radius: 10px; font-size: 35px;"
        />

        <!-- Run code -->
        <label>Code output:</label>
        <pre>{{ output }}</pre>

        <div class="button-group-run">
          <button type="button" @click="runCode">Run Code</button>
        </div>
      </div>

      <!-- Normal textarea if type is 'text' -->
      <textarea
        v-else
        id="content"
        v-model="content"
        required
      ></textarea>

      <div class="button-group">
        <button type="submit">
          Create
        </button>
        <router-link to="/">
          <button type="button">
            Back
          </button>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import Codemirror from "codemirror-editor-vue3";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/midnight.css";
import api from "../services/api";

export default {
  name: "NewDocView",
  components: { Codemirror },
  data() {
    return {
      title: "",
      content: "",
      type: "text", // Determines if the document is plain text or code
      output: "", // stores the output after running code
      /* Configuration options for CodeMirror editor */
      cmOptions: { 
        mode: "javascript",
        theme: "midnight",
        lineNumbers: true,
        lineWrapping: true,
      }
    };
  },

methods: {
    /**
     * Triggered when CodeMirror content changes.
     * Updates the components 'content' variable in real time.
     */
    onEditorChange(value) {
      this.content = value;
    },

    /* Creates a new document via the API. */
    async createDoc() {
      await api.post("/", {
        title: this.title,
        content: this.content,
        type: this.type,
      });
      alert("Document created!");
      this.$router.push("/");
    },

    /* Runs the JavaScript code typed into the CodeMirror editor. */
    async runCode() {
      const code = this.content?.trim();
      if (!code) {
        this.output = "Code is empty!";
        return;
      }
      /* POST request */
      const res = await fetch("https://execjs.emilfolino.se/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: btoa(code) }),
      });
      const data = await res.json();

      /* Decode the Base64 response and display the output. */
      const decoded = atob(data.data);

      /* Display output or error message if there's and error. */
      if (decoded.toLowerCase().includes("error")) {
        this.output = "⚠️ There was an error in your code. Please check your syntax.";
      } else {
        this.output = decoded;
      }
    },
  },
};
</script>
