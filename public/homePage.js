//Реализация страницы «Личный кабинет пользователя»

//выход из лк
const logOut = new LogoutButton();
logOut.action = () => {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });
}

//Получение информации о пользователе
ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data)
  }
});

//Получение текущих курсов валюты
const ratesBoard = new RatesBoard();
function getRates() {
  ApiConnector.getStocks((response) => {
  if (response.success) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(response.data);
  }
 });
}
getRates();
setInterval(getRates, 60000);

//Операции с деньгами
const moneyManager = new MoneyManager;
moneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Успешное пополнение баланса");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
}

//конвертирование валюты
moneyManager.conversionMoneyCallback = function ({ fromCurrency, targetCurrency, fromAmount }) {
  ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Конвертация прошла успешно");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
}


//перевод валюты
moneyManager.sendMoneyCallback = function ({ to, currency, amount }) {
  ApiConnector.transferMoney({ to, currency, amount }, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Перевод выполнен");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
}


//Работа с избранным

const favoritesWidget = new FavoritesWidget;

//Запросите начальный список избранного
ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});


//Реализуйте добавления пользователя в список избранных
favoritesWidget.addUserCallback = function ({id, name}) {
  ApiConnector.addUserToFavorites({id, name}, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(true, "Пользователь добавлен в список избранных");
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
}

//Реализуйте удаление пользователя из избранного
favoritesWidget.removeUserCallback = function (id) {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(true, "Пользователь удален из избранного");
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
}