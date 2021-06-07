# Использование Rewrite через .htaccess нужно для того что бы любой get запросах 
# Напирмер: domain.ru/table/fff запускал один и тот же index.php файл через который будем обрабатывать
# get строку и запускать нужные нам файлы. Также таким способом избавляемся от index.php в get запросе.

# .htaccess
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^(.*) index.php?url=$1 [QSA,L]

# обработка get строки через 
  header("Content-type: application/json; charset=UTF-8");
  require_once __DIR__.'/config/config.php';
 
  $path = explode('/', $_GET['url']);

  if(empty($path[0])){
    header("Content-type: text/html; charset=UTF-8");
    require_once __DIR__.'/views/pages/index.php';
    return;
  }elseif($path[0] == 'table' && count($path) == 1){
    require_once __DIR__.'/services/getPriceList.php';
  }elseif($path[0] == 'mail' && count($path) == 1){
    require_once __DIR__.'/services/sendMail.php';
  }else{
    header("Content-type: text/html; charset=UTF-8");
    require_once __DIR__.'/views/pages/404.php'; 
  }


# -----------------------------------------------------------------------
# Через Nginx тоже можно так сделать.

server{
  listen 80 default_server;
  root /var/www/html;
  
  location / {
    fastcgi_pass php-fpm:9000;
    include /etc/nginx/fastcgi.conf; 
    fastcgi_index index.php;
  }

  location ~ /.+ {
    rewrite /.+ /;
  }
}

# Главный php файл из под nginx
  header("Content-type: application/json; charset=UTF-8");
  require_once __DIR__.'/config/config.php';
  
  $path = explode('/', $_ENV['REQUEST_URI']);

  if(empty($path[1]) || $path[1] == 'index.php'){
    header("Content-type: text/html; charset=UTF-8");
    require_once __DIR__.'/views/pages/index.php';
    return;
  }elseif($path[1] == 'table' && count($path) == 2){
    require_once __DIR__.'/services/getPriceList.php';
  }elseif($path[1] == 'mail' && count($path) == 2){
    require_once __DIR__.'/services/sendMail.php';
  }else{
    header("Content-type: text/html; charset=UTF-8");
    require_once __DIR__.'/views/pages/404.php'; 
  }

  # но через nginx можно и через location обработать по нормальному пути
  # Типа:
  server{
  listen 80 default_server;
  root /var/www/html;
  
  location / {
    fastcgi_pass php-fpm:9000;
    include /etc/nginx/fastcgi.conf; 
    fastcgi_index index.php;
  }

  location ~ /table {
    fastcgi_pass php-fpm:9000;
    include /etc/nginx/fastcgi.conf; 
    fastcgi_param  SCRIPT_FILENAME    $document_root/getPriceList.php;
  }
}