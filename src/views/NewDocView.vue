<template>
  <div>
    <div v-if="message" class="message">{{ message }}</div>
    <h2>Create a new document</h2>

    <!-- Form for create a new document -->
    <form @submit.prevent="createDoc">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        required
      >

      <label for="type">Type</label>
      <!-- Choose between text or code document -->
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

        <!-- Run code button -->
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
      message: "",
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
    // Runs when user types in CodeMirror
    onEditorChange(value) {
      this.content = value;
    },

    // Creates a new document using the API
    async createDoc() {
      try {
        const token = localStorage.getItem("token");         // Check if user is logged in
        const endpoint = token ? "/posts" : "/posts/public"; // guests go to /posts/public

        const payload = {
          title: this.title,
          content: this.content,
          type: this.type,
        };

        await api.post(endpoint, payload); // Send data to backend

        this.message = "✅ Document successfully created! Redirecting...";

        // Wait 3 seconds, then redirect
        setTimeout(() => {
          this.message = "";
          this.$router.push("/"); // redirect after showing message
        }, 3000);

      } catch (err) {
        this.message = "❌ Could not create document. Please try again.";
        setTimeout(() => this.message = "", 3000);
      }
    },

    // Runs the JavaScript code typed into the CodeMirror editor
    async runCode() {
      const code = this.content?.trim();
      if (!code) {
        this.output = "Code is empty!";
        return;
      }

      const res = await fetch("https://execjs.emilfolino.se/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: btoa(code) }),
      });
      const data = await res.json();

      // Decode the Base64 response and display the output
      const decoded = atob(data.data);

      // Display output or error message if there's an error
      if (decoded.toLowerCase().includes("error")) {
        this.output = "⚠️ There was an error in your code. Please try again.";
      } else {
        this.output = decoded;
      }
    },
  },
};
</script>
