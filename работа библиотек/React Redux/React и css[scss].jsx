import "./App.css";
/*
  Подключая таким образом css в каждом js файле, в html будет появляться новый
  раздел в head с тегом <style type="text/css"> стили </style>
  Здесь всё как обычно контроль за классами ложиться полностью на разработчика.
*/
import c from"./App.module.css";
/*
 Есть возможность css файлы использовать как объект. В таком случае в каждом css файле можно 
 не заморачиваться и писать одинаковые классы типа "item" потому-что в конечном итоге react генерирует приписку классам.
*/

//Стили можно в react писать, но не очень удобно.
let style = {
  ul: {
    marginLeft: "20px",
    background: "#551188"
  },
  li: {}

}

let MyComponent = (props) => (
  <div className={c.header} >
    <ul style={style.ul}>
      <li style={style.li}></li>
    </ul>
  </div>
)
