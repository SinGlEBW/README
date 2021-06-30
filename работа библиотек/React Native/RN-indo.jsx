/*

  npx react-native init имяПроекта     нельзя создавать через -. 
    Есть ключи: --version X.XX.X

    
 **Если предварительно устанавливали react-native-cli то удалить

 
  1. Нужно установить Java Development Kit. Это эмулятор телефона. 
      (Эмулятор можно запускать и без запуска Android Studio.)
     Скачать можно через Chocolatey
        choco install openjdk8 | cinst openjdk8   от админа
    Переменная JAVA_HOME установиться автоматически. 
    
  2. Ставим Android Studio. При установке поставить флаги:  Android SDK, Android SDK Platform, Android Virtual Device.
     После установки добавить локальные переменные: 
        ANDROID_HOME_ROOT  %LOCALAPPDATA%\Android\Sdk   и в 
        Path добавить %LOCALAPPDATA%\Android\Sdk\platform-tools
      Теперь можем запускать эмуляторы как с запуском Android Studio, так и не запуская, но используя файлы.

  3. Gradle как я понял есть в проекте и в Android Studio. Если запускать без запуска AS, то 
     возможно придётся изменить версию Gradle в нашем проекте, в папке 
      {проект}\android\gradle\wrapper\gradle-wrapper.properties
      изменить distributionUrl, тогда Gradle сможет распознавать JDK.
      Найти версию на сайте: services.gradle.org/distributions/
    С запуском AS сам у себя обновит. 
    

  4. Если хотим отображать приложение по USB на телефоне нужно, зайти в режим разработчика и включить 
    "Отладка по USB" и "Установка через USB" и подключить телефон и набираем в терминале "npm run android" 

  5. Если хотим увидеть в эмуляторе, то нужно 2 терминала: 
       в 1м  "npm run start"  во 2м  "npm run android".  


  7. Установить нужные версии Андроид в AS. Зайти в File -> Settings -> System Settings -> Android ADV и, так же во 
     вкладке SDK Tools установить:  
        Android SDK build-Tools, Android SDK Platform-Tools, Android-Emulator, Google Play services, intel x86 Emulator

  8. Скорей всего нужно создать профиля с мобильниками. В верху справа главного меню видно один профиль Pixel... 
      там найти ADM Manager и создать нужные профиля.
      Так же профиля сжираю пространство диска: C:\Users\boats\.android\avd

  9. Запускать эмулятор можно в Android Studio, после запустить npm run android в терминале проекта.



  
     Можно Запускать приложение через Expo. Expo это фреймворк над React-Native для облегчения работы. 
     Для этого читать документацию Expo использовать. Там запуск происходит через Dashboard Expo.

Как с так и без Expo есть авто обновление кода в эмуляторе

*/

/*---------------------------------------------------------------------------------------------
#########-------<{ Подключение RN к существующему проекту }>-------#########

  1. Создать папку, в неё перекинуть из стандартного проекта RN папку android или ios.
  2. Установить "react", "react-native"
  3. указать в package.json  "scripts": {  "start": "npx react-native start" }
  4. создать index.js 
  import { AppRegistry }  from 'react-native';

      AppRegistry.registerComponent( 'MyReactNativeApp', () => MyAppComponent );
  5. Через Android Studio в папке manifest проверим  android:usesCleartextTraffic="true"  и   android.permission.SYSTEM_ALERT_WINDOW
      ...  
      
  6. Настройте разрешения для наложения ошибок разработки про API level 23или выше ни фига не понял
 

 
   
  
  

*/










import { Text, Image, View } from 'react-native';
