import '@/common/bootstrap'
import './index.scss'
import Vue from 'vue'
import Welcome from '@/components/Welcome.vue'

new Vue({
    el: '#app',
    render: (h) => h(Welcome)
});
