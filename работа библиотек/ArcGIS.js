/* eslint-disable no-alert, no-console */
/*  Обычный способ подключения */
import Map from '@arcgis/core/Map';
import argConfig from '@arcgis/core/config';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

/*или установить пакет esri-loader это обёртка над @arcgis. Подключение пакетов выглядит иначе и имеет приписку esri.*/
import { loadModules, loadCss } from 'esri-loader'; 

/*#########---------<{ Небольшое отступление }>---------############
  В ArcGIS куча классов и многие примеры указанны с добавлением какого либо класса,
  на самом деле ArcGIS зачастую преобразует автоматически переданные данные в нужный класс, 
  В документации есть пометки "AUTOCASTS"

  Пример который показывает как сокращается код: 
*/
// с подключением классов:
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      style: "diamond",
      color: new Color([255, 128, 45]),
      outline: new SimpleLineSymbol({
        style: "dash-dot",
        color: new Color([0, 0, 0])
      })
    })
  })
});
// без них
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
  renderer: {                        // autocasts as new SimpleRenderer()
    symbol: {                        // autocasts as new SimpleMarkerSymbol()
      type: "simple-marker",
      style: "diamond",
      color: [ 255, 128, 45 ],       // autocasts as new Color()
      outline: {                     // autocasts as new SimpleLineSymbol()
        style: "dash-dot",
        color: [ 0, 0, 0 ]           // autocasts as new Color()
      }
    }
  }
});

/*----------------------------------------------------------------------------------------------------------------------------------*/
/* 
АСИНХРОННОЕ ПОДКЛЮЧЕНИЕ ArcGIS.
  loadCss нужен если требуется определённую версию скачать css или с сервера
  loadCss('3.37')
  loadCss('http://server/path/to/esri/css/main.css'); Обычно хватает указать параметра в loadModules
 */
  loadModules(
    [
    "esri/Map",
    "esri/config",
    
    "esri/views/MapView",
    "esri/views/SceneView",
 
    //Если хотим виджеты
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
      //создание пользовательских вариантов
    "esri/Basemap",
    "esri/layers/VectorTileLayer",
    "esri/layers/TileLayer",
    //Создание фигур на карте
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/WebTileLayer",
    ], {css: true})
    .then(() => 
    ([
      eMap, eCfg,
      eMapView, eSceneView,
      eBasemapToggle, eBasemapGallery,
      eBasemap, eVectorTileLayer, eTileLayer,
      eGraphic, eGraphicsLayer,
      eWebTileLayer 
    ])=> {

      eCfg.apiKey = 'токен';//для использования пакета выдают токен в личном кабинете arcgis
      /* СЛОИ ЭТО ЭТО ОБЕЩАНИЯ.
        1. Все слои добавляются на карту, а карта отрисовывается в желаемом формате используя 2d(класс MapView) или 3d(SceneView).
        2. К опциям классов есть взможность обращаться через экземпляр. 
        3. Есть как минимум 5 стандартный способов добавить как слои на карту так и в слои графику.
          (Ни кто не мешает выходить на данные свойства и методы через другие экземпляры и под тем же соусом взаимодействовать с ними. ) 
              Классы слоёв: FeatureLayers || WebTileLayers || GraphicsLayers

               a) let instansMap = new Map({layers: экземпляр_слоя})    
               b) instansMap.add(экземпляр_слоя)//для динамического добавления слоёв
               с) instansMap.addMany([экземпляр_слоя])//для динамического добавления слоёв
                  
               d) map.layers = [экземпляр_слоя1, экземпляр_сло2] //заглянув в map.layers мы увидим не массив а объект с items, даже после такого добавления
               e) map.layers.push(экземпляр_слоя1, экземпляр_сло2)
        Для график всё тоже самое только обращение к свойству graphic let instansGraphic = new GraphicsLayers({graphic: экземпляр_graphic})    

          Экземпляр view наследует экземпляр map: view.map.layers = [экземпляр_слоя1, экземпляр_сло2]

          ВАЖНО:
            Казалось бы заманчивая идея исключить GraphicsLayers и кидать графику сразу же в view.graphic = [graphic1, graphic2], 
            но загвоздка в том что мы не сможем воспользоваться возможностью предлагаемых опций от new GraphicsLayers({}), я пробовал.
            Зная о том что мы обычно GraphicsLayers добавляем в Map, то добравшись туда, действительно видим что переданная графика через
            view.graphic автоматически обернулась GraphicsLayers в Map, но как только мы туда обращаемся видим undefined т.к. это асинхронная операция.
            




        4. Не смотря на на что напихиваем например в один GraphicLayer много new Graphic для Map это один слой
            это нужно учитывать если мы хотим менять zIndex слоёв через map.reorder, возможно нам менять zIndex надо на одном слое? 
        5. Нельзя один и тот же слой пихать на разные карты:
              let layer = new GraphicsLayer();
                map1.layers.add(layer); - Слой принадлежит карте 1 
                map2.layers.add(layer); - Слой теперь принадлежит карте 2 и будет автоматически удалён из карты 1 map1.layers.remove(layer) 
        
      */
      const map = new eMap({//иногда используют WebMap
        basemap: 'dark-gray',/*Заготовленный шаблон(профиль) карты. В документации есть кучу Basemaps шаблонов 
                             для тех у кого токен, и без него. Можно самому создать шаблон или использовать готовый*/                              
        ground: "world-elevation", /*параметр для (3d)SceneView земли. Не должно быть null или undefined, должен иметь или заготовленый
                                    профиль от Ground или сам экземпляр  new Ground({}).
                                    В MapView может использоваться если используем виджет с классами ElevationProfileLineGround, new ElevationLayers({}) new ElevationProfile({}) 
                "world-elevation" - 3d земля, работает через Terrain3D Service
                "world-topobathymetry" - 3d грунт, сервис TopoBathy3D
                 */
        //порядок слоёв важен
        layers: [FeatureLayers, WebTileLayers, GraphicsLayers],// 2d слои. один или массив перечисленных слоёв. 
        //layers: [VectorTileLayer, WebTileLayer, WMTSLayer],// или 3d слои,
        //layers: [MapImageLayer , ImageryLayer , WMSLayer ],// какие-то динамические слои,
      })
      




      /* Экземпляр map из полезного содержит: 
          только чтение:  */
        initialized: bool //проинициализирована ли карта
        destroyed: bool//вызыван ли destroy
        declaredClass: "esri.Map"//указывает что за класс используем. 
        allLayers: {// allTables, editableLayers - содержать те же свойства и методы
        /*Странно то что  allLayers объект, но носледует он (кастомные) методы Array и на нём их можем использовать 
        не смотря на то что это объект и эти методы возвращают специфичный объект*/

            getChildrenFunction()
            getCollections()
            itemFilterFunction()
            items: Array(3)
            length: 3
            
            filter((item, inx, )=>{}),//перебирает items, но только наши подклёчённые слои. В items могут быть ещё слои если подлючён готовый basemap
            flatten(()=>{}), map(()=>{})//даже если ничего не возвращать всё равно вернёт объект, просто не изменёный
            getItemAt(1);//вернуть слой по найденный по inx
            on()//change, after-add, after-changes, after-remove и для before 
            /* Пример 
                  map.allLayers.on("change", function(event) {
                    console.log("Layer added: ", event.added);
                    console.log("Layer removed: ", event.removed);
                    console.log("Layer moved: ", event.moved);
                  });
            */
        }
        allTables: {}//что бы работать с этим объектом мы должны использовать вместо графики new Featurelayer 
        editableLayers: {}//какие-то редактируемые слои
        /*
          несмотря на то что можем присваивать к данным свойствам массив layers = [], мы всё равно можем обратиться
          layers.items, что очень странно. Видим объект, layers но можем обращаться как к массиву вызвав любой метод массива 
        */ 
        layers: {
          items: []//массив 
        }
        tables: {}

        //методы
       
        add(layer), addMany([layer]) //добавить на карту слой или пачку слоёв или map.layers.push(layer, layer2);
        remove(layer), removeMany([layer]), removeAll(), //удаление слоёв
        destroy(),//Вырубает карту
        findLayerById(id)//найти слой по id
        findTableById(id)
        reorder(layer, inx);// перемещает слой в массиве изменяя его zIndex относительно других слоёв
        


     
/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
###########-------<{ Раздел View }>---------###########

  Карты, сцены, слои являются основой для всех приложений визуального картографирования.
  MapView - для создания 2D-приложений, SceneView - для создания 3D-приложений. 
  2D и 3D варианты используют слои.

  В 2d виде точка определяется точкой заданной в center: [] и параметром scale: number
  В 3d виде эта точка определяется положением камеры.


*/

//в документации не все свойства указанны т.к. смотреть нужно не MapView, а View
/*
  СВОЙСТВА НЕ ВОШЕДШИЕ В options КЛАССА используются для только для чтения через экземпляр
  ИЛИ ДОСТУП РАБОТАЕТ НЕПОСРЕДСТВЕННО ЧЕРЕЗ ЭКЗЕМПЛЯР 
*/
  const view = new eMapView({//настройки показа 2d карты
    map,
    container: "viewDiv", // свойство принимает id контейнера для отрисовки карты

    //3 свойства отвечающие за вид карты. Приоритет зависит от положения инициализации.
    //1й
    center: [30.3141, 59.9396], /* смещение по x(долгота) y(широта). 0 0 это где-то в индийском океане 
                                  || new Point({ x: 12804.24, y: -1894032.09, spatialReference: 2027  });*/
    zoom: 13, // уровень увеличения.
    scale: 20000,//текущее увеличение

    //2й. Можно не указывать свойства center, zoom, scale, а заполнить всё в одном месте 
    viewpoint: {/* тут можно описать точку обзора для 2D или 3D вида. не забыть  */
      targetGeometry: {
        type: "point",  
        longitude: 30.3141,
        latitude: 59.9396
      },
      rotation,
      scale,
      camera//принимает экземпляр Camera камеры если используем 3d вариант
    },

    //3й. Ещё альтернативный способ центрирования карты, вместо center и zoom
    extent: new Extent({ xmin: -9177882, ymin: 4246761, xmax: -9176720, ymax: 4247967, 
                          spatialReference: { wkid: 102100 } }),
                          
   
    graphics,//если не требуется использовать возможности прослойки layerGraphic, то можно сразу же сюда закинуть экземпляры графики 
    allLayerViews,//имеет объект с items перечисляющий все layer, предварительно обёрнутые доп объектом
    animation,//показывает установлена ли анимация через view.goTo(). Если анимация по событию, можно отследить изменение свойства через  view.watch()
    background: {
      color: '#123456'//цвет видно при увеличении карты
    },
   
    breakpoints: {//точки останова для css @media
      large: 1200,//всё что выше xlarge
      medium: 992,
      small: 768,
      xsmall: 544
    },
    //имена текущих breakpoint меняется в свойствах widthBreakpoint, heightBreakpoint изменяет его в процессе изменения размера карты.
    widthBreakpoint: "xlarge",/*указывает какому breakpoint относиться текущая ширина. */  
    heightBreakpoint: "medium",/*указывает какому breakpoint относиться текущая ширина.*/

    constraints: {
      maxScale,
      minScale: 500000,//до какого предела увеличивается карта,
      rotation: false,
      rotationEnabled: true,//возможность поворачивать карту с зажатой ПКМ
      maxZoom: 15,//ограничение максимального увеличения
      minZoom: 8,

      effectiveLODs,//только чтение значений.
      effectiveMaxScale,//только чтение значений.
      effectiveMaxZoom,//только чтение значений.
      effectiveMinScale,//только чтение значений.
      effectiveMinZoom,//только чтение значений.
      /*ограничивающий блок за который нельзя выйти при скроле карты. 
        можно использовать new Extent({}) или {type: 'polygon', свойства_polygon } */
      
      geometry:  new Polygon({//. Так же можно использовать объект 
        rings: [[
            [29.707526908203114, 59.301149332399326],
            [31.15222905664057, 59.301149332417076],
            [31.153602347656218, 60.20537612081401],
            [29.707526908203086, 60.20811006063809],
            [29.707526908203114, 59.301149332399326]
        ]]
      }),
      lods: [],//хз
    },

   
    floors: {},//Содержит набор FloorFilter, а он работает только с виджетами FeatureLayers и SceneLayers. Его задача вроде регулировать zIndex виджетов
    
    highlightOptions: {//подсветка фигуры при наведении 
      color: 'rgba(0,255,255,1)',
      fillOpacity: 0.25,
      haloColor: '#123456',
      haloOpacity: 1,
    },
 

    resizeAlign,//по ум. center. При изменении размера окна, одна из частей всегда стремиться быть в поле зрения. специфичная опция, center не стоит менять на что либо
    popup: {// popup описано ниже
      actions,
      alignment,
      autoCloseEnabled,
      autoOpenEnabled,
      collapseEnabled,
      collapsed,
      ontainer,
      content,
      defaultPopupTemplateEnabled,
      dockEnabled,
      dockOptions,
      featureMenuOpen,
      features, 
      goToOverride,
      container,
      headingLevel,
      highlightEnabled,
      id,
      label,
      location,
      maxInlineActions,
      promises,
      selectedFeatureIndex,
      spinnerEnabled,
      title,
      view,
      viewModel,
      visible,
      visibleElements
    },
    rotation,//изначальный поворот карты, если не включён
    
    spatialReference: {//какая-то пространственная привязка к карте
      wkid: 3857,//id профиля пространственной привязки. 102113, 102100, 3857.
      wkt: 111,
      //чтение
      isWebMercator: bool//указывает установлен ли в wkid один из 3х профилей
    },

    
    //взято из документации View, а не MapView
    basemapView,
    fatalError,
    padding,
    timeExtent,
    ui: {
      components: ["attribution"]//хз
    },
    layerViews,
    navigation: {
      gamepad: {
        enabled: false //отключить навигацию по карте на геймпаде
      }
    },
    
  });


//свойства экземпляра
//чтение
  view.orientation//landscape | portrait - указывает какая ориентация на данный момент у гаджета. через view.watch можно отследить
  view.resolution//показывает размер одного пикселя в пространстве карты. Бесполезное свойство
  view.type//показывает какого типа используем экземпляр '2d'(MapView) | '3d'(SceneView)
  view.interacting //меняется если происходит взаимодействие с картой
  view.updating //меняется если происходит обновление на карте. Если отслеживать свойства через watch, interacting чем то похоже 

//доступ только через экземпляр
  view.input.gamepad.enabledFocusMode = "none";//хз. что-то для геймпада

//Методы
  view.goTo();//перемещает карту на заданную координату. Можно организовать событие клика и передавать координату
  view.watch('имя_свойства', ()=>{});//принимает имя динамического свойства в view и следит за его возможным изменением 
  /*Динамические свойства:  animation,  widthBreakpoint, */



  view.focus()//добавляет рамку сигнализирующую что карта в фокусе(если её не отключили через css)
  view.get('animation')//получить свойство на 1м уровне.
  view.set('свойство', 'значение')//задать свойство
  view.destroy()
  view.hasEventListener('click')//есть ли на данном экземпляре событие click
  view.hitTest( {x: 0, y: 0} | "MouseEvent", {
    include:  'Слой или Массив слоев графики для включения в hotTest.',
    exclude: 'Слой или Массив слоев графики, которые нужно исключить из hotTest.'
  })

  view.toMap({x: 0, y: 0})//как-то преобразует координаты монитора в координаты на карте. Ничего не происходит.
  view.toScreen(new Point({latitude: 31.3141, longitude: 59.9396}))//преобразования точки на карте в пиксели не происходит
  view.tryFatalErrorRecovery()//вызов данной функции очистит накопившиеся ошибки в свойстве fatalError из-за проблем с WebGL 
  view.when( (view)=>{/*resolve*/}, ()=>{/*reject*/} )  //выполняется когда view полностью загружен
  view.whenLayerView('один_слой').then(() => {});/*может отслеживать загруженность слоя. 
      Всё равно это не решает адекватно отключать preloader, т.к. отрисовка слоя живёт своей жизнью */

  view.ui.add();//ui работает с классами widget. Один из них Feature. Об этом читать UI


/* мусор */
view.isFulfilled()
view.isRejected()
view.isResolved()

/*-------------------------*/

  view.takeScreenshot({// пример использования ниже в Event
      area: {x: 100, y: 100, height: 70, width: 80},//можно сделать скриншот определённой области
      format: 'jpg',//по ум. png
      height: 500,//по ум. высота области. если не указано определяется автоматически
      width: 500,//по ум. ширина области)
      ignoreBackground: false,//
      ignorePadding: false,
      layers: [],//заснять только определённые слои.(если не указан начальный слой, то снимок будто без фона). Без этого свойства делает полный снимок
      quality: 70//по ум. 98. качество от 0 - 100
  })
  .then((value) => {})




/*#######-------<{ События  View }>---------########### 
  Что возвращает объект Event можно почитать в разделе MapView в ArcGIS  


  Имена событий:
    blur, focus,
    click, double-click,(клики с припиской immediate-* ) 
    drag - срабатывает когда карту перемещают. event.action указывает состояние
    hold - срабатывает после кратковременного удержания миши или пальца на экране,
    mouse-wheel - прокрутка колеса мыши,
    pointer-*(enter, leave, down, up,  move)//мышь входит/выходит с области, нажали/отжали, нахождение мыши на области
    key-*(down,up),  
    layerview-*(create, create-error, destroy),//отрабатывает когда для каждый слоя создан оборачивающий слой layerView для отображения в view | или возникла ошибка | слой уничтожен
    resize - при изменении размера получаем 
          event{height: 775
          oldHeight: 775
          oldWidth: 1080
          width: 1050
        }
      но лучше использовать другой подход отслеживания размера окна через watch('widthBreakpoint')

  blur, focus, layerview-create, layerview-destroy, resize - не поддерживают модификаторы

  Модификаторы - это указание возможных клавиш к событию
  ["Control"]

  Пример1:

      view.on("drag", ["Shift", "Control"], function(e) {
          e.stopPropagation();
      });

  Пример2: Событие отрабатывает только с зажатым Shift 

      view.on('pointer-move', ["Shift"], function(event){
        view.toMap({x: event.x, y: event.y});
      
      });
*/
//отключение события по нажатию клавиш
view.on("key-down", ["Модификатор?"] | Function, function(event) {
  let prohibitedKeys = ["+", "-", "Shift", "_", "="];
  let keyPressed = event.key;
  if (prohibitedKeys.indexOf(keyPressed) !== -1) {
    event.stopPropagation();
  }
});

//Отрабатывает всякий  раз когда создаётся слой
 view.on("layerview-create", (event) => {
  if (event.layer.id === "ny-housing") {
    console.log( event.layerView);
  }
});

//Один из вариантов управлять увеличением и уменьшением карты через клавиши
view.on("key-down", function(event){ 
  (event.key === "a") 
    && view.goTo({ target: view.center, zoom: view.zoom + 1 });
  (event.key == "s")
    && view.goTo({ target: view.center, zoom: view.zoom - 1 });
});





/*
  Скорей всего понадобиться именно такой вариант события.
  hitTest проверяет объект event, и указывает в results массив слоёв графики по которым произошёл клик. 
  
  Если закидывать разные фигуры на один слой, при этом они визуально друг на друге, то не потребуется исключать какй-либо слой т.к. слой будет определяться только
  тот на который нажали.

  Если фигуры используют разные слои и при этом визуально так же друг на друге, то кликнув по верхней фигуре получим в results всю пачку слоёв.
  для исключения нужных слоём потребуется указывать в exclude или include
*/
//получение данных по нажатому полигону
view.on("click", function(event) {
  view
    .hitTest(event, { include: pointTeploGraphicsLayer, exclude: polygonTeploGraphicsLayer })
    .then(({ results }) => {
      if (results.length) {
        console.dir(results[0]);
      }
    });
});


view.on("click", function(event) {
  view.popup.fetchFeatures(event).then(function(response) {
    response.promisesPerLayerView.forEach(function(fetchResult) {
      console.dir(fetchResult);
    });
  });
});


//Пример скриншота: 
  view.on('click', ()=>{
    view.takeScreenshot({ignoreBackground: false}).then(function(screenshot) {
      let imageElement = document.getElementById("screenshot");
      imageElement.src = screenshot.dataUrl;
    });
  })


/*########--------<{ Примеры с использованием watch }>----------########*/

//Способ применять какие либо действия при достижении нужных точек останова ( @media )
view.watch("widthBreakpoint",function(breakpoint){
  switch (breakpoint) {
    case "xsmall":  break;
    case "small":
    case "medium":
    case "large":
    case "xlarge":  break;
    default:
  }
});


//проверка ориентации девайса
view.watch("orientation", function(newVal){
  if (newVal === "xsmall"){
    view.ui.components = [];
  }
})


//очистить возможные ошибки в fatalError
view.watch("fatalError", function(error) {
  error && view.tryFatalErrorRecovery();
  
});



//как решить вопрос с адекватным временем preloader на карте
const checkPreloader = (view, keyRenderMap) => (dispatch, getState) => {
  /*функция вызывается 1 раз поэтому значение preloader видим только начальное не измениться после dispatch, 
    поэтому используем flag, что бы не диспатчить при каждом скроле. Хотя при использовании отдельных 
    полигонов district checkPreloader вызывается постоянно, но это всё же универсальный способ*/
  let { mapState } = getState();
  let { preloader } = mapState.render[keyRenderMap];
  let flag = true;

  if(preloader){
    view.when(
      (e)=>{ 
        view.watch('updating', (status) => {
          if(!status && flag){
            flag = false
            dispatch({type: PRELOADER_FOR_MAP, keyRenderMap, preloader: false})
          }
        });
      }, 
      (error) =>{
        setErrorInHandler('Ошибка загрузки карты', keyRenderMap)(dispatch)
          console.log("Ошибка загрузки карты ", error);
      }
    );
  }

}




/*-------------------------------------------------------------------------------------------------------------
#######-------<{ goTo или управление анимацией }>---------###########
  goTo - Не отрисовывает фигуры, а просто получает координаты и перемещается к ним
  1й. аргумент. Пар. Можно сразу передавать фигуры или собрать свой объект
  GoToTarget2D = | number[] | Geometry [] | Collection<Geometry> |
  Graphic  [] | Collection<Graphic> | Viewpoint | any;


  2й. 
  animate?: boolean;
  duration?: number;//milliseconds
  easing?: 
  signal?: addEventListener, removeEventListener;//signal для прерывания анимации
*/

let ob = {
  target: new Point({
    latitude: 49,
    longitude: -126
  }),
  center: [33.3141, 59.9396],//вместо target
  zoom: 15,
  scale: 200000
}
//или 

let optionGoTo = {
  animate: bool,
  duration: 1000,//milliseconds,
  easing: "linear", //"linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | Function;
  // signal: 
}
view.goTo(ob, optionGoTo)//можно сразу передать всё что указанно в 1м аргументе, но будет без zoom, ...





/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Добавление фигур на карту. Слои + графика }>---------###########
  В отличие от виджетов, фигуры на карте присваиваются слоем(GraphicsLayer) самой карте,  а не на её
  поверхность отображения. Так что сначала создаём карту, закладываем в неё фигуры и отображаем в 2d||3d режиме
  
  Как сказано было ранее есть 5 способов добавить графику на слой. 
   
  Отличие GraphicsLayer от FeatureLayer и MapImageLayer, GraphicsLayer содержит несколько типов: "point", "polygon", "line".
  Для начала нужно накидать фигур на слой после чего его подключить на карту.
*/


      let pointGraphic = new eGraphic({
        visible: true,
        layer: [],
        geometry: { 
          type: "point",//"point",  "polyline", "polygon", "multipoint","extent", "mesh"
          longitude: -118.80657463861,//долгота
          latitude: 34.0005930608889//широта
        },
        symbol: {//как будет выглядеть
          type: "simple-marker", /*"simple-marker", "text", "simple-line", "simple-fill", "picture-fill", "shield-label-symbol",
                                   "picture-marker", "point-3d","line-3d", "polygon-3d", "web-style", "mesh-3d", "label-3d", "cim", */
          color: [226, 119, 40], 
          outline: {
              color: [255, 255, 255], 
              width: 1
          }
        },
        // не обязательные. об этом далее
        attributes: {},
        popupTemplate: {
          title: "Заголовок",
          content: `<p style="height: 200px;">Тестовое описание</p>`
        },
        layer: {},
        visible: true //видимость фигуры

      })

  

      let polyline = new eGraphic({
        geometry: {
          type: "polyline",
          paths: [
              [-118.821527826096, 34.0139576938577],
              [-118.814893761649, 34.0080602407843],
              [-118.808878330345, 34.0016642996246] 
          ]
        },
        symbol: {
          type: "simple-line",
          color: [226, 119, 40], 
          width: 2
        }
      })

/*ВАЖНО: тут указывается [долгота, широта]. На яндекс карте можем получить данные как отдельной точки,
         так и нарисовать фигуру, но там [широта, долгота] поменяны местами. Можно использовать метод .reverse() или переворачивать в ручную */
      const polygon = new eGraphic({

        geometry: {
          type: "polygon",
          rings: [
              [-118.818984489994, 34.0137559967283], 
              [-118.806796597377, 34.0215816298725], 
              [-118.791432890735, 34.0163883241613], 
              [-118.79596686535, 34.008564864635],   
              [-118.808558110679, 34.0035027131376]  
          ]
        },
     
        symbol: {
          type: "simple-fill",
          color: [227, 139, 79, 0.8],  // Orange, opacity 80%
          outline: {
              color: [255, 255, 255],
              width: 1
          }
        },
        //атрибуты придумываем самостоятельно
        attributes: {
          Name: 'Какое-то имя',
          Description: 'описание'
        },
        popupTemplate: {
          title: "{Name}",//string | Function | Promise
          content: "{Description}"//string | ({graphic}) => {} | Promise<any>;// например можно при клике получить данные с сервака
        }
    
      });


      
//Методы экземпляра Graphic 
let clonePoint = pointGraphic.clone(); //создаёт глубокою копию. Зачем нужна с теми же координатами хз.
pointGraphic.setAttribute('Description', 'ddddddddddddd')
pointGraphic.getAttribute('Description');
pointGraphic.getObjectId()//должна вернуть id но возвращает null пока не ясно как этим пользоваться
pointGraphic.getEffectivePopupTemplate()//возвращает экземпляр PopupTemplate данной фигуры




  //5 способов добавления фигуры в слой:
      let layer = new GraphicsLayer({
        graphics: [graphicA],
      });

   
      layer.graphics.add(graphicB);
      layer.addMany([graphicD, graphicE]);
      layer.graphics.push(graphicA, graphicB);
      layer.graphics = [graphicA, graphicB]; //Вместо layer.add = graphicA

 

      map.add(layer);

      const view = new eMapView({
        map,//добавляем экземпляр map на 2d view
        center: [-118.80500,34.02700], //Longitude, latitude
        zoom: 13,
        container: "viewDiv",
      });

    
 
      /*
        На самом деле можно добавлять через экземпляр view. Разницы я не заметил и при этом не нужен модуль GraphicsLayer
        Есть ещё пометка в доках:
          Каждая графика может иметь свой собственный символ, указанный, если родительский слой является GraphicsLayer.
          Такое добавление view.graphics.add(pointGraphic); как то ограничивает ли сами фигуры? 
      */






//Возможные опции в GraphicsLayer
  const districtGraphicsLayer = new GraphicsLayer({
    //возможные опции
    id: "layer1",
    title,
    blendMode: "soft-light",
    effect: "brightness(5) hue-rotate(270deg) contrast(200%)", //функции от css filter:
    elevationInfo: {}, //только для SceneView. Настройка оси z в 3d пространстве
    opacity: 0.5,
    screenSizePerspectiveEnabled: true, // значки размещённые на карте при увеличении и уменьшении правильно располагаются относительно карты
    graphics: [graphicA],
  
    elevationInfo,
    fullExtent,
    listMode,
    maxScale,
    minScale,
    visible,
  });
  

  
  //только чтение
  districtGraphicsLayer.loaded; //bool. указывает загружен ли слой
  districtGraphicsLayer.loadStatus; //not-loaded, loading, failed, loaded. этапы загрузки слоя
  	


  //методы
  districtGraphicsLayer.load()//обычно слой начинает загружаться по требованию map, но можно загрузить его руками за ранее
    





//Отрабатывает при загрузке слоя
districtGraphicsLayer.on("layerview-create", (ev) => {
  console.dir(1);
});


//пока не совсем понял. when ждёт когда слой загрузиться и отрабатывает, но пока от этого пользы не вижу
graphicsLayer.when((layer) => {  });



/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Класс Geometry и где он в цепи фигур }>---------###########
  Geometry - это базовый класс описывающий только геометрическую фигуру, но сама фигура описывается через классы 
              new Point(), new Polygon(), ..., Эти классы наследуют класс Geometry.

  а Graphic это совокупность нескольких классов(класс фигуры(например Point), PopupTemplate, Symbol, ...) и немного по другому описывает эти классы

  Описать фигуру можно как через классы непосредственно фигуры ( new Point(), new Polygon() и т.д.)
  или через Geometry с указанием type фигуры.
  возможные типы геометрии:
    "point"|"multipoint"|"polyline"|"polygon"|"extent"|"mesh"
*/


let point = new Geometry({ type: 'point', x: 14804.24, y: -1894032.09, spatialReference: { wkid: 102100 } })
let point1 = new Point({//или 
  x: 14804.24, //использует какие-то большие единицы  
  y: -1894032.09,//использует какие-то большие единицы  
  z: 0,
  latitude: 0,//вместо x
  longitude: 0,//вместо y
  m: 0,//какая-то единица так же указывающая положение точки на карте. Возможно для 3d
  spatialReference: { wkid: 102100 }//т.к. Point наследует Geometry можем добавить это свойство
  })

let graphic11 = new Graphic({
  geometry: { type: 'point', x: 14804.24, y: -1894032.09 }//автоматом преобразует в Geometry
}) 
//этот тип не работает с Graphic и служит для некоторых настроек отображения участка карты для view
let extent = new Extent({ 
  xmin: -9177882,
  xmax: -9176720,
  ymin: 4246761,
  ymax: 4247967,
  mmin: 0,
  mmax: 0,
 })









/*-----------------------------------------------------------------------------------------------------------------------------
##########-------------<{ Слой текста на полигонах }>-----------#############

*/

let textSymbol = {
  type: "text", // autocasts as new TextSymbol()
  text: "You are here",
  angle: 10, //поворот текста
  color: "white",
  backgroundColor: "#000000",
  borderLineColor: "#000000",
  borderLineSize: 2,
  kerning: false, //нужен ли интервал между символами
  lineHight: 5, //высота между строк
  lineWidth: 10, //ширина строки
  rotated: false,
  verticalAlignment: "",
  haloSize: "1px", //размер обводки у текста
  haloColor: "black", //цвет обводки у текста

  xoffset: 3, //смещение по оси
  yoffset: 3, //смещение по оси
  font: {
    // autocasts as new Font()
    family: "Josefin Slab",
    size: 12,
    style: "italic",
    weight: "bold",
  },
};








/*-------------------------------------------------------------------------------------------------------------
###########---------<{ Настройка popup }>---------###########
    
  Не загружая модуль "esri/widgets/Popup", можно воспользоваться некоторыми предустановленными настройками.
  Половину свойств не работает хоть и написано что можно что либо передавать. 


  Есть модуль Popup - с более расширенным функционалом, и PopupTemplate - скромней функционал
*/


/*
  По ум. popup настроен таким образом при достижении < 544px popup прилипает к низу и это поведение не изменить.
  Можно указать breakpoint для смещения этого поведения и даже указывать position, но в любом случаем < 544 он прилипнет к низу
*/
view.popup.dockOptions = {
  breakpoint: { width: 544, height: 544 }, /*@media max-width: 544. Всё что ниже поведение popup заточено под мобилу
                                            View size < breakpoint  то растягивается на 100% в ширину*/
  buttonEnabled: true, //показать или скрыть кнопку открепляющую popup от границ view
}




//только чтение
view.popup.dockEnabled = true; //по ум. false. закреплён ли popup к границам просмотра

//не чтение
view.popup.autoOpenEnabled = false; /*При указании в Graphic свойства popupTemplate будет включен стандартный popup при клике по элементам. Если хотим менять на свой нужно его выключить*/
view.popup.collapseEnabled = false; /*Полоса сверху popup для его сворачивания */
view.popup.alignment = "bottom-right"; /*Если popup не привязан к какой либо стороне путём внесением изменения данных в position, то
                                        можно отрегулировать его положение относительно элемента на котором вызываем popup.
                                        Можно задать функцию*/

view.popup.dockOptions = {
  buttonEnabled: true, //показать или скрыть кнопку позволяющую пользователю прикрепить popup к одной из сторон границ карты
  breakpoint: {
    width: 544,
    height: 544,
  } /*@media max-width: 544. Всё что ниже поведение popup заточено под мобилу
                                            View size < breakpoint  то растягивается на 100% в ширину*/,
  /*
  По ум. popup настроен таким образом при достижении < 544px popup прилипает к низу и это поведение не изменить.
  Можно указать breakpoint для смещения этого поведения и даже указывать position, но в любом случаем < 544 он прилипнет к низу
*/
};

view.popup.actions = {}; //объект для добавления действий на popup панель

//Методы
view.popup.open({
  //Можно открывать popup в событиях
  title: "Reverse geocode",
  location: event.mapPoint,
  content: "This is a point of interest",
});


/*-----------------------------------------------------------------------------------------------------------------------------
##########-------------<{  Добавление кнопок в popup }>-----------#############
*/

view.popup.actions.push({title: 'Кнопки1', id: 'test-id', className: 'my-popup'});//описываем объект на который будем ориентироваться 

view.popup.on("trigger-action", function(event){//отрабатывает на любые кнопки на popup
 
  if(event.action.id === "test-id"){
    test();
  }
});



/*-----------------------------------------------------------------------------------------------------------------------------
##########-------------<{ Раздел popupTemplate и его контент }>-----------#############
  Классы типов контента: TextContent | MediaContent | FieldsContent | AttachmentsContent | CustomContent

  Промежуточные класс: 
    ExpressionInfo. Для него существует определённый синтаксис Arcade. (Его конечно плотно разбирать не буду т.к. выглядит мягко говоря не очень)
    FieldInfo - определяет, в каких случаях не участвует или нет PopupTemplate.    Так же содержит данный синтаксис и доп параметры
  Классы присваиваются к свойству popupTemplate и наполняются контентом.
*/
//Посмотрели и ЗАБЫЛИ
popupTemplate: {
  content: "{expression/percent-unemployed}",
  expressionInfos: [
    {
     name: "percent-unemployed",
     title: "Percent unemployed",
     /*
      Везде где видим свойство expression, значит принимает этот код с закосом под js, строчного вида со своей глобальной переменной $feature.
      Как проверять работу этого кода я не представляю. Удобство нулевое.
     */
     expression: `
      var unemploymentRate = ( $feature.UNEMP_CY / $feature.LABOR_FORCE ) * 100;
      var population = $feature.POP_16UP;
      var populationNotWorking = ( ( $feature.UNEMP_CY + $feature.NOT_LABORFORCE_16 ) / $feature.POP_16UP ) * 100;
      // returns a string built using an Arcade template literal
      return \`\${$feature.COUNTY} County
      - Unemployment rate: \${Text(unemploymentRate, "##.#")}%
      - % population not working: \${Text(populationNotWorking, "##.#")}%
      - Population: \${Text(population, "#,###")}\`
     `
    }
  ]
}
//Для понимания где тут ExpressionInfo. Кстате наследует класс "esri.core.JSONSupport" - на всякий
popupTemplate: new ExpressionInfo({title: 'tet', expression: '',name: '', returnType: ''});//присмотревшись понятно что тут за что отвечает

/*Немного о FieldInfo. Примеров нет нафига он нужен.*/
new FieldInfo({fieldName,format,isEditable,label,statisticType,stringFieldOption,tooltip,visible})





/*>>-----{{ TextContent }}----------> */



/*
  В content: string | [{},{}] | promise | function
  string - Пишем любую строку даже строку с html элементами
  [{},{}] -   Массив объектов, каждый из которых содержит как минимум описывающий данные type.
    type: "fields" - поля которые будут отображаться как строки в таблице
    fieldInfos = [{},{}] - сопутствующий данному типу массив принимающий описание числовых полей

    type: "media" - будет создан слайдер 
    mediaInfos




    Не знаю зачем но в док. указано много классов, без которых и так можно взаимодействовать с кодом.
    Например:

    let textElement = new TextContent();
    textElement.text = "There are {Point_Count} trees within census block {BLOCKCE10}";

    let template = new PopupTemplate({
      title: "Заголовок",
      outFields: ["*"],
      content: [textElement]
      //если можно так 
       content: [
        {
          type: 'text',
          text: "<div class='test1'>Текст</div>"//или new TextContent().text
        }
      ]
    });

*/

popupTemplate: {
  title: "Какой-то заголовок";
  content: [
    {
      type: "text",
      text: "<div class='test1'>Текст</div>", //или new TextContent().text
    },

    {
      type: "fields", // Будет создана в popup типа таблица строки которой будет отличаться друг от друга
      fieldInfos: [
        {
          fieldName: "Числовые поля",
          label: "sda", //label приоритетней чем fieldName

          format: {
            //форматирование для числовых полей
            places: 0,
            digitSeparator: false, //ни на что не влияет хотя указана в доках
          },
        },
        {
          fieldName: "expression/per-asian",
        },
      ],
    },
    {
      type: "media", //text, media, fields, attachments, custom
      mediaInfos: [
        {
          title: "<b>Mexican Fan Palm</b>",
          type: "image", // указание типа данного медиа поля
          caption: "tree species",

          value: {
            sourceURL:
              "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
            fields: ["relationships/0/Point_Count_COMMON"],
            normalizeField: null,
            tooltipField: "relationships/0/COMMON",
          },
        },
      ],
    },
  ];
}



/*>>-----{{ AttachmentsContent }}----------> 
  Доступен только если используется FeatureLayer и включён 
    FeatureLayer.capabilities.data.supportsAttachment = true. При чём объект capabilities только для чтения, а как включить это никто не знает.
*/




/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Что за модули TextContent, MediaContent, FieldsContent, AttachmentsContent, CustomContent, Content }>---------###########











/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Добавление виджетов на карту }>---------###########

  Например переключение на гибрид.
  Виджеты добавляются на поверхность отображённой карты. 
  (далее будут фигуры на карте, они закладываются предварительно в карту, и карта закидывается в 2d-3d отображение) 
  
*/

const basemapToggle = new eBasemapToggle({//мини виджет миникарт: гибрид, топография
  view, //добавляем карту 2d или 3d карту
  nextBasemap: "arcgis-imagery"
});


const BasemapGallery = new eBasemapGallery({//виджет со скролом вариантов карт
  view, 
  source: {
    query: {
      title: '"World Basemaps for Developers" AND owner:esri',//это типа какой-то запрос вариантов отображаемых в виджете
    }
  }
});

view.ui.add(basemapToggle, 'bottom-right')//указываем, какой виджет добавить и куда
view.ui.add(BasemapGallery, 'top-right')//указываем, какой виджет добавить и куда

/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Создание собственных шаблонов для карты }>---------###########

Есть 2 типа: "векторный слой"(VectorTileLayer) и слой "мозайка"(TileLayer) 
Создание этих карт происходит в ArcGISOnline, но как пока не понятно.
После того как карта создана можно получить id и загрузить её
*/
  //1й слой основной слой дорог
  const vectorTileLayer = new eVectorTileLayer({
    portalItem: {
      id: "6976148c11bd497d8624206f9ee03e30" 
    },
    opacity: .75
  });
  //2й слой рельефа 
  const imageTileLayer = new eTileLayer({
    portalItem: {
      id: "1b243539f4514b6ba35e7d995890db1d" 
    }
  });
  //складываем слои на слой рельефа наложен будет слой дорог
  const basemap = new eBasemap({
    baseLayers: [ imageTileLayer, vectorTileLayer ]//порядок имеет значение
  });
  //инициализируем наш профиль в карте
  const map = new Map({
    basemap,
  });
  //выводим в 2d карте и настраиваем
  const view = new eMapView({
    container: "viewDiv",
    map: map,
    center: [-100,40],
    zoom: 3
  });


  new Extent({ xmin: 6077882, xmax:827882,  ymin: 8246761, ymax: 8247967 })
  //Предполагаю что берётся среднее значение указанных точек по которым и получаем точку по X Y

 

/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Разбор FeatureLayer + Feature }>---------###########
 Это тот случай когда нужно взять информацию из какой-т фигуры и вместо того что бы её отображать по нажатию открывая popup
  можно отображать сразу на карте без popup и как виджет
*/
  

  let gl = new FeatureLayer();
  let feature = new Feature({
    map,
    graphic: pointGraphic3,
  });
  view.ui.add(feature, "top-left");


  let featLayer = new FeatureLayer({
    apiKey, blendMode, opacity, id, maxScale, minScale, title, url, visible,

    copyright,
    customParameters,
    definitionExpression,
    displayField,
    dynamicDataSource,
    editingEnabled,
    effect,
    elevationInfo,
    featureReduction,
    fields,
    floorInfo,
    formTemplate,
    fullExtent,
    gdbVersion,
    geometryType,
    hasM,
    hasZ,
    historicMoment,			
    abelingInfo,
    labelsVisible,
    layerId,
    legendEnabled,
    labelingInfo,
    listMode,
    objectIdField,
    outFields,
    popupEnabled,
    popupTemplate,
    portalItem,
    refreshInterval,
    renderer,
    returnM,
    returnZ,
    screenSizePerspectiveEnabled,
    source,
    sourceJSON,
    spatialReference,
    templates,
    timeExtent,
    timeInfo,
    timeOffset,
    typeIdField,
    types,
    useViewTime,
  
  })


  let feature = new Feature({
    view, map, //привязать можно как к карте так и к view
    container,
    defaultPopupTemplateEnabled,
    graphic,
    headingLevel,
    id,
    label,
    spatialReference,
    viewModel,
    visible,
    visibleElements
  });

  view.ui.add(feature, "top-left");






/*-------------------------------------------------------------------------------------------------------------
###########-------<{ Раздел 3d SceneView }>---------###########
  настройки показа 3d карты
*/




const view = new eSceneView({//на карте появятся доп. значки управления картой 
  map,
  container: "viewDiv", 
  camera: {
    position: {
      x: -118.808,
      y: 33.961, 
      z: 2000 //высота до карты вместо zoom
    },
    tilt: 90//угол наклона камеры на высоте z
  },
  
});












})






/*###########-------<{ Arcade синтаксис }>--------##########
  Он может выполнять математические вычисления и оценивать логические утверждения.
  Специально разработан для создания пользовательских визуализаций, всплывающих окон и меток выражений
  Имеет геометрические операции которые позволяют рассчитывать площади и длины
*/
$feature //глобальная переменная доступна для функций в FeatureLayer










