// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { model } from './stores/gantt'


import App from './App'

Vue.component('anchored-heading', {
  render: function (h) {
    return h(
      'h' + this.level,   // tag name
      this.$slots.default // array of children
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})

Vue.component('count-display', {
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  render: function (h) {
    return h('h3', {}, [this.count])
  }
})

Vue.component('count-trigger', {
  render: function (h) {
    return h('input', {
      attrs: {
        type: 'button'
      },
      on: {
        click: () => this.$store.commit('increment')
      }
    }, this.$slots.default)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#content',
  store: model,
  template: `
    <App/>
  `,
      // <anchored-heading :level=1>On Top?</anchored-heading>
      // <count-trigger>Hit Me</count-trigger>
      // <count-display/>
  components: { App }
})
