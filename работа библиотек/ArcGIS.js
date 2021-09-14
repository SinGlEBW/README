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
 // подключение происходит асинхронно.
 /*
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
      /* 
        1. Все слои добавляються на карту, а карта отрисовываеться в желаемом формате используя 2d(класс MapView) или 3d(SceneView).
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
            но загвозка в том что мы не сможем воспользоваться возможностью предлагаемых опций от new GraphicsLayers({}), я пробовал.
            Зная о том что мы обычно GraphicsLayers добавляем в Map, то добравшись туда, действительно видим что переданная графика через
            view.graphic автоматически обернулась GraphicsLayers в Map, но как только мы туда обращаемя видим undefined т.к. это асинхронная операция.
            




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
        add(layer)
        addMany([layer])
        remove(layer), removeMany([layer]), removeAll(), //удаление слоёв
        destroy(),//Вырубает карту
        findLayerById(id)//вернёт слой
        findTableById(id)
        reorder(layer, inx);// перемещает слой в массиве изменяя его zIndex относительно других слоёв
        




      /*
        Карты, сцены, слои являются основой для всех приложений визуального картографирования.
        MapView - для создания 2D-приложений, SceneView - для создания 3D-приложений. 
        2D и 3D варианты используют слои.
      */

    
      const view = new eMapView({//настройки показа 2d карты
        map,
        container: "viewDiv", // div элемент
        //координаты можно узнать в личном кабинете. об этом позже
        center: [-118.847, 34.027], // смещение по x(долгота) y(широта). 0 0 это где-то в индийском океане
        zoom: 13, // уровень увеличения
      	/*
					allLayerViews,
			animation,
			background,
			basemapView,
			breakpoints,
			constraints,
			extent,
			fatalError,
			floors,
			graphics,
			heightBreakpoint,
			highlightOptions,
			layerViews,
			navigation,
			padding,
			resizeAlign,
			popup,
			rotation,
			scale,
			spatialReference,
			timeExtent,
			ui,
			viewpoint,
			widthBreakpoint
			
			*/
      });

    //настройки показа 3d карты
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


/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Добавление виджетов на карту }>---------###########

  Например переключение на гибрид.
  Виджеты добавляются на поверхность отображённой карты. 
  (далее будут фигуры на карте, они закладываются предварительно в карту, и карта закидывается в 2d-3d отображение) 
  
*/

    const basemapToggle = new eBasemapToggle({//мини виджет миникарт: гибрид, топография
      view: view, //добавляем карту 2d или 3d карту
      nextBasemap: "arcgis-imagery"
    });
    
    view.ui.add(basemapToggle, 'bottom-right')//указываем, какой виджет добавить и куда


    const BasemapGallery = new eBasemapGallery({//виджет со скролом вариантов карт
      view: view, 
      source: {
        query: {
          title: '"World Basemaps for Developers" AND owner:esri',//это типа какой-то запрос вариантов отображаемых в виджете
        }
      }
    });
    
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

/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Добавление фигур на карту }>---------###########
  В отличие от виджетов, фигуры на карте присваиваются слоем(GraphicsLayer) самой карте,  а не на её
  поверхность отображения. Так что сначала создаём карту, закладываем в неё фигуры и отображаем в 2d||3d режиме
  
  Как сказано было ранее есть 5 способов добавить графику на слой. 
   
  
*/



      const map = new eMap({ basemap: "arcgis-topographic" });
    
      let graphicsLayer = new eGraphicsLayer({
        id: 'layer1',
        minScale: 80000, //отображает слой если scale меньше 80000
      }); //нужен для добавления Graphic фигур на слой карты
      map.add(graphicsLayer);// Не забываем добавить на карту. слой добавили на карту


      let pointGraphic = new eGraphic({
        geometry: { 
          type: "point",//"point",  "polyline", "polygon", "multipoint","extent", "mesh"
          longitude: -118.80657463861,//долгота
          latitude: 34.0005930608889//широта
        },
        symbol: {//как будет выглядеть
          type: "simple-marker", /*"simple-marker", "text", "simple-line", "simple-fill", "picture-fill", "shield-label-symbol",
                                   "picture-marker", "point-3d","line-3d", "polygon-3d", "web-style", "mesh-3d", "label-3d", "cim";*/
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

      let clonePoint = pointGraphic.clone(); //создаёт глубокою копию. Зачем нужна с теми же координатами хз.
      pointGraphic.setAttribute('Description', 'ddddddddddddd')
      pointGraphic.getAttribute('Description');
      pointGraphic.getObjectId()//должна вернуть id но возвращает null пока не ясно как этим пользоваться
      pointGraphic.getEffectivePopupTemplate()//возвращает экземпляр PopupTemplate данной фигуры


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

    
      graphicsLayer.add(pointGraphic);
      graphicsLayer.add(polyline);
      graphicsLayer.add(polygon);
      /*
        На самом деле можно добавлять через экземпляр view. Разницы я не заметил и при этом не нужен модуль GraphicsLayer
        Есть ещё пометка в доках:
          Каждая графика может иметь свой собственный символ, указанный, если родительский слой является GraphicsLayer.
          Такое добавление view.graphics.add(pointGraphic); как то ограничивает ли сами фигуры? 
      */
      view.graphics.add(pointGraphic);
      view.graphics.add(pointGraphic);
      view.graphics.add(pointGraphic);

      const view = new eMapView({
        map,
        center: [-118.80500,34.02700], //Longitude, latitude
        zoom: 13,
        container: "viewDiv"
      });

    /*-------------------------------------------------------------------------------------------------------------
    #######-------<{ Добавление слоёв на карту }>---------###########
    
    */
        
  })

/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Класс FeatureLayer }>---------###########
*/
  let gl = new FeatureLayer();

/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Методы Map + Примеры }>---------###########
*/

map.reorder(graphicsLayer1, 0);


//Изменение zIndex Слоёв на карте
let graphicsLayer = new GraphicsLayer({id: 'test1'});
let graphicsLayer1 = new GraphicsLayer({id: 'test2'});
graphicsLayer.add(pointGraphic);
graphicsLayer1.add(pointGraphic2)
const map = new Map({
  basemap: "streets-vector",
  // ground: "world-elevation",
  layers: [graphicsLayer,graphicsLayer1]

})

const view = new MapView({
  map,
  center: [-118.747, 34.007],
  zoom: 13,
  container: "viewDiv",
});

map.reorder(graphicsLayer1, 0)


/*-------------------------------------------------------------------------------------------------------------
###########---------<{ Настройка popup }>---------###########
    
  Не загружая модуль "esri/widgets/Popup", можно воспользоваться некоторыми предустановленными настройками.
  Половину свойств не работает хоть и написано что можно что либо передавать. 


  Есть модуль Popup - с более расширенным функционалом, и PopupTemplate - скромней функционал
*/



view.popup.alignment = "bottom-right";/*Если popup не привязан к какой либо стороне путём внесением изменения данных в position, то
                                        можно отрегулировать его положение относительно элемента на котором вызываем popup*/


//только чтение
view.popup.dockEnabled = true;//по ум. false. закреплён ли popup к границам просмотра



//не чтение
view.popup.autoOpenEnabled = false;/*При указании в Graphic свойства popupTemplate будет включен стандартный popup при клике по элементам. Если хотим менять на свой нужно его выключить*/
view.popup.open({//Можно открывать popup в событиях 
  title: "Reverse geocode: [" + lon + ", " + lat + "]",
  location: event.mapPoint, 
  content: "This is a point of interest" 
});



/*
  По ум. popup настроен таким образом при достижении < 544px popup прилипает к низу и это поведение не изменить.
  Можно указать breakpoint для смещения этого поведения и даже указывать position, но в любом случаем < 544 он прилипнет к низу
*/
view.popup.dockOptions = {
  breakpoint: { width: 544, height: 544 }, /*@media max-width: 544. Всё что ниже поведение popup заточено под мобилу
                                            View size < breakpoint  то растягивается на 100% в ширину*/
  buttonEnabled: true, //показать или скрыть кнопку открепляющую popup от границ view
}

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
##########-------------<{ Раздел popupTemplate }>-----------#############
*/
