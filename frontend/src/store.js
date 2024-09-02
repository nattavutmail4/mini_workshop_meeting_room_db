import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:null,
    equipments: [],
    rooms:[],
    booking_histories: [],
    bookings:[]
  },
  mutations: {
    set_user:(state, user) => state.user = user,
    set_equipments: (state, equipments) => state.equipments = equipments,
    set_rooms :(state,rooms) => state.rooms = rooms,
    set_booking_histories: (state, booking_histories) => state.booking_histories = booking_histories,
    set_bookings : (state,bookings) => state.bookings = bookings
  },
  actions: {
    get_user_login:({ commit }) => axios.get('/api/account/userLogin').then(res => commit('set_user',res.data)),
    set_equipments: ({ commit }, params = {page:1}) => axios.get(`/api/equipment`,{params}).then(res => commit('set_equipments',res.data)),
    set_rooms: ({ commit }, params = {page:1}) => axios.get(`/api/rooms`,{params}).then(res => commit('set_rooms',res.data)),
    set_booking_rooms: ({ commit }, params = {page:1}) => axios.get(`/api/booking`,{params}).then(res => commit('set_rooms',res.data)),
    set_booking_histories: ({ commit }, params = { page: 1 }) => axios.get(`/api/booking/history`, { params }).then(res => commit('set_booking_histories', res.data)),
    set_bookings: ({ commit }, params = { page: 1 }) => axios.get(`/api/booking/history`, { params }).then(res => commit('set_bookings', res.data)),
  }
})
