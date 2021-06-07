/*
  Работа с mysql запросами через консоль требует установки ; в конце
  1. sudo apt install mysql-server
  2. sudo mysql secure installation  - скрипт безопасности
      Спросит пароль от root и спросит не хотим ли сменить его, далее
      Remove anonymous users? [Y/n] Y
      Disallow root login remotely? [Y/n] Y
      Remove test database and access to it? [Y/n] Y
      Reload privilege tables now? [Y/n] Y

  3. Подключение к серверу MySQL
      Подключимся клиентом к серверу и посмотрим его статус. 
      Выполним команду подключения от имени root-пользователя mysql:
      mysql -u root -p   -по умолчанию на localhost и так сойдёт
      mysql -u Login -p DB_name -h Host 

      Проверить статус:
      mysql> status


  4. поправить файл sudo nano /etc/mysql/my.cnf
    ....


  5. Импортировать бд. 
        CREATE DATABASE new_database; - создать
        mysql -u username -p new_database < data-dump.sql  - и импортировать
*/
/*

  Установить пароль
  mysql> UPDATE user SET Password=PASSWORD('mynewpassword')
    -> WHERE User='root';
  mysql> FLUSH PRIVILEGES;
*/