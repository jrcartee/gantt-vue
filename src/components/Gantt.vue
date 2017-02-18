<template>

  <div id="Gantt-root" v-on:scroll="onScroll">

      <svg id="Gantt-scale" :width="width" :height="scaleHeight">
        <!-- Scale -->
        <g id="Gantt-scale-group">
          <!-- Top Border -->
          <line x1="0" y1="1" :x2="width" y2="1"/>

          <!-- Configured scales -->
          <g v-for="(uType, depth) in scaleConfig">
              <text 
                v-for="unitBlock in unitsVisible"
                v-if="scaleShouldPrint(uType, unitBlock)" 
                :x="scaleSpread(uType, unitBlock)" 
                :y="(scaleUnitH*(depth+1)) - 2">
              {{ scaleText(uType, unitBlock) }}</text>
            <line x1="0" :y1="scaleUnitH*(depth+1)" :x2="width" :y2="scaleUnitH*(depth+1)" />
          </g>
          
        </g>
      </svg>

      <svg id="Gantt-data" :width="width" :height="gridHeight">

        <g id="Gantt-bg-group">
          <!-- Borders -->
          <line x1="0" :y1="0" :x2="width" :y2="0"/>
          <line x1="0" :y1="0" x2="0" :y2="gridHeight"/>
          <line x1="0" :y1="gridHeight" :x2="width" :y2="gridHeight"/>
          <line :x1="width" :y1="0" :x2="width" :y2="gridHeight"/>

          <!-- Inner Grid -->
          <line 
            v-for="n in numTasks-1" 
            :x1="0" :y1="n*unitH" 
            :x2="width" :y2="n*unitH"/>
          <line 
            v-for="n in unitsVisible-1" 
            :x1="n*unitW" :y1="0" 
            :x2="n*unitW" :y2="gridHeight"/>
        </g>

        <g id="Gantt-task-group">
          <g v-for="(task, i) in tasks">
            <rect 
              :x="taskXPadding(task, startDate)" :y="taskYPadding(i)" 
              :width="taskWidth(task)" :height="unitH"
              rx="5" ry="5"/>
            <text 
              :x="textXPadding(task)" 
              :y="textYPadding(i)">{{ task.code }}</text>
          </g>
        </g>
      </svg>
    
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { getUnitsBetween, getWeekNumber, UNITS, SHORT_MONTHS, nth } from 'utils/date'
import getYear from 'date-fns/get_year'

const SCALE_HEIGHT = 15,
  UNIT_HEIGHT = 15,
  INIT_UNIT_WIDTH = 30,
  TEXT_PADDING_LEFT = 1;


export default {

  mounted: function() {
    Vue.nextTick(() => {
      this.updateDimensions(true);
    })    
  },
  
  data: function () {
    return {
      unitH: UNIT_HEIGHT,
      scaleUnitH: SCALE_HEIGHT, 
    }
  },

  computed: {
    unitW: function() {
      return INIT_UNIT_WIDTH * (this.scale.baseRatio/this.scale.zoomRatio)
    },
    width: function() {
      return this.unitsVisible * this.unitW
    },
    gridHeight: function() {
      return this.$store.getters.numTasks * UNIT_HEIGHT
    },
    scaleHeight: function() {
      return this.$store.getters.scaleConfig.length * SCALE_HEIGHT
    },
    totalHeight: function() {
      return this.gridHeight + this.scaleHeight
    },

    unitsVisible: function() {
      let s = this.$store.getters.startDate,
        f = this.$store.getters.finishDate,
        u = this.scale.units
      return getUnitsBetween(s, f, u) + 2;      
    },
    
    ...mapGetters([
      'startDate',
      'numTasks',
      'scaleConfig',
    ]),
    ...mapState([
      'tasks',
      'scale'
    ]),
  },

  methods: {
    dateForUnit (u, i) {      
      let d = new Date(this.startDate)
      switch(u) {
        case UNITS.DAYS:
          d.setDate(d.getDate() + i);
          break;
        case UNITS.WEEKS:
          d.setDate(d.getDate() + i*7);
          break;
        case UNITS.MONTHS:
          d.setMonth(d.getMonth() + i);
          break;
        case UNITS.YEARS:
          d.setMonth(d.getMonth() + i*12);
          break;
        default:
          throw new Error("Unexpected date unit type: " + u)
      }   
      return d;
    },
    dateStartsScale: function(u, i) {
      let d = this.dateForUnit(this.scale.units, i)
      switch(u) {
        case UNITS.DAYS:
          return true
        case UNITS.WEEKS:
          switch (this.scale.units) {
            case UNITS.DAYS:
              return d.getDay() === 0            
            case UNITS.WEEKS:
              return true
          }
        case UNITS.MONTHS:
          switch (this.scale.units) {
            case UNITS.DAYS:
              return d.getDate() === 1
            case UNITS.WEEKS:
              return d.getDate() >= 1 && d.getDate() <= 7
            case UNITS.MONTHS:
              return true
          }
        case UNITS.YEARS:
          return d.getMonth() === 0
        default:
          throw new Error("Unexpected date unit type: " + u)
      }
    },

    unitForDate (u, i) {

    },

    scaleText (u, i) {
      let d = this.dateForUnit(this.scale.units, i)
      switch(u) {
        case UNITS.DAYS:         
          let DoM = d.getDate()
          return String(DoM) //+ nth(DoM)
        case UNITS.WEEKS:
          return getWeekNumber(d)
        case UNITS.MONTHS:
          return SHORT_MONTHS[d.getMonth()]
        case UNITS.YEARS:
          return getYear(d)        
        default:
          throw new Error("Unexpected date unit type: " + u)
      }
    },
    scaleShouldPrint(u, i) {
      if (i === 1) return true
      return this.dateStartsScale(u, i)
    },
    scaleSpread(u, i) {
      let d = this.dateForUnit(u, i);      
      let numUnits = getUnitsBetween(this.startDate, d, u)
      return numUnits*this.unitW + TEXT_PADDING_LEFT
    },

    taskWidth (task) {
      let s = new Date(task.start_early),
        f = new Date(task.finish_early),
        dur;
      if (f < s) {
        dur = getUnitsBetween(f, s, this.scale.units)      
      } else {        
        dur = getUnitsBetween(s, f, this.scale.units)      
      }
      return this.unitW * (dur + 1);
    },

    taskXPadding: function (task) {
      let s = new Date(task.start_early),
        dur = getUnitsBetween(this.startDate, s, this.scale.units)
      return this.unitW * dur;      
    },
    taskYPadding: function (i) {
      return this.unitH*i
    },

    textXPadding: function (task) {
      return this.taskXPadding(task, this.startDate) + TEXT_PADDING_LEFT
    },
    textYPadding: function (i) {
      return this.unitH * (i+1)
    },

    onScroll: function() {
      let $scale = this.$el.querySelector('#Gantt-scale'),
        $root = this.$el;
      $scale.style.top = $root.scrollTop
      // this.setPan();
    },
    setPan: function() {
      let panRatio = this.$el.scrollLeft / this.$el.scrollWidth;

      let scale = this.$store.state.scale
      scale.panRatio = panRatio
      this.$store.commit('scale', scale)
    },


    updateDimensions: function(clearZoom) {
      let viewW = this.$el.clientWidth,
        totalW = this.width,
        currentPos = this.$el.scrollLeft,
        scale = this.$store.state.scale
      scale.baseRatio = viewW / totalW;
      scale.panRatio = currentPos;
      if (clearZoom) {
        scale.zoomRatio = scale.baseRatio
      }
      this.$store.commit('scale', scale)
    },
  },

  watch: {
    "scale.panRatio": function(val){
      this.$el.scrollLeft = this.$el.scrollWidth * val
    },
    "scale.units": function(){
      Vue.nextTick(() => this.updateDimensions(true))
    },
  },

}
</script>

<style>
#Gantt-root {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#Gantt-scale {  
  position: relative;
  top: 0;
  background-color: white;
  float: left;
}

#Gantt-scale-group text {
  font-size: 12px;
  fill: SteelBlue;
  font-weight: bold;
}
#Gantt-scale-group line {
  stroke-width: 0.7; 
  stroke: black;
}

#Gantt-bg-group line {
  stroke-width: 1.5;   
  stroke: lightgrey;
  stroke-opacity: 0.8;
  shape-rendering: crispEdges;
}
#Gantt-task-group rect {
  fill: SteelBlue;
  stroke-width: 0.5;
  stroke: black;
}
#Gantt-task-group text {
  fill: white;
  stroke: grey;
  font-weight: bold;
  font-size: 13px;
  /*font-family: impact;*/
  transform: translateY(-2px);
}
</style>
