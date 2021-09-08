
/*--О структуре компонентов.. 
  Компонента эта функция возвращающая разметку JSX

Часто методы и свойства хранятся выше по структуре. Зачем?
  1. для того что бы контролировать и обеспечивать разные компоненты одними и теми же методами и свойствами    
  2. оставить более чистые дочерние компоненты
  Передавать данные можно через props и между компонентом в поле children.
  Передавать можно даже компоненты

  ВАЖНО:
    в localStorage нужно хранить данные в JSON если используем bool тип что бы корректно использовать данные 
    в логических операциях, а не строку.

  Доп.Инфа:
    1. Передавать в что либо в {} в JSX типа: <div>{props.method}</div> это не опасно т.к. перед рендером преобразуется всё в строку.
       Так же в React нет никаких ограничений на то, что можно передать в качестве пропсов. 

    2. С точки зрения React, эти классовые и функциональные компоненты эквивалентны. Классовы компоненты обычно используют для
       управления состоянием "методами жизненного цикла". Они нужны для управления ресурсами приложения. 
        componentDidMount(), - монтирование. Запускается после того, как компонент отрендерился.
        componentWillUnmount(), - размонтирование. Запускается после того, как пользователь ушёл с компонента.

    3. Если переписываем существующее приложение на React, лучше начать с маленького компонента типа Button и постепенно двигаться «вверх» по иерархии.
        В более сложных приложениях удобнее в первую очередь создавать и тестировать подкомпоненты.

    4. Если какая-то часть интерфейса многократно повторяется (Button, Panel, Avatar) или она сложная,
       например циклом создаём сложную громозкие компоненты, то лучше вынести её в независимый компонент.

    5. Чистой компонентой считается та компонента которая никогда не записывает в свои props какие либо значения, только использует.
        Правило: "React-компоненты обязаны вести себя как чистые функции по отношению к своим пропсам."

    6. State - состояние контролируется и доступно только конкретному компоненту. Иногда для синхронизации
        дочерних компонентов друг с другом требуется использовать родительский state и прокидывать дочерним компонентам
        эти данные вместе с методами (handleChange, handleSubmit) изменяющие родительский state.
      
    7. props и state можно передать вниз по структуре компонентов. В статическом приложении state не нужно использовать.
      Каждый компонент изолирован: <Clock count=1> <Clock count=2> <Clock count=3> 

    8. Условный рендеринг - это условие обычно опирающиеся на props при котором отображаем тот или иной компонент.
       Так же если компонент возвращает null, то компонент не отрендерится, но его componentDidUpdate будет вызываться.
       Обычно хватает условия в верхнем по структуре компоненте.
    


    

*/
/*----------------------------------------------------------------------------------------------------
#######-------<{ Стандартные компоненты React }>-------####### */
/* Это JSX формат. Используется в там где возвращается этот формат.  */                   

<React.StrictMode></React.StrictMode>; //следит за ошибками потомков. В случае ошибки предупреждает.
<React.Fragment></React.Fragment>; /*пустая обёртка или так <> </>. Сокращённая запись не пойдёт если нужно использовать 
                                    отрисовку циклом. Нужно указать <Fragment key={item.id}> </Fragment>*/
         
    

/* #######-------<{ React методы }>-------####### */

React.createRef();//присвоим экземпляр будем получать элементам можем получить их свойства
React.createContext();//когда запарило прокидывать пропсы через все компоненты, можно избежать этого использовав данный метод.  
React.lazy(()=> import('./Images'));//<- компонент который лениво загрузится. Должен обёрнут в компонент Suspense из React
  Пример:/* Пока Images не загружен показывает то что в fallback  */
  <Suspense fallback={<Preloader id='pageLoading'/>}>
    <Images add={this.add} allImages={this.allImages} />
  </Suspense>



/*----------------------------------------------------------------------------------------------------
#######-------<{ Как работает React }>-------####### 
  Отрисовка всей страницы. 
  1й - основной класс который связывает другие классы, 2й - куда рэндерить*/
ReactDOM.render(<App name=''/>, document.getElementById('box'));
/*
  любой компонент может рэндерить html(по сути это готовые компоненты) или другие компоненты.
  Компоненты могут быть классовыми или функциональными.
  ВАЖНО: 
    c 17й версии в классовых компонентах this в setTimeout не теряют контекст, 
    можно метод render указывать без render = () => {}. 
*/




class App extends React.Component{
  render(){
    return (
      <div className="base">
        <ComponentTwo name={this.props.name} left={ <ComponentThree />} right={ <ComponentFour /> }/>     
        <h3>Hello {this.props.name} </h3> {/* скобки что бы указать код который сформирует данные. */}
      </div>
    )
  }
};


//ПОДРОБНОЕ ОПИСАНИЕ как работает передача через props.children. 
let Forma = (props) => <div></div>;
<Component> { Forma } </Component>;// передаём не вызванный компонент */
<Component render={ Forma }/>;// Тоже самое что и выше

<Component> <Forma/> </Component>;// вызвали компонент. Он возвращает спец. объект для React
/*
  В обоих случаях { Forma } <Forma/> мы передаём props.children в Component.
  В спец. объекте так же есть props от компонента вложенного в родителя.

 Спец объект описывает для React что это за данные: Пример: <Component> <div><div/> </Component>;
  {type: 'div', props: {}- пустой} Если есть вложенность <div> <p>15</p> Строка </div>, то 
  {props: { children: [{type: 'p', props:{...}}, 'Строка'] }}.

  Пока { Forma } не вызвана React естественно о ней не знает. Пример:*/

<Component name='Петя'><Forma data={[14,5,17]}/></Component>; //запись в виде JSX, это объект который связан с компонентом и React сам вызовет метод и передаст данные 
<Component name='Вася'>{Forma({data: [14,5,17]})}</Component>; /*это почти аналог, сами вызываем, сами передаём, React получает сразу то что возвращает метод. 
                                                                 т.к. вызов обычной функции можно создать её с маленькой буквы */
<Component>
  <h1>Добро пожаловать!!</h1>
  <p>Какой-то текст</p>
</Component>; //это всё можно получить через prop.children . Об этом описано в react "Композиция и наследование"
                                                                  
function Component(props) {
  return (<div> Компонент 1 { props.children } </div>)//передаём спец объект от  <Forma...> | Forma() в React 
};
function Forma(props) {
  return (<p>Форма:{props.data[0]}</p>)
};
/*
  Разница между JSX вызовом и вызов функции:
   <Forma data={[14,5,17]}/>     { type: Forma(props), props:{data: [14,5,17]} } - подготовили спец объект с функцией, но вызова ешё не было. 
                                 Что бы вызов произошёл как раз для этого родитель и предаёт объект в React строкой { props.children }
                                 React сам вызовет эту функцию и передаст props. Получается сначала отрабатывает родитель после Forma 
                                                                                 
  { Forma({data: [14,5,17]}) }   { type: <p>, props: {children: ["Форма:", 14]} } - тут мы сами вызвали функцию и передали данные
                                 и получили спец объект возвращаемого элемента <p>. Функция отрабатывает 1й, потом родитель

                                 1. <Component name='Вася'>{Forma({data: [14,5,17]})}</Component>; это
                                 2. <Component name='Вася'><p>Форма:{props.data[0]}</p></Component>;
                                 3. В родителе: { props.children }   
                                 
                                 Лучше возложить это на React а не самому вызывать. React сам решит когда лучше вызвать.


---------------------------------------------------
Можем не вызывать сразу { Forma } а вызвать в родителе props.children() или props.children 
если требуется что ли бо получить в родителе и передать дальше. */
<Component> { Forma } </Component>;//Если будет <Forma > будет ошибка
function Component(props) {
  let newData = {...props, method1: (a) => {}, property: 11 }
  return (
  <div> 
    { props.children({data: newData}) } 
    <props.children data={newData}/>
  </div>) 
};
function Forma(arr) {
  return (<div> Форма: {arr[0]}</div>)
} ;



/* Вообще нам не обязательно передавать компонент в родительский компонент, а потом манипулировать через props.children
   Это просто один из способов. Есть же функции которые рассчитывают принимать функции, это просто построения независимой функции. 
   Ни кто там не мешает возвращать сразу компонент без передачи:
   function test1(){...  return test2()}*/

function Component(props) {
  let newData = {...props,method1: (a) => {},property: 11 }
  return (<div> Компонент 1 <Forma data={newData}/></div>)  
};
function Forma(props) {
  return (<div> Форма: {props.data.property}</div>)
};
    

/*1. При использовании JSX не забываем что сначала отрабатывает родитель, а после вложенность. 
  2. Важно так же компоненты указывать с большой буквы если мы используем JSX вызов, иначе React не отработает.
     Так же есть много компонентов которые принимают JSX запись. Во многих случаях не используем такую запись 
     <props.children data={newData}/> так что нет нужды создавать компоненты с маленькой буквы и передавать родителю. 
      
  3. В любом случае компонент переданный между тегов родителя должен возвращаться в React этим родителем.
  4. Лучше не вызывать {Forma()} а предоставить это обрабатывать React.

*/




/* 
  Прокидывать через все компоненты данные в props плохая идея. Код может раздуться и промежуточные компоненты будут иметь 
  ненужный функционал.
*/
//Не грамотно.
    // В в App.jsx
    class App extends React.Component {
      render = () => <Toolbar theme="dark" />;
    }
    //в Toolbar файле
    let Toolbar = (props) => <ThemedComponent theme={props.theme} />;//промежуточная компонента.
    //в ThemedComponent файле
    let ThemedComponent = (props) => <div>{props.theme}</div> ;//конечная компонента.
      

// Так лучше, но не идеально.
    //в App.jsx
    export const Context = React.createContext('light');//создание контекста. Принимает defaultValue
    class App extends React.Component {
      render = () => <Context.Provider value="dark">  <Toolbar /> </Context.Provider>;
    }


import { useState } from 'react';
    //в ThemedComponent файле
    import { Context } from 'путь';
    //Не важно классовая или функциональная компонента 100% работает Общий вариант
    let ThemedComponent = (props) => <Context.Consumer>{value => { <div>{value}</div> }}</Context.Consumer>;
    /* в классовой компоненте через static contextType = MyContext; или MyClass.contextType = MyContext выдаёт ошибку с 17.0.0v */

    /* Вообще не рекомендуется использовать react context. На это есть Redux.  */
    




/*----------------------------------------------------------------------------------------------------
#######-------<{ Продвинутая тема с prop.children, prop.render }>-------####### 
    Рендер-пропсы - это передача функционала в children или в render которые могут передать в другие компоненты если хотят зависеть от 
    родителя. Это требуется если хотим делать универсальную компоненту, потому-что мы по сути мы и без children и render
    могли б сразу в Mouse закинуть компонент и передать данные
*/

function Component(props) {

  return  (
    <>
      <Mouse render={ (mouse) => {  }}/>  
      <Mouse>{(mouse) => { return <Cat mouse={mouse}/> }}</Mouse> 
    </>
  )
};

/* Можем создать компонент с неким функционалом который будет готов передать этот функционал переданному 
   callback в атрибут render или children*/
function Mouse(props) {
  let [mouse, setMouse] = useState({ x: 0, y: 0 });
  let handleMouseMove = (ev) => {
    setMouse({
      ...mouse,
      x: ev.clientX,
      y: ev.clientY 
    })
  }

  return (
    <>
      <div onMouseMove={handleMouseMove}></div>
      {props.render(mouse)}
      {props.children(mouse)}{/* или сюда */}

      <Cat mouse={mouse}/>{/*1я мысль, а почему не так? Ну потому-что вдруг нам Cat тут не к месту. 
                             и не хотим загрязнять компонент, хочется сделать компонент и не трогать его при этом 
                             легко подключать другие через render или children*/}
    </>
  )
 
};

/* Так можно сделать HOC с рендер-пропсами */

function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}






/*----------------------------------------------------------------------------------------------------
#######-------<{ Некоторые фишки и рекомендации }>-------####### */
/* 
  При цикле скорей всего придётся нумеровать элементы передавая id(или inx) в атрибут key на элементах
  иначе:   Warning: Each child in a list blockTextould have a unique "key" prop.
*/
arr.map((item) => (/*При итерации можем передать что-нибудь в событие*/ 
  <div onClick={(e)=>{ this.evChange(e, item.number) }}>item.number</div>
));
//
arr.map((item, inx) => (/*Привязать index и в случае чего удалят по нему*/ 
  <div onClick={(e)=>{ this.myRemove(e, inx) }}>item.number</div>
));

/*----------------------------------------------------------------------------------------------------
#######-------<{ Наследованные методы, методы React, методы Компонента }>-------####### */

render();/* обновляется в 1ю очередь при изменении компонента и первоначальной загрузки страницы.
           Разница: render(){} - метод общего объекта Component, render = () => {} - метод перемещается на 0 уровень.*/
componentDidMount();//отрабатывает после render 1 раз, то есть после того как DOM отрисовался. Аналог: useEffect(()=>{})

componentDidUpdate(prevProps, prevState);/* обновляется после render и только если были изменения state. setState в render
                                            и componentDidUpdate использовать можно только в условии которое ограничит и 
                                            не даст бесконечно перерисовывать компонент */
componentWillUnmount()//отрабатывает когда с компонента ушли


shouldComponentUpdate (nextProp, nextState){  /* метод будет обновлять данный контейнер только в том случае если 
                                                 если условие истинно. Нужно это для того что бы реакт не обновлял 
                                                 если данные этого компонента не изменились. тот же useMemo или ReactMemo. 
                                                 Если данный контейнер обновляется то и компоненты в нём обновляются. 
                                                 Для ниж так же можно установить memo.*/
  console.dir(nextProp !== this.props);                          
  return nextProp !== this.props 
}
class myComponent extends PureComponent {} //уже несут данный конфиг shouldComponentUpdate


/*----------------------------------------------------------------------------------------------------
#######-------<{ О ref }>-------####### */

/* ВАЖНО: В react нельзя обращаться напрямую к DOM через подобные обращения: document.querySelector и т.д. потому что он может не успеть отрисоватся.
          для этого есть createRef, но всё равно им не рекомендуется пользоваться.  */

React.createRef();/*react привязывает ссылку напрямую к DOM после того как он будет готов.*/
  Пример:
    let formaData = React.createRef();/* react будет ссылаться на DOM тогда когда он будет готов. */

    render = () => {
      return (
        <form  ref={formaData}>
          <input type="text"/>
          {console.dir(formaData.current)}{/* 100% получим данные формы. Если бы пытались обратиться через querySelector то можем не получить. */}
        </form>
      )
    }


/*Что будет если форма будет компонентом и в родителе мы хотим получить к ней доступ в DOM */
class Forma extends Component {

  render () {
    return (
      <form onSubmit={this.props.handleSubmit} ref={this.props.ref}>
        <input type="submit" value="Отправить">
      </input>
      </form>
    )
  }
}



class ParentComponent extends Component {

  state = {
    ref: React.createRef()
  }
  handleSend = (e) => {
    e.preventDefault();
    console.dir(this.state.ref);
  }
  render () {
    return  <Forma handleSend={this.handleSend} ref={this.state.ref} />
  }
};

/*
  Если попытаться передать ссылку через компонент и через резервированный пропс ref, то 
  в этой ссылке this.state.ref.current мы увидим компонент  Forma со всеми своими свойствами, а не элемент. 
  Что бы увидеть элемент form нужно или передать через другой названый пропс или воспользоваться 
  forwardRef.

  
 */
//Вариант 1. Так будет нормально работать
  class ParentComponent extends Component {

    state = {
      ref: React.createRef()
    }
    handleSend = (e) => {
      e.preventDefault();
      console.dir(this.state.ref);
    }
    render () {
      return  <Forma handleSend={this.handleSend} myRef={this.state.ref} />
      
    }
  };
    
/*
  Вариант 2. С функциональной компонентой. Если обернуть функциональную компоненту в HOC React.forwardRef(Forma),
  то получим 2м параметром ссылку ref передаваемую через зарезервированный пропс ref={this.state.ref}

*/

function Forma ({handleSubmit}, ref) {

  return (      
   <form onSubmit={handleSubmit} ref={ref}>
     <input type="submit" value="Отправить"/>
   </form>
 )
}

let Forma1 = React.forwardRef(Forma)

class ParentComponent extends Component {
 state = {
   ref: React.createRef()
 }
 handleSubmit = (e) => {
  e.preventDefault();
   console.dir(this.state.ref.current);//увидим элемент form
 }
 render () {
   return <Forma1 handleSubmit={this.handleSubmit} ref={this.state.ref} />
 }
};










/*--------------------------------------------------------------------------------------------------------------------------------------*/
  /* Нюансы ref 
    Если передать один и тот же ref многим элементам будем получать последний по списку элемент.
    Например при клике на Кнопку1 будем получать данные Кнопки3 т.к. все элементы перезатёрты
  */ 
    
    
class ParentComponent extends Component {

  state = {
    ref: React.createRef()
  }
  handleClick = () => {
    
    console.dir(this.state.ref);//Кнопка 1 - будет
  }
  render () {
    return (
      <div className="box" >
        <button className="FancyButton" ref={this.state.ref} onClick={this.handleClick}>Кнопка1</button>
        <button className="FancyButton" ref={this.state.ref} onClick={this.handleClick}>Кнопка2</button>
        <button className="FancyButton" ref={this.state.ref} onClick={this.handleClick}>Кнопка3</button>
        {/* <Child handleClick={this.handleClick} ref={this.state.ref}>Кнопка2</Child> */}
      </div>
    )
  }
};
    
    



/*----------------------------------------------------------------------------------------------------
#######-------<{ this.setState }>-------####### */
    
this.setState({})
this.setState((prevState, props) => ({count: prevState.count + props.count})); // требуется если нужно динамически использовать предыдущее значение

    Пример:
    state = {
      count: 100
    }
    handleClick = () => {
      /* 
        При вызове множество раз setState с объектом, мы не получим перерендер на каждый вызов это означает
        что setState работает асинхронно, то есть перерендер страницы будет после всех вызовов setState.
        и поэтому каждый setState получает одни и те же старые данные
      */

      this.setState({count: this.count + 1})//100 + 1
      this.setState({count: this.count + 1})//100 + 1
      this.setState({count: this.count + 1})//100 + 1

      /*
        Правильное решение. Каждый новый setState со своим callback'ом получает предыдущие значения хранящиеся во временной памяти
        после окончания так же происходит перерендер.
      */
      this.setState((prev)=> ({count: prev.count + 1}))
      this.setState((prev)=> ({count: prev.count + 1}))
      this.setState((prev)=> ({count: prev.count + 1}))
    }
  
    render = () => {
      return (
        <main className="home">
          <Tests {...this.props} />
          <button onClick={this.handleClick}>Клик</button>				
          <div>{this.state.count}</div>
        </main>
      )
    }

/*----------------------------------------------------------------------------------------------------
#######-------<{ Объект события React  }>-------####### 

  В классах Event теряется this поэтому нужно делать так:
*/

 class MyComponent extends Component {
  evToggle(){
    this.setState({ check: !this.state.check})
  }
  render(){
    return (
      <div onClick={this.evToggle.bind(this)}></div>
      // <div onClick={(ev) => (this.evToggle(ev))}></div>
    )
  }
 }
/*
 Оба способа bind стрелочной функции не рекомендуется указывать в событии т.к. при каждом клике лишний раз 
 вызывается bind + наш обработчик или создаётся новая стрелочная функция. Лучше создать новый обработчик
*/
class MyComponent extends Component {
  state = {
    toggleBtn: this.toggleBtn.bind(this),
    check: false
  }
  toggleBtn(){
    this.setState({
      check:!this.state.check
    })
  }
  render(){
    return <div onClick={this.state.toggleBtn}></div>
  }
 }

// А ещё лучше выкинуть bind и использовать запись метода в классе evToggle = () => {} (в 16.13.1 это актуально)

onFocus//реагирует при фокусировке на элементе





/*
  ВАЖНО:
    В React над обычным объектом Event есть обёртка SyntheticEvent которая при вызове события 
    передаёт данные в event и очищается. (сделано это для производительности. Поэтому я ничего там
    не видел, только после вызова). Что бы исключить этот объект из потока и использовать асинхронно
    нужно вызвать e.persist().
    Так же SyntheticEvent может пригодиться при использовании setTimeout т.к. Event там может потеряться.

    
*/
e.bubbles//является ли событие всплывающим в DOM :=> bool
e.cancelable//является ли событие отменяемым :=> bool
e.charCode//хз но вместо кода клавиши возвращает 0
e.ctrlKey//был ли нажат Ctrl
e.shiftKey//был ли нажат Shift

e.currentTarget//target тот на котором висит событие. Не важно если кликаем на дочерний элемент
e.target//если событие на родителе, то в target попадает тот элемент на который тыкнули
e.defaultPrevented//информирует был ли в событии установлен e.preventDefault() :=> bool
e.detail//возвращает число кликов по событию. Клики засчитываются если интервал чуть меньше секунды иначе сбрасывается 
e.dispatchConfig//описывает что за событие отработало
e.eventPhase//возвращает число типа event: Ev.NONE = 0 Ev.CAPTURING_PHASE = 1 Ev.AT_TARGET = 2 Ev.BUBBLING_PHASE = 3
e.getModifierState("Shift")//была ли нажата. На всю клавиатуру не распространяется, только определённые кнопки. читать Modifier keys on Gecko
e.keyCode || e.which //определяют код клавиши 
e.type//определяет чем нажато. Смысла от этого нет т.к. я определяю событиями мыши или клавы 
e.timeStamp//показывает число в промежутке времени котором было отработано событие
e.nativeEvent//стандартный js объект event








/*----------------------------------------------------------------------------------------------------
#######-------<{ Управляемые, неуправляемые компоненты в форме  }>-------####### 

  При вводе в input по ум. в react state не обновляется и например другие
  компоненты не получают данной информации на которую мы могли бы опираться и что либо делать. 
  Для этого нужно создать управляемую форму.
 */
	state = {
		login: ''
	}
	handleChange = (ev) => {
		this.setState({ login: ev.target.value })
	}
	render = () => (
		<input type="text" onChange={this.handleChange} value={this.state.login} />
	)
/* Теперь происходить flux круговорот: Происходит ввод пользователя, обновление state, присваивание данных из переменной в state 
   в атрибут value. Просто указанный атрибут value='строка' заблокирует ввод в input и потребует повесить слушатель для поддержания 
   этого круговорота. Привязанная переменная в state для атрибута value в этом случае играет роль начального значения. Здесь
   нет смысла ставить defaultValue.   
    value={undefined} - препятствий заполнению нет
   */	

/* В HTML по ум. выбранный элемент в спике указывается в <option selected value="lime">Лайм</option>. В React указывается 
   в select и привязывается к state для flax круговорота. */
render = () => {
  return (
  <select value={this.state.value} onChange={this.handleChange}>{/*value={['grapefruit','lime']} можно передать массив для выбора нескольких позиций*/}
    <option value="grapefruit">Грейпфрут</option>
    <option value="lime">Лайм</option>
  </select>
  )
}

/*
    Неуправляемая форма выглядит так:
*/
 
input = React.createRef()

handleSubmit = (ev) => {
  this.props.sendForm('register', this.input.current.value)
}
render = () => (
  <form onSubmit={this.handleSubmit}>
    <input type="text" ref={this.input} defaultValue='Поле'/>
    <input type="file"/> {/* input file сам по себе является неуправляемым компонентом т.к. нельзя наладить flux круговорот  */}
    <input type="submit" value="Отправить" />
  </form> 
)
/* Тут нет flux круговорота, лиш передана ссылка ref к источнику обращаясь к которому заберём его данные в конце ввода. 
   Для неуправляемой формы нельзя ставить value для текста по ум. т.к. он заблокирует ввод, для это тут ставят defaultValue
  ** В обычных ситуациях мы рекомендуем использовать управляемые компоненты.
*/


/* Что будет если передать ref в компонент как пропс? 
  Ничего, если мы непосредственно компоненту не будем задавать имя ref,
  а зададим refForButton, тогда мы просто в родителе получим доступ к DOM этой кнопки.
*/

function App() {
  let ref = useRef();

  let handleClick = (e) => {
    console.log(ref.current)
  }
  return  <Button handleClick={handleClick} refForButton={ref}/>
}

const Button = ({refForButton, handleClick}) => {
  return <button ref={refForButton} onClick={handleClick} >Кнопка2</button>
}

/* Но есть 2й пример. Во-первых мы получим undefined если сделаем так:*/

return  <Button handleClick={handleClick} ref={ref}/> 
/* потому-что ref зарезервированн как и key и они не передаются в props компоненты.
  ref компоненты служит для того что бы использовать чью то ссылку. 
  Пример:
    Если передать реф 1й кнопки в резервированное свойство ref компонента,
    то 
*/

function App() {
  let ref = useRef();
  
  let handleClick = (e) => {

    console.log(ref.current)
    console.log(e)
  }
  return (
    <div className="App">
      {/* Теперь при клике хоть на 1ю кнопку хоть на кнопку компонента */}
      <button onClick={handleClick} ref={ref}>Кнопка1</button>
      <Button handleClick={handleClick} ref={ref}/>
    </div>
  );
}

const Button = ({handleClick}) => {

  return (
    <button  onClick={handleClick} >Кнопка2</button>
  )
}








/*----------------------------------------------------------------------------------------------------
#######-------<{ Поднятие состояния }>-------####### 
  Общий state нужен для синхронизации работы компонентов. Так сказать менять поведение одного дочернего компонента 
  в зависимости какие изменения внесли в 1м дочернем компоненте. 

  Обычно состояние сначала добавляется к компоненту, которому оно требуется для рендера.
  Затем, если другие компоненты также нуждаются в нём, можно поднять его до ближайшего общего предка.
*/


class Parent extends Component{
  state = {
    check: false,
  }
  handleToggle = () => this.setState({check: !this.state.check})
  render = () => (
    <> 
      <Child1 check={this.handleToggle}/>{/* Использовать в дочернем компоненте */}
      <Child2 check={this.state.check}/>{/* Ориентируемся на родительский state */}
    </>
  
  )
}





"-----------------------------------------------------------------------"
"#########-------<{ Нестандартные решения прокидывания компонентов }>-------#########"

/* Смысл createPortal в том что бы поместить jsx компонента в любое место в DOM, а сам компонент размещаем в любом месте это всего лишь
  триггер */

class Modal extends React.Component {
  state = {
    el: document.createElement('div'),
    box: null
  }

  componentDidMount() {
    this.setState((state)=>{
      let box = document.getElementById('box');
      box.appendChild(this.state.el);
      return {
        ...state, box
      }
    })
  }

  componentWillUnmount() {
    this.state.box.removeChild(this.state.el);
  }

  render() {
    
    /* Из-за того что при render мы не успеваем получить id какого-то блока, т.к. render отрабатывает раньше 
      componentDidMount, мы кладём children в пустой el, а в componentDidMount уже запихиваем в нужный элемент 
      не важно где он в DOM  */
    return ReactDOM.createPortal(
      this.props.children,
      this.state.el
    );
  }
}

class Parent extends React.Component {
  state = { clicks: 0 };
  handleClick = this.handleClick.bind(this);


  handleClick() {
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div className='test'>
        <div onClick={this.handleClick}>
          <p>Количество кликов: {this.state.clicks}</p>
          <Modal>
            <Child />
          </Modal>
        </div>

        <div id="box"></div>{/*Компонент  Child будет тут*/}
      </div>
    );
  }
}

function Child() {
  return (
    <div className="modal">
      <div>Какой-то контент</div>
    </div>
  );
}










"-----------------------------------------------------------------------"
"#########-------<{ стандартные props для компонентов }>-------#########"

/*
Заметка
  Иногда при построении сайтов предусматривают вариант для людей с ограниченными возможностями
  Когда проектируются такие решения нужно использовать не camelCase а kebab-case.
  В React есть атрибут aria-* и целый список возможностей. 
*/
component='div'; /*или*/ component={myComponent};
<Parent render={() => <Component/> } />;
<Parent component={() => <Component/> } component={Component} component='div' />;
<Parent children={ <Component/> } />;
<Parent><Component/></Parent>;





/*
    Информация

    С версии 17.0 : Удалят componentWillMount, componentWillReceivePropsи componentWillUpdate. 
    (С этого момента будут работать только новые имена жизненного цикла с префиксом«UNSAFE_».)
*/
