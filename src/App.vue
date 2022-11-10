<template>
  <main>
    <div id="tomato-count">
      <span @click="store.setTomatoCount(1)" :class="{ 'active-tomato': store.tomatoCounter > 0 }">🍅</span>
      <span @click="store.setTomatoCount(2)" :class="{ 'active-tomato': store.tomatoCounter > 1 }">🍅</span>
      <span @click="store.setTomatoCount(3)" :class="{ 'active-tomato': store.tomatoCounter > 2 }">🍅</span>
      <span @click="store.setTomatoCount(4)" :class="{ 'active-tomato': store.tomatoCounter > 3 }">🍅</span>
    </div>
    <h1 id="timer">{{ store.currentTimerString }}</h1>
    <div id="stop-start">
      <button class="circle-button" @click="store.toggleTimer()">
        <ion-icon name="stopwatch-outline"></ion-icon>
      </button>
      <button class="circle-button" @click="store.resetTimer()">
        <ion-icon name="refresh-outline"></ion-icon>
      </button>
    </div>
    <div id="option-buttons">
      <button @click="store.shortBreakButton()">Short break</button>
      <button @click="store.longBreakButton()">Long break</button>
      <button @click="store.clearTomatoes()">Clear tomatoes</button>
    </div>
    <button id="settings-button" class="circle-button" @click="store.toggleOverlay()">
      <ion-icon name="settings-outline"></ion-icon>
    </button>
  </main>
  <div id="overlay" v-if="store.overlayOn">
    <Settings />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from './store'
import Settings from './Settings.vue'

const store = useStore()

onMounted(async () => {
  store.startFresh()
  store.getSettings()
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#tomato-count {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-grow: 0;
  gap: 1rem;
}

#tomato-count span {
  font-size: 2rem;
  filter: grayscale(1);
  cursor: pointer;
  transition: .3s all;
}

.active-tomato {
  filter: grayscale(0) !important;
}

#timer {
  font-size: 100px;
  margin: 0;
  font-family: monospace;
}

#stop-start {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

#option-buttons {
  display: flex;
  flex-direction: column;
}

#option-buttons button {
  width: 150px;
  margin-bottom: .5rem;
  padding: 10px 15px;
}

#overlay {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: .95;
}

#settings-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
}
</style>

