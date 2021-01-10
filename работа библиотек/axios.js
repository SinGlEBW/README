/*eslint-disable*/
import axios from "axios";

/*
  1. Запросы возвращают Promise
  2. Работает как со стороны клиента так и на серверной части NodeJS
*/
axios
  /* param или auery строку можно передавать прямо в url или удобней через option  */
  .get(url, option);
option = {
    param: {
      ID: 12345
    } //тот же url '.../user?ID=12345'
  }

  /*
    В названиях можно запутаться.
    query - на сервере это объект который получим из get запроса после ?name="Вася"&family="Печкин"
    param - на сервере это тоже объект, но ключи определяются на сервере, а значения это путь url
            .../:phone/:modal    с клиента ожидаем .../redmi/note7   

    В axios в options ключ params - это по факту query
  */

  .post(url, data, option);

//Запросы можно делать так
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
//методы
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
/* Общие настройки для всех запросов. */
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {
    'X-Custom-Header': 'foobar'
  }
});
//методов чуть больше
instance.request(config)
instance.get(url[, config])
instance.delete(url[, config])
instance.head(url[, config])
instance.options(url[, config])
instance.post(url[, data[, config]])
instance.put(url[, data[, config]])
instance.patch(url[, data[, config]])
instance.getUri([config])





