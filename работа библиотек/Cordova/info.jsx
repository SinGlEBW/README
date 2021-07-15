
/*
#########--------<{ Установка и настройка cordova }>--------##########
   cordova -h \\помощь
   1. npm install -g cordova
   2. cordova create имяПроекта 
   3. cordova platform add android  -  создать платформу     

   4. Скачать Grable https://gradle.org/releases/   распаковать в  C:\Program Files\Grable\gradle-7.1
      и прописать переменные в "Path"  C:\Program Files\Grable\gradle-7.1\bin   
      
   5. Установить AndroidStudio https://developer.android.com/studio   и  Java Development Kit (JDK) 7 (1.7 v)

   6. Установить локальные переменные:(Windows 10) Система->Доп.параметры системы->Переменные среды - 
      В разделе "Переменные среды пользователя" | "Системные переменные" найти "Path" и изменить добавив:
         для AndroidStudio.(удостоверившись в правильном пути)
            C:\Users\boats\AppData\Local\Android\Sdk\tools
            C:\Users\boats\AppData\Local\Android\Sdk\platform-tools

         Помимо "Path" просто переменные 
      JAVA_HOME  C:\Program Files\Java\jdk1.7.0_75  (путь до установленной версии)
      ANDROID_SDK_ROOT C:\Users\boats\AppData\Local\Android\Sdk


   7. В AndroidStudio зайти в sdk Manager и во вкладке: 
         SDK Platform   установить нужные модели
         SDK Tool  поставить Android Emulator, Android SDK build поставить 30.0.3, Android SDK Platform Tool,
                  Google Play service, intel x86...

   8. cordova requirements  - проверить всё ли устраивает кордову

   9. cordova build android  



/*------------------------------------------------------------------------------------------------
#########--------<{ Использование cordova }>--------##########

1. Файлы редактируют в основной папке www, а не в platforms/www.
   Они автоматически перекидываются в platforms 

cordova build  - build всех платформ, (это сокращённый вариант команд  cordova prepare android  и  cordova compile android
cordova build android - конкретный build



*/

/*------------------------------------------------------------------------------------------------
#########--------<{ Команды cordova }>--------##########
cordova platform update <platform@version>    обновление
cordova platform remove || rm <platform>   удаление платформы



cordova plugin [add || rm] имя_плагина

cordova info  - выводит в консоль информацию о сборках, версиях и config.xml
*/




/*-----------------------------------------------------------------------
#########--------<{ config.xml }>--------##########

   widget - id проекта возможно используеться другими пакетами
   name - имя проекта

   cordova create имя_папки_проекта id_widget имя_name;  2 последних парраметра записывают в confog.xml 

*/