import axios from "axios";

import constants from "../util/constants";

export default {
  postCreateAccount(firstname, lastname, email, pass) {
    axios
      .post(constants.BASE_URL + constants.PATHS.CREATE_ACCOUNT, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: pass,
      })
      .then(function (response) {
        console.log(response);
        window.location = "/auth";
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getLogin(email, password) {
    axios
      .get(constants.BASE_URL + constants.PATHS.LOGIN, {
        params: {
          email,
          password,
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem("email", email);
          window.location = "/filemanager";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  getLogout() {
    localStorage.clear();
  },
};
