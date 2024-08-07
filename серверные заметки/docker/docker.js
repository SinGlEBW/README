/* 

  cat /etc/*-release  - узнать версию linux. Разные пакеты могут иметь своё окружение. Например php:8.0.2-apache2 os Debian GNU/Linux 10 (buster)

  docker имеет сервисы, 
    https://docs.docker.com/docker-for-windows/install/ - документация
    https://hub.docker.com/ - картотека пакетов как у npm только свои.

Преимущества docker: 
    Мы можем скачать нужные образы,закинуть файлы в контейнер, скачать или изменить файлы с
    помощью образа в контейнере и вернуть изменённые файлы удалив ненужный контейнер не загрязняя компьютер.
    Это один из вариантов событий, одноразового использования контейнера.

Docker Engine - действует как клиент-серверное приложение с длительно выполняющимся процессом-демоном dockerd
dockerd - сокращённо docker daemon - по простому (в ubuntu нет диспетчера) это обычный рабочий процесс в диспетчере задач
          любые команды через docker выполняются внутри этого dockerd
Демон - это процесс работы приложения. тоже самое что процесс в диспетчере задач в window

Через docker как я понимаю можно подключаться к разным хостам или виртуальным машинам и управлять проектом.
Можно устанавливать пакеты или что-то добавлять находясь на своей машине. 
docker может установлен на своей машине так и на сервере

Docker Engine - имеет 3 вида пакетов: стабильный, тестовый, ночной.
  стабильный - v19.03.0 - год, месяц,номер патча
  ночные - создаются один раз в день из основной ветки в формате версии: 0.0.0-20180720214833-f61e0f7


images - образы пакетов 
container - виртуальная пространство(машина, процесс в диспетчере задач) в которой происходит работа и он изолирован от других контейнеров
            сколько контейнеров столько процессов запущенно. В каждый такой контейнер в linux подобных системах типа Ubuntu 
            можно попасть указав в строке запуска  /bin/bash об этом ниже 
            ЛЮБЫЕ изменения в контейнере будут существовать пока контейнер не удалён.
volume - это хранилище. 
  ВАЖНАЯ ИНФОРМАЦИЯ по VOLUME: 
    VOLUME - это ящик(промежуточный посредник) для сохранения информации передаваемой из контейнера в данный том и из тома в контейнер.
    Этим ящиком (пространственная область - то есть том) может выступать:
      1. отдельно созданный том в docker пространстве 
      2. локальное пространство компьютера связывается с контейнером
      В обоих вариантах путь установленный в контейнере ссылается на данное пространство

      В 1м варианте при создании тома в системе docker он ничего не имеет и туда подтягивается информация из контейнера путь который указываем
      После чего можем делиться данной информацией в других контейнерах.
      При описании Dockerfile с указанием VOLUME мы можем использовать только тома docker пространства.
      Указывать для создания томов можно VOLUME /home/tom1 /home/tom2 или ["/home/tom1", "/home/tom2"]
      Создать хранилище можно и через:
        docker volume create имя_хранилище.

      Связав том с несколькими контейнерами получаем поведение:
        Видоизменяя файл хранилища в одном контейнере, увидим изменения в другом контейнере Проверил.

      Такой подход не всегда нужен. Часто нужно связать пространство компьютера с контейнером.
      Это можно сделать через непосредственно передачу ключа -v при запуске контейнера через docker run
      ну или через docker-compose. Через Dockerfile этого не сделать.

  
  Мы можем создать контейнер заведомо сконфигурированный через images и можем что-то там делать,
       

          1. передать файлы с локальной машины в контейнер (нужен посредник volume)
          мы должны воспользоваться volume хранилищем. 
          Есть 2 режима хранилища. 

            3 способа создания:
                1. Везде где указывается в -v только один параметр -v \data или в Dockerfile VOLUME /data
                   это путь к папке в контейнере и он привяжется к именованному тому имя которого будет длинное id
                2. Такой вариант -v myTom:\data (в Dockerfile нельзя так) будет создан нормальный именуемый том
                3. -v ${pwd}:\data будет виртуальная папка привязан к локальной папке.



Dockerfile - тот же package.json в корне проекта, только докера. Нужен для создания images из нашего приложения


-----------------------------------------------------------------------------------------------------------
#######-------<{ Работа с процессами в Ubuntu }>--------########
  см. файл "docker на Ubuntu.js"
 
-----------------------------------------------------------------------------------------------------------
#######-------<{ Докер команды }>--------########
  В дальнейшем указанные флаги типа -a -p -q и тому подобные можно объединять для сокращения: -ap -aq
docker

  ps          Показывает информацию о контейнерах.
                flag:
                  -a (ALL) показать все контейнеры которые были когда то запущены
                  -aq показать все, но только id. Можно передать все id на удаление
                Пример:
                  docker rm $(docker ps -aq).   $() - bash, ${} - shell и при удалении не катит

  search      Найти пакета на docker hub. docker search namePackage

  pull        Скачать image(пакет) и не более. docker pull namePackage

  run         Запустить image(пакет), если его нет то скачает и после запустит. 
                flag:
                  -it  это 2 флага -i(--interactive) Держит STDIN(процесс в консоли) занятым, даже если он не подключен.
                                  -t(--tty) псевдо-телетайп. Указываем что будем подключаться к консоли в контейнере
                                  
                  -p 1234:8080  [локальный]:[контейнера] привязка порта контейнера к локальному что бы подключиться из вне к контейнеру
                  -d(--detach)    Запустить за заднем фоне. Консоль при этом освободится
                  --name имя    Задать имя контейнеру вместо рандомного указанного NAMES
                  -v(--volume)	  Привязать(монтировать) к локальному тому(хранилищу). Дополнительное хранилище VOLUME. Приложение из контейнера может хранить там 
                                информацию. Когда контейнер удалят то информация там сохраняется. 
                                После того как создали хранилище docker volume create имяХранилища
                                (оказывается -v может автоматически создать именованный том), 
                                может привязать его при запуске 
                                -v todo-db:/etc/todos     :путь сохранения 
                                docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started


                  -e(--env), 		Установить переменные среды NODE_ENV=production и в запущенном контейнере будет эта переменная 
                  --link          Считается устаревшей технологией привязки контейнера к контейнеру. Изучать не нужно. 
                                Вкратце если нужно связывать кучу контейнеров меж собой, то получается сложная каша из --link
                                которые трудно отлаживать.
                  --network       Предварительно создав сеть через docker network create можем присоединиться к сети
                                    docker run --network имяСозданной сети ...
                                Без использовании --link в основном предлагают использовать docker-compose. Без него подключить
                                mysql и phpmyadmin можно только так:
                                  docker run --name myadmin --network todo-app -dp 4000:80 -e PMA_HOST=172.18.0.2 phpmyadmin
                                phpmyadmin предлагает ему передать через --link mysql:db но этого делать я не будут т.к. link вырежут.
                                PMA_HOST=ip контейнера mysql или network-alias который был задан при запуске контейнера mysql
                                
                  --network-alias Псевдоним для ip контейнера который можно использовать вместо ip для подключения к контейнеру.
                                    
                   ВАЖНО: Что link что network не дают возможности использовать команды одного контейнера в другом.
                  -w(--workdir) Установить на виртуальной машине рабочий каталог. -w /app 
                                при подключении к данному контейнеру попадём не в корень а сразу в app
                                из-за этого можем указывать команды консоли которые зависят от местоположения.
                  --health-cmd   выполнить команду. Например: --health-cmd npm run start

  network     Управление соединением между собой контейнеров. Замена старой docker run --link 
                Пример: 
                  docker network create -d bridge my_network     - создать для начала сеть. -d(--driver) тип сети
                  docker network connect my_network nameCont1    - засунуть контейнер в сеть докера. --alias псевдоИмяСети в контейнере
                  docker network connect my_network nameCont2      как 2й так и 1й контейнер будут связаны одной сетью
                  docker network inspect my_network              - Проверить попали ли в одну сеть контейнера
                После того как контейнера находятся в одной сети можно использовать ip нужного нам контейнера и в коде там где нам 
                требуется. Например при подключении к базе данных в коде:
                    const sequelize = new Sequelize("userDb", "root", "123456", { dialect: "mysql",host: "localhost" });           
                Но все значимые значения выводят обычно в локальные переменные что бы можно было при запуске контейнера сразу передать их.
                Поэтому каждый готовый пакет может запрашивать свои переменные.
                  Например node:12-alpine 
                const sequelize = new Sequelize("userDb", "root", "123456", { dialect: "mysql",host: MYSQL_HOST });

                                                                 
                
                Типы сетей: 
                  bridge  - Мостовой сетевой драйвер по умолчанию, но можно настроить пользовательскую сеть. 
                            Лучше всего подходят, когда вам нужно, чтобы несколько контейнеров взаимодействовали на одном хосте Docker.
                  host    - напрямую соединить по ip.лучше всего подходят, когда сетевой стек не должен быть изолирован от хоста Docker, но вы хотите, чтобы другие аспекты контейнера были изолированы
                  overlay - сеть соединяют несколько демонов Docker
                  macvlan - работа со старыми приложениями. (не особо нужна)
                  Так же можно устанавливать сторонние сети.
        
  attach      Подключиться к запущенному контейнеру в режим интерактив, то есть в режим прослушивания логов.
              Тоже самое если бы контейнер запустили не с флагом -d, а -i. Это просто как отдельная команда 
              если мы изначально контейнер запустили с -d, поработали с консолью и как освободились решили посмотреть логи. 
              Логи показываются к контейнеру идёт обращение, то есть get запросы.
                docker attach nameCont 

              Когда находимся внутри контейнера если набрать exit или нажать Ctrl+C контейнер завершит процесс,
              (это поведение на linux) но что бы выйти не завершая процесс нажать Ctrl+P и сразу Ctrl+Q       

  exec        Команда заходит внутрь контейнера для взаимодействия с ним. 
              Пример подключения:   docker exec -it nameCont bash   
              т.к. нам нужна консоль указываем флаг -it. Если хотим просто выполнить команду и отключиться после bash
              добавляем -c "какая-то команда". флаг -c обязательно.
              
  start       Запускает контейнер. После 1го использования контейнера через run, контейнер храниться в docker ps -a 
              и что бы не плодить список контейнеров запуском через run нужно запускать через эту команду 
              Пример: docker start nameCont
                                
  stop        Остановить контейнер. Можно указать docker rm -f id контейнера, что бы остановить 
              и удалить контейнер вместо 2х команд: docker stop nameCont  docker rm nameCont

  kill        Остановить контейнер запущенный через run -d
  
  images      Показывает список пакетов(образов - images)

  history     Проверить шаги построения проекта.
                docker image history --no-trunc getting-started   

  rm          Удалить контейнер. Запуская контейнер можно указать флаг --rm 
              что означает удалить контейнер после того как он прекратит работу.

  rmi         Удалить image. Не удалит если используется контейнером до тех пор пока не удалим контейнер 
              флаг -f всё равно удалит образ, но при этом информация о когда-то запущенном контейнере не удалиться,
              лучше предварительно чистить контейнер/
    
  volume      Именованное хранилище. Если не хотим связывать локальную папку с виртуальной при запуске
              run -v [лок.Путь]:[вирт.Путь], то можем привязать к именованному хранилищу создав при этом это хранилище
              Пример: docker volume create имяХран     docker run -v [имяХран]:[вирт.Путь] ...


                       
  tag         Создаёт копию images с новым именем. Пример: docker tag nameImage newName 

  login       Войти в docker Hub если требуется использовать docker push.
              В vscode вроде заходит автоматом если стоит на windows docker dashboard

          Есть 3 способа создать образ: через commit, build, docker-compose build
  commit      Из подготовленного контейнера создаёт images. Пример docker commit nameCont nameImg
              Недостаток: Если нужно что-то обновить то запускаем наш образ, изменяем плодим новый образ из запущенного контейнера.
                           Замена этому Dockerfile который описывается должным образом и используется build.
              Так же сохраняются локальные переменные если были переданные в контейнер при запуске 
                                     
  build       Создание собственного образа. Создание происходить только в случае того если есть Dockerfile.
              
                flags:
                  docker build -f /path/to/a/Dockerfile -t наше_имя. Можно указать путь, но заметил что images создаётся с <none>
                                                          имя в Dockerfile нет возможности указать.
                  docker build -t shykes/myapp .   Консоль на уровне Dockerfile. Указываем имя будущему images. Так же перезапишет
                                                   image если он у нас скачен.
                  docker build -t shykes/myapp:1.0.2 -t shykes/myapp:latest . несколько контейнеров

  diff        Показывает последние изменения в контейнере 
  logs        Показывает что было введено в консоли контейнера за последний сеанс
  stats       Показывает загруженность процессора, расход памяти. Пример: docker stats -a
  

-----------------------------------------------------------------------------------------------------------
#######-------<{ Докер Management команды }>--------########
docker
  service create --name redis_2 --constraint node.platform.os==linux --constraint node.labels.type==queue redis:3.0.6
  Создаёт какой-то сервис --constraint это флаг какого-то ограничения при полученной истине. Список на возможные ограничения 
  https://docs.docker.com/engine/reference/commandline/service_create/#specify-service-constraints---constraint
  
 
 

-------------------------------------------------------------------------------------------------------------------
#######-------<{ Примеры команд }>--------########
   
  docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started     
  docker run -it ubuntu ls /    запустить не на заднем фоне(-i) запустить режим tty(-t) образ ubuntu выполнить только команду ls /



-------------------------------------------------------------------------------------------------------------------
#######-------<{ именованный том(VOLUME), привязка к локальным файлам(Bind Mounts) }>--------########

VOLUME - хранилище предназначено брать из контейнера файлы и сохранять их к себе хранилище.

Судя по поведению
         при первом запуске хранилище пытается передать данные из хранилища в контейнер по указанному пути Пример:
         -v myVolume:/etc/todos     из "A" : в "B", при последующих изменениях файла по пути "B" данные передаются в
         хранилище "А". Зачем это нужно? На самом деле если контейнер не удалять а только останавливать и запускать,
         то контейнер сохраняет изменения, но если контейнер удалить, то изменения так же удаляться т.к. они внутри его же.
         VOLUME это независимое хранилище, в которое передаём данные и даже если контейнер удалить и снова запустить ссылаясь на это 
         хранилище то изменения будут переданы с последними изменениями.
         На больших проектах обычно изменения отправляют в DB.

  docker volume create todo-db        создали независимый именованный том (хранилище) 
  docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started      привязали контейнер к хранилищу. Здесь сказали что любые изменения
                                                                      в папке etc/todos  сохранять в хранилище todo-db

 
Bind Mounts - это способ связать файлы на локальной машине с файлами из контейнера виртуальной машины.
              Т.к. папки будут связаны, то если есть файлы на виртуальной пашине попадут на локальную,
              и если вносить изменение или добавлять файлы на локальной машине, будут попадать на виртуальную.
              Передача осуществляется так же
              из "A" : в "B" то есть из pathLocal : в /pathContainer и обратно при остановке контейнера.

Команда запуска:  docker run имяПакета:версия  обычный запуск образа. Возможно с разными ключами.
    

Пример 1. Одноразовый контейнер:
    docker run --rm -v /$(pwd):/app имяПакета:версия php /app/command.php    

    Как это читается:
      docker run --rm  - докер запусти и после удали запускаемымй файл
      -v /$(pwd):/app -   -v (--volumes) взять всё что лежит(папки, файлы) по данному пути на локальной машине:/положить по этому пути в контейнер
      php:7.7.7-apache - какой для этого образ запустить 
      php /app/файл.php - команда запуска файла, через php но уже это будет сделано на виртуальной машине.(php путь - подобие node путь в консоли)
                          ВАЖНО: если после пакета есть доп условия как тут /app/command.php, то контейнер считается одноразовым.
                                 к тому же если есть доп условие, то этот запуск не сопровождается -p. Одноразовый обычно ставят с флагом --rm

Пример 2. Одноразовый контейнер:
    docker run --rm -v /$(pwd):/app composer require phpmailer/phpmailer   Установили пакет на виртуальной машине через composer и вернули проект 
                                                                          на локальную машину.


Пример 3. Многоразовый контейнер: 
    docker run -dp 4000:80 -v /$(pwd):/var/www/html php:8.0.2-apache       /var/www/html - для nginx и apache именно по этому пути обычно
                                                                                          сохраняют проекты

    docker exec -it id bash    подключимся к консоли в контейнере. -it интерактивно режим tty(то есть подключение к образу ubuntu)
  Далее например если хотим вносить изменения в apache то нужно для начала заиметь в контейнере редактор хотя бы "nano" для этого
  в контейнере пропишем apt update   и apt install nano   и введём  nano /etc/apache2/apache2.conf

-------------------------------------------------------------------------------------------------------------------
#######-------<{ Создание собственного images }>--------########
  
  1. Контейнеры все одинаковы и содержат изначально один и тот же список файлов в корне помогающий контейнеру работать.
  2. В контейнер можно засунуть наш проект и установить нужные пакеты и фреймворки
  3. Что бы по 100 раз не устанавливать пакеты можно создать нужный образ через Dockerfile и команду  "docker build -t имя:tag ."
  4. images можно сохранить на docker Hub, но для этого имя образа должно иметь префикс репозитория имяРепозитория/имяОбраза push
  5. префикс добавляется через docker tag имяСуществ.Образа имяРепозитория/имяОбраза   При этом эта будет копия.
      Пример: docker tag getting-started singlebw/getting-started
          и того у нас в images:
        getting-started             172Mb
        singlebw/getting-started    172Mb  пушить есть смысл только этот т.к. имя соответствует теперь репозиторию
  


  Dockerfile
    FROM node:12-alpine   на каком образе собираем свой образ
    ARG APP_IN_CONTAINER=/home/app   Используя в дальнейшем переменную указанную в ARG в Dockerfile можно обращаться через
                                      $PEREM или ${PEREM}
                                      Так де можно передавать динамически 
                                      docker build --build-arg username=what_user .

    WORKDIR /app    создаёт директорию в контейнере. В последующем команды RUN, CMD, ENTRYPOINT, COPY and ADD опираются на данный путь. Можно целиком не писать
    COPY . .
    ADD файл.js /путь/      возьмёт файл с локальной машины и поместит в контейнер
    RUN yarn install --production   это то что будет запущенно в консоли в контейнере. Можно перечислять &&. Так же
                                    команд RUN может быть много. Можно так же устанавливать расширения PECL
    CMD ["node", "/app/src/index.js"]

  6. Не мало важно. В docker есть отличный способ соединять контейнера через docker-compose.
     Просто заполняешь нужные команды в одном файле и запускаешь, вместо того что бы заполнять кучу текста в консоли.
      
    Проект можно разбить на клиентскую и серверную часть и упаковать в разные images используя свой Dockerfile для 
     каждой части. В таком случае что бы связать 2 Dockerfile разных местах одного проекта нужно создать в самом корне проекта
     docker-compose.yml
     


  
  Ещё вариант создать images это подготовить контейнер с нужными пакетами и прописать docker commit idContainer имя.
  Будет создан новый images с данным ему именем.

-------------------------------------------------------------------------------------------------------------------
#######-------<{ Установка пакетов в контейнере через docker }>--------########

  Пока не совсем понятно как это устроенно. Каждый пакет собран на какой-то операционной системе которую ставил владелец
  пакета. Проверить cat /etc/*-release 
  Т.к. у нас запущен php 8.0.2-apache хотелось бы установить mySQL. Но там Debian GNU/Linux 10 (buster).
  Через apt нихрена толком не выходит т.к. там отсутствует репозиторий, потому-что os старьё. В контейнере больше нет пакетных
  менеджеров. Что интересно не каждая сборка может иметь консоль bash Именно эта Сборка предлагает ставить пакет в контейнере так:
  docker-php-ext-install -j$(nproc) pdo_mysql   установить
  docker-php-ext-enable pdo_mysql   включить
  service apache2 reload    перезагрузить сервер


  Вариант установки пакета mysql-server через файл .deb
 
Итог: Можно запускать images и ставить пакеты внутри через apt или предложенный вариант в документации от этого images
      Ещё вариант скачивать через docker нужные images и связывать контейнеры при запуске
-------------------------------------------------------------------------------------------------------------------
#######-------<{ Связать несколько контейнеров меж собой }>--------########
  Такой подход как мне показалось лучше чем создавать кучу всего в одном контейнере. 
  К примеру скачали mySQL и запускаем контейнер. Через переменные устанавливаем пароль и создаём базу
    docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=test -d mysql:latest

-------------------------------------------------------------------------------------------------------------------
#######-------<{ Докер и его журнал }>--------########

json-file - журнал который ведёт docker. Пишут в doc что он может вырасти до больших размеров.


-------------------------------------------------------------------------------------------------------------------
#######-------<{ Сборка проекта }>--------########

Есть 2 варианта. 
  1й. Подготовить проект локально и собрать через Dockerfile скомпилировать в images и отправить
      на docker Hub откуда клиент скачает его.
  2й. Загрузить проект в контейнер, настроить окружение из нужных пакетов 

Что выполнит такая команда: 
  docker run -dp 3000:3000 -w /app -v ${PWD}:/app node:12-alpine sh -c "yarn install && yarn run dev"


  -v ${PWD}:/app  - наш проект привяжем к папке app в контейнере. Всё что в папке app в контейнере появиться, всё
                    передастся на локальную машину, так и обратно. 
  node:12-alpine  - В контейнере будет установлен node 12 на операционной системе Linux Alpine
  sh -c "yarn install && yarn run dev"   -и запущена команда Не важно npm yarn суть не меняется.


    Неправильно
FROM node:12-alpine
WORKDIR /app
COPY . .                        - Зачем копировать постоянно node_modules?
RUN yarn install --production
CMD ["node", "/app/src/index.js"]

  Правильно.
FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD ["node", "/app/src/index.js"]
--health-cmd string              Command to run to check health
-------------------------------------------------------------------------------------------------------------------
#######-------<{ docker-compose }>--------########

  docker-compose - нужен чтобы запускать несколько контейнеров одновременно. Использовать чистый docker не очень
                   удобно т.к. приходиться писать кучу команд в консоли. Зачем делать так если можно описать 1 файл 
                   и его запускать.

  1. запускать docker-compose run имяСервиса не стоит без флага --build если в этом сервисе используем build вместо images
     без флага сервис будет запускаться раньше чем закончиться build
  2. При использовании терминала bash обращаться к текущему пути использовать конструкцию /$(pwd)  не забывать указывать слеш в начале.
     При использовании sh использовать ${pwd}
  

     Заменил на sh и его вариант ${pwd}.
  3. При запуске отдельного service через docker-compose run не забывает указывать --service-ports иначе порты не пробрасываются 
      и в контейнере работать будет а с наружи нет.
  
    ----------------------------------------------------------
     nodejs запуск способ 1: 
        Предварительно собрав Dockerfile

          FROM node:12.19.0-alpine
          WORKDIR /home/app
          COPY ./package.json .
          RUN npm install

      Пытаемся запустить nodejs в контейнере таким способом:

        docker run -v ${pwd}/public:/home/app/public -v ${pwd}/server:/home/app/server 
                   -w /home/app/server --health-cmd "npm run dev" -p 3000:4000 -i test_app:v1

      Почему не -d ? Как оказалось контейнер сразу вырубается на заднем фоне. Его почему-то не интересует запустил 
      я там nodejs или нет. Всё потому что по умолчанию контейнер ссылается на оболочку node. При команде -t мы 
      видим ожидание ввода в node:
        Welcome to Node.js v12.19.0.
        Type ".help" for more information.
      Если выйти Ctrl + C то контейнер не закроется в отличии от -it

    ----------------------------------------------------------
    Следующий вариант 2:

        FROM node:12.19.0-alpine
        WORKDIR /home/app
        COPY ./package.json .
        RUN npm install
        COPY ./public ./public
        COPY ./server ./server
        CMD cd server && npm run dev
        
        Для запуска достаточно: 
          docker run -dp 3000:4000 test_app:v2   без привязки volume. Тут всё нормально держится

    ----------------------------------------------------------
    Вариант 3:
        FROM node:12.19.0-alpine
        WORKDIR /home/app
        COPY ./package.json .
        RUN npm install
        COPY ./public ./public
        COPY ./server ./server
        # CMD cd server && npm run dev

        docker run --health-cmd "cd server && npm run dev" -p 3000:4000 -it test_app:v3
        Ииии проект снова не может удерживаться на фоне через -d. Через -i -t -it комбинации контейнер работает и 
        сервер отвечает из вне.
          Вывод: Что бы полноценно запускать на фоне nodejs приложение оно должно перемещено и запущено 
                 через Dockerfile. По сути 1 проект 1 Dockerfile под него.
                
    Что если мы хотим иметь 1 nodejs, а файлы подкидывать через композер? 

      Dockerfile                                docker-compose.yml
          FROM node:12.19.0-alpine                  app:
          WORKDIR /home/app                             image: test_app:v4
          COPY ./package.json .                         volumes:
          RUN npm install                                 - ./public:/home/app/public 
                                                          - ./server:/home/app/server
                                                        command: "npm run dev"
                                                        ports: 
                                                          - 3001:4000
                                                        restart: always

      И COPY файлов нам не нужен т.к. мы связываем их в volume, да и CMD нам не нужен т.к. проекта то нет
          
-------------------------------------------------------------------------------------------------------------------
#######-------<{ Разное полезное }>--------########         
 Иногда требуется иметь в 1 контейнере 2 приложения, взяв готовый контейнер с одним приложением и установив в нём доп пакет
 то при каждом запуске контейнера окажется что доп пакет без авто-запуска. 

  supervisor - это автоматом запускает процессы в контейнере, но предварительно при сборке её нужно установить в контейнер и 
               и так же предварительно создать ве контейнера supervisord.conf с правилами авто-запуска после чего засунуть в 
               в сборку.
         
*/

/*
-------------------------------------------------------------------------------------------------------------------
#######-------<{ Пример }>--------########   
.dockerignore
  node_modules
  
 Dockerfile
  FROM node:20-alpine3.19
  WORKDIR /var/www/html
  COPY package.json .
  RUN npm install
  COPY . .
  EXPOSE 3000
  CMD ["npm", "start"] //При docker run выполнит команду

  docker build -t react:dev .

  docker run -it --rm react:dev //Запустить в интерактивном режиме и удалять контейнер после выхода т.к. они копятся без флага --rm

*/

/*
-------------------------------------------------------------------------------------------------------------------
#######-------<{ Полезные команды }>--------########  
   docker images --filter "dangling=true" -q //показать id всех images none
   docker rmi $(docker images --filter "dangling=true" -q)  //так удалить все images none

   docker exec -it имя_контейнера sh

  docker volume prune //для очистки оставшихся томов, которые не подключены к работающим контейнерам

  docker-compose config //посмотреть как сконфигурирован файл compose

  docker ps --format "{{.Ports}}"

   docker inspect --format='{{ (index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort }}' f6cb05ba3957 //получить порт контейнера 

   docker inspect --format='{{ (index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort }}' $(docker ps -q)//получить порты контейнеров 
*/
