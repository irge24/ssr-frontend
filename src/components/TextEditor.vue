<template>
  <div>
    <label for="content-field">Innehåll</label>
    <textarea
      :value="modelValue"
      @input="handleContentChange"
    ></textarea>

    <button id="print-message" @click="clear">Rensa</button>

    <div id="output-container">
      <p>{{ modelValue }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";

// Props & emits för v-model
const props = defineProps({ modelValue: String });
const emit = defineEmits(["update:modelValue"]);

const SERVER_URL = "http://localhost:3000";
let socket = null;

onMounted(() => {
  socket = io(SERVER_URL);

  socket.on("content", (data) => {
    emit("update:modelValue", data);
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});

function clear(e) {
  e.preventDefault();
  emit("update:modelValue", "");
}

function handleContentChange(e) {
  const value = e.target.value;
  emit("update:modelValue", value);
  if (socket) socket.emit("content", value);
}
</script>

<style scoped>
textarea {
  width: 100%;
  height: 150px;
  padding: 8px;
  font-size: 24px;
  box-sizing: border-box;
}
</style>
