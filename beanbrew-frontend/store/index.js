// frontend/store/index.js
export const getters = {
  getToken: state => state.token,
  getUserId: state => state.auth.user.id,
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
  loggedInUser(state) {
    return state.auth.user
  },
}