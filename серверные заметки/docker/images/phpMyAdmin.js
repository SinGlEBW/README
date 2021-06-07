/*

#######-------<{ Константы (локальные переменные) для запуска }>--------########

PMA_ARBITRARY=1           - при установке 1 будет разрешено подключение к произвольному серверу
PMA_HOST=dbHostCont       - определить адрес / имя хоста сервера MySQL. Связанные в общей сети mysql и phpmyadmin без использования --link
                              docker run --name myadmin --network todo-app -dp 4000:80 -e PMA_HOST=172.18.0.2 phpmyadmin
PMA_VERBOSE               - определить подробное имя сервера MySQL
PMA_PORT                  - определить порт сервера MySQL
PMA_HOSTS                 - определить разделенный запятыми список адресов / имен хостов серверов MySQL
PMA_VERBOSES              - определить разделенный запятыми список подробных имен серверов MySQL
PMA_PORTS                 - определить через запятую список портов серверов MySQL
PMA_USERи PMA_PASSWORD    - определить имя пользователя для использования в методе аутентификации конфигурации
PMA_ABSOLUTE_URI          - определить пользовательский URI
HIDE_PHP_VERSION          - если определено, скроет версию php ( expose_php = Off). Установите любое значение (например, HIDE_PHP_VERSION = true).
UPLOAD_LIMIT              - если установлено, отменяет значение по умолчанию для apache и php-fpm (значение по умолчанию 2048 кб)
PMA_CONFIG_BASE64         - если установлено, заменит config.inc.php по умолчанию на содержимое переменной, декодированное с помощью base64
PMA_USER_CONFIG_BASE64    - если установлено, заменит config.user.inc.php по умолчанию на декодированное base64 содержимое переменной

-----------------------------------------------------------------------------------------------------------

  phpMyAdmin - работает в связке в MySQL или MariaDB. Предварительно запускаем контейнер одной из бд и запускаем phpmyadmin
    

    Предварительно было запущена база mysql:
      docker run --rm --name some-mysql -e MYSQL_ROOT_PASSWORD=secret -d mysql:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

    Привязываем к ней контейнер phpMyAdmin:
      docker run --rm --name myadmin --link some-mysql:db -dp 8080:80 phpmyadmin   
        some-mysql:db связывали контейнер mysql с каким-то db который использовался внутри phpMyAdmin. --link вырежут в будущем поэтому
        подключение к 1й сети --network todo-app и PMA_HOST=ip контейнера mysql
      
      --link [имя контейнера с запущенной базой]:[имя базы]

   


  Использование с внешним сервером
  docker run --name myadmin -d -e PMA_HOST=dbhost -p 8080:80 phpmyadmin

-----------------------------------------------------------------------------------------------------------
#######-------<{ Сохранение конфигураций }>--------########

  /etc/phpmyadmin/config.user.inc.php

  связать локальный конфиг с контейнерным
  docker run --name myadmin -d --link mysql_db_server:db -p 8080:80 -v ${pwd}/server/config/phpmyadmin/config.user.inc.php:/etc/phpmyadmin/config.user.inc.php phpmyadmin
  
  Если хотим перекинуть файл конфига через docker-composer, то обязательно самостоятельно создать на локальной машине
  папку и файл конфига иначе автоматом создаёт папку именем файла config.user.inc.php как на локальной так и в контейнере
volumes: 
  - ./myadmin/config.user.inc.php:/etc/phpmyadmin/config.user.inc.php
*/