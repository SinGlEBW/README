const { useState, useEffect, useContext, useMemo, useCallback } = require('react');
/*
Хуки появились в 16.8.0 версии. 
  Хуки это функции которые делают то же самое что и стандартные методы React
  классовых компонентов. 
  Хуки не работают внутри классов — они дают вам возможность использовать React без классов.
  Их использовать удобней. 


  1. Хуки следует вызывать только на верхнем уровне. Не вызывайте хуки внутри циклов, условий или вложенных функций.
  2. Хуки следует вызывать только из функциональных компонентов React. Не вызывайте хуки из обычных JavaScript-функций. 
     Есть только одно исключение, откуда можно вызывать хуки — это ваши пользовательские хуки
*/
/* state - состояние относиться к конкретному компоненту.  */
let [value, setValues] = useState(1);//принимает начальное значение любого типа и массив 2х элементов. ES6 воспользуемся деструктуризацией
  Пример:
    let [count, setCount] = useState(100);//

    const increment = (ev) => {
      /* При вызове множество раз setState с объектом, мы не получим перерендер на каждый вызов это означает
         что setState работает асинхронно, то есть перерендер страницы будет после всех вызовов setState.
         и поэтому каждый setState получает одни и те же старые данные*/
         
       
      setCount(count + 1)//100 + 1
      setCount(count + 1)//100 + 1
      setCount(count + 1)//100 + 1

      setCount((prev)=> prev + 1)//100 + 1
      setCount((prev)=> prev + 1)//101 + 1
      setCount((prev)=> prev + 1)//102 + 1
    }
    const increment = (ev) => {
      /* ещё один способ работы с предыдущим значением. В принципе count + count будет такой же результат.
        В классовом компоненте setState((prevState, props) => {}) 2 аргумента  */
      setCount((prevCount) => prevCount + count)
    }
    console.dir(count);/* после нажатия тут новое значение, а в функции increment count содержит предыдущее значение. */


/*---------------------------------------------------------------------------------------------------
########--------<{ useRef }>-------######## */
let ref = useRef(null);//присвоив переменную ref компоненту, получим доступ к DOM элементу

/*---------------------------------------------------------------------------------------------------
########--------<{ createContext }>-------######## */
//где-то 
export let MyContext = React.createContext('ddd') 
//в каком-то файле получим или сразу или через callback в MyContext.Consumer 
let value1 = useContext(MyContext);//value1 = ddd 
<MyContext.Consumer>{(val) => console.dir(val)}</MyContext.Consumer>


/*---------------------------------------------------------------------------------------------------
########--------<{ useEffect }>-------######## 
    useEffect, useMemo, useCallback похожи тем что они реагируют на 2й аргумент, но задачи у них отличаются.
    
*/


useEffect() //тот же componentDidMount, componentDidUpdate, componentWillUnmount. Отрабатывает после рендера страницы.
  Пример: 
  let test = () => console.dir('test');

  let App = (props) => {
    let [ob, setCount] = useState({count: 0, age: 14});
    useEffect(() => {  });/* Отработает при загрузке и при каждом обновлении state заменяя заменяя методы componentDidMount, componentDidUpdate*/
    useEffect(() => {/*код*/}, [ob.count, test]);/* можно заставить отрабатывать callback только при изменении какого-то значения в state.
                                                    ну или если по каким то причинам отработала функция test. (об этом в useMemo, useCallback)
                                                    Это аналог - componentDidUpdate, если он меняться не будет то значит useEffect отработает
                                                    1. Можно для этого указать пустой [].  */
    useEffect(() => () => {});/* если callback useEffect возвращает функцию, то она имитирует componentWillUnmount то есть отрабатывает после ухода с компонента */

    const increment = (ev) => setCount({...ob, count: ob.count + 1})

    return (<></>);
  }

 


/*---------------------------------------------------------------------------------------------------
########--------<{ useMemo, useCallback }>-------######## 
  Каждый раз когда компоненту требуется воспользоваться событием изменяющим state, компонент
  перерисовывается. Ничего страшного если он вызывает снова те функции которые задуманы, но бывает
  в компоненте есть функция которая должна вызваться только 1 раз (например запрос на сервер) или это
  будет функция которая у которой внутри 500 строк кода и она делает определенные вычисления.
  
*/

let test = (data) => {/* 500 строк кода */ console.dir('test'); return {data}};//Функция за компонентом не просто так.

const App = (props) => {
  let [user, setUser] = useState({name: '', age: 0});
  let [count, setCount] = useState(0);
  /* 2 независимые друг от друга функции обработчиков событий  */
  let inclement = (ev) => setCount((prev) => prev + 1)
  let handleChange = (ev) => setUser((prev) => ({...prev, [ev.target.name]: ev.target.value}))

  /* Но какое бы событие не отработало, происходит перерендер компонента в котором могут быть вызваны функции напрямую.  */
  test();// Например такой вызов, но делать так не будем и НЕ ПРАВИЛЬНО
  //ПРАВИЛЬНО
  useMemo(()=> test(), [count]);// вызовет test при 1м рендере а дальше вызывать будет только если был изменён count в state 
  /* 
    Мы можем воспользоваться результатом функции test (если она возвращает) просто присвоив значение переменной. 
    Фишкой является то, что useMemo кеширует результат и возвращает каждый раз старый не вызывая функцию test если не было
    изменения в count.
  */

  let data = useMemo(()=> test(user), [count]);

  /*
    Немало важный пример если вдруг 2й параметр useMemo поглядывает на функцию и ждёт когда отработает что б запуститься.
    Какая функция в callback и на какую смотрит неважно. Я смотрю и вызываю одну и туже, роли это не играет главное как работает useMemo
  */
  let data = useMemo(()=> test(user), [test]);//отработает 1 раз и ждёт когда test вызовут. Но есть 2й вариант. Об этом в следующей App.

  return (
    <>
      <button onClick={inclement}>Клик</button>
      <div>{count}</div>

      <input type="text" onChange={handleChange} name="name"/>
      <input type="number" onChange={handleChange} name="age"/>
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(data)}</div>
    </>
  )
}


/*
  Если организовать всё тоже самое, но мы решили не выносить функцию test из компонента, а оставить внутри, 
  (не важно используем мы useMemo или useEffect) и при этом решили смотреть на эту функцию. Как только этот компонент
  подвергнется перерисовке (например отработает любая функция изменяющая state), от того что компонент перерисуется
  функция test создастся 

*/

const App = (props) => {

  let [user, setUser] = useState({name: '', age: 0});
  let [count, setCount] = useState(0);
  let inclement = (ev) => setCount((prev) => prev + 1)
  let handleChange = (ev) => setUser((prev) => ({...prev, [ev.target.name]: ev.target.value}))

  let test = (data) => {/* 500 строк кода */ console.dir('test');};
  let test = useCallback((data) => {/* 500 строк кода */ console.dir('test');},[]);//не забыть передать 2й параметр


  useEffect(()=> test(user), [count, test]);//будет отрабатывать при изменении count, но не из-за того что test заново отрисовался


  return (
    <>
      <button onClick={inclement}>Клик</button>
      <div>{count}</div>
    </>
  )
}
 

/* Предположим что мы создали функцию внутри компонента */

//**  Функцию useCallback нельзя использовать с пустым 2м параметром
const anyFunc = useCallback(() => {/* любой код */}, []); // НЕ ПРАВИЛЬНО. Без параметра лучше создать простую функцию за пределами компонента
    

/*---------------------------------------------------------------------------------------------------
########--------<{ useReducer }>-------######## 
    Можно не использовать react-redux т.к. react может обновлять state по такому же принципу.
    ** Но всё же от redux есть польза.  
*/

const testReducer = (state, action) => {
  switch(action.type){
     case 'ADD_TEXT': return {...state, text: action.text};
     default: return state; 
   }
}

export default (props) => {
 
  let [state, dispatch] = useReducer(testReducer, {text: 'Начальная инициализация state'})
  let addText = (text) => dispatch({type: 'ADD_TEXT', text})

  return (
    <>
      <input type="text" onChange={(ev) => addText(ev.target.value)} />
      <div>{state.text}</div>
    </> 
  )
}
/*
  Можно попробовать так же держать reducer по разным файлам с начальным значением, в файлы Container... 
  экспортировать каждый свой [state, dispatch]. Вообщем если подумать не очень удобно в сравнении с react-redux
*/


/*---------------------------------------------------------------------------------------------------
########--------<{ Создание собственных хуков }>-------########
    создавать собственный хук есть смысл если повторяется код хуков.
    Хуки — это способ использовать повторно логику состояния, а не само состояние.
*/

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  const handleStatusChange = (status) => { setIsOnline(status.isOnline);  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}



