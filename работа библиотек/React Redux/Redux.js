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
let combine = combineReducers({
  header: headerReducer,
})
//метод принимает результат combine и необязательный applyMiddleware() и возвращает сам store объект
createStore(combine, applyMiddleware(метод))//принимает (не обяз.) Middleware методы для расширения Redux



compose()()// в 1й выз. методы которые он будет вызывать по порядку, 2й выз. что он будет в них передавать

//Пример его работы
function compoZ(...param){

  return (Component) => param.reduce((pValue, item) => ({...pValue, ...item(Component)}), {})

}



"##########-------<{ React-Redux }>--------############"
//В файлах ...Container 
/*
  Взаимодействие dispatch и action в react. 
  В файле reducer создаются action функции и dispatch 
*/
//Старый способ. Приходиться по 100 раз прокидывать в dispatch action в ручную
connect();/*
  Требуется для получения props и возможность диспачить action из нужного файла с нашим компонентом,
  а не прокидывать через все промежуточные компоненты props и функцию dispatch до нашей компоненты.
 */
let mapStateToProps = (props) => ({home: props.home})
let mapDispatchToProps = (dispatch) => {
  let setPath = (data) => dispatch(setPathAC(data))
  let toggleBtn = (data) => dispatch(toggleBtnAC(data))

  return {
    setPath: setPath,//dispatch возвращает объект, а значит наша любая функция тож возвращает объект
    toggleBtn,//здесь просто функции вместо которых будут объекты
  }
}

//принимает объекты из методов mapStateToProps и mapDispatchToProps 2й вызов принимает Component где хотим пользоваться этим добром 
connect(mapStateToProps, mapDispatchToProps)(Component)

/*
  Новый способ. Однообразия в mapDispatchToProps можно избежать передав просто объект с нашими action.
  connect сам проверит что передаём и передаст автоматически в вызов dispatch и запрёт в замыкании наших новых методах.
*/
connect(mapStateToProps, {
  showImages: showImagesAC, //можно задать новое имя методу
  delImageAC//можно оставить таким же как action и сократить запись т.к. синтаксис ES6 позволяет 
})(Компонент)




/*
Есть промежуточный функционал Thunk для передачи в dispatch callback'a. Вместо объекта. Зачем это нужно?

	Redux-Thunk нужен если мы при одном действии обращаемся к нескольким нашим методам в props для изменения BLL.
	Установив Redux-Thunk промежуточный слой будет отслеживать что за данные в dispatch. Если это callback
	то он его запустит и проверит если возвращаться будет объект передаст в reducer.
*/


/*
	Бывает такое что функции из reducer и методы из контейнера пересекаются в презентационной компоненте
	поэтому если при передаче поставить правильный порядок то ненужные нам перезатираются
*/



/*
		let toggle = await !this.state.formSwitch;

		await this.setState({
			formSwitch: toggle,
			pathLogin: (toggle) ?  this.state.path + '/' : (`${this.state.path}/login`).replace(/^\/{2,}/, '/login')//true значит путь без login. При следующем клике(ВЫКЛ)
*/

/*
	Из-за того что header не привязан к Router и пути мы отслеживаем путь по всем ссылкам.
	1. При нажатии на любую ссылку нужно менять адрес +
	2. Где бы я на находился при нажатии на регистрацию или авторизацию
		 к адресу должно конкатенироваться /autorization или /registration,
		 при этом контент не должен уходить

*/