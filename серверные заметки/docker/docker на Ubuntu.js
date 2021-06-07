/* 

#######-------<{ Установка на Ubuntu }>--------########

  Есть 3 способа установки, рассмотрим 1. Установка из репозитория.
  Что бы не пользоваться постоянно sudo можно войти как root пользователь набрав sudo su

  1. sudo apt-get update  
  2. sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common     зависимости к docker
  3. curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -        Установка ключа GPG
  4. sudo apt-key fingerprint    Проверить ключ, должен быть 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88

  Скачиваем из репозитория
  $ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
  
  $ sudo apt-get update  ещё раз обновляем список программ

  Непосредственная установка
  $ sudo apt-get install docker-ce docker-ce-cli containerd.io
  $ systemctl status docker     проверить статус процесса 

  $ docker run hello-world запуск пакетов


-----------------------------------------------------------------------------------------------------------
#######-------<{ Работа с процессами в Ubuntu }>--------########

  systemctl - команда которая отвечает за запуск служб и процессов. статус можно менять
  systemd - папка в папке etc в которой хранятся конфигурации запуска приложений и служб. 

  $ sudo systemctl enable docker.service   - (можно сократить до docker) docker сейчас настроен на автоматический запуск и по всей видимости эта команда не нужна
  $ sudo systemctl enable containerd.service

  ВАЖНО: на ubuntu что бы пользоваться docker занести без постоянного подтверждения нужно в групповой политике 
         подтвердить докер  $ sudo groupadd docker   $ sudo usermod -aG docker $USER 
         После чего нужно перезалогиниться

Команды systemctl посмотреть в ubuntu.js
 

-------------------------------------------------------------------------------------------------------------------
#######-------<{ Состояния сервера }>--------########
Каждое состояние можно контролировать привязав выполнение разных unit' ов и служб. Это как тупо профиль 1, профиль 2 ...
в которых может работать какое-то кол-во программ

poweroff.target	0
rescue.target	1
multi-user.target	2
multi-user.target	3
multi-user.target	4
graphical.target	5
reboot.target	6
*/