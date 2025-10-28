<template>
  <div>
    <label>Titel</label>
    <input v-model="title" />

    <label>Innehåll</label>
    <textarea
      :value="content"
      @input="handleContentChange"
    ></textarea>

    <button @click="clear">Rensa</button>

    <div id="output-container">
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { io } from "socket.io-client"

const SERVER_URL = "http://localhost:1337"
const docId = "demo-doc" // Här kan du byta mot MongoDB _id

const title = ref("")
const content = ref("")
let socket = null
let updatingFromSocket = false

onMounted(() => {
  socket = io(SERVER_URL)

  // Join document room
  socket.emit("create", docId)

  // Lyssna på uppdateringar från andra
  socket.on("doc", (data) => {
    updatingFromSocket = true
    content.value = data.content
    title.value = data.title
    updatingFromSocket = false
  })
})

onUnmounted(() => {
  if (socket) socket.disconnect()
})

function handleContentChange(e) {
  if (updatingFromSocket) return
  const value = e.target.value
  content.value = value

  // Skicka uppdatering med docId
  socket.emit("doc", { _id: docId, content: content.value, title: title.value })
}

function clear(e) {
  e.preventDefault()
  title.value = ""
  content.value = ""
  socket.emit("doc", { _id: docId, content: "", title: "" })
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
