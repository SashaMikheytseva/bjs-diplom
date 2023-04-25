//реализация страницы "вход и регистрация"

"use strict"
const userForm = new UserForm();
userForm.loginFormCallback = function(data) {
  ApiConnector.login(data, (response) => {
    if (response.success) {
      location.reload();
    } else {
      this.setLoginErrorMessage("Неверный пароль или логин");
    }
  });
}

userForm.registerFormCallback = function (data) {
  ApiConnector.register(data, (response) => {
    if (response.success) {
      location.reload();
    } else {
      this.setRegisterErrorMessage("Введены некорректные данные");
    } 
  });
}