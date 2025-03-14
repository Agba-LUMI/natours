import axios from "axios";
import { showAlert } from "./alerts";
export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Account Created successfully");
      window.setTimeout(() => {
        location.assign("/login"), 1500;
      });
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
