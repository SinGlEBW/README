/*########--------<{ Общие сведения }>-------######### 

  Apache — это сам веб-сервер, который обрабатывает пришедшие от пользователей запросы и показывает страницы сайтов.
           Без дополнительных модулей Apache преимущественно предназначен для показа статичных страниц, в которых не происходит 
           изменений на стороне сервера

  PHP — это язык программирования. Также называется среда для выполнения скриптов, написанных на PHP.
        В операционной системе, в том числе и Windows, PHP может быть установлен самостоятельно, без веб-сервера.
        В этом случае программы (скрипты) на PHP можно запускать из командной строки.
        Но веб-приложения очень часто используют PHP, данный язык фактически стал
        стандартом веб-серверов и поэтому они почти всегда устанавливаются вместе.
        PHP скрипты позволяют делать очень функциональные веб-сайты, динамичные веб-приложения, 
        сохранять данные в базу данных и запрашивать данные оттуда

  MySQL, MariaDB — это система управления базами данных (СУБД). Это также самостоятельная программа,
                  она используется для хранения данных, поиска по базам данных, для изменения и удаления данных.
                  Первой появилась MySQL, а затем от неё ответвилась MariaDB.
                  Для веб-приложений обе эти СУБД являются взаимозаменяемыми, то есть никакой разницы нет.
                  Такие базы данных называют Реляционные (табличные)

  phpMyAdmin — это веб-приложения, которое работает на PHP. С помощью phpMyAdmin можно просматривать базы данных, 
               создавать новые базы данных и таблицы, наполнять их и удалять, делать резервные копии баз данных и 
               восстанавливать из бэкапов. phpMyAdmin очень популярно, поэтому многие считают его частью веб-сервера

*/

/*----------------------------------------------------------------------------------------------*/
/*########--------<{ Установка сервера Apache Windows }>-------######### 

1. Скачать Apache со всеми пакетами Visual Studio 2015-2019 на странице: apachelounge.com/download/. 
2. Скачать PHP на странице windows.php.net/download/. 
   Там выберите файл VC15 x64 Thread Safe или VC15 x86 Thread Safe — они различаются битностью. Причём нужно скачивать файл Zip (а не Debug Pack).
3. Скачивания MariaDB на странице downloads.mariadb.org. последнюю версию нужного разряда.
   При клике на файл, откроется другая страница, там просто найдите и нажмите кнопку с надписью «No thanks, just take me to the download».

4. Создать C:\Server\bin (для исполнимых файлов) и C:\Server\data.
   В C:\Server\data\DB (для баз данных) и C:\Server\data\DB\data и C:\Server\data\htdocs (для сайтов)-тут phpMyAdmin будет.

C:.
├───bin
│   ├───-Apache24 - сюда распаковать сервер Apache2.4
│   │   └───conf - главный конфигурационный файл
│   ├───-mariadb - сюда распакуем MariaDB СУБД
│   ├───-PHP - сам PHP тут будет
│   └───-Sendmail
├───certs
├───data
│   ├───DB
│   │   └───data - здесь храниться будут таблицы БД
│   └───htdocs - в эту папку заливать проект
│       └───-phpmyadmin
└───manage

5. Править conf.  
    Define SRVROOT "c:/Apache24"  на "c:/Server/bin/Apache24", далее пролистать до закоментированных модулей
    LoadModule rewrite_module modules/mod_rewrite.so - раскоментиовать, пока хватит. Далее найти
    #ServerName www.example.com:80 на ServerName localhost, далее поменять путь
    DocumentRoot "${SRVROOT}/htdocs" на "c:/Server/data/htdocs/"
    <Directory "${SRVROOT}/htdocs"> на "c:/Server/data/htdocs/", далее
    AllowOverride None  на AllowOverride All - Этой настройкой мы включили поддержку файла .htaccess,
    	
    DirectoryIndex index.html на DirectoryIndex index.php index.html index.htm - поддержка вариаций index файлов

    Файл сохранить.

6. Открыть PowerShell от админа и установить и запустить сервер
          c:\Server\bin\Apache24\bin\httpd.exe -k install
          c:\Server\bin\Apache24\bin\httpd.exe -k start

7. Заливаем в папку C:\Server\data\htdocs\  проект. Проверяем http://localhost/index.html
8. Распаковываем mariadb-xx.x.x-winx64.zip распакуйте в папку C:\Server\bin\mariadb\
      создаём там файл my.cnf и скопируйте в него:

      [mysqld]
        datadir="c:/Server/data/DB/data/"
        bind-address = 127.0.0.1
    Сохранить

  В PowerShell
    C:\Server\bin\mariadb\bin\mysql_install_db.exe --datadir=C:\Server\data\DB\data\
    C:\Server\bin\mariadb\bin\mysqld --install
    net start mysql
        
9. Разорхивировать php-x.x.xx-Win32-VC15-x64.zip в C:\Server\bin\PHP\, найти файл php.ini-development и переименовать в php.ini,
        открыть, найти и исправить на: 
        extension_dir = "C:\Server\bin\PHP\ext\"
        extension=bz2
    Некоторые советуют раскомментировать
        ;extension=curl
        extension=fileinfo
        extension=gd2
        extension=gettext
        extension=gmp
        ;extension=intl
        ;extension=imap
        ;extension=interbase
        ;extension=ldap
        extension=mbstring
        extension=exif ; Must be after mbstring as it depends on it
        extension=mysqli
        ;extension=oci8_12c ; Use with Oracle Database 12c Instant Client
        extension=odbc
        extension=openssl
        ;extension=pdo_firebird
        extension=pdo_mysql
        ;extension=pdo_oci
        ;extension=pdo_odbc
        ;extension=pdo_pgsql
        extension=pdo_sqlite
        ;extension=pgsql
        ;extension=shmop

    Советуют
      extension=soap
      extension=sockets
      ;extension=sodium
      extension=sqlite3
      extension=tidy
      extension=xmlrpc
      extension=xsl
    Сохраните и закройте этот файл.

10. Подключить PHP к Apache. Для этого в файле c:\Server\bin\Apache24\conf\httpd.conf в самый конец добавьте строчки:
      PHPIniDir "C:/Server/bin/PHP"
      AddHandler application/x-httpd-php .php
      LoadModule php7_module "C:/Server/bin/PHP/php7apache2_4.dll"
    Сохраните и закройте файл.

    После этого в командной строке перезапустите Apache:
      c:\Server\bin\Apache24\bin\httpd.exe -k restart

    Проверить в каталоге c:\Server\data\htdocs\ создать файл index.php с <?php phpinfo(); ?>  и перейти http://localhost/index.php. 

              
11. Распаковать phpMyAdmin-x.x.x-all-languages.zip в C:\Server\data\htdocs\phpMyAdmin, создать файл config.inc.php 
      скопировать: 
      
    <?php
 
      /* Servers configuration */
      $i = 0;
      
      /* Server: localhost [1] */
      $i++;
      $cfg['Servers'][$i]['verbose'] = '';
      $cfg['Servers'][$i]['host'] = 'localhost';
      $cfg['Servers'][$i]['port'] = '';
      $cfg['Servers'][$i]['socket'] = '';
      $cfg['Servers'][$i]['connect_type'] = 'tcp';
      $cfg['Servers'][$i]['extension'] = 'mysqli';
      $cfg['Servers'][$i]['auth_type'] = 'cookie';
      $cfg['Servers'][$i]['user'] = 'root';
      $cfg['Servers'][$i]['password'] = '';
      $cfg['Servers'][$i]['nopassword'] = true;
      $cfg['Servers'][$i]['AllowNoPassword'] = true;
      
      /* End of servers configuration */
      
      $cfg['blowfish_secret'] = 'kjLGJ8g;Hj3mlHy+Gd~FE3mN{gIATs^1lX+T=KVYv{ubK*U0V';
      $cfg['DefaultLang'] = 'ru';
      $cfg['ServerDefault'] = 1;
      $cfg['UploadDir'] = '';
      $cfg['SaveDir'] = '';

  /*Вроде не нужен закрывающий ?>   Проверить http://localhost/phpMyAdmin/

    В БД Скорей всего будет внизу
      Хранилище конфигурации phpMyAdmin не полностью настроено, некоторые расширенные функции были отключены. Узнайте причину.
      Или перейдите на вкладку 'Операции' любой базы данных, чтобы настроить хранилище в ней.

      Чтобы исправить проблему, достаточно создать требуемую базу данных,
      чтобы это сделать просто перейдите по ссылке http://localhost/phpMyAdmin/chk_rel.php?db=&goto=db_operations.php&create_pmadb=1
   
    
  
  11. БЕЗОПАСНОСТЬ
        Поскольку в Windows Apache работает с повышенными привилегиями, а права доступа на файлы не настроены должны образом,
        то веб-сервер с уязвимым скриптом может злоумышленнику предоставить доступ к любому файлу на компьютере
  
      Стандартный веб-сервер, в том числе тот, который мы только что установили, имеет две сетевые службы:

        сам веб-сервер, который прослушивает 80 порт (при включении HTTPS, то ещё прослушивается и 443 порт)
        сетевая служба системы управления базами данных, то есть MariaDB или MySQL, которая прослушивает порт 3306


    К MariaDB/MySQL можно подключиться с другого компьютера и выполнить разнообразные действия с базами данных, но есть другой подход
    Есть виртуальный сетевой интерфейс Loopback(можно перевести как «возвратная петля») - это такой способ подключиться к сетевой службе,
    которая работает на этом же компьютере. 
      То есть мы как будто делаем запрос в сеть, а сетевая служба видит эти пакеты как будто бы они пришли из сети. 
      То есть клиент сетевой службы и сама сетевая служба работают как надо, но трафик на самом деле с компьютера никуда не уходит.
    
    В файле настройки MariaDB   bind-address = 127.0.0.1
    Это означает, что она прослушивает только IP адрес 127.0.0.1, который относится к Loopback. Это, в свою очередь, означает, 
    что никто из вне (вне компьютера, на котором работает веб-сервер), не сможет подключиться к MariaDB/MySQL. 
    При этом сайты и другие приложения будут работать с базами данных как ни в чём не бывало 
    — они как раз и используют такие соединения к адресу 127.0.0.1. То есть MariaDB уже защищена.



  */





/*----------------------------------------------------------------------------------------------*/
/*########--------<{ Установка сервера Apache на Ubuntu }>-------######### 

/*
  Не дописано....

1. sudo apt-get update, sudo apt-get upgrade  - обновление операционной системы Ubuntu и (upgrade) какой-то пока не знаю
2. sudo apt install apache2 - установка сервера
3. Если есть сертификат ssl установить
4. sudo apt-get install git curl - установка 2х пакетов git - чтоб получить репозиторий и curl чтоб установить node js
                              (читать док. ubuntu nodejs)
5. curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -   = скачать пакет nodejs
6. sudo apt-get install -y nodejs   - теперь установить пакет
  после установки nodejs есть доступ к npm.
7. sudo npm install pm2 -g  - пакет что бы запускать автоматически сервер если комп перезагрузился у хостинга
8. npm init



*/


/* Настройка сервера
  В Apache есть основной конфигурационный файл httpd.conf изменяя который придётся перезапускать сервер,
  есть так же дополнительный .htaccess который может быть создан пользователем в корневой папке сайта если это разрешено в
  основном конфигурационном файле.
  Его конфигурация будет распространятся на дочерние папки и изменив этот файл сервер не нужно перезагружать.
  Если сделать ошибку в файле, то сайт не загрузиться выдав 500 ошибку сервера, придётся поправить файл.
  Конфигураций существует около 600, запишу основные в созданном .htaccess фале.


*/