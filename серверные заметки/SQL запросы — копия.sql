/*
  Есть консль на Open Server
  mysql -u root -p имя_базы

*/


show tables;

/*#########--------<{ РАБОТА С ТАБЛИЦЕЙ }>---------#########*/

--<{ ПОКАЗАТЬ ТАБЛИЦЫ }>

SHOW DATABASES;
SHOW COLUMNS FROM название_таблицы;

  Будет отображенно:
  field,type,key,defailt,extra 



--<{ СОЗДАТЬ ТАБЛИЦУ }>

 CREATE TABLE tutorials_tbl(
    tutorial_id INT NOT NULL AUTO_INCREMENT,
    tutorial_title VARCHAR(100) NOT NULL,
    tutorial_author VARCHAR(40) NOT NULL,
    submission_date DATE,
    PRIMARY KEY ( tutorial_id )
    );



--<{ ИЗМЕНИТЬ, СОЗДАТЬ КОЛОНКУ }>

  ALTER TABLE token AUTO_INCREMENT=1; - Сброс инкремента id

  ALTER TABLE `user` ADD `password` INT(32) NOT NULL AFTER `login`;//создать столбец
  ALTER TABLE `user` ADD `email` VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL AFTER `password`;



/**********************************************************************************************/
*****<{ ПРОЧИТАТЬ }>*****

SELECT колонка FROM таблица // колонки: * все, можно перечислить
SELECT таблица.колонка FROM таблица // есть такой вариант. закос ООП

для SELECT
  DISTINCT префикс колонке. убирает повторяющиеся записи
  CONCAT(колонка1+200,колонка2,колонка3); --соединит колонки.Арифметика так же влияет на колонку 
  AS новое имя колонки -- указывать можно существующее имя
  UPPER(колонка); --приведёт в верхний регистр колонку
  LOWER(колонка); --нижний регистр
  SQRT(колонка); --возведёт каждую строку в квадратный корень и выведет колонку
  AVG(колонка); --вернёт число среднего значения по всей колонке
  SUM(колонка); --вернёт сумму значения по всей колонке
  MIN(колонка); --вернёт минимальное значения по всей колонке
  MAX(колонка); --вернёт максимальное значение
  ORDER BY (ставиться после FROM таблица. фильр) колонка DESC ASC//можно перечислять
  TOP 1 - 1 верхний (в моём случае не работает на MariaDB)

Если попытаться получить последнюю строку в таблице глядя на её id, 
  то "SELECT max(id) FROM user" - получим лишь id максимального значения

  "SELECT * FROM token WHERE id=(SELECT max(id) FROM  token)" - так получим послеюнюю запись как положено


  Выборка из нескольких таблиц
    SELECT table1.ID, table1.Name, table2.ID, table2.City FROM table1, table2  WHERE table1.ID=table2.table1_id

  Таблицы ни каким волшебным образом не соединены, просто в table2 создана дополнительная колонка в которую указывают цифру,
  заведомо зная что под таким id в другой таблице нужный объект. Далее просто правильный запрос сыграет большую роль.
  Ключевая особенность запроса 
    WHERE table1.ID = table2.table1_id

    Данные колонок из 2х таблиц table1.ID, table1.Name, table2.ID, table2.City получим в том случае если id равны

  Есть сокращённая запись 
  SELECT table1.Name, table2.City FROM table1 INNER JOIN table2 ON table1.id = table2.id
  SELECT table1.Name, table2.City FROM table1 LEFT OUTER JOIN table2 ON table1.id = table2.id

	SELECT * FROM table1 INNER JOIN table2 USING(id) INNER JOIN table3 USING(id); можно использовать USING вместо ON table1.id = table2.id


    Пример: black_work = 12 объектов, cable_laying = 8
      SELECT * FROM black_work LEFT JOIN cable_laying ON black_work.id=cable_laying.id
        Запрос будет циклом проверять выражение ON table1.id = table2.id столько раз, сколько элементов находиться в левой колонке
        и при true будет возвращать найденый элемент из таблицы cable_laying, если  cable_laying id закончаться 
        LEFT JOIN продолжает перебирать пихать во временную таблицу но колонки с null значениями пока счётчик не закончился.
        В этом конкретно случае получаем 12 элементов из них 8 из таблицы cable_laying и 4 объекта с 


  SELECT table1.Name, table2.City FROM table1 RIGHT OUTER JOIN table2 ON table1.id = table2.id

ДЛЯ FROM

  LIMIT --лимит. 1пар кол-во, если 2й параметра. то 1й пропустить 2й кол-во  
  WHERE --критерий сортировки. колонка = 10. Работает с лог операторами. Принимает так же подзапросы
  WHERE --колонка > (SELECT колонка1 FROM таблица)
  LIKE '_'; --условный поиск. '_%s' - любой символ % - происзвольное кл-во символов,в конце s
  AS --сокращает имя таблицы для удобства, но саму тблицу не переименовывает FROM table1 AS t1 WHERE t1.id


лог операторы для WHERE почти те же. как работают
  WHERE column_name BETWEEN value1 AND value2;

  BETWEEN 1 AND 5; --между диаппазоном
  AND = '1 && 2'; --верно если оба верны 
  OR = '1 || 2'; --верно если один из 2х. AND 
  IN = '1 || 2 || 3 || 4'; --верно если какой-нибудь подходит. Нужен что бы не писать кучу ИЛИ
  NOT = '!='; --верно если выражение не верно
  NOW(); -- время на сервере

  Внимательно быть к запросам
  WHERE phone =89999992244 AND (role='admin' OR role='user');  --где телефон И либо это либо то
  WHERE phone =89999992244 AND role='admin' OR role='user';  --где телефон И вот это либо ещё то
  WHERE phone =89999992244 NOT IN(role='admin', role='user', role='gost');


IF NOT EXISTS


*****<{ ЗАПИСАТЬ }>*****

  INSERT INTO таблица(поле1, поле2, поле3) VALUES (‘London’, ‘Hoffman’, 2001);  
  INSERT INTO user(name) VALUE ('Вася'); - Запрос будет в "" строка в ''


*****<{ ОБНОВИТЬ ДАННЫЕ }>*****

  UPDATE token SET accsess_token = '417555'
  UPDATE таблица SET колонка = REPLACE(name, 'Масква', 'Москва'); - метод REPLACE меняет гдето, что-то, на что-то

  UPDATE название таблицы SET к какому столбцу что добавить login='Петя',... WHERE (где -это оператор условия). ID=1. 
  
  В mySQL знак != пишется так: <>
  В условии перед типом NULL требуется ставить IS NULL.


*** ПОЛЕ ВРЕМЯ И ДАТА***
  тип: TIMESTAMP по умолчанию->Выражение: CURENT_TIMESTAMP


*****<{ УДАЛИТЬ ДАННЫЕ }>*****

  DELETE FROM название таблицы WHERE условия ID=1
  DELETE FROM token WHERE access_token=222222222222222






