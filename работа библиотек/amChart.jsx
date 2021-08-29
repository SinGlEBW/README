
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);


    

  let barChart = am4core.create('id_el', am4charts.XYChart3D);

  barChart.data = [{label: 'Тест', plan: 100, fact: 50}];
  barChart.cursor = new am4charts.XYCursor();

  /* 
  Что бы это работало нужно 2 оси оси добавить в chart. В xAxes и yAxes.  
    в "x"  добавим - CategoryAxis,  в  "y" - ValueAxis
    Возможные варианты для XY чарта: CategoryAxis, DateAxis, DurationAxis, ValueAxis
  */
  let categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category =  'label'; //Так можем добавить поле на которое будет смотреть а там храним заголовок
  categoryAxis.title.text = 'Текст под чартом'; //
  categoryAxis.title.fill = '#9457EB'; //цвет title

  let valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.title.text = 'Текст с боку';
  valueAxis.title.fill = '#ffffff';


/*####---------<{ Серии }>--------######
  Для эффективности диаграмма XY используют с сериями. Можно использовать много серий.
*/
let series = barChart.series.push(new am4charts.ColumnSeries());



/*####---------<{ События }>--------######
  Почти любой объект имеет adapter который может добавить событие
*/

  valueAxis.adapter.add('getTooltipText', (...d) => {  })
  dateAxis.adapter.add("getTooltipText", (text, target, key) => {}); //типа mouseover
  dateAxis.adapter.remove("getTooltipText");  //удаление прослушивающего события
  



  


/*####---------<{ Внешняя загрузка данный }>--------######
  Форматы зависят от того какой parser подключим
*/

chart.dataSource.url = "/data/myData.php";
chart.dataSource.parser = new am4core.JSONParser(); //, new am4core.CSVParser()
chart.dataSource.reloadFrequency = 5000; // перезагружать данные каждые 5s
chart.dataSource.load();// перезагрузить после того как данные приняты

//Событие на загрузку данных
chart.dataSource.adapter.add("url", function(url, target) {}); 

