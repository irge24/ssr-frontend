<template>
  <div>
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
import { onMounted, onUnmounted } from "vue"; // livscykelmetoder i Vue
import { io } from "socket.io-client"; // klientens anslutning

// Props & emits för v-model
const props = defineProps({ modelValue: String }); // content som skickas in
const emit = defineEmits(["update:modelValue"]); // uppdatera content

const SERVER_URL = "http://localhost:3000";
let socket = null;


// ansluta till servern, alla klienter får synkat content
onMounted(() => {
  socket = io(SERVER_URL);

  socket.on("content", (data) => {
    emit("update:modelValue", data);
  });
});

// koppla från
onUnmounted(() => {
  if (socket) socket.disconnect();
});

// trycka "rensa", synkas
function clear(e) {
  e.preventDefault();
  emit("update:modelValue", "");
  if (socket) socket.emit("content", "");
}

// uppdatera content som en användare skriver, synkas
function handleContentChange(e) {
  const value = e.target.value;
  emit("update:modelValue", value);
  if (socket) socket.emit("content", value);
}
</script>

// CSS
<style scoped>
textarea {
  width: 100%;
  height: 150px;
  padding: 8px;
  font-size: 24px;
  box-sizing: border-box;
}
</style>
