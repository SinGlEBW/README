/*

docker run -d --network todo-app --network-alias mysqlAls -v todo-mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=todos mysql:latest

docker run -dp 3000:3000 -w /app -v ${PWD}:/app --network todo-app -e MYSQL_HOST=mysqlAls -e MYSQL_USER=root -e MYSQL_PASSWORD=secret -e MYSQL_DB=todos node:12-alpine sh -c "yarn install && yarn run dev"

  доступ
    docker exec -it some-mysql bash
    db docker exec -it 5bb9860413a3 mysql -u root -p    сразу в db


-----------------------------------------------------------------------------------------------------------
#######-------<{ Константы (локальные переменные) для запуска }>--------########
  MYSQL_ROOT_PASSWORD=secret  обязательная переменная. 
  MYSQL_DATABASE=test  
  MYSQL_USER=user, MYSQL_PASSWORD=user  используются вместе для создания нового пользователя. Приоритет: Суперпользователь
  MYSQL_ALLOW_EMPTY_PASSWORD=yes   разрешит root пользователю остаться без пароля. В production без пароля нельзя.
  MYSQL_RANDOM_ROOT_PASSWORD=yes   сгенерировать пароль для root и показать в консоли
  
-----------------------------------------------------------------------------------------------------------
#######-------<{ Сохранение конфигураций }>--------########

  Файлы конфигурации:
  /etc/mysql/conf.d               - хранение конфигураций
  /var/lib/mysql                  - место хранение базы
  /docker-entrypoint-initdb.d     - место добавления таблиц


  Привязать файлы конфигурации к локальной машине.
   docker run --rm --name some-mysql -v ${pwd}/server/config/mySQL/conf.d:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=secret -d mysql:latest


  Устанавливать настройки можно без .cnf файла, устанавливая ключи.
    docker run --rm --name some-mysql -e MYSQL_ROOT_PASSWORD=secret -d mysql:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  Посмотреть доступные ключи для этого пакета можно прописав:
    docker run -it --rm mysql:latest --verbose --help

-----------------------------------------------------------------------------------------------------------
#######-------<{ Возможные проблемы }>--------########  
  Если появляются проблемы с подключением то как вариант можно удалить сохранённую базу на локальный
  компьютер которую добавили через -v ${pwd}/server/config/mySQL/saveDB:/var/lib/mysql

-----------------------------------------------------------------------------------------------------------
#######-------<{ Сохранение таблиц }>--------########  

1. созданные db можно сохранить на локальной машине связав папку с var/lib/mysql 
    docker run --name some-mysql -v ${pwd}/server/config/mySQL/saveDB:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret -d mysql:latest
2. Если есть таблицы (файл.sql) можно передать их в папку   /docker-entrypoint-initdb.d, тогда в созданной нами базе при вызове 
    создадутся таблицы.
    docker run --name some-mysql -v ${pwd}/server/config/mySQL/table:/docker-entrypoint-initdb.d -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=test -d mysql:latest


docker run --rm --name some-mysql -v ${pwd}/server/config/mySQL/saveDB:/var/lib/mysql 
-v ${pwd}/server/config/mySQL/table:/docker-entrypoint-initdb.d -e MYSQL_ROOT_PASSWORD=secret 
-e MYSQL_DATABASE=test -d mysql:latest


ИТОГ: Если мы хотим изменять настройки, сохранять внесённые данные и передать таблицы строка запуска вырастет
docker run --rm --name some-mysql
            -v ${pwd}/server/config/mySQL/saveDB:/var/lib/mysql 
            -v ${pwd}/server/config/mySQL/conf.d:/etc/mysql/conf.d 
            -v ${pwd}/server/config/mySQL/table:/docker-entrypoint-initdb.d 
            -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=test -d mysql:latest


  Что бы такую большую строку не писать есть docker-compose.yml в котором примерно указывается так:
  version: '3.1'

  services:

    db:
      image: mysql
      restart: always
      environment:
        MYSQL_ROOT_PASSWORD: secret
        MYSQL_DATABASE: test
      volumes:
        - ./server/config/mySQL/saveDB:/var/lib/mysql
        - ./server/config/mySQL/conf.d:/etc/mysql/conf.d
        - ./server/config/mySQL/table:/docker-entrypoint-initdb.d
*/