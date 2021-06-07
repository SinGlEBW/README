/*
  Для получения HTTPS сертификата есть сайт https://certbot.eff.org/lets-encrypt/debianbuster-nginx
  Выбрал Debian 10 т.к. Alpine не нашёл

1.
$ sudo apt update
$ sudo apt install snapd
или через root
$ su root
# apt update
# apt install snapd

2.
$ sudo snap install core
core 16-2.45.2 from Canonical✓ installed

3.
sudo snap install core; sudo snap refresh core

4.
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot  -  убедится что команда запущена

*/

