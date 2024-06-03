<script setup lang="ts">
async function onSubmit(event: Event) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const id = formData.get('id')

  await fetch('/api/posts', {
    method: id ? 'PATCH' : 'POST',
    body: formData
  })

  form.reset()
}
</script>

<template>
  <form @submit="onSubmit">
    <label>
      ID
      <input type="string" name="id" id="id" />
    </label>

    <label for="title">
      Title
      <input type="text" name="title" id="title" required />
    </label>

    <label>
      Body
      <input type="text" name="body" id="body" required />
    </label>

    <button type="submit">Submit</button>
  </form>
</template>
