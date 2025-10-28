<template>
  <div>
    <textarea v-model="content" placeholder="Skriv något här..."></textarea>
    <p>Du skrev: {{ content }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const content = ref("");
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
