Команды применимые в далее

grep -oP '(?<="id":\s")(.*\b)' plugins/fetch.json //Отобразить найденное
grep -oP '(?<="id":\s)(.*)' plugins/fetch.json > data.txt //создать и записать в файл. (с кавычками ищет)
cordova plugin add $(grep -oP '(?<="id":\s")(.*\b)' plugins/fetch.json) //убрали кавычки, преобразовали в строку, так для установки

docker run -p $localport:$localport -v /$(pwd):/home/app -e PORT_START=$localport --rm -it --name $(npm run env | grep "npm_package_name" | awk -F "=" '{print $2}') node:v20