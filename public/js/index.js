// import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { updateUserData, updateUserPassword } from "./updateSetting";
import { bookTour } from "./paystack";

import { login, logout } from "./login";
const updateUserPasswordForm = document.querySelector(".form-user-password");

const loginForm = document.querySelector(".form--login");
const updateUserDataForm = document.querySelector(".form-user-data");
const logOutBtn = document.querySelector(".nav__el--logout");
const bookBtn = document.querySelector("#book-tour");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (updateUserDataForm)
  updateUserDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const photo = document.getElementById("photo").files[0];
    updateUserData(name, email, photo);
  });
if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn-save-password").innerHTML = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateUserPassword(passwordCurrent, password, passwordConfirm);
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
    document.querySelector(".btn-save-password").innerHTML = "Save password";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.innerHTML = "Processing...";
    const tourId = e.target.dataset.tourId;
    if (tourId) {
      bookTour(tourId);
    } else {
      console.error("Tour ID not found!");
    }
    e.target.innerHTML = "Book tour now!";
  });
}
