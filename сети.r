
Модель OSI
Имя                                        Как передаётся                                          тип данных
1. Физический               - Передача по: радиоканал, эл.сигнал по витой паре, светосигнал        - передача данных в битах
                              по оптоволокну. Сигнал прямоугольный разной длинны обычно от
                              0 до 1 вольта. Нет проверки что передаёт сигнал. 
                              Тип канала связи: Симплексный (в одну сторону), дуплексный(в обе),
                              полудуплексный(в обе, но по очереди)
                              Примерный сигнал: 01000101
2. Канальный                - Сигнал получает данные от Сетевой модели, добавляет                  - передача данных в кадрах 
                              J(11000) и K(10001) к началу, T(01101) к концу данных, разграничивая
                              так данные, определяет по какому маршруту переадвать кадры через
                              Физический канал. Тоже самое проделывает в обратном порядке.
                              Если нужно исправляет ошибки.
                              
3. Сетевой                  - Ethernet, WI-FI, 5G/4G/3G..., MPLS, ATM                              - передача в пакетах
                              Глобальные сети: 
                                Протокол: TCP/IP адреса, используется для сети Интернет.
                              Пример:
                                ip:      213.180.193.3   1е 3 числа определяет подсеть
                                подсеть: 213.180.193.0   подсеть связка какого-то кол-ва компов 
                                хост:    0.0.0.3         последнее число ip это номер компа в подсети
                                маска    255.255.255.0   определяет где подсеть, а где хост в ip адресе.
                              Маски не обязательно имеют 3 раза по 255.
                                Пример: ip 213.180.193.3/20  - 20 запись в байтах = маскаe 255.255.240.0
                                    ip:      11010101.10110100.11000001.00000011 | 213.180.193.3
                                    Маска:   11111111.11111111.11110000.00000000 | 255.255.240.0
                                    Подсеть: 11010101.10110100.11000000.00000000 | 213.180.192.0
                                    Хост:    00000000.00000000.00000001.00000011 | 0.0.1.3

                                Все единицы в ip которые попадают на 0 в маске, не передаются в
                                подсеть

                              Локальные сети:
                                Ориентируеться на адреса канального уровня:
                                  MAC в Ethernet, IMEI в телефонах
                              Так же есть Фрагментация которая
                              определяет на сколько фрагментов разбить пакет если на устройстве 
                              сети есть ограничение максимального размера передаваемого пакета.
                              Собирает его на каждом этапе и снова анализирует.
                              Маршрутизация - объединять несколько путей для передачи пакетов.
                              Разные сети связаны маршрутизаторами которые имеют ip. 
                              Что представляет из себя сеть, хз.
 На сетевом оборудовании есть только 3 выше описаных уровня.                            
 Остальные уровни работают на хостах.                       
                              

4. Транспортный             - UDP (датаграмма)/TCP (сегмент)                                       - сегментах или датаграмма
                              Для этого уровня существует TLS/SSL протоколы для обеспечения
                              безопасности в небезопасный сетях. Пример оплата картой.
                              Данные протокоды TLS/SSL используют: HTTPS, SMTPS, POP3S, IMAPS
                              SSL - делала Netscape компания, TLS - делала IETF.
                              Все версии SSL не обеспечивают хорошей безопасности, 
                              только TLS 1.2 или лучше 1.3(в 2018 вышла). Есть баблиотеки
                              OpenSSL, LibreSSL ... не стоит обращать внимание на имена они 
                              используют TLS 1.2 - 1.3

5. Сеансовый                - Управление сеансом связи RPC, PAP                                    - передача в данных
6. Уровень представления    - JPG, ASCII                                                           - передача в данных
7. Прикладной               - HTTP, DNS, FTP                                                       - передача в данных


 Процесс когда данные передаються с верхнего уровня на нижний называеться инкапсуляция
 Вообще в программировании Инкапсуляция означает то что при построении объекта скрывают принцип работы методов и свойств 
 что бы нельзя было сломать функционал. пользователю остаёться лишь пользоваться функционалом


ПРОТОКОЛ: это некий набор правил. На самом деле протокол указываеться через порт. КОманда netstat -na показывает открытые порты
  Зарегистрированные порты: 1025-49151
  Динамические порты: 49151-65535 (Автоматом задаються операционной системой для приложения на клиенской стороне)
  Пример: сайт FAQ-REG.RU находится на 194.58.116.30:80, а запрос идёт с браузера мой внешний ip 172.17.133.193:auto 
          как раз система выдаёт автоматически мне порт и я делаю запрос и на этот адрес мне приходит ответ.
  Один и тот же порт не может занимать разные программы

0.0.0.0 = 127.0.0.1
Транспортный: Популярна разработка приложений взаимодейсвующих на этом уровне.
  UDP/TCP: ручной проброс порта. UDP без подтверждения доставки пакета, нужна там где не важна точных 
          данных(потеряется маленький пакет данных, не важно - видео, звонки, музыка)
          TCP с подтверждением(При отправке запускает таймер и ждёт подтверждения получения, 
          если нет подтверждения шлёт по новой - письма, программы)
Прикладной:
  FTP: 21  
  SMTP: 25 (Электронная почта)  
  DNS: 53  - Domain Name System  это принцип использования имени сайта вместо положенного ip т.к. по ip к сайту не удобно обращаться.
  HTTP: 80  
  HTTPS: 443
Сетевой:
  DHCP: 67,68  - При подключении компьютера, он посылает сообщение DISCOVER со своим mac адрессом всем компам у провайдера в его подсети 
                  будь то обычные или сервера (ШАГ1: Поиск DHCP сервера), сервер отвечает OFFER выдавая через DHCP ip адрес 
                 (ШАГ2: Предложение ip DHCP сервером),  клиент снова посылает запрос REQUEST уже с этим ip (ШАГ3: Поверка связи),
                 сервер отвечает ACT подтверждая ip(ШАГ4: Подтверждение). 4й шаг нужен для того что бы не было путанницы с DHCP серверами
                 т.к. ip выдать на 1м шаге могут несколько серверов и когда на 3м шаге наш комп отправит запрос с ip положительно ответит 
                 один сервер, тот который узнает свой выдаваемый ip.  Шаги Сокращённо: Discover Offer Request Act : DORA

                В основном сервер у провайдера должен находиться в одной подсети, но есть маршрутизаторы с DHCP Relay которые предают mac в другую подсеть.

                Способы привязать ip к серверу.
                 1. Фиксированный - зная mac адреса, привязать на сервере к ip. (Как хз)
                 2. Динамический - выделение любого ip из таблицы. Арендует на время(lease time) от минут до дней. 
                                   Можно продлевать время. Комп сам посылает 3й шаг и если всё нормально сервер продлевает.
                                   При выключении компьютера отсылается автоматически запрос на DHCP сервер с сообщением RELEASE
                                   Если комп неккорректно выключился и сообщение не отправлено DHCP думает что ip занят и освободиться 
                                   когда истечёт аренда ip.

                                  


POP3: 110



DNS - серверы как раз таки хранят таблицы инфонмации о привязке "имя_сайта - его_ip" 

Когда вводим в браузера доменное имя, пример: FAQ-REG.RU и жмём Enter, браузер ищет сначало в кеше браузера если нет 
ищет на нашем компьютере файл hosts.
Если в нём есть: 
  194.58.116.30 FAQ-REG.RU
то сайт откроется сразу т.к. ip известен и домен тоже. По одному ip обратиться к сайту практически невозможно 
т.к. практически везде на одном ip висит множество сайтов (мультихост) поэтому браузер добавляет нами введённый
домен в заголовок Host и на заднем фоне обращается по ip к серверу который смотрит на Host и отдаёт данный сайт
Тут картина чуть размыта. Как он у себя ищет и где конкретно.

Кстате при обращении по ip при отсутствие поля "Host:"  Хостер может обработать данный запрос и выбрать какое
из доменных имен предоставлять по умолчанию на данном IP.
Для HTTPS уже 100% требуеться заголовок "Host:"

Если в файле host нету ip - domain, то запрос уходит провадеру с вопросом: "какой ip у данного имени?" ( DNS-запрос ).
У провайдера есть кеш. Если запрос уже был то провайдер вернёт ip по данному домену браузеру обратиться на хостинг.

1.
Если запись отсутствует, провайдер делает DNS-запрос на "корневые DNS-серверы".
Корневые DNS-серверы хранят информацию (IP, domain) других DNS-серверов, отвечающих за доменные зоны. .RU .COM .NET и т.д.
Возвращается провайдеру информация (IP-адрес и domain) DNS-сервера доменной зоны, в данном случае .RU 
2.
Провайдер снова обращаеться уже по номому ip к "DNS-серверу зоны RU". Там уже хранится информация 
о других DNS-серверах которые хранят все имена доменов. Нам нужен FAQ-REG.RU и DNS-сервер
вернёт (IP-адрес и domain) DNS-сервера провайдеру, который хранит именно FAQ-REG.RU домен.
3.
Провайдер снова сходит по новому (IP-адрес и domain) В случае успеха DNS-сервер отправит 
IP-адрес домена FAQ-REG.RU интернет-провайдеру. Провайдер сохраняет его у себя в кеше IP-адрес домена и
после этого он отправит браузеру результат DNS-запроса. Браузер обращается к хостингу по полученному IP-адресу.
Открывается запрашиваемый сайт FAQ-REG.RU.


Файл host

127.0.0.1    www.kaspersky.ru      Запретить доступ к сайтау
77.74.178.40 www.kaspersky.ru      Установив его ip он доступен будет сразу без DNS-запросов


О доменах: 
  ru или любое 1 слово    был бы домен 1го уровня, но такого не существует, т.к. одно слово, а нужна зона ru, net, com и т.д.
  example.ru              домен 2го уровня  чаще всего. Индексируеться лучше чем 3го уровня
  video.example.ru        домен 3го уровня

Собственный сервер дома.
  От провайдера получаем серый ip адрес по нему не получиться использовать нормально сервер т.к. 
  ip не статичный, он меняется и напрямую обращаться к нему из вне не получиться 


  80  стандартный HTTP порт
  443  стандартный HTTPS порт для которого требуется SSL сертификат. Его надо покупать или искать где-то.
       На https://letsencrypt.org/ бесплатно можно получить.



  Схема такая: 
    Регистрируем себе домен 2го уровня, т.к. у нас на компе серый ip 
    данный провайдером, то нам нужен статичный(публичный) ip. Можно попробовать купить тариф у провайдера со
    статичным ip или можно арендовать виртуальный сервер VDS у хостигна, в комплекте которого получаем публичным ip.
    Через этого же хостера может привязать домен к ip для этого нужно будет указывать доменные сервера того места
    где приобретали домен.

    При запросе на наш домен будет как обычно пробежда по DNS-серверам и поиск ip. ip и будет возвращён браузеру
    который будет переходить на купленый сервер VDS. Там можно установить NGINX который будет проксировать дальше.
    Мы хотели бы подключаться к своему комьютеру, обращаясь к домену, но у нас серый ip, поэтому нам нужен ещё посредник.
    Можно поставить OpenVPN сервис рядом с NGINX. NGINX будет проксировать на него. На компьютере нашем так же нужно
    установить OpenVPN.
    OpenVPN связывает между собой клиентов подключившихся к нему, что-то типо Hamachi и Tunngle.
    Если мы хотим из компьютера организовать сервер файлововй системы нужно установить сервис NextCloud
    который организовывает файловое хранилище как точку доступа.


Маски:
  Маски требуются для ограничения размера диаппазона основного ip адреса.

ip:     192.168.0.0
маска:  255.255.255.255

Как я понимаю 192.168 стандартно, а последние 2 числа зависят от маски. 

ip:     192.168.0.1           Если хотим изменить ip маску придёться вычитать из маски или в маске ставить 0 что бы не ограничивать
маска:  255.255.255.254       диапазон ip. Кажное 255 это размер 1 байта или 8бит

Т.к. в ip зарезервированно 192.168... под ними маска 255. 255 - можно сказать 1 байт или если перевести на boolean это полноценный true
установив 255 под 192 и под 168 запрещенно изменять их. Под 3 и 4 отделом ip ставят обычно 0 снимающий ограничение на изменение числа.
и в целом если сложить маску 255.255.0.0 = 8бит+8бит+0+0 = 16бит

Почему именно 192.168... Есть зарезервированные стандарты:
192.168.0.0/16    /16 это и есть маска в битах сокращённая запись
10.0.0.0/8
172.16.0.0/16
127.0.0.0/8
127.0.0.1/32  или ip: 127.0.0.1 маска: 255.255.255.255 


Диапазон сети нужен для того что бы общение компьютеров было только в выбраном биапазоне и не более
Сети состоят из изолированных получаеться блоков. Домашняя сеть 192.168..., но обращение к интернету происходит
от имени роутера (от его ip). Технология NAT этим и занимаеться подменяя 192.168... на какой-нибудь 78.13.201.45

DHCP Server - ведёт таблицу сетевых настроек клиентов сети у провайдера и автоматически выдаёт ip,маску,dns компьютеру клиента.
Вообщем он следит что бы не повторялись значения иначе будет сбой.
Если бы не было DHCP пришлось бы провайдеру ходить в ручную забивать ip и вести учёт у кого какие настройки сети,
какие ip освободились и можем ли их давать кому-то другому. Недостаток DHCP выдаёт постоянно разные ip клиенту основываясь на своей
таблице.
Клиент DHCP: Компьютер который получает ip
Сервер DHCP: Компьютер который ведёт таблицу ip адесов, обмениваеться с клиентом данными
             в режиме Запрос-Ответ и выдаёт клиентам ip избегая дублирования.


По сути роутер имеет вэб серверное приложение, мы посылаем ему запрос, а он на основе данных обрабатывает запрос и решает куда послать его.




