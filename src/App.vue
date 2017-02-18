<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div id="slider-wrapper">
      <Slider/>
    </div>
    <div id="gantt-wrapper">
      <Gantt/>
    </div>
  </div>
</template>

<script>
import './includes.css'
import Gantt from './components/Gantt'
import Slider from './components/Slider'

export default {
  name: 'app',
  components: {
    Gantt, Slider
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  margin-left: 30px;
  height: 100%;
  width: 100%;
}
#slider-wrapper {
  width: 50vw;
  height: 10vh;
  margin-bottom: 30px;
}
#gantt-wrapper {
  width: 50vw;
  height: 60vh;
  /*overflow: auto;*/
}
</style>
