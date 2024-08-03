
gitk --all&  //команда для графического показа коммитов
git clone git|ssh|ult|src ["дирекотрия"]-не обяз, но при желании можно указать куда клонировать
git fetch git|ssh|ult|src - откуда забрать
git branch - проверить какие ветки есть
git push имя-репозитория имя-ветки//git push origin Redux

По комитам можно переходить использовав ID

Есть локальные ветки (если ввести git branch -a), выглядят так:
*master
 cordovaDev
 cordovaReact

Есть удалённые ветки, описываються так:

    remotes/origin/cordovaDev
    remotes/origin/cordovaReact
    remotes/origin/master
они появляються после того когда используем push и соответствуют локальному имени ветки.
При обращении на удалённые ветки remotes/ опускается. Имя берётся origin/cordovaDev и т.д.



Шаги по веткам.
    Исползуем: git clone имя_репозитория //получаем данные из ветки master в локальную ветку master.
    1. Локальные ветки и удалённые ветки репозитория связаны. 
    2. Удалённые ветки появляються если была создана локальная ветка и была выполнена команда push.
    3. Каждый разработчик введя "git branch -a" увидит все общие ветки на репозитории и все ТОЛЬКО СВОИ локальные ветки.
        В начале новый разработчик клонирует репозиторий и получает данные ветки master. Локальных веток у него пока нет, но он 
        хочет начать разработку с общей ветки dev. 
        Есть 2 варианта. Или он работает в своей ветке локальной ветке и когда запушит в репозитории появиться 
        новое ответвление или он работает в той же локальной ветке dev.
         2й вариант, ему требуеться создать или такую же локальную ветку dev "git checkout -b dev"
         и прописать "git pull origin dev"  и он в локальную ветку dev получит данные с удалённого репозитория dev ветки
         и при push будет попадать куда надо.

         1й вариант есть 2 пути:
            Например разработчик создал свою новую локальную ветку "git checkout -b mydev",
            далее забрал данные с репозитория с ветки разработки "git pull origin dev". Но когда он закончит,
            то либо ему сразу пушить тогда образуется новая ветка на репозитории, либо ему соединять
            данные локальной ветки с другой локальной веткой и запушть от её имени. 

* ВАЖНО. Когда внесены изменения в локальной ветке, на другую длкальную ветку нельзя перейти пока не будет 
         сохранения, git add .
         
       
    

#####---- git настройка ----######
git help название команды про которую ходим узнать

git init  появиться файл .gitignore начинаеться слежка за проектом. Нужно проследить что бы новый проект был инициализирован.
          У меня была проблема когда была инициализированна общая папка с проектами в итоге была путаница.
          Каждый проект своя инициализация. На это указывает скрытая папка в проекте .git
1м делом как только установили git нужно войти в свой кабинет через Git branch
git config --global user.email "you@example.com"
git config --global user.name "имя" вроде как это не то имя которое вводиться 1й раз перед подключением


git config --list  выводит настройки git
git config --global --list  имя email там можно проверить
git remote -v показывает все репозитории: имя репозитория(стандартно origin оставляют) и URL репозитория. 
git remote  //имена
git remote rm origin удалить можно лишний репозиторий из слежки
git status - проверить статус. 4 статуса Untracked, Unmodified, Modified, Staget

git stash  --keep-index  отменит все изменения внесённые до использования git add .  
             Удобно когда напартичили, и хочеться вернуться к исходному состоянию. 
             Добавленные файлы при этом не удаляються, но подчистит от них если их где-то начали использовать.

В новом проекте возможно будет старый репозиторий. Добавить новый. По сути привязываем локальный к глобальному репозиторию
git remote add <Любое название репозитория которое мелькает в объекте config> <сылка репозитория>

 git branch --set-upstream-to=origin/<branch> cordovaDev


некоторые управляющие символы. работают на разных командах
-a   all
-m   master
-v   verbose
-t   branch
-f   fetch
-u --set-upstream
rm  remove  без -rm

#####---- git взаимодействие ----######
git clone URL проекта. //предварительно выбрав папку в которой вводим эту команду
git log --graph посмотреть кто на каких узлах (комитах)

git add название изменённого файла. "." выбирает все файлы. Указывается флаг -A без дальнейших названий если требуеться несколько файлов добавить
        git add подтверждает изменение файла, пересохраняя предыдущий файл. Если этого не сделать и ввести git commit то передастся
        предыдущий файл, а не новый. Кстате говоря когда мы пользуемся add мы добавляем изменение а локальный
        репозиторий который в дальнейшем переносим на github

git commit -m "какое-то указание к изменению"  если неправильно ввести то открываеться окно
git commit -am "какое-то указание к изменению"  //вроде как ключ -a это git add . 


git push -u <название репозитория сохранёного в remote> <название ветки которую хотим скинуть> //(master ветка главная обычно)
#####################################################################################
#-- Если возникнет какая-то непредвиденая ситуация
#-- ввести git push -f origin master что бы это не значило
#-- на каком то этапе использовании git push возможно будет просить что-то типо  git push --set-upstream origin master
#-- ведя её вроде всё начнёт работать
#####################################################################################
git push - дальше можно просто тыкать и отправляет в репозиторий
git push -f origin master  //после удаления папки .git и новой инициализации git выдаёт ошибки hint
                           (предлагает pull, но ошибка не уходит) -f решит проблему

git pull - если были изменения на репозитории кем-то, то эта команда скачает недостающие файлы, вместо того что бы по новой использовать git clone URL
git pull origin branchname --allow-unrelated-histories всё равно достать данные из удалённого репозитория

git restore имя_файла  //откатит назад до последнего коммита



Создание ветоки даёт возможность получить копию ветки master, в копии которой мы можем что-то делать и смотреть на результат прежде чем
делать слияние с веткой master. Все разработчики делают свои ветки и не мешают друг другу. Когда кто-то закончил, переносит копию
в мастер заменяя изменение файлов. Другие разработчики при обращении к ветке master получают сообщение что в ветке были некие 
изменения которые требуеться скачать 

#####---- git взаимодействие с ветками. На Одном репозитории. ----######
//есть основная ветка master
git branch <название ветки> - создаём ещё новую. Что бы перейти использовать checkout
git branch -d <название ветки> - удалить ветку. Если что git предупреждает связь ветки с репозиторием.  -D хардкорно удалить.  

git checkout <название ветки для перехода>. Если указать -b то мы сразу создаём и переходим(branch можно не использовать)
git checkout -b serverfix origin/serverfix //создание новой ветки и подтягивание удалённой

git branch -a показывает все ветки как локальные так и с github (с github маркируються remotes/название/название ветки)
git branch -v -a показать доп информацию веток
git branch -d <название ветки> удаление локальной ветки
git push origin -d <название ветки> удаление удалённой ветки
git branch -m <новое название ветки> переменует текущую ветку


git branch --merge//посмотреть соединённые ветки

git merge <название ветки> - объеденяет ветки, но прежде чем объединить нужно перейти на главную ветку master. 
Чем то похоже на git pull, но pull забирает новые изменения с github
git merge-base <ветка куда сливаем> <которую ветку сливаем>  - вернёт id новой ветки. это не сливание, а лиш показывает id будущей ветки если будет слияние



/*Решения разного рода ошибок*/

Вывод сообщения типа
warning: LF will be replaced by CRLF in package-lock.json.
The file will have its original line endings in your working directory

убираеться 
git config --global core.autocrlf false
git config --global core.safecrlf false

Установка Алиасов
git config --global alias.co checkout
git config --global alias.ct commit
git config --global alias.st status
git config --global alias.br branch


https://russianblogs.com/article/91811417392/

1. Создайте ключ ssh и загрузите его в Github / Gitlab.
    # Укажите имя файла при генерации открытого ключа и секретного ключа, Gitlab использует
    ssh-keygen -t rsa -f ~/.ssh/id_rsa.gitlab -C "w_zhangguanjun@xx.com.cn"
    # Создать по умолчанию, Github использует
    ssh-keygen -t rsa -C "championzhang007@gmail.com"

2. Настройте файл конфигурации. 
    touch ~/.ssh/config
    В файле указать
        Host *intra.xxx.com
            IdentityFile ~/.ssh/id_rsa.gitlab
            User zhangguanjun
3. добавить ключи в git Hub|Lub  -  id_rsa.pub|id_rsa.gitlab
4. Убедитесь, что все в порядке.
    ~  ssh -T git@github.com
    ~  ssh -T git@gitlab.dev

5. Добавить данные пользователя в git config --global и --local с данными user.name и user.email
    git config --local user.name 'grigoriy.shlyakhtich' && git config --local user.email 'grigoriy.shlyakhtich@ruitb.ru'


Добавление в несколько репозиториев
git remote add origin https://github.com/SinGlEBW/med-call-ivanovo.git 
git remote set-url --add --push "origin" https://github.com/SinGlEBW/med-call-ivanovo.git
git remote set-url --add --push "origin" https://git.ruitb.ru/grigoriy.shlyakhtich/med-call-ivanovo.git

git push origin


