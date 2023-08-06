<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')

const wadlist = [
  {
    id: 1,
    name: 'Ancient Aliens',
    thumbnailURL: 'testThumb.png',
    authors: ['Skillsaw'],
    description: 'A megawad for Doom II'
  },
  {
    id: 2,
    name: 'Ancient Aliens',
    thumbnailURL: 'testThumb.png',
    authors: ['Skillsaw'],
    description: 'A megawad for Doom II'
  },
  {
    id: 3,
    name: 'Ancient Aliens',
    thumbnailURL: 'testThumb.png',
    authors: ['Skillsaw'],
    description: 'A megawad for Doom II'
  },
]

</script>

<template>
  <div>
    <h6>
      Search page
    </h6>

    <q-input outlined v-model="searchText" label="Enter a search term" dark />

    <q-list bordered dark>
      <q-item v-for="wad in wadlist" :key="wad.id" class="q-my-xs" clickable>
        <q-item-section>
          <q-img
            :src="wad.thumbnailURL"
            spinner-color="red"
            style="max-height: 140px"
            fit="contain"
          />
        </q-item-section>

        <q-item-section style="min-width: auto;" class="q-px-lg">
          <q-item-label>{{ wad.name }}</q-item-label>
          <q-item-label caption lines="1">
            {{ wad.authors.join(', ') }}
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label caption>{{ wad.description }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn icon="download" color="green" clickable />
        </q-item-section>
      </q-item>
    </q-list>

  </div>
</template>

<style scoped>

</style>
