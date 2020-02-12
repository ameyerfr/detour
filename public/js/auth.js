const registerForm = document.getElementById("form-register");
const inputEmail = document.getElementById("email");
const EmailTextFeedback = document.getElementById("email-text-feedback");
const EmailVisualFeedback = document.getElementById("email-visual-feedback");
const inputPassword = document.getElementById("password");
const PasswordTextFeedback = document.getElementById("password-text-feedback");
const PasswordVisualFeedback = document.getElementById("password-visual-feedback");
const SubmitFormBtn = document.getElementById("submit-form");
let validEmail = false,
  validPassword = false;

if (registerForm) {
  inputEmail.oninput = checkEmailInput;
  inputPassword.oninput = checkPasswordInput;
}

function checkEmailInput(e) {
  EmailVisualFeedback.classList.remove("is-hidden");
  if (e.target.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    inputEmail.className = "input is-success";
    EmailVisualFeedback.firstElementChild.className = "fas fa-check";
    EmailTextFeedback.className = "help is-visible is-success";
    EmailTextFeedback.textContent = "This email is valid";
    validEmail = true;
  } else {
    inputEmail.className = "input is-danger";
    EmailVisualFeedback.firstElementChild.className = "fas fa-exclamation-triangle";
    EmailTextFeedback.className = "help is-visible is-danger";
    EmailTextFeedback.textContent = "This email is not valid";
    validEmail = false;
  }
  checkFormValidity();
}

function checkPasswordInput(e) {
  PasswordVisualFeedback.classList.remove("is-hidden");
  if (inputPassword.validity.valid) {
    inputPassword.className = "input is-success";
    PasswordVisualFeedback.firstElementChild.className = "fas fa-check";
    PasswordTextFeedback.className = "help is-visible is-success";
    PasswordTextFeedback.textContent = "This password is valid";
    validPassword = true;
  } else {
    inputPassword.className = "input is-danger";
    PasswordVisualFeedback.firstElementChild.className = "fas fa-exclamation-triangle";
    PasswordTextFeedback.className = "help is-visible is-danger";
    PasswordTextFeedback.textContent = "Your password should contains 6 to 10 letters or numbers only";
    validPassword = false;
  }
  checkFormValidity();
}

function checkFormValidity(e) {
  if (validEmail && validPassword) SubmitFormBtn.disabled = false;
  else SubmitFormBtn.disabled = true;
}
