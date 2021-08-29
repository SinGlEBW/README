/* В react спокойно могу импортировать модули 2мя способами. Обычный: */
  
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

      const map = new eMap({
        basemap: 'arcgis-topographic',/*разрешить доступ службе слоя базовой карты. Заготовленный шаблон
                                        можно самому создать шаблон*/
        ground: "world-elevation", //параметр для SceneView, земля становится объёмной
      })
      /*
        Карты, сцены, слои являются основой для всех приложений визуального картографирования.
        Map - для создания 2D-приложений, Scene - для создания 3D-приложений. 
        2D и 3D варианты используют слои.
      */

    //настройки показа 2d карты
      const view = new eMapView({
        map,
        //координаты можно узнать в личном кабинете. об этом позже
        center: [-118.847, 34.027], // смещение по x(долгота) y(широта). 0 0 это где-то в индийском океане
        zoom: 13, // уровень увеличения
        container: "viewDiv" // div элемент
      });

    //настройки показа 3d карты
      const view = new eSceneView({//на карте появятся доп. значки управления картой 
        map,
        camera: {
          position: {
            x: -118.808,
            y: 33.961, 
            z: 2000 //высота до карты вместо zoom
          },
          tilt: 90//угол наклона камеры на высоте z
        },
        container: "viewDiv" 
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
        basemap: basemap,
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
  
  Принцип добавление графики:
    map.add( new eGraphicsLayer().add( new eGraphic({}) ), new eGraphicsLayer().add( new eGraphic({}) ) )  
*/



      const map = new eMap({
        basemap: "arcgis-topographic",
      });
    
      let graphicsLayer = new eGraphicsLayer(); //нужен для добавления Graphic фигур на слой карты
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
   





