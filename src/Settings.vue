<template>
    <div id="overlay-content">
        <span>
            <label>Pomodoro minutes</label>
            <input v-model="pomodoroMinutes" type="number" required />
        </span>
        <span>
            <label>Short break</label>
            <input v-model="shortBreakMinutes" type="number" required />
        </span>
        <span>
            <label>Long break</label>
            <input v-model="longBreakMinutes" type="number" required />
        </span>
        <span>
            <label>Alarm volume</label>
            <select v-model="alarmVolume">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </span>
        <span>
            <label>Alarm sound</label>
            <input type="checkbox" v-model="store.alarmSoundOn" />
        </span>
        <span id="save-settings">
            <button @click="saveSettings()">Save settings</button>
        </span>
        <button class="circle-button" id="close-button" @click="closeOverlay()">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useStore } from './store'

const store = useStore()
const pomodoroMinutes = ref(store.pomodoroMinutes)
const shortBreakMinutes = ref(store.shortBreakMinutes)
const longBreakMinutes = ref(store.longBreakMinutes)
const alarmVolume = ref(store.alarmVolume);
const alertText = "Minutes cannot exceed 59";

const saveSettings = () => {
    if (pomodoroMinutes.value > 59) {
        pomodoroMinutes.value = store.pomodoroMinutes
        alert(alertText)
    } else if (shortBreakMinutes.value > 59) {
        shortBreakMinutes.value = store.shortBreakMinutes
        alert(alertText)
    } else if (longBreakMinutes.value > 59) {
        longBreakMinutes.value = store.longBreakMinutes
        alert(alertText)
    } else {
        store.saveSettings(pomodoroMinutes.value, shortBreakMinutes.value, longBreakMinutes.value, alarmVolume.value, store.alarmSoundOn)
        closeOverlay()
    }
}

const closeOverlay = () => {
    store.toggleOverlay()
}
</script>

<style>
#overlay-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: white;
}

#overlay-content span {
    margin-bottom: 1rem;
    font-size: .85rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 250px;
}

input[type=number],
select {
    border-radius: 0;
    padding: 5px;
    border: none;
}

input[type=number] {
    height: 25px;
    width: 45px;
}

#save-settings {
    justify-content: flex-end !important;
}

#close-button {
    position: fixed;
    top: 1rem;
    right: 1rem;
}
</style>