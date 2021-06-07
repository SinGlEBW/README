/*
#######-------<{ Константы (локальные переменные) для запуска }>--------########

  APACHE_DOCUMENT_ROOT /path/to/new/root       меняет рабочий каталог /var/www/html 


-----------------------------------------------------------------------------------------------------------
#######-------<{ Сохранение конфигураций }>--------########

/var/www/html      - рабочая папка php с apache версией. php | html - index отрабатывает 

/usr/src/myapp     - рабочая папка для версии просто php вроде как без apache. С apache и myapp папки нет да и работать не будет
  Пример: docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp php:7.4-cli php your-script.php

/etc/apache2/mods-available      - папка моделей apache
/etc/apache2/apache2.conf        - конфигурации
-----------------------------------------------------------------------------------------------------------
#######-------<{ Описание работы php:8.0.2-apache }>--------########
В контейнере:
  php -m          - Проверить установленные расширения php. Список поддерживаемых расширений версиями
                  https://github.com/mlocati/docker-php-extension-installer
  php -i          - Вся информация о php. php.info() тот же результат

  apachectl -M    - Посмотреть модули Apache. 
                    
  a2enmod         - включить модули. a2 dis mod имя_модуля (a2 - Apache2  dis || en - disable, enable  mod - module)
                    Некоторые модули нужно устанавливать прежде чем использовать эту команду

  Дополнительный функционал от php docker пакета
  docker-php-ext-configure                  - не понял зачем это
  docker-php-ext-install имяРасширения      - установить расширение 
  docker-php-ext-enable имяРасширения       - включить расширение. можно указывать несколько расширений для включения
 

  PECL - это репозиторий модулей PHP, доступ к которым предоставляется через систему PECL

-----Модули Apache: ----------------------------------------------------

    Имя               Команда в терминале               
  rewrite               a2enmod rewrite     
        
-----Модули для php: ---------------------------------------------------

  xdebux              pecl install xdebug && docker-php-ext-enable xdebug
                      
  pdo_mysql           docker-php-ext-install pdo_mysql && service apache2 reload 
------------------------------------------------------------------------                    


*/