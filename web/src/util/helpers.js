export default {
  isLoggedIn() {
    return localStorage.getItem('user_id') != null;
  },
  setLoggedIn(user_id) {
    localStorage.setItem('user_id', user_id);
  }
}