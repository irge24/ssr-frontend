<template>
  <div v-if="doc">
    <div v-if="message" class="message">{{ message }}</div>
    <h2>{{ doc.title }}</h2>

    <!-- Edit form -->
    <form @submit.prevent="updateDoc" v-if="canEdit">
      <label for="title">Title</label>
      <input id="title" v-model="title" required />

      <label for="content">Contents</label>

      <!-- Code editor if type is 'code' -->
      <div v-if="doc.type === 'code'">
        <Codemirror
          :value="content"
          :options="cmOptions"
          @input="onEditorChange"
          style="height: 400px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.3rem;"
        />
        <label>Code output:</label>
        <pre>{{ output }}</pre>

        <div class="button-group-run">
          <button type="button" @click="runCode">Run Code</button>
        </div>
      </div>

      <!-- Plain textarea for text type -->
      <div v-else>
        <TextEditor v-model="content" />
      </div>

      <div class="button-group">
        <button type="submit">Update</button>
        <router-link to="/"><button type="button">Back</button></router-link>
      </div>
    </form>

    <!-- If user can't edit -->
    <p v-else>
      You have read-only access to this document.
    </p>

    <!-- Share section (only owners can share) -->
    <div v-if="isOwner && userEmail" class="share-section">
      <h3>Share this document</h3>
      <form @submit.prevent="shareDoc">
        <input
          v-model="shareEmail"
          type="email"
          placeholder="Enter email"
          required
        />
        <button type="submit">Share</button>
      </form>
      <p v-if="shareMessage" :class="{ success: shareSuccess, error: !shareSuccess }">
        {{ shareMessage }}
      </p>
    </div>
  </div>

  <!-- Loading message -->
  <p v-else>Loading document...</p>
</template>

<script>
import Codemirror from "codemirror-editor-vue3";
import TextEditor from '../components/TextEditor.vue'
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/midnight.css";
import { getUserEmail } from "@/services/auth.mjs";
import api from "../services/api";
import { onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";
let socket = null;

export default {
  name: "DocView",
  components: { Codemirror, TextEditor },

  data() {
    return {
      doc: null,
      title: "",
      content: "",
      output: "",
      shareEmail: "",
      shareMessage: "",
      shareSuccess: false,
      canEdit: false,
      isOwner: false,
      userEmail: "",
      message: "",
      cmOptions: {
        mode: "javascript",
        theme: "midnight",
        lineNumbers: true,
        lineWrapping: true,
      },
    };
  },

  watch: {
    // Refetch document with route ID changes
    "$route.params.id": "fetchDoc",
  },

  async mounted() {
    await this.fetchDoc();

    socket = io(SERVER_URL);
    socket.on("content", (data) => {
      this.content = data;
    });
  },

  beforeUnmount() {
    if (socket) socket.disconnect();
  },

  methods: {
    // Get documents from the API
    async fetchDoc() {
      try {
        const res = await api.get(`/posts/${this.$route.params.id}`);
        this.doc = res.data.data;

        if (!this.doc) {
          this.title = "";
          this.content = "";
          this.isOwner = false;
          this.canEdit = false;
          return;
        }

        this.title = this.doc.title;
        this.content = this.doc.content;
        this.userEmail = getUserEmail();

        // Check if user is the owner
        this.isOwner = 
          this.userEmail &&
          this.doc.owner?.toLowerCase().trim() === this.userEmail;

        // canEdit if:
        // 1. owner
        // 2. shared collaborator
        // 3. document is public (owner null) => logged-in users can edit
        this.canEdit =
          this.isOwner ||
          (this.userEmail &&
            this.doc.sharedWith?.map(e => e.toLowerCase().trim()).includes(this.userEmail)) ||
          this.doc.owner == null;

      } catch (err) {
        console.error("Failed to fetch document:", err);
        this.doc = null;
        this.title = "";
        this.content = "";
        this.isOwner = false;
        this.canEdit = false;
      }
    },

    // Save updates to the document
    async updateDoc() {
      if (!this.canEdit) {
        this.message = "You don't have permission to edit this document.";
        return;
      }

      try {
        await api.post("/posts/update", {
          id: this.$route.params.id,
          title: this.title,
          content: this.content,
        });
        this.message = "Document updated!";
  
        this.doc.title = this.title;
        this.doc.content = this.content;
      } catch (err) {
        console.error("Failed to update document:", err);
        this.message = "You must be logged in to update a document!";
      }
    },

    // Handle input from CodeMirror
    onEditorChange(value) {
      this.content = value;
      if (socket) socket.emit("content", value);
    },

    // Run JavaScript code using external API
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

        this.output = decoded.toLowerCase().includes("error")
          ? "⚠️ There was an error in your code. Please check your syntax."
          : decoded;
      } catch (err) {
        console.error("Error running code:", err);
        this.output = "Error executing code.";
      }
    },

    // Share document with another user
    async shareDoc() {
      this.shareMessage = "";
      this.shareSuccess = false;

      const userEmail = getUserEmail();

      if (!userEmail) {
        this.shareMessage = "You must be logged in to share documents.";
        return;
      }

      if (!this.isOwner) {
        this.shareMessage = "Only the document owner can share this document.";
        return;
      }

      try {
        const res = await api.post("/posts/share", {
          docId: this.doc._id,
          shareWithEmail: this.shareEmail,
        });

        if (res.data.modifiedCount > 0) {
          this.shareMessage = `Document shared with ${this.shareEmail}! Invitation sent.`;
          this.shareSuccess = true;
          this.shareEmail = "";
          await this.fetchDoc();
        } else {
          this.shareMessage = "Could not share document. Are you the owner or already have rights to edit?";
        }
      } catch (err) {
        console.error("Error sharing document:", err);
        this.shareMessage = "An error occurred while sharing.";
      }
    },
  },
};
</script>
