/*
  1. Для того что бы работать с TS требуется установить пакет: npm i typescript, он компилирует в js.
*/
/*##############-------------<{ Типы }>-------------##############
  Типы указываются после названия переменной с двоеточиями. Так же можно создавать свои типы которые 
  по нашему мнению лучше своим названием описывают. 
  Если присваивать неверный тип, выпадает ошибка. Можно указывать несколько вариантов типов.

  После компиляции ничего лишнего в JS не будет. 
*/

const isFetching: boolean = true;
const int: number = 41;//4.2 3e10 
const msg: string = 'строка';
const numberArray1: number[] = [1,2,3,4,5];//новая запись. string[] и т.д
const numberArray2: Array<number> = [1,2,3,4,5];//старая
const numberArray3: [string, number] = ['Вася', 23];//мешаный вариант
const variable: any = 'строка';//всё что угодно. Можно переназначать.

function method1(name: string): void { }//void означает то что функция не будет ничего возвращать
function method2(msg: string): never { //указываем never если метод точно выкинет ошибку. Или мы свою выкидываем или система сработает.(Например цикл будет бесконечный) 
  throw new Error(msg);
}

//Что бы не писать так у каждой переменной которая требует варианты данных типов
let isCordova: number | string | object = 's'; 
//можно создать шаблон типов
type ID = string | number;//Создали свой шаблонный тип

const id1: ID = '3123';
const id2: ID = 1234;

/*
  Обычно заготавливается type на котором в дальнейшем строиться какой-то объект.
  Например для React т.к. в state может не быть изначально значений, указываем одно из вариантов состояния null(в объекте undefined так же пойдёт)
*/

type InitialState = {
  name: string | null,
  age: number | null,
  method?: Function
}

let ob: InitialState = {
  name: undefined,
  age: 29
} 

/*
  Но можно создать type на основе готового объекта и экспортировать type для использования где-либо.
  Т.к. изначально присвоенное значение к какой либо переменной привязывается к данному типу это поведение можно изменить.
  К примеру экспортированный type может идеально не подойти к какому либо объекту, к примеру year где-то указывается как string
 
*/



// в ts typeof умеет не просто определять тип, он передаёт ссылку этой переменной с её данными
export type Model = typeof ob1;
//где-то в другом файле
let ob2: Model = {
  model: 'Opel',
  year: '2009',
  money: 1300000
} 


// В reducer описываются константы 
const GET_USERS = 'app/GET_USERS';
type InitAction = {
  type: typeof GET_USERS,//мало того что сказали string, так ещё строка должна соответствовать
  // type: GET_USERS,//не верное. переменная не отдаёт значение
  id: number,
}



/* Пример 2. ------------------------------------------------------*/
type InitialStateApp = {
  users: Array<string>,
  pages: {
    actionPage: string
  }
}

let stateApp: InitialStateApp = {
  users: [],
  pages: {
    actionPage: 'home'
  },
}
let reducerApp = (state = stateApp, ac: any): InitialStateApp => {
  return {
    users: ['Вася'],
    pages: {
      actionPage: ''
    }

  }
}


/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Интерфейсы }>-------------##############
  Интерфейс похож на определение класса, но создаёт по сути шаблон для свойств с ограничениями по типам.
  ? - не обязательное указание данного свойства
  readonly свойство после заполнения нельзя будет переназначить
*/

interface Rect {
  readonly id: string,
  color?: string,
  size?: {
    width: number,
    height: number
  }
}


let ob1 = {
  model: 'BMW',
  year: 2004 as number | string,
  money: 1200000
}

const react3 = {} as Rect; //привязать тип. Новая запись


interface IRect2 extends Rect{ //Есть наследование. Часто вначале ставят I указывая что это интерфейс
  id: string
  method2?: () => number //новая запись. С function как записывать не знаю.
}
/*Ни кто не мешает создать пустой Interface и наследовать в него из других */

interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
interface ColorfulCircle extends Colorful, Circle {}
//или объединить через type
type ColorfulCircle1 = Colorful & Circle;



const react1: Rect = {
  id: '1234',
  size: {
    width: 4,
    height: 6
  }
}
// react1.id = 465// нельзя переназначить



class MyClass implements IRect2{//привязываемся к нужному интерфейсу т.к. хотим заполнять те же свойства
  id: '151'
}


/*
  Представим ситуацию что объект длиннющий и хз сколько там свойств. Пришлось бы долго описывать интерфейс. 
  Для этого можно указать короткую запись.
*/
interface Style {
  [key: string]: string
}

const css: Style = {
  border: '1px solid red',
  marginTop: '10px'
}


/* Как получить поля из interface */

interface Test1 {
  id: number,
  name: string,
  age: number,
  address: string,
  is: boolean
}

type KeysAll = keyof Test1;
let key: KeysAll = 'address' //переменной могу присваивать только из полученных полей.(имеются подсказки)
//Как получить только нужные поля
type Key1 =  Exclude<keyof Test1, 'address' | 'is'>//исключаем 2 поля
type Key2 =  Pick<Test1, 'name' | 'age' | 'id'>//наоборот указываем какие поля получить


/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Объединение Интерфейсов }>-------------##############

  Можно задавать одно и то же имя интерфейсам, тогда они будет объединяться. Объединение происходит в обратном порядке.
*/
interface Animal{}
interface Sheep{}
interface Animal{}
interface Cat{}


interface Dog {
  clone(animal: Animal): Animal;
}
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {//порядок не меняется
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
//Всё это будет объединено компилятором в таком порядке так:

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}

//но порядок измениться если тип будет указан в строковом литерале. 
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
//собирается так же с конца, но сначала строки
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}

/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Описание enum }>-------------##############

  enum это просто названный список содержащий чего либо и названый элемент находиться на своей позиции индекса.
  На нормальный русский это типа массив записанный в другой форме. 
  let Membership = ['One', 'Two', 'Three'], но с одной фишкой
*/
  enum Membership { One, Two, Three }

  const props1 = Membership[2];//Three. Результат как в обычном массиве
  const props2 = Membership.One;//0 - обратившись по имени получаем индекс.В обычном массиве пришлось бы использовать findIndex()
  
  enum SocialMedia {
    VK = 'VK', 
    FACEBOOK = 'FACEBOOK',
    INSTAGRAM = 'INSTAGRAM',
  }
  //если в enum свойствам присвоены значения, то при обращении через них будем получать не индекс а значения 
  const props3 = SocialMedia.VK;//
  

/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Объединение namespace }>-------------##############
  namespace - требуется для того что бы не было конфликта с одинаковыми именами переменных, классов, функций встречающихся в разных файлах,
  Без использования namespace, конфликт может возникнуть при компиляции или при использовании import. 
  В JS нет этого и обычно файл оборачивают само-вызывающейся функцией, что бы данные имена были локальными, но в некоторых языках используется namespace.
  Есть некоторая особенность объединения namespace. Объединение в namespace происходит только того тех конструкций которые имеют export.
  К примеру мы можем предполагать что в предыдущем  Animal должно быть значение haveMuscles, и мы надеемся что оно имеет export, а значит 
  предполагаем что раз будет объединение, то это значение можем использовать в описанном ниже пространстве в конкретной функции. Это будет
  работать если будет export и не будет работать если его не будет.
*/

namespace Animal {
  let haveMuscles = true;
  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}
namespace Animal {
  export function doAnimalsHaveMuscles() {
    //return haveMuscles; // забыли экспортировать в предыдущем пространстве, будет ошибка.
  }
}


/*---------------------------------------------------------------------------------------------------------------------
  ###########---------<{ Примеры на React TypeScript }>---------###########
  Когда привязываем interface получаем подсказки при инициализации компонента и при вызове
*/
import React, { FC, useRef, useState } from 'react';
import { useParams } from 'react-router';

enum EVariantColor {
  primary = '#123456',
  gold = '#F4CA16',
  crimson = 'crimson'
}

interface ICardProps {
  width?: string, //не обязательный
  height: string, //обязательный для передачи (но не факт что он будет использоваться)
  method?: (num: number) => void, 
  variant?: EVariantColor,
  children?: React.ReactChild | React.ReactNode,
}

//Вариант 1. 
const Card = ({variant}:ICardProps) => {
  return (<div style={{background: variant}}></div>)
}
/* 
  при использовании в interface конструкции enum без всяких "ИЛИ" использовать в дальнейшем данный props можем только 
  через его самого. Придётся экспортировать данный enum. Хотя подсказка так же подсказывает имя цвета:
  variant={'#F4CA16'} - но так не работает
*/
<Card height="100" variant={EVariantColor.primary}></Card>



/*------------------------------------------------------------------------------------------------------*/
//Немного изменённый вариант + как заставить подсказывать пропс в переданной функции в children 
interface CardChildrenFunction {
  prop: string,
  test: string
}

interface ICardProps1 {
  height: string,
  onClick: (event: React.ChangeEvent) => void,//можно указать object, но тогда подсказок не будет
  onChange(event: React.ChangeEvent):void //2й вариант записи. Подсказка  будет показывать это как функцию, а не как пропс
  children?: FC<CardChildrenFunction>//показываю что есть короткая запись от FunctionComponent
}
//Вариант 2. Немного по другому определим компонент и interface. 
const Card1:React.FunctionComponent<ICardProps1> = ({onClick}) => {
  return (<div onClick={onClick}></div>)
}

<Card1 height="100" onClick={(event) => {  }}>
  {//тут подсказывает 
    ({}) => <div></div>
  }
</Card1>


/*------------------------------------------------------------------------------------------------------*/
//Существует вариант когда мы не знает что должно придти. Например массив разных типов

interface ListProps{
  items: any[]
}
const Card2:FC<ListProps> = ({items}) => {
  return (
    <div></div>
  )
}
/*
  ещё один вариант. Честно говоря не особо понял такой подход.
  T - это любой тип, но указывать её тогда нужно везде и к тому же она не работает со стрелочной функцией 
*/

interface ListProps1<T>{
  items: T[]
}
function Card3<T> ({items}: ListProps1<T>) {
  return (
    <div></div>
  )
}





/*------------------------------------------------------------------------------------------------------*/



/* Итого для компонентов: Можно передавать interface объекту props или указывать через компоненту с 
  const Users = ({}:IUsers) =>{} 
  const Users:FC<IUsers> = ({}) =>{} 
*/


/*#########---------<{ Примеры }>---------##########*/
interface IUsersArr {
  name: string;
  age: number;
}

//Пример 1. Привязываем interface что бы отгородить себя от ошибок + будет подсказки
let arr:IUsersArr[] = [{name: '', age: 45}];
// let arr:IUsersArr[] = [{name: '', age: '45'}];//будет ошибка
let arr1 = [{name: 'Вася', age: 45},{name: 'Петя', age: 45}, {name: 'Жора', age: 68}];
let user = {name: 'Вася', age: 45};
function App() {
  let [users, setUsers] = useState(arr1);
  //Можно отгородить себя на уровне функции. будет ошибка если что-то не так.
  //let [users1, setUsers1] = useState<IUsersArr[] | null>(arr1);
  let ref = useRef<HTMLDivElement>(null);//говорим что будет в ref 

  console.dir(ref.current?.textContent);
  /* 
    В некоторых случаях доставать данных требуется через "?", т.к. данные в какой-то момент времени отсутствуют, то есть равны null
    и через null обращаться нельзя и в typescript предусмотрен такой вариант.  Так же если на функции указывается null, 
    то компилятор МОЖЕТ потребует указывать "?"(Но такое встречал на объекте) 
  */

  let [users1, setUsers1] = useState<IUsersArr | null>(user);
  
  return (
    <div >
      <div>{users1.name}</div>
      {
        users.map((item, inx) => {
          return (
            <div key={inx}>
              <h2>{item.name}</h2>
              <div>{item.age}</div>
            </div>
          )
        })
      }
    </div>
  );
}


/*#########---------<{ Где же проявляет себя type в отличие от interface }>--------########## 
  Как такой вариант реализовать через interface я не придумал, т.к. у interface вложенность а обращаться не выходит
  type практически похож на interface, но может немного больше.
*/
type MouseEvent = (e: React.MouseEvent) => void//Кстате обращаем внимание к MouseEvent мы привязали функцию значит и указываем на переменной к которой привяжется функция  

function App1() {
  let handleClick:MouseEvent = (e) => {//можно указать тут e: React.MouseEvent, но зачем по 100 раз
  
    console.dir(e.currentTarget);
  }
  return (
    <div onClick={handleClick}></div>
  );
}

/*
  Главная особенность type это объединять типы.
  Иногда требуется придумать какой-нибудь универсальный тип перечисляющий типы. Интерфейс так не может. 
  Это полезно т.к. перечислять можно и interface
*/

type myType = object | string | React.MouseEvent 

interface interface1 {
  test: string
}
interface interface2 {
  test2: boolean
}
type allInterface = interface1 & interface2;

/*
    имеем теперь подсказки по Event, это хорошо, плохо тем что только по 1й вложенности но не полноценно по следующим т.к. дальше Event не знает 
    на какой элемент при присваиваем данное событие. Тут если изначально у нас был план сделать type универсальным, то
    если хотим углублённые подсказки круг универсальности сужается.
    Таких подсказок куча в React
     React.DragEvent<HTMLDivElement>

     OptionHTMLAttributes<HTMLOptionElement>  - отвечает за <option атрибуты />
     ...
*/
type MouseEvent2 = (e: React.MouseEvent<HTMLDivElement>) => void
function App2() {
  let handleClick:MouseEvent2 = (e) => {
    console.dir(e.currentTarget);//подсказок больше
  }
  return (
    <div onClick={handleClick}></div>
  );
}

/*##########-----------<{ Подготовка данных с сервера }>---------##########
  можно описать какие данные с сервера приходят
*/
interface Users {
  name: string,
  age: number
}

fetch('url')
.then((data) => data.json() )
.then((users:Users[]) => users[0] )

async function fetchUser() {
  // let res = await axios.get<IUsers>('url')

}

interface IParams {
  id: string
}
//снова же привязали interface для подсказок, но чтоб действительно в id что-то было нужно это получить в данном случае через get строку
let params = useParams<IParams>()
console.dir(params);



/*-------------------------------------------------------------------------------------------------*/
/*#########---------<{ Примеры на React }>---------########## 
  FC - специальный тип из TypeScript, он к тому же сокращённый от FunctionComponent 
  Некоторые типы принимают дополнительные типы в < >(Как это узнать хз).
  FC - может применить тип в <Props>. Всё что будет туда переданно компонента будет это проверять 
  на входе передаваемых компоненте props
*/

//Начнём с того что один из вариантов определения пропс выглядит так: children обязательно определять
const Home:FC = (props:{
  name?:string,
  children?: React.ReactNode,
  onClick?(e:React.ChangeEvent):void,//показывает в подсказках как положено как функцию
  onClick1?:(e:React.ChangeEvent) => void
}) => { return ( <div></div> ) }

//2й способ
const Component:FC<{name?:string, myMethod:()=>{}}> = ({name, myMethod}) => {
  return (<div></div>)
}

//но т.к. это не больно удобно описывать типы таким способом то лучше их вынести в type или interface

interface Props {
  name?:string,
  children?: React.ReactNode,
  onClick?(e:React.ChangeEvent):void,//показывает в подсказках как положено как функцию
  onClick1?:(e:React.ChangeEvent) => void
}

const Home1:FC = (props:Props) => { return ( <div></div> ) }
const Component1:FC<Props> = ({name, myMethod}) => { return (<div></div>) }










const Carts = (props:any) => {}
// Продвинутая вариация
interface CartsInterface {
  width: string,
  height: string,
  method1?: () => void,
  children?: React.ReactNode | React.ReactElement | React.ReactChild//ts заставит определить это свойство, используем мы children или нет 
}

const Carts1 = ({height, method1, width, ...props}: CartsInterface) => {
  return (
    <div>
      {props.children}
  </div>)
} //уже авто-комплит будет подсказывать тут и при использовании компонента  <Carts1 />   

// Можно сразу переменной указать что это функциональная компонента и через <> указать interface на который ссылается компонента
const Carts3: React.FunctionComponent<CartsInterface> = ({height, method1, width}) => {
  return (<div></div>)//
} // Есть короткая запись

//import React, { FC } from 'react';
const Carts4:FC<CartsInterface> = ({height, method1, width}) => {
  return (<div></div>)//
} // Есть короткая запись



/*########----------<{ Варианты динамического подгона свойства пользователю компонента }>-------#########*/
export enum CartVariant {
  primary = '#123465',
  darkGray = '#555555'
}

interface CartsInterface1 {
  children?: React.ReactNode | React.ReactElement | React.ReactChild
  cartVariant: CartVariant,
}

const Cart5:FC<CartsInterface1> = ({ cartVariant }) => {
  return (
    <div>
      <div style={{height: 100, width: 100, background: cartVariant}}></div>
    </div>
  );
};

/*Странно в этом то, что если данное свойство обязательно и построено через
  enum, то придётся импортировать данный вариант и прокидывать его свойства. 
  Подменив эти значения какого-нибудь созданного объекта не выйдет, я пробовал */
<Cart5 cartVariant={CartVariant.primary}></Cart5>

/*Обычная картинка когда interface описывает данные которые так же описываются другим interface */
interface Users {
  name: string,
  age: number,
  address: IAddress
}
interface IAddress {
  strict: string
}
let ob3: Users[] = [{
  name: 'Вася',
  age: 20,
  address: {
    strict: 'Москва',
  }
},{
  name: 'Петя',
  age: 20,
  address: {
    strict: 'Краснодар',
  }
},
]





/*-------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------------------------------- */

/*###########------------<{ Универсальность Типов }>-----------###########
  Создаём функцию с универсальными типами. Будет подсказывать в зависимости от переданных типов.
*/

function mergeObject<T, R>(a: T, b: R): T & R{
  return Object.assign({}, a, b)
}
const merged = mergeObject({name: 'Вася'}, {age: 30})
const merged2 = mergeObject({model: 'BMW'}, {year: 1998})



/*
  Обращаясь через любой экземпляр мы получаем подсказку относящуюся к ним, поэтому 
  использование выдуманных "generic type" <T, R> не привязывается к конкретному
  типу и из-за это удобно работать. 
*/
/*-------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------------------------------- */

/*#########---------<{ Функции }>----------############ */

interface myPosition {
  x: number | undefined;
  y: number | undefined;
}
interface myPositionDefault extends myPosition{
  default: string
}
//потенциально возможные варианты. Такой вариант называется перегрузкой
function position (): myPosition
function position (a: number): myPositionDefault
function position (a: number, b: number): myPosition

//реализация
function position(a?: number, b?: number){
  if(!a && !b){
    return {x: undefined, y: undefined}
  }
  if(a && !b){
    return {x: a, y: undefined, default: a.toString()}
  }
  if(a && b){
    return {x: a, y: b}
  }
}
