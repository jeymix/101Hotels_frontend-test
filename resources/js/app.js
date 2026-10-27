import Vue from 'vue'

// Main pages
import App from './views/app.vue'
import store from './store'

const app = new Vue({
    el: '#app',
    store,
    components: { App }
})