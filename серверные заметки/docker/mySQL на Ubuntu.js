/*
  при подключении к DB MySQL(не MariaDB) через PDO, потребуется на хосте найти плагины 
  и отключить pdo_mysql после найти nd_pdo_mysql и включить. Нужно это для того что бы 
  заработала указанная опция при подключении к DB 
  PDO::ATTR_STRINGIFY_FETCHES => false, которая отключает перевод чисел в строку
  иначе можно прошляпить и неправильно обработать данные на JS
*/

/*
Если нет wget то apt install wget

  wget https://dev.mysql.com/get/wget/mysql-apt-config_0.8.16-1_all.deb
*/