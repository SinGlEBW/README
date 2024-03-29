cls или clear - очистить консоль. 
cd указание директории - переход по папкам

cd .. - переход на позицию выше
По умолчанию путь принадлежит дистку C поэтому модно не указывать корень С.

cd /D далее имя каталога. Пример: cd /D d:\papka
copy название файла, куда копировать  Пример: copy js-info.js tabs
mkdir название папки или md папка - создание
rmdir название папки или файла - удаление
del тоже удаляет папки, так же отдельно файлы можно или пачку файлов удалить
del папка\*  - удаляться файлы в папке

dir - проверяет собержимое папки (добавив -a или (all) покажет всё)
type nul > название файла - создание файла

date - показывает дату и время 

команды именно для терминала vscode
pwd - указывает путь 
cp - тот же copy. При копировании папок со всеми потрахами указать флаг -r
cp -r название папки, куда копировать.
mv - перемещение файлов и папок
команда touch для создание файлов не работает

Иногда при некоторых манипуляциях в консоли требуеться отвечать на предлагаемые вопросы
что бы этого избежаcть нужно указать ключ в конце строки выполняемого кода:
-y   - не спрашивать 
-g   - глобально

#####---- git настройка ----######
git init  появиться файл .gitignore начинаеться слежка за проектом
1м делом как только установили git нужно войти в свой кабинет через Git branch
git config --global user.email "you@example.com"
git config --global user.name "имя" вроде как это не то имя которое вводиться 1й раз перед подключением

git config --list  выводит настройки git
git remote -v показывает список репозиторий
git remote add <Любое название репозитория которое мелькает в объекте config> <сылка репозитория>

git help название команды про которую ходим узнать

некоторые управляющие символы. работают на разных командах
-m   master
-v   verbose
-t   branch
-f   fetch
-u --set-upstream
rm  remove  без -rm

#####---- git взаимодействие ----######
git clone URL проекта. //предварительно выбрав папку в которой вводим эту команду
git log --graph посмотреть кто на каких узлах (комитах)
git status - проверить статус. 4 статуса Untracked, Unmodified, Modified, Staget
git add название изменённого файла. "." выбирает все файлы. Указывается флаг -A без дальнейших названий если требуеться несколько файлов добавить
        git add подтверждает изменение файла, пересохраняя предыдущий файл. Если этого не сделать и ввести git commit то передастся
        предыдущий файл, а не новый. Кстате говоря когда мы пользуемся add мы добавляем изменение а локальный
        репозиторий который в дальнейшем переносим на github

git commit -m "какое-то указание к изменению"  если неправильно ввести то открываеться окно

git push -u <название репозитория сохранёного в remote> <название ветки которую хотим скинуть> 
#####################################################################################
#-- Если возникнет какая-то непредвиденая хуйня
#-- ввести git push -f origin master что бы это не значило
#-- на каком то этапе использовании git push возможно будет просить что-то типо  git push --set-upstream origin master
#-- ведя её вроде всё начнёт работать
#####################################################################################
git push - дальше можно просто тыкать и отправляет в репозиторий
git pull - если были изменения на репозитории кем-то, то эта команда скачает недостающие файлы


Создание ветоки даёт возможность получить копию ветки master, в копии которой мы можем что-то делать и смотреть на результат прежде чем
делать слияние с веткой master. Все разработчики делают свои ветки и не мешают друг другу. Когда кто-то закончил, переносит копию
в мастер заменяя изменение файлов. Другие разработчики при обращении к ветке master получают сообщение что в ветке были некие 
изменения которые требуеться скачать 

#####---- git взаимодействие с ветками ----######

git branch <далее название ветки> - есть основная ветка master, мы создаём свою
git checkout <далее название ветки на которую ходим перейти>. Если указать -b то мы сразу создаём и переходим(branch можно не использовать)

git branch -a  показывает все ветки, как локальные так и с github (с github маркируються remotes/название/название ветки)
git branch -d <название ветки> удаление ветки

git merge <название ветки> - объеденяет ветки, но прежде чем объединить нужно перейти на главную ветку master


/*Решения разного рода ошибок*/

Вывод сообщения типа
warning: LF will be replaced by CRLF in package-lock.json.
The file will have its original line endings in your working directory

убираеться git config --global core.autocrlf true