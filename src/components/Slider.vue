<template>
  <div>
    <div id="Slider-wrapper"></div>
    <div id="Slider-Scale">
      <input type="radio" name="scale_units" :value="UNITS.DAYS" v-bind:checked="units==0" v-on:change="setUnits($event.target.value)">Days
      <input type="radio" name="scale_units" :value="UNITS.WEEKS" v-bind:checked="units==1" v-on:change="setUnits($event.target.value)">Weeks
      <input type="radio" name="scale_units" :value="UNITS.MONTHS" v-bind:checked="units==2" v-on:change="setUnits($event.target.value)">Months
    </div>
    <div>
    Current Units: {{ units }}
    </div>
  </div>
</template>


<script>
  import { mapState } from 'vuex'
  import noUiSlider from 'nouislider'
  import { formatDate, UNITS } from "utils/date"

  function timestamp(str) {
    return new Date(str).getTime();
  }

  export default {

    mounted () {
      this.slider = noUiSlider.create(this.$el.querySelector('#Slider-wrapper'), {
        start: this.initValue,
        connect: true,
        behaviour: 'drag',
        // step: 1000 * 60 * 60 * 24,
        range: {
          'min': this.min,
          'max': this.max
        },
        margin: this.margin,
        limit: this.limit,
        formatter: this.formatter,
      })
      this.slider.on('change', () => {this.setZoom(); this.setPan()})
    },
    data () {
      let min = this.$store.getters.startDate.getTime(),
        max = this.$store.getters.finishDate.getTime(),
        y = this.$store.state.scale.baseRatio;
      return {
        initValue: [min, y],
        min,
        max,
        UNITS,
        formatter: function (value) {
          let d = new Date(value)
          return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear()
        }
      }
    },

    computed: {
      ...mapState([
        'scale',
      ]),
      ...mapState({
        units: function(state){
          return state.scale.units
        },
        margin: function(state) {
          let margin = (0.5 * state.scale.baseRatio * this.range);
          return margin
        },
        limit: function(state) {
          return 2* state.scale.baseRatio * this.range;
               
        },
        range: function(state) { 
          return this.max - this.min
        },
      }),
    },

    methods: {
      setUnits: function(val) {
        let scale = this.$store.state.scale
        scale.units = Number(val)
        this.$store.commit('scale', scale)
      },
      setZoom: function() {
        let val = this.slider.get()
        let setRange = val[1] - val[0],
          ratio = setRange/this.range;
        let scale = this.$store.state.scale
        scale.zoomRatio = ratio
        this.$store.commit('scale', scale)
      },
      setPan: function() {
        let val = this.slider.get()[0],
          diff = val - this.min,
          panRatio = diff / this.range;

        let scale = this.$store.state.scale
        scale.panRatio = panRatio
        this.$store.commit('scale', scale)

      },
      setValue: function(val) {
        this.slider.set(val)
        this.setZoom()
      }
    },

    watch: {
      margin: function(val) {
        this.slider.updateOptions({
          'margin': val
        }, true)
      },
      limit: function(val) {
        this.slider.updateOptions({
          'limit': val
        }, true)
      },
      "scale.units": function() {

      },
      "scale.panRatio": function(val) {
        let left = this.range * val,
          current = this.slider.get(),
          diff = (current[1] - current[0]),
          right = Math.min(left + diff, this.max)
        // this.setValue([left, right])
      }
    },


    destroyed: function() {
      this.slider.off()
      this.slider.destroy()
    },

    components: {
    }
  }
</script>


<style>
  @import '~nouislider/distribute/nouislider.min.css';
  .noUi-horizontal .noUi-handle {
    width: 12px;
    height: 20px;
    left: -6px;
    top: -2px;
  }
  .noUi-handle:after, .noUi-handle:before {
    left: 3px;
    top: 2px;
  }
  .noUi-handle:before {
    left: 3px;
  }
  .noUi-handle:after {
    left: 6px;
  }
</style>