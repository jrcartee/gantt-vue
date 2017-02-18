import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { TASKS, LINKS } from 'data'
import { getUnitsBetween, sort, UNITS } from 'utils/date'

const SCALE_CONFIGS = {
  0: [UNITS.MONTHS, UNITS.WEEKS, UNITS.DAYS],
  1: [UNITS.MONTHS, UNITS.WEEKS],
  2: [UNITS.YEARS, UNITS.MONTHS],
};

export const model = new Vuex.Store({
  state: {
    count: 0,
    tasks: TASKS.sort(function(a,b) {
      return sort(a.start_early, b.start_early)
    }),
    links: LINKS,

    scale: {      
      units: UNITS.DAYS,
      panRatio: 0,
      zoomRatio: 1,
      baseRatio: 1,
    },
  },

  getters: {
    numTasks: state => {
      return state.tasks.length
    },

    startDate: state => {
      let start = state.tasks.reduce(function(min, cur) {
        let tmp1 = min instanceof Date ? min : new Date(min.start_early),
            tmp2 = new Date(cur.start_early);
        return tmp1 < tmp2 ? tmp1 : tmp2;
      });
      return start
    },
    finishDate: state => {
      let finish = state.tasks.reduce(function(max, cur) {
        let tmp1 = max instanceof Date ? max : new Date(max.finish_early),
            tmp2 = new Date(cur.finish_early);
        return tmp1 > tmp2 ? tmp1 : tmp2;
      });
      return finish
    },
    scaleConfig : state => SCALE_CONFIGS[state.scale.units]
  },

  mutations: {
    scale (state, {units, panRatio, zoomRatio, baseRatio}) {
      state.scale.units = units 
      state.scale.panRatio = panRatio
      state.scale.zoomRatio = zoomRatio
      state.scale.baseRatio = baseRatio
    },
  }
})
