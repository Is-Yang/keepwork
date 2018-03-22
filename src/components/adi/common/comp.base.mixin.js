import _ from 'lodash'
import compDefaultProperties from './comp.properties'

export default {
  props: {
    source: Object,
    options: Object,
    editorMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    properties() {
      if (!this.sourceData) {
        this.sourceData = _.merge(
          compDefaultProperties[this.$options.name] || {},
          this.source || {}
        )
      }
      return this.sourceData
    }
  },
  methods: {
    generateStyleString(style) {
      let string = ''

      _.forEach(style, (value, key) => {
        string = string + key + ':' + value + ';'
      })

      return string
    },
    px2rem(px) {
      let rem = 100

      return parseInt(px) / rem + 'rem'
    }
  }
}
