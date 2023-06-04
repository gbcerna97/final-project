require('dotenv').config();

export default {
  target: 'static',
  router: {
    base: '/bean&brew/'
  },
  axios: {
    // Base URL of the API
    baseURL: 'http://localhost:1337',
    // Headers to send with every request
    headers: {
      common: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  },

  auth: {
    // Options
    strategies: {
      local: {
        token: {
          property: 'jwt',
        },
        user: {
          property: false,
        },
        endpoints: {
          login: {
            url: 'http://localhost:1337/api/auth/local',
            method: 'post',
          },
          user: {
            url: 'http://localhost:1337/api/users/me',
            method: 'get',
          },
          logout: false,
        },
      },
    },
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Bean & Brew Cafe',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js', integrity: 'sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q', crossorigin: 'anonymous' },
      { src: '~/assets/js/vendor/bootstrap.min.js' },
      { src: '~/assets/js/easing.min.js' },
      { src: '~/assets/js/hoverIntent.js' },
      { src: '~/assets/js/superfish.min.js' },
      { src: '~/assets/js/jquery.ajaxchimp.min.js' },
      { src: '~/assets/js/jquery.magnific-popup.min.js' },
      { src: '~/assets/js/owl.carousel.min.js' },
      { src: '~/assets/js/jquery.sticky.js' },
      { src: '~/assets/js/jquery.nice-select.min.js' },
      { src: '~/assets/js/parallax.min.js' },
      { src: '~/assets/js/waypoints.min.js' },
      { src: '~/assets/js/jquery.counterup.min.js' },
      { src: '~/assets/js/mail-script.js' },
      { src: '~/assets/js/main.js' },
    ],
    __dangerouslyDisableSanitizersByTagID: { 'fb-customer-chat': ['innerHTML'] },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/linearicons.css',
    '~/assets/css/font-awesome.min.css',
    '~/assets/css/bootstrap.css',
    '~/assets/css/magnific-popup.css',
    '~/assets/css/nice-select.css',
    '~/assets/css/animate.min.css',
    '~/assets/css/owl.carousel.css',
    '~/assets/css/main.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios', mode: 'client' },
    { src: '~/plugins/bootstrap.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'defu'
    ]
  },
}
