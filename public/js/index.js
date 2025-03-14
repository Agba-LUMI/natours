// import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { updateUserData, updateUserPassword } from "./updateSetting";
import { bookTour } from "./paystack";
import { signUp } from "./signup";

import { login, logout } from "./login";
const updateUserPasswordForm = document.querySelector(".form-user-password");
const signUpForm = document.querySelector(".form--signedUp");
const loginForm = document.querySelector(".form--loggedIn");
const updateUserDataForm = document.querySelector(".form-user-data");
const logOutBtn = document.querySelector(".nav__el--logout");
const bookBtn = document.querySelector("#book-tour");
// Login Initialization
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
// Sign up initialization
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    signUp(name, email, password, passwordConfirm);
  });
}
// Log out Initiliazation
if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (updateUserDataForm)
  updateUserDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const photo = document.getElementById("photo").files[0];
    updateUserData(name, email, photo);
  });

// User to update password
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

// The Booking Initialization

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
