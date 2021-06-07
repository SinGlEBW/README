/*
  NodeJS не плохой backend, но обычно ставят дополнительно перед нодой сервер NGINX. Если использовать чистую ноду, 
  то если на сервере будет 2 и более сайтов, то каждый сайт можно будет запускать только с новым портом или ip. 
  В NGINX сделано это как-то по другому прописывая пару строк в конфиге.
  
  Когда сайт станет большой и популярный, нода может перестать помещаться в одном процессе или одном сервере,
  и придётся запускать несколько экземпляров ноды или даже докупать новые серверы. nginx позволит равномерно 
  распределить нагрузку между процессами/серверами, принимая все запросы на себя и пересылая его на один из 
  случайно выбранных процессов/серверов (или не случайно — смотря как настроить). - не совсем понятно как контролировать
  процессы

  80  стандартный HTTP порт
  443  стандартный HTTPS порт для которого требуется SSL сертификат. Его надо покупать или искать где-то.
       На https://letsencrypt.org/ бесплатно можно получить.
NodeJS Может использовать стандартные порты 80/443 только в root. А когда код сайта запускается от рута, это ОЧЕНЬ плохо:
  малейшая RCE-уязвимость — и злоумышленник без проблем получает полный доступ к серверу

  HTTPS и сертификаты для него. 
  Для работы SSL/TLS NodeJS нужен будет доступ к приватному ключу, и опять же, если злоумышленник откопает RCE-уязвимость,
  то он сможет прочитать приватный ключ и начать организовывать MitM-атаки.

  !! Если же HTTPS будет настроен на nginx и доступ к приватному ключу будет только у nginx, то злоумышленник обломается. !!
  
Прочие плюшки NGINX
  Обязательно будут моменты, когда нода не будет работать (например, она может быть просто выключена на тех-работы).
  Без nginx пользователи получат просто какую-то невнятную ошибку браузера, уведомляющую о невозможности подключения.
  С nginx можно отдать статическую страницу с более понятным описанием ошибки и предложением сообщить о проблеме 
  администраторам сайта, или же повесить плашку тех-работ и предложение подписаться например на твиттер.

  Маршрутизация.
    При попытке подключить кого-либо к компьютеру мало будет одного ip, нужен ещё и порт. Обычно порт нужно открывать 
    через Брандмауэр. Если в цепи имеется роутер, то подключающийся дойдёт до роутера, а дальше ему нужно будет
    показывать дорогу до компьютера. Для этого нужно будет указывать в роутере на какой локальный ip должен пойти тот порт по которому 
    пытаются подключится (то есть перенаправление порта). И дальше остаётся лишь открыть порт на компе через Брандмауэр.

    Внешний порт - по которому подключаются, можем перенаправить на внутренний порт и не обязательно он должен быть  таким же как внешний
*/