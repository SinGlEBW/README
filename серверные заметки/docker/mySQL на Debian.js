/*
  при подключении к DB MySQL(не MariaDB) через PDO, потребуется на хосте найти плагины 
  и отключить pdo_mysql после найти nd_pdo_mysql и включить. Нужно это для того что бы 
  заработала указанная опция при подключении к DB 
  PDO::ATTR_STRINGIFY_FETCHES => false, которая отключает перевод чисел в строку
  иначе можно прошляпить и неправильно обработать данные на JS
*/

/*


  1. wget скорей всего не установлен apt install wget    для скачки файла по ссылке curl -O 
                                                       
  2. cd /tmp  wget https://dev.mysql.com/get/mysql-apt-config_0.8.16-1_all.deb    версию можно узнать https://dev.mysql.com/downloads/repo/apt/  
              curl -O https://dev.mysql.com/get/mysql-apt-config_0.8.16-1_all.deb   альтернатива
  3. dpkg -i mysql-apt-config_0.8.16-1_all.deb    находясь в tmp пробуем установить. Возможно потребуется пакеты lsb-release и gnupg 
  4. отвечаем на вопросы 1. MySQL Cluster(содержит MySQL-Server)
  5. Вылезет ошибка Warning: apt-key should not be used in scripts (called from postinst maintainerscript of the package mysql-apt-config)
     Лечится: apt-key adv --keyserver keys.gnupg.net --recv-keys 8C718D3B5072E1F5
  6.apt update
  7.apt upgrade
  8. До этого был процесс распаковки в репозиторий, теперь установка apt install mysql-server
  9. проходим снова вопросы. 1й: root пароль, 2й: 1. Use Strong Password Encryption (RECOMMENDED) 
  10. mysql_secure_installation проверка,
  11. mysql -V
  12. При попытке подключить возможно вылезет ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'
      При установке ни файл ни папки не создаться по нужному пути. Возможно в папке var так же будет лежать файл run который 
      мешает созданию папки run
      mkdir  mkdir -p /var/run/mysqld 
      mkfifo /var/run/mysqld/mysqld.sock
      chown -R mysql /var/run/mysqld
    Решения пока не нашёл. Можно создать папку и файл mysqld.sock удалив мешающий run, то ошибка так и вылазит.
    Кстате если скачать отдельный images mySQL и запустить его в контейнер, то заметил что там не создаётся ни какой папки
    в var и проблем ни каких нет 


*/