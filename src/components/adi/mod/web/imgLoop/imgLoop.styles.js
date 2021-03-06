export default [
  // style 0
  {
    data: {
      // 定义mod根div的样式
      root: {
        position: 'relative',
        overflow: 'hidden',
        zoom: 1
      }
    },
    theme: {
      root: ['mod-space']
    },
    options: {
      theme: {},
      config: {
        imgLoop: {
          height: '150px'
        }
      }
    },
    cover: require('@/../static/adi/imgLoop/thumbnail.png')
  },

  // style 1
  {
    theme: {
      root: ['mod-space']
    },
    cover: require('@/../static/adi/imgLoop/thumbnail.png')
  }
]
