/*########--------<{ Старый способ }>-------########*/
//в index.jsx. объект stateData получен из reducerStore файла. 
/*
	Способ прокинуть контекст через React.Provider не рассматривается т.к. не рекомендуется его использовать, для этого есть Redux.
	Как это работает можно глянуть в файле React.
*/
<React.StrictMode>
	<App dispatch={stateData.dispatch} {...stateData.getState()} />
</React.StrictMode>;


//в App.jsx
	<Route path='/chat' render={(props) => <ChatContainer dispatch={this.props.dispatch} chat={this.props.chat} {...props}/>} />;
/*
	данные из stateReducer пробрасываются строчкой "this.props.chat"
	...props - добавляет небольшой объект с данными:  history: {}, location: {}, match: {}, staticContext: undefined

	Способ неудобен тем про в ChatContainer придётся дальше прокидывать: <MyComponent {...this.props}/>
*/
/*
	dispatch пробрасывается что бы дать команду передачи данных в state в более удобном месте. Для этого создают
	функцию при вызове которой будет вызываться dispatch с нужным нам action. 
	Роль action это нести информацию в виде объекта на основании которого будет найден нужный участок для обновления state. 
	action обычно описывается в reducer файле и импортируется к dispatch функции.
*/
	//action в chat-reducer файле 
	export const inMessAction = (text) => ({type: IN_MESS, text})

	//наша задача отправлять нужный импортированный action через dispatch для обновления reducer.
	let inMess = ({ target }) => props.dispatch(inMessAction(target.value));
	let send = () => props.dispatch(sendAction(refTextarea2.current.value));
	//неудобство в том что нужно +- писать одну и туже конструкцию с dispatch.

	//Данные оболочки inMess, send можем передавать дальше через props конечному компоненту.


/*---------------------------------------------------------------------------------------------------*/
/*########--------<{ Новый способ }>-------########*/
//Отказаться и не прокидывать таким способом dispatch и state в целом. Получать 

// в index.jsx
<React.StrictMode>
	<Provider store={reduxStore}>
		<App  />
	</Provider>
</React.StrictMode>;

//в App.jsx
<Route exact path='/' render={(props) => <ChatContainer {...props}/>}/>
/* в this.props уже пусто проброс осуществляется через импортированную в нужном файле функцию connect: */

// в каком-нибудь ChatContainer
import { connect } from 'react-redux';
import Contact from './Contact'; //чистая компонента
import { setPathAC, toggleBtnAC, editLinksAC } from './chat-reducer';

class ChatContainer extends Component {
	render = () => <Chat/>
}

let mapStateToProps = (state) => ({contact: state.contact});
/*
	теперь функция connect даёт возможность в 1м callback'e определить какой state нам нужен, а во 2м
	подготавливать функции с пробросом action через dispatch во 2м callback'e.
	Во 2м вызове передаётся тот компонент в котором хотим использовать данные методы и props
*/ 
let mapDispatchToProps = (dispatch) => {
	let setPath = (data) => dispatch(setPathAC(data))
	let toggleBtn = (data) => dispatch(toggleBtnAC(data))
	let editLinksAC = (data) => dispatch(editLinksAC(data))
	
	return {
		setPath: setPath,//dispatch возвращает объект, а значит наша любая функция тож возвращает объект
		toggleBtn,//здесь просто функции вместо которых будут объекты
		editLinksAC,
	
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactContainer);//подключаю в App.jsx
/* МИНУС всё тот же: Повторение +- одной и той же конструкции dispatch, да и вообще мы могли бы не давать кучу имён нашим 
	функциям как например задал одно и тоже имя "editLinksAC" . 
*/

/* connect имеет короткую запись. 2й параметр указывается как объект который принимает action.
	 connect будет автоматом передаст их в dispatch и под теми же ключами добавит в props*/

export default connect(mapStateToProps, {
	setPathAC: (data)=> ({ type: 'ADD_PATCH', path: {data} })
})(Home);
//


//action можно держать в файлах с reducer и импортировать передавая так:  
export default connect(mapStateToProps, {
	setPathAC,
	toggleBtnAC,
	editLinksAC 
})(ContactContainer)





/*---------------------------------------------------------------------------------------------------
########--------<{ Redux-Thunk }>-------########

	Зная о сокращённой записи будет более понятно зачем Thunk, но не особо понятно в старой записи.
	Thunk должна быть подключена как промежуточная функция:
		createStore(reducers, applyMiddleware(thunk));
	после появиться возможность передавать не только функцию возвращающую объект, (то есть action), 
	а передать функцию которая должна вернуть другую функцию в которую connect закинет аргументы 
	dispatch, getState
*/



export default connect(mapStateToProps, {
	setPathAC: (data)=> ({ type: 'ADD_PATCH', path: {data} }),
	getPostsAsync: (data) => (dispatch, getState)=>{ }
})(Home);


/* И вот делема которая меня смущает. Такая функция называется асинхронной вот пример запроса к базе */


export default connect(mapStateToProps, {
	setPathAC: (data)=> ({ type: 'ADD_PATCH', path: {data} }),
	getPostsAsync: (id) => (dispatch, getState)=>{

		fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
      .then(response => response.json())
      .then(json => dispatch(addPostsAction(json)))//тут теперь прокидываем action
      .catch(console.err)

	}
})(Home);
/*
	Зная о том что сокращённая запись закидывает в dispatch, да ещё мы внутри снова используем dispatch, но для данных,
	то запись через mapDispatchToProps выглядит так: 
*/




let mapDispatchToProps = (dispatch) => {

	return {
		//UI -> DAL   UI -> BLL
		getPostsAsync1: (id) => {

			fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
			.then(response => response.json())
			.then(json => dispatch(addPostsAction(json)))
			.catch(console.err)
		},

		//UI ->  BLL -> DAL 
		getPostsAsync2: (id) => dispatch((dispatch, getState) => {

			fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
			.then(response => response.json())
			.then(json => dispatch(addPostsAction(json)))
			.catch(console.err)
		}),

		setStatePreloader: (bool) => dispatch(preloaderPostsAction(bool))

	}
}
/*
	В чём смысл? Что мне мешает использовать 1й вариант? 
*/

export default connect(mapStateToProps, mapDispatchToProps)(Home);



/* Предположим мы делаем запрос и пока не пришли данные меняем состояние загрузки*/

let mapDispatchToProps = (dispatch) => {

	return {
    getPosts: (id) => {

				dispatch(preloaderPostsAction(true))
				fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
				.then(response => response.json())
				.then(json => {
							dispatch(preloaderPostsAction(false))
							dispatch(addPostsAction(json))
				})
				.catch(console.err)
        
		},
		getPostsAsync: (id) => dispatch((dispatch, getState) => {

				dispatch(preloaderPostsAction(true));
				fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
				.then(response => response.json())
				.then(json => {
							dispatch(preloaderPostsAction(false))
							dispatch(addPostsAction(json))
				})
				.catch(console.err)

		}),
	}
}

/*
	хз. Работает как с санками так и без санок. По всей видимости санки придуманы для короткой записи. 
	Ну вот, без mapDispatchToProps заполучить метод dispatch можно только через Thunk. 
	** Все примеры без вынесения функций, чтоб было понятно. 
*/

export default connect(mapStateToProps, {

	getPostsAsync: (id) => (dispatch, getState) => {

			dispatch(preloaderPostsAction(true));
			fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
			.then(response => response.json())
			.then(json => {
					dispatch(preloaderPostsAction(false))
					dispatch(addPostsAction(json))
			})
			.catch(console.err)

	},
	
})(Home);

/* Так если дело в dispatch, то смысл отказываться от mapDispatchToProps и тянуть пакет Thunk если можно сделать так: */

export default connect(mapStateToProps, (dispatch) =>({
	getPosts: (id) => {

		 dispatch(preloaderPostsAction(true));
		 fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
		 .then(response => response.json())
		 .then(json => {
				dispatch(preloaderPostsAction(false))
				dispatch(addPostsAction(json))
		 })
		 .catch(console.err)

	},

}))(Home);



/* Если попытаться вынести методы за пределы, то картина без Thunk в такой записи не очень*/

let getPosts = (dispatch, id) => {
	console.dir(dispatch);
		 dispatch(preloaderPostsAction(true));
		 fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
		 .then(response => response.json())
		 .then(json => {
				dispatch(preloaderPostsAction(false))
				dispatch(addPostsAction(json))
		 })
		 .catch(console.err)
}


export default connect(mapStateToProps, (dispatch) =>({
	getPosts: getPosts.bind(null, dispatch), // 1й способ
	getPosts: (id) => getPosts(dispatch, id), // 2й способ


}))(Home);


/* 
	** Если охота прокидывать параметры для каждой функции как показал выше, то Thunk можно не указывать, 
		 но с ними всё лаконичней.  Можно ещё по заморачиваться и попробовать оставить  mapDispatchToProps в конечном итоге  
		 Thunk окажутся удобней */


let getPostsAsync = (id) => (dispatch) => {
	console.dir(dispatch);
		 dispatch(preloaderPostsAction(true));
		 fetch('https://jsonplaceholder.typicode.com/posts?userId=' + id)
		 .then(response => response.json())
		 .then(json => {
				dispatch(preloaderPostsAction(false))
				dispatch(addPostsAction(json))
		 })
		 .catch(console.err)
}


export default connect(mapStateToProps, {
	getPostsAsync,
})(Home);

/*
	Итог: Если не хочется отказаться от mapDispatchToProps может быть функций мало, то  Thunk можно не использовать,
				но для выноса в отдельный файл таких функций с Thunk получим короткую запись чем без неё.

*/


/*---------------------------------------------------------------------------------------------------
########--------<{ Понятие Селекторы в React-Redux }>-------########
	Это решение которое требует забирать данные в mapStateToProps через функции а не напрямую.  
*/

const mapStateToProps = ({app}) => ({
	users: app.pages.users
})
const mapStateToProps = ({app}) => ({
	users: app.pages.users
})
const mapStateToProps = ({app}) => ({
	users: app.pages.users
})
//... 
/* Предположим мы в state изменили имя users на allowedUsers, в таком случае нам придётся лазить по всем компонентам и менять
	 users: app.pages.allowedUsers. Не очень то и удобно. Раз у нас повторяется логика 	users: app.pages.users, то нужно занести это
	 в функцию.
	 Например:
*/

const mapStateToProps = (state) => ({
	users: getUsers(state)
})
const mapStateToProps = (state) => ({
	users: getUsers(state)
})
const mapStateToProps = (state) => ({
	users: getUsers(state)
})


const getUsers = ({app}) => (app.pages.users)//и теперь если будет изменение то имени то править будет в одном месте.

