<script setup lang="ts">
defineProps<{
  id: string
  title: string
  body: string
}>()
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <h1 class="title">{{ id }}</h1>
    <h2 class="sub-title">{{ title }}</h2>
    <p class="content">{{ body }}</p>
  </div>
</template>

<style>
.title {
  text-decoration: underline;
}

.sub-title {
  color: blue;
}

.content {
  background-color: tomato;
  padding: 10px;
}

.button {
  outline: none;
  border: none;
  background-color: aquamarine;
  color: #000;
  padding: 10px;
}
</style>
