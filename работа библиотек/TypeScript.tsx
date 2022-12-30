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


/*###########------------<{ Что может typeof }>-------------###########
  В обычном js typeof поверхностно определяет тип:
    typeof 12 //'number'
    typeof {} //'object'
    typeof {name: 'd'} //'object'
  
  В ts typeof может узнавать типы и внутри объектов, так 
*/

  let object1 = {
    name: 'Вася',
    family: 'Пупкин',
    age: 30,
    address: {
      city: 'Таганрок'
    }
  }

 console.dir(typeof object1)

/*
  Можно создать на основе собранной информации type. Получается собираем информацию на основе существующего 
  объекта и можем применять где либо.*/
type User = typeof object1;

/*
  Ещё особенность typeof в том что если переменная примитив и константа (const) то он возвращает её значение а не тип. 
  Это может пригодиться при использовании его при создании type, interface.
  Работает он там только с переменными.  (typeof 11, typeof 'sadas' и т.д. не правильно).
  Если переменная примитив 
*/

const GET_USERS = 'app/GET_USERS';
type InitAction = {
  type: typeof GET_USERS,//в свойство type вернулось app/GET_USERS, 
  // type: GET_USERS,//не верное. переменная не отдаёт значение
  id: number,
}


//Ещё примеры
const initialStateProfile = {
  posts: [
    {id: 1, message: 'Hi, how are you?', likeCount: 12},
    {id: 2, message: 'It\'s, my first post?', likeCount: 11},
    {id: 3, message: 'BlaBlaBla?', likeCount: 13},
    {id: 4, message: null, likeCount: null as number | null}
  ]
}
/*
  Указав as роли не поменяло т.к. на основе предыдущих значений typeScript сделал для себя 
  выводы что данное свойство или number | null.
  Автоматическое типизирование это конечно хорошо, но лучше типизировать самому.
*/
/*typeScript пытается сам определить тип, и в некоторых моментах это успешно,
  отругает
  initialStateProfile.posts[0].id = 'd';
  initialStateProfile.posts[0].message = 2;
  initialStateProfile.posts[0].likeCount = 'test';
*/
/*такой тип нельзя применить на самом initialStateProfile3, а только на других объектах. */
export type initialStateProfileType = typeof initialStateProfile;

initialStateProfile.posts[0].message = 2;/* Поэтому он продолжает не ругаться */

//Попробуем самостоятельно типизировать именно этот объект 
const initialStateProfile2= {
  posts: [
    {id: 1, message: 'Hi, how are you?', likeCount: 12},
    {id: 2, message: 'It\'s, my first post?', likeCount: 11},
    {id: 3, message: 'BlaBlaBla?', likeCount: 13},
    {id: 4, message: null, likeCount: null},
  ] as {id: number, message: string, likeCount: number}[]//можно сказать: Воспринимай этот posts как массив объектов с типами.
}

initialStateProfile2.posts[0].likeCount = 2// теперь если что-то не так будет ругаться.
/* Но запись как по мне не очень читаема. Лучше делать так */


const initialStateProfile3 = {
  posts: [
    {id: 1, message: 'Hi, how are you?', likeCount: 12},
    {id: 2, message: 'It\'s, my first post?', likeCount: 11},
    {id: 3, message: 'BlaBlaBla?', likeCount: 13},
    {id: 4, message: null, likeCount: null as string | null},
  ]
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
  onClick: (event: React.MouseEvent) => void,//можно указать object, но тогда подсказок не будет
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
     React.InputHTMLAttributes<HTMLInputElement>
     React.ThHTMLAttributes<HTMLTableColElement>  <th> таблицы 
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
/*#########---------<{ Примеры на React }>---------########## 
  props просто без объявления не покатит. Хотя бы any должен быть 
*/

interface CardProps extends React.HTMLProps<HTMLButtonElement> {

}

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



/*#########---------<{ Утилиты TypeScript }>----------############ */


//1
interface I_Test1 {
  name?: string;
  age?: number;
}
let a:I_Test1 = {age: 18}
let b:Required<I_Test1> = {age: 20, name: ''}//Если закинуть в Required тип с необязательными полями то они станут обязательными в этом контексте

//2
type AllKey = 'boilerRoom' | 'tsTP' | 'heatingNetwork';

// let c:{[key: AllKey]: string} = {}   <- Вот так делать нельзя пытаться сказать что ключами в данном объекте будут выступать перечисленные в типе
let c: Record<AllKey, string> = {boilerRoom: '', tsTP: '', heatingNetwork: ''}//  только как контролировать обязательность данных ключей хз

//3

/* Как получить поля из interface */

interface Test1 {
  id: number,
  name: string,
  age: number,
  address: string,
  is: boolean
}

type KeysAll = keyof Test1; //keyof перечисление ключей интерфейса или перечисляет type X = "A" | "B" | "C". 
let key: KeysAll = 'address' //переменной могу присваивать только из полученных полей.(имеются подсказки)
//Как получить только нужные поля
//TODO: поправить.
//утилиты для типов виде перечисления

type Key1 =  Exclude<"A" | "B" | "C", 'C'>//исключаем тип С из набора перечисленных типов создавая новый тип 

type TestType1 = "A" | "B" | "C";
type Key2 =  Exclude<TestType1, 'C'>//Вот пример создания нового типа с исключенным 'С'
type Key3 =  Exclude<keyof Test1, 'address' | 'is'>;//или можем исключить ключи из interface
//
// Extract - противоположная сторона Exclude
type Key4 =  Extract<keyof Test1, 'car' | 'city'>;//Эта утилита наоборот конкатенирует ключи в новый тип

//
type Key5 = NonNullable<string | number | undefined >//Создаёт тип исключая null | undefined то есть вернёт string | number


//утилиты для типов виде объектов

type Key6 = Pick<Test1, 'name' | 'age' | 'id'>//наоборот указываем какие поля получить если есть. 
type Key7 = Omit<Test1, 'age' | 'id'>//исключает, ключи. 


//Как получить из массива тип с его ключами.
const arrKeyRequestSystemPTB = [
  "boilerRoom", "tsTP", "heatingNetworks", "exTechDevices",
  "buildingsAndStructures", "gasEquipment", "inspCollectorsBoilerRoom",
  "inspBatteryTanks", "preparationFuelOil", "dataAboutConservation",
  "dataFuelReserves"
] as const;
type keysArr = typeof arrKeyRequestSystemPTB[number]
//собрать объект на основе ключей. 2й параметр reduce не требует заполнения если указать as
const idSelectors = arrKeyRequestSystemPTB.reduce((prev, key, inx) => ({...prev, [key]: `${key}2`}), {}) as Record<keysArr, string>;


export const RoutesPrivate = {
  home: { titleHeader: 'АРМ Руководителя',  path: '/' },
  map: { titleHeader: 'Зоны теплоснабжения', path: '/map' },
  information: { titleHeader: 'Информация', path: '/information' },
  settings: { titleHeader: 'Настройки', path: '/settings' } 
}
//Вариант получить ключи объекта для type
export type KeyNameMainPage = keyof typeof RoutesPrivate;

//Partial<{}>
/* Утилита нужна для присваивания переменной какого-то типа, но при этом
  но в переменную данные могут попасть чуть позже
*/
// Partial<BoilerRoom001Type>[]





class MainContainer extends Component {

  backInHome = (e) => {
    e.preventDefault(); 
    this.props.history.push('/')
    this.props.closeMenu();
    this.props.controlNavBar({visible: true})
    this.props.setActivePage('home'); 
    this.props.setActivitySlide()
  }

  handleLogOut = (e) => {
    e.preventDefault();
    this.props.logOut()
    this.props.closeMenu();
  }
  render() {
   
    let { isDarkTheme, toggleDarkMode, isMenuMain, openingMenu, closeMenu } = this.props;
    

    return (
      <CSSTransition in={isMenuMain} timeout={{enter: 30, exit: 320}} unmountOnExit classNames={{
        // appear: 'my-appear',
        // appearActive: 'my-active-appear',
        // appearDone: 'my-done-appear',
        // enter: 'menu-active',
        // enterActive: 'menu-active',
        enterDone: 'menu-active',
        // exit: 'my-exit',
        // exitActive: 'my-active-exit',
        exitDone: '',
       }}>
      <div id="menu-main" className={`menu menu-box-left rounded-0 `} 
           data-menu-width="280" data-menu-active="nav-welcome" style={{zIndex: 110}} >
        <CardTitle {...{closeMenu}}/>
      

        <div className="list-group list-custom-small list-menu " style={{}}>
         
          <a href="/" onClick={this.backInHome} className="menu-active" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
              <i className="fa fa-home gradient-blue color-white" style={{margin: '0px 0px 0px 6px'}}></i>
              <span className="ps-3" style={{ flexGrow: 1}}>Главная</span>
              <i className="fa fa-angle-right"></i>
          </a>     

          <ListNavigation />

          

          <Settings {...{isDarkTheme, toggleDarkMode, openingMenu}} />
          

          
          <a href="/" onClick={this.handleLogOut} className="menu-active" style={
            { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
              <i className="fa fa-sign-out-alt gradient-dark color-white"  aria-hidden="true" style={{margin: '0px 0px 0px 6px'}}></i>
              <span className="ps-3" style={{ flexGrow: 1 }}>Выход</span>
              
          </a>   

          {/* <ListGroupContacts /> */}
          <h6 className="menu-divider font-10 mt-4">©<span className="copyright-year">{year}</span> ГУП «ТЭК СПб» </h6>
        </div>
      </div>
      </CSSTransition>
    );
  }
}




const mapStateToProps = (state) => ({ 
  isDarkTheme: getDarkModeStatus(state), 
  isMenuMain: getMenuStatus('isMenuMain', state),
 
})

const mapDispatchToProps = {
  toggleDarkMode,
  openingMenu,
  closeMenu,
  setActivePage,
  logOut,
  controlNavBar,
  setActivitySlide
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(MainContainer);
















const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {

    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

const root = ReactDOM.createRoot(appRoot);
root.render(<Parent />);


