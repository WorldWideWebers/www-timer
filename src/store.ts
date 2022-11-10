import { defineStore } from "pinia";
import { initializeApp } from 'firebase/app'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useTitle } from '@vueuse/core'

const firebaseConfig = {
  apiKey: "AIzaSyCtNk_xsbfuNR1f-sUpoR2VPIOvJjI-784",
  authDomain: "timer-72ded.firebaseapp.com",
  projectId: "timer-72ded",
  storageBucket: "timer-72ded.appspot.com",
  messagingSenderId: "818376260741",
  appId: "1:818376260741:web:b3775b030f4a2e1a1ffdec"
};

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const title = useTitle()

let storageValue = localStorage.getItem("pomodoroMinutes");
const pomodoroMinutes = storageValue !== null ? parseInt(storageValue) : 25;
storageValue = localStorage.getItem("shortBreakMinutes");
const shortBreakMinutes = storageValue !== null ? parseInt(storageValue) : 5;
storageValue = localStorage.getItem("longBreakMinutes");
const longBreakMinutes = storageValue !== null ? parseInt(storageValue) : 15;
storageValue = localStorage.getItem("alarmSoundOn");
const alarmSoundOn = storageValue !== null ? storageValue == "true" : true;

export const useStore = defineStore("store", {
  state: () => {
    return {
      currentTimer: new Date(0),
      currentTimerString: "",
      timerGoing: false,
      tomatoCounter: 0,
      onBreak: false,
      currentInterval: 0,
      pomodoroMinutes: pomodoroMinutes,
      shortBreakMinutes: shortBreakMinutes,
      longBreakMinutes: longBreakMinutes,
      alarmSoundOn: alarmSoundOn,
      secondDuration: 1000,
      title: "www-timer",
      overlayOn: false,
    };
  },
  actions: {
    setCurrentTimer(date: Date) {
      this.currentTimer = date;
    },
    setPomodoroMinutes(minutes: number) {
      this.pomodoroMinutes = minutes;
    },
    setShortBreakMinutes(minutes: number) {
      this.shortBreakMinutes = minutes;
    },
    setLongBreakMinutes(minutes: number) {
      this.longBreakMinutes = minutes;
    },
    setAlarmSoundOn(alarmSoundOn: boolean) {
      this.alarmSoundOn = alarmSoundOn;
    },
    setTomatoCount(count: number) {
      this.tomatoCounter = count;
    },
    startFresh() {
      this.timerGoing = false;
      this.tomatoCounter = 0;
      this.onBreak = false;
      this.setTimer(this.pomodoroMinutes);
    },
    setTimer(numOfMinutes: number) {
      this.currentInterval = numOfMinutes;
      this.currentTimer = new Date(0);
      this.currentTimer.setMinutes(numOfMinutes);
      this.currentTimerString = this.currentTimer.toISOString().substr(14, 5);
    },
    determineNextBlock() {
      if (this.alarmSoundOn) {
        this.playAlarmSound();
      }
      if (this.tomatoCounter < 3) {
        if (this.onBreak) {
          this.onBreak = false;
          this.setTimer(this.pomodoroMinutes);
        } else {
          this.tomatoCounter++;
          this.onBreak = true;
          this.setTimer(this.shortBreakMinutes);
        }
      } else if (this.tomatoCounter === 3) {
        if (this.onBreak) {
          this.onBreak = false;
          this.setTimer(this.pomodoroMinutes);
        } else {
          this.tomatoCounter++;
          this.onBreak = false;
          this.setTimer(this.longBreakMinutes);
        }
      } else {
        this.startFresh();
      }
      this.startTimer();
    },
    startTimer() {
      this.timerGoing = true;
      const incrementSecond = setInterval(() => {
        if (this.timerGoing) {
          this.currentTimer.setSeconds(this.currentTimer.getSeconds() - 1);
          this.currentTimerString = this.currentTimer
            .toISOString()
            .substr(14, 5);
          title.value = this.currentTimerString;
        }
        if (this.currentTimer.getTime() === 0 || this.timerGoing === false) {
          clearInterval(incrementSecond);
          if (this.timerGoing) {
            // playAlarmSound()
            this.determineNextBlock();
          }
        }
      }, this.secondDuration);
    },
    stopTimer() {
      this.timerGoing = false;
    },
    toggleTimer() {
      if (!this.timerGoing) {
        this.startTimer()
      } else {
        this.stopTimer()
      }
    },
    resetTimer() {
      this.stopTimer();
      this.setTimer(this.pomodoroMinutes);
    },
    clearTomatoes() {
      this.stopTimer(),
        this.setTomatoCount(0),
        this.setTimer(this.pomodoroMinutes);
    },
    shortBreakButton() {
      this.stopTimer(), this.setTimer(this.shortBreakMinutes);
    },
    longBreakButton() {
      this.stopTimer(), this.setTimer(this.longBreakMinutes);
    },
    saveSettings(
      pomodoroMinutes: number,
      shortBreakMinutes: number,
      longBreakMinutes: number,
      alarmSoundOn: boolean
    ) {
      this.pomodoroMinutes = pomodoroMinutes;
      this.shortBreakMinutes = shortBreakMinutes;
      this.longBreakMinutes = longBreakMinutes;
      this.alarmSoundOn = alarmSoundOn;
      this.persistSettings();
      this.setTimer(this.pomodoroMinutes);
    },
    getSettings() {
      let storageValue = localStorage.getItem("pomodoroMinutes");
      this.setPomodoroMinutes(
        storageValue !== null ? parseInt(storageValue) : 25
      );
      storageValue = localStorage.getItem("shortBreakMinutes");
      this.setShortBreakMinutes(
        storageValue !== null ? parseInt(storageValue) : 5
      );
      storageValue = localStorage.getItem("longBreakMinutes");
      this.setLongBreakMinutes(
        storageValue !== null ? parseInt(storageValue) : 15
      );
      storageValue = localStorage.getItem("alarmSoundOn");
      this.setAlarmSoundOn(
        storageValue !== null ? storageValue == "true" : true
      );
    },
    toggleOverlay() {
      this.overlayOn = !this.overlayOn;
    },
    persistSettings() {
      localStorage.setItem("pomodoroMinutes", this.pomodoroMinutes.toString());
      localStorage.setItem(
        "shortBreakMinutes",
        this.shortBreakMinutes.toString()
      );
      localStorage.setItem(
        "longBreakMinutes",
        this.longBreakMinutes.toString()
      );
      localStorage.setItem("alarmSoundOn", this.alarmSoundOn.toString());
    },
    async playAlarmSound() {
      const alarmFileRef = ref(
        storage,
        'gs://timer-72ded.appspot.com/alarm.mp3'
      )
      const url = await getDownloadURL(alarmFileRef)
      const alarm = new Audio(url)
      alarm.play()
    },
  },
});
