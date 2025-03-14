// import axios from "axios";
import axios from "axios";
import { showAlert } from "./alerts";

export const updateUserData = async (name, email, photo) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data: {
        name,
        email,
        photo,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Data is successfully Updated");
      window.setTimeout(() => {
        location.assign("/me");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    window.setTimeout(() => {
      location.assign("/me");
    }, 2000);
  }
};
export const updateUserPassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PUT",
      url: "/api/v1/users/updateMyPassword",
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Password is successfully Updated");
      window.setTimeout(() => {
        location.assign("/me");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
