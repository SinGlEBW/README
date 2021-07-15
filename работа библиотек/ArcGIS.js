/* В react спокойно могу импортировать модули 2мя способами. Обычный: */
  
    import Map from '@arcgis/core/Map';
    import argConfig from '@arcgis/core/config';
    import Graphic from '@arcgis/core/Graphic';
    import MapView from '@arcgis/core/views/MapView';
    import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
    import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

/*или установить пакет ersi-loader это обёртка над @arcgis. Подключение пакетов выглядит иначе и имеет приписку esri.*/

import { loadModules } from 'ersi-loader'; 
 // подключение происходит асинхронно.
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
    ],
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

    /*-------------------------------------------------------------------------------------------------------------
    #######-------<{ Добавление фигур на карту }>---------###########
      В отличие от виджетов, фигуры на карте присваиваются слоем(GraphicsLayer) самой карте,  а не на её
      поверхность отображения. Так что сначала создаём карту, закладываем в неё фигуры и отображаем в 2d||3d режиме
      
    */

      const map = new eMap({
        basemap: "arcgis-topographic",
      });
    
      //фигуры создаются через класс Graphic и каждый раз добавляются через класс GraphicsLayer

      let pointGraphic = new eGraphic({
        geometry: { //описание геометрии фигуры
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
        }
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
          color: [226, 119, 40], // Orange
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

      let graphicsLayer = new eGraphicsLayer();

      //добавление фигур на графический слой
      graphicsLayer.add(pointGraphic);
      graphicsLayer.add(polyline);
      graphicsLayer.add(polygon);

      map.add(graphicsLayer);//слой добавили на карту

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





