<template>
  <div>
    <label for="title-field">Titel</label>
    <input v-model="title">

    <label for="content-field">Innehåll</label>
    <textarea
      :value="content"
      @input="handleContentChange"
    ></textarea>

    <button id="print-message" @click="clear">Rensa</button>

    <div id="output-container">
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:1337";

const title = ref("");
const content = ref("");

let socket = null;

onMounted(() => {
  socket = io(SERVER_URL);

  socket.on("content", (data) => {
    content.value = data;
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});

function setTitle(value) {
  title.value = value;
}

function clear(e) {
  e.preventDefault();
  title.value = "";
  content.value = "";
}

function handleContentChange(e) {
  const value = e.target.value;
  content.value = value;
  if (socket) socket.emit("content", value);
}
</script>

<style scoped>
textarea {
  width: 100%;
  height: 150px;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
}
</style>