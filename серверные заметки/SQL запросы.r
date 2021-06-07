Подсказки консоли 
  \h - Помощь
  \c - Clear
  \s - status server
  \q - exit
  \T C:/mysql/logs.log - можно сохранять данные которые были введены в консоль 
  \t отключает сохраненеие логов

  \. C:/mysql/myFile.sql  - можно написать sql в файле и открыть через консоль, файл отработает

  \u база или use база - переключение между базами данных


Подключиться к mysql
  mysql -u root -p имя_базы;

#########--------<{ КОДИРОВКА }>---------#########
Символьная кодировка может быть задана для:
  1. сервера,
  2. базы данных,
  3. таблицы и
  4. колонок в таблице.

Кодировка (characher set) - набор используемых символов. (cp1251, cp866, utf8mb4)
Представление (collation) - набор правил для сравнения символов в наборе. cp1251_general_ci, cp866_general_ci, utf8mb4_general_ci || utf8mb4_unicode_ci

cp1251(cp1251_general_ci - Windows Cyrillic) 
cp866 (cp866_general_ci - Russian)
utf8mb4 (utf8mb4_unicode_ci, utf8mb4_general_ci);
utf8 (utf8_unicode_ci, utf8_general_ci, utf8mb4_0900_ai_ci - какой-то новый вариант)

Дефолтное представление для utf8 - utf8_general_ci, если бы мы его использовали вместо utf8_unicode_ci,
то параметр collation_server можно было бы вообще опустить.


Если сайт на русском и английском то utf8_general_ci - он быстрей, но не точен если используються сложные символы.

SET NAMES cp866; # меняет кодировку и на клиенте и на сервере, но это не то что мне надо.



SHOW VARIABLES LIKE'collation%';
SET collation_connection=utf8mb4_unicode_ci, collation_database=utf8mb4_unicode_ci, collation_server=utf8mb4_unicode_ci;

SHOW VARIABLES LIKE'character%';
SET character_set_results=utf8mb4, character_set_client=utf8mb4, character_set_connection=utf8mb4;

SHOW VARIABLES WHERE Variable_name LIKE 'character%' OR Variable_name LIKE 'collation%';

SET character_set_results=cp866; - как отображать в консоли
SET character_set_client=cp866; - как будет отправляться на сервер
SET character_set_connection=cp866;
  но консоль когда разрывает соединение кодировка снова возвращаеться.
  нужно в идеале поменять кодировку в файле MariaDB.conf  установить



В mySQL 8 достаточно прописать в файле my.cnf 
[client] или в этом отделе [mysql]
  default-character-set = utf8mb4



#########--------<{ РАБОТА С БАЗОЙ }>---------#########
CREATE DATABASE staff;
SHOW DATABASES;

SHOW CHARSET;

#########--------<{ РАБОТА С ТАБЛИЦЕЙ }>---------#########

*****<{ ПОКАЗАТЬ ТАБЛИЦЫ }>*****
SHOW TABLES;
SHOW COLUMNS FROM название_таблицы

  Будет отображенно:  field, type, key, defailt, extra 



*****<{ СОЗДАТЬ, УДАЛИТЬ - ТАБЛИЦУ }>*****

  CREATE TABLE имя_таблицы(
    поле тип() ...доп. параметры,
  )

 CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(40) NOT NULL,
    submission_date DATE,
    PRIMARY KEY ( id )
    );

  можно посмотреть данные как создавалась таблица
  SHOW CREATE TABLE tutorials_tbl;


  DROP TABLE имя_таблицы;


*****<{ ИЗМЕНЕНИЕ ТАБЛИЦЫ. СОЗДАТЬ, УДАЛИТЬ - КОЛОНКУ }>*****

  ALTER TABLE token AUTO_INCREMENT=1; - Сброс инкремента id

  ALTER TABLE `user` ADD `password` INT(32) NOT NULL AFTER `login`;//создать столбец
  ALTER TABLE `user` ADD `email` VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL AFTER `password`;
  ALTER TABLE `user` DROP `колонка`;





/**********************************************************************************************/
<-------------<{ РАБОТА С ДАННЫМИ }>--------------->

**********<{ ПРОЧИТАТЬ }>***********

SELECT колонка FROM таблица # * все колонки.    
SELECT таблица.колонка FROM таблица // есть такой вариант. закос ООП
#параметры распределяються так:
SELECT тут FROM ... [ВОЗМОЖНО WHERE] тут.

параметры SELECT.  
  # ПЕРЕД FROM
  AS # именно перед FROM даёт новое временное название колонке для отображения. 
     # Пример: SELECT name AS 'ИМЯ', age AS 'ВОЗРАСТ'...  Сокращённая запись: SELECT name 'ИМЯ', age 'ВОЗРАСТ'...
  DISTINCT колонка; # убирет повторяющиеся записи. Если выбрано * то ориентируеться на id, а там нет повторений.
  CONCAT(колонка1+200,колонка2,колонка3)//соединит колонки.Арифметика так же влияет на колонку 
  UPPER(колонка)//приведёт в верхний регистр колонку
  LOWER(колонка)//нижний регистр
  SQRT(колонка)//возведёт каждую строку в квадратный корень и выведет колонку
  AVG(колонка)//вернёт число среднего значения по всей колонке
  SUM(колонка)//вернёт сумму значения по всей колонке
  MIN(колонка)//вернёт минимальное значения по всей колонке
  MAX(колонка)//вернёт максимальное значение
  TOP 1 - 1 верхний (в моём случае не работает на MariaDB)

  # ПОСЛЕ FROM.
  ORDER BY колонка [DESC или ASC] # фильтрует порядок по колонке. Возможно установить от сверху вниз или снизу вверх. 
  UNION - объединяет запросы select в 1 запрос. По умелчанию так же имеет встроеный DISTINCT.
          Пример: SELECT name FROM t1 UNION SELECT name FROM t2; Если имена совпадут то повторений не будет.
          ВАЖНО: Числов столбцов должно совпадать !!!.
  UNION ALL - даже если строки совпадают то выведет как есть.
   
  # И ТАМ И ТАМ
  NOW() - время на сервере
  USER() - информация о пользователе
  DATABASE(); - тот же SHOW DATABASE но через select
  \G # отобразит строками а не таблицей. Пример: SELECT * FROM table1 \G;

  для FROM
  LIMIT лимит. 1пар кол-во, если 2й параметра. то 1й пропустить 2й кол-во  
  WHERE критерий сортировки. колонка = 10. Работает с лог операторами. Принимает так же подзапросы
  WHERE колонка > (SELECT колонка1 FROM таблица)
  LIKE '_'; # условный поиск. '_%s' - любой символ % - происзвольное кл-во символов,в конце s
  AS # после FROM сокращает просто имя таблицы для удобства, манипулирования в sql строке
     # Пример: FROM table1 AS t1 WHERE t1.id


лог операторы для WHERE почти те же. как работают
  WHERE column_name BETWEEN value1 AND value2;

  BETWEEN 1 AND 5,//между диаппазоном
  AND = '1 && 2',//верно если оба верны 
  OR = '1 || 2',//верно если один из 2х. AND 
  IN = '1 || 2 || 3 || 4',//верно если какой-нибудь подходит. Нужен что бы не писать кучу ИЛИ
  NOT = '!='//верно если выражение не верно
  

  Внимательно быть к запросам
  WHERE phone =89999992244 AND (role='admin' OR role='user')//где телефон И либо это либо то
  WHERE phone =89999992244 AND role='admin' OR role='user'//где телефон И вот это либо ещё то
  WHERE phone =89999992244 NOT IN(role='admin', role='user', role='gost')





$$$ ЗАПРОСЫ КОТОРЫЕ Я ИСПОЛЬЗОВАЛ $$$


Если попытаться получить последнюю строку в таблице глядя на её id, 
  то "SELECT max(id) FROM user" - получим лишь id максимального значения

  "SELECT * FROM token WHERE id=(SELECT max(id) FROM  token)" - так получим послеюнюю запись как положено





**********<{ ЗАПИСАТЬ }>***********
  INSERT INTO таблица(поле1, поле2, поле3) VALUES (‘London’, ‘Hoffman’, 2001);  
  INSERT INTO user(name) VALUE ('Вася'); - Запрос будет в "" строка в ''


**********<{ ОБНОВИТЬ ДАННЫЕ }>***********

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




/*------------------ <{ ПРОДВИНУТЫЕ ТЕМЫ }>----------------------------------*/
<---------<{ ОБЪЕДИНЕНИЕ ТАБЛИЦ. ( ВЫБОРКА ) }>---------->

  - Подручный способ -

    SELECT table1.ID, table1.Name, table2.ID, table2.City FROM table1, table2 WHERE table1.ID=table2.table1_id

  Таблицы ни каким волшебным образом не соединены, просто в table2 создана дополнительная колонка в которую указывают цифру,
  заведомо зная что под таким id в другой таблице нужный объект. Далее просто правильный запрос сыграет большую роль.
  Ключевая особенность запроса 
    WHERE table1.ID = table2.table1_id

    Данные колонок из 2х таблиц table1.ID, table1.Name, table2.ID, table2.City получим в том случае если id равны

  
  - Чуть продвинутые способы -

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


/*------------------------------------------------------------------*/
<---------<{ СОЗДАНИЕ ТАБЛИЦЫ НА КОТОРУЮ ССЫЛАЮТЬСЯ ДАННЫЕ ДРУГИХ ТАБЛИЦ }>---------->
# Если часто приходиться обращаться к одним и тем же жанным и делать большо запрос можно создать таблицу
VIEW - ключевое слово создающее таблицу но с некоторыми отличиями от основных таблиц.
  # Пример:
    CREATE VIEW new_name_table AS SELECT col1, col2, col3 FROM table1 LIMIT 10;
    
#########--------<{ ОБЩИЕ СВОЙСТВА для SELECT, INSERT, UPDATE или DELETE }>---------#########

IF NOT EXISTS

#########--------<{ ТИП ДАННЫХ JSON }>---------#########
# когда указываю json формат создаёться - longtext
# данные чувствительны к регистру
   
mysql> CREATE TABLE T1(jdoc JSON);
mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}'); # не забываем что изначально стоят ' '. Так же не указано колонки
# МЕТОДЫ ДЛЯ JSON
mysql> SELECT JSON_TYPE('["a", "b", 1]'); # JSON_TYPE проверить тип Обязательно в двойных " "

mysql> INSERT INTO t1 VALUES(JSON_ARRAY('a', 1, NOW())); #преобразует данные в массив json ["a", 1, "2021-01-14 06:57:53"]
mysql> INSERT INTO t1 VALUES(JSON_OBJECT('key1', 1, 'key2', 'abc')); #преобразует данные в объект json ["a", 1, "2021-01-14 06:57:53"]
                      
JSON_ARRAY JSON_OBJECT # разве что немного данных передать иначе писать придёться много. Для больших данных json_decode()

 # в MariaDB 10.3 JSON_MERGE_PATCH() и JSON_MERGE_PRESERVE() не работает начинают с MariaDB 10.3.16 and MariaDB 10.4.5.
mysql> INSERT INTO t1 VALUES(JSON_MERGE('["a", 1]', '{"key": "value"}')); #принимает более 2х данных типа json преобразует в 1
# сохраняем в переменную, хоть и похоже на JSON но это строка
mysql> SET @j = JSON_OBJECT('key', 'value'); # @ здесь нужна. Заносит объект в переменную.
mysql> SELECT @j; # SET хранит в консоли как я понял т.к. в бд это не попадает

mysql> SELECT JSON_VALID('null'), JSON_VALID('Null'), JSON_VALID('NULL');# принимает что либо в '' на валидность. 1 null записан неправильно, а значит это считаеться 
                                                                         # строкой он будет валиден, остальные будут 0 т.к. NULL(Null) не может быть валижет
# Зато стандартный метод принимает не только в '' и может вычислить null
# ISNULL(null), ISNULL(Null), ISNULL(NULL); везде 1

JSON_UNQUOTE()

# предположим у нас объект {"key1": "Какой-то текст \"Sakila\"."}  нужно получить значение
 
  селекторы поиска. в док указываеться как path

    "$.key"  - в объекте по ключу
    '$[0]' - в массиве по индексу
    '$[0 - 10]' - в диаппазон поиска 
    '.[*]' - оценивает значения всех членов в объекте JSON.
    '[*]' - оценивает значения всех элементов в массиве JSON.

  Предположим есть массив json: [3, {"a": [5, 6], "b": 10}, [99, 100]]
    $[0] - 3.
    $[1] - {"a": [5, 6], "b": 10}.
    $[2] - [99, 100].
    $[3] -  NULL (это относится к четвертому элементу массива, который не существует).

    $[1].a - [5, 6]  #обращение к объектам как в ООП js
    $[1].a[1] - 6.
    $[1].b - 10.
    $[2][0] - 99.


    Очень странно но в бд может ключ содержать пробел
    {"a fish": "shark", "a bird": "sparrow"}

1 способ
  mysql>  SELECT JSON_EXTRACT(колонка, "$.key")  FROM t1;# в MariaDB работает  
2 способ. Короткая запись колонка->"$.key"   # в MariaDB 10.3 пока что не работает.
  mysql> SELECT jdoc->"$.key1" FROM t1; "Какой-то текст \"Sakila\" "
  mysql> SELECT sentence->>"$.key1" FROM facts; # показано выводит так   Какой-то текст "Sakila"