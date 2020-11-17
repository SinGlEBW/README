const { connect, } = require('react-redux');
/*eslint-disable*/
const { compose,combineReducers,applyMiddleware,createStore,bindActionCreators } = require('redux');
"##########-------<{ Redux }>--------############"
Redux /* При использовании обычного setState мы будем использовать во многих компонентах свой setState. Если 
         потребуется использовать одно состояние для разных компонентов, то нам придётся поднимать состояние
         вверх по структуре в любом случае, что бы не дублировать поведение. Начальный state будет в каждой 
         компоненте что не очень удобно отслеживать, state размазан по проекту. Redux это глобальный state.
         Использование обычного setState удобней всего на незначительных вещах которые не требуют внимания 
         в бизнес уровне
         */
reducer /*это функция которая принимает 2 параметра: начальное значения state и объект action и
          возвращает изменённый state*/
action  /* это функция которая возвращает объект у которого минимум есть свойство type*/

//метод который принимает объект reducer'ов
combineReducers({
  header: headerReducer,
})
//метод принимает результат combine и необязательный applyMiddleware() и возвращает сам store объект
createStore()
applyMiddleware()//принимает Middleware методы для расширения Redux
compose()()// в 1й выз. методы которые он будет вызывать по порядку, 2й выз. что он будет в них передавать
//Пример его работы
function compoZ(...param){

  return (Component) => param.reduce((pValue, item) => ({...pValue, ...item(Component)}), {})

}



bindActionCreators
$CombinedState

"##########-------<{ React-Redux }>--------############"

connect()()//принимает объекты из методов mapStateToProps и mapDispatchToProps 2й вызов принимает Component

/*
  Старый способ. В ручную каждый раз, указываем вызов dispatch и когда наш метод будет запущет
  dispatch передаст в state наш action объект
*/
let mapDispatchToProps = (dispatch) => {

   let showImages = (id) => {
      return dispatch(showImagesAC(id))
   }
   return {
      showImages
   }
}
//для наглядности. Ключи это не action, это функция которая свяжется с dispatch 
connect(mapStateToProps, mapDispatchToProps)(Компонент)
/*
  Новый способ. Когда мы вызовем showImages, то react-redux автоматически передаст 
  showImagesAC в вызов dispatch. Переданные параметры showImages передадутся в showImagesAC.
*/
connect(mapStateToProps, {
  showImages: showImagesAC
})(Компонент)

/*
  Сокращённая запись. Просто методы action называем так же ка те методы которы ходим видеть в props 
  и синтаксис ES6 позволяет сократить запись в объекте из {showImages: showImages} в: 
*/
connect(mapStateToProps, {
  showImages
})(Компонент)