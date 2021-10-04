/*eslint-disable */
import React, { FC } from 'react';
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

type ID = string | number;//Создали свой шаблонный тип

const id1: ID = '3123';
const id2: ID = 1234;

/*
  Обычно загатавливаеться type на котором в дальнейшем строиться какой-то объект.
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
  Т.к. изначально присвоенное значение к какой либо переменной привязываеться к данному типу это поведение можно изменить.
  К примеру экспортированый type может идеально не подойти к какому либо объекту, к примеру year где-то указываеться как string
 
*/
let ob1 = {
  model: 'BMW',
  year: 2004 as number | string,
  money: 1200000
}
// в ts typeof умеет не просто определять тип, он передаёт ссылку этой переменной с её данными
export type Model = typeof ob1;
//где-то в другом файле
let ob2: Model = {
  model: 'Opel',
  year: '2009',
  money: 1300000
} 


// В reducer описываються константы 
const GET_USERS = 'app/GET_USERS';
type InitAction = {
  type: typeof GET_USERS,//мало того что сказали string, так ещё строка должна соответсвовать
  id: number,
}

let action: InitAction = {
  type: GET_USERS,
  id: 12
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

interface React {
  readonly id: string,
  color?: string,
  size?: {
    width: number,
    height: number
  }
}

interface IReact2 extends React{ //Есть наследование. Часто вначале ставят I указывая что это интерфейс
  method2?: () => number //новая запись. С function как записывать не знаю.
}

const react1: React = {
  id: '1234',
  size: {
    width: 4,
    height: 6
  }
}
// react1.id = 465// нельзя переназначить

const react3 = {} as React; //привязать тип. Новая запись
// const react4 = <React>{}; //старая


class MyClass implements IReact2{//привязываемся к нужному интерфейсу т.к. хотим заполнять теже свойства
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

/* 
  enum это просто названный список содержащий чего либо и названый элемент находиться на своей позиции индекса.
  На нормальный русский это типа массив записанный в другой форме. 
  let Membership = ['One', 'Two', 'Three'], но с одной фишкой
 */
enum Membership {
  One, 
  Two,
  Three,
}

const props1 = Membership[2];//Three. Результат как в обычном массиве
const props2 = Membership.One;//0 - обратившись по имени получаем индекс.В обычном массиве пришлось бы использовать findIndex()

enum SocialMedia {
  VK = 'VK', 
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
}
//если в enum свойствам присвоены значения, то при обращении через них будем получать не индекс а значения 
const props3 = SocialMedia.VK;//


/*#########---------<{ Примеры на React }>---------########## 
  props просто без объявления не покатит. Хотя бы any должен быть 
*/

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
FC
//import React, { FC } from 'react';
const Carts4:FC<CartsInterface> = ({height, method1, width}) => {
  return (<div></div>)//
} // Есть короткая запись



/*########----------<{ Варианты динамического подгона свойства пользователю компонента }>-------#########*/
export enum CartVariant {
  primary = '#123465',
  darkGray = '#555555'
}

interface CartsInterface {
  children?: React.ReactNode | React.ReactElement | React.ReactChild
  cartVariant: CartVariant,
}

const Cart5:FC<CartsInterface> = ({ cartVariant }) => {
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
interface Ob {
  name: string,
  age: number,
  address: IAddress
}
interface IAddress {
  strict: string
}
let ob: Ob[] = [{
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