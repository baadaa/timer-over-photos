module.exports = ({options, env}) => ({
  plugins: {
    'autoprefixer': {'browsers': ['> 1%', 'last 2 versions']
    },
    'cssnano': {}
  }
})