/*eslint-disable*/
/*
1. Yup модуль имеет типы для создания схемы.
   [mixed, string, number, boolean, bool, date, array, object] и полезные методы для управления
   [reach, addMethod, ref, lazy, setLocale, ValidationError]
2. Разные типы имеют как разные методы, так и схожие.
   тип mixed содержит схожие
*/
/*####### -- Логика построения схемы для валидации -- ##### */
let ob = {
  name: 'Вася',
  age: Number(24), //явно число
  friends: ['Дима', 'Петя', 'Толя', '123d#3'],
  locationOfFriends: [
    {name: 'Дима43', city: 'Москва' },
    {name: 'Петя', city: 123 }
  ]
}

let schema = yup.object({
	name: yup.string().max(4),
	age: yup.string().max(25),//yup.string() - оказывается не проверка типа, а преобразование в тип 
  friends: yup.array().of(yup.string().min(4)),
	locationOfFriends: yup.array()
		.of(yup.object({ name: yup.string().max(6), city: yup.string().max(7) })),	
})
//Данные не обязательно должны придти все, главное сто бы проверка подразумевала нужный ключ
//манипуляция данными и ошибками
schema.validate(ob, options)
.then((val) => console.dir(val))
.catch((err) => console.dir(err))
/*options*/
{//значения по умолчанию
  strict: boolean = false;//если true генерирует ошибку
  abortEarly: boolean = true;//вернуть после 1й ошибки
  stripUnknown: boolean = false;//удалить неуказанные ключи из объекта
  recursive: boolean = true;
  context: object;//любой контекст для проверки
}
schema.validateSync(ob)//синхронный вариант. При успехе получаем объект
schema.validateAt('locationOfFriends[0].name', ob)//проверяет конкретное место и возвращает его
schema.validateSyncAt()
schema.isValid(ob)//bool вариант
.then((val) => console.dir(val))//true.ко-во полей проверки и переданных полей не соответствует и ошибки то false
schema.isValidSync()

schema.default()//если в валидации были заданы дефолтные значения, то этот метод вернёт объект с ними 
/*-------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------*/
/*######>>>>------ МЕТОД setLocale. ОБРАБОТКА ОШИБОК В ОДНОМ МЕСТЕ. ----------*/
  
const schema1 = yup.object({
  login: yup.string().min(5, 'Мин 5 символов').max(15, 'Макс 15 символов').required('Пустое поле'),
})

yup.setLocale({
	mixed: { 
    required: 'Пустое поле',
    default: ({label, originalValue, path, value})=>{
      return 'Какая-то ошибка'
    }
  },
  string: {
		min: 'Мин ${min} символов',//предусмотрен такой вариант передать число.(не ES6, просто закос)
    max: ({path, max, value})=> { //детальное влияние на ошибку. path - там где происходит ввод 
      return `${path} не должен превышать ${max} символов`
    }},
  number: {
    /*
     если работать с Yup через schema.validate, то в catch в свойство message мы 
     можем отправить свой объект. Через Formik такой прикол не удастся т.к. он ждёт сообщение */
    min: ({ min }) => ({ key: 'field_too_short', values: { min } })
  }
});
const schema2 = yup.object({
	login: yup.string().min(5).max(15).required(),//чисто
})
/*-----------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------*/
/*######>>>>------МЕТОД REACH. СХЕМЫ ГОТОВЫ И ИМЕЮТ ВЛОЖЕННОСТЬ. ------ #######*/

let schema3 = yup.object({
  nested: yup.object({
    arr: yup.array().of(yup.object({ num: yup.number().max(4) })),
    arr2: yup.array().of(yup.number().max(4)),//хотим эту
  }),
});

let arrSchema = yup.reach(schema3, 'nested.arr2');//получил часть схемы
arrSchema.isValid([1,2,3,3])
.then((value) => console.dir(value))//проверили

/*------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------*/
/*######>>>>------МЕТОД AddMethod. СОЗДАНИЕ СВОЕГО МЕТОДА. -----*/
/*
	Создаёт собственный метод. 1. для какого типа 2. как называется 3. функция для выполнения
	this схема через которую добавляем валлидацию.
*/
yup.addMethod(yup.string, 'myMethod', function (myMessage = ''){
	return this.min(5).max(15).required()
})
//избавляет от указывания одной и той же проверки
const schema5 = yup.object({
	name: yup.string().myMethod('Можем что-нибудь передать'),
	login: yup.string().myMethod()
})

/*------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------*/
/*######>>>>------МЕТОД CAST------ */
/* 
  Как я понял cast с валлидацией не работает, он просто передаёт данные и 
  выполняет только преобразование без всяких min, max...
  Вроде как cast это значения по умолчанию. Если передать в isValid значения то он будет сравнивать с 
  cast значениями 

  Предположим я прогоняю данные через схему */
  let schema6 = yup.object({
    products: yup.array().of(yup.object({
      id: yup.number().min(1),
      name: yup.string().min(3)
    })),
  })

  let a = schema6.cast({
    products: [{id: '0', name: 2}],
  } )
  console.dir(a);//products: [{name: "2", id: 0}]
/*
  Если передаётся бред, то обрабатывать нужно через try catch. Короч метод validate лучше справляется. 
*/
try {
	let a = schema6.cast({
		products: [{id: '0ds', name: 2}],
	} )
} catch (error) {
	console.dir(error);
}
/*------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------*/
/*######>>>>----МЕТОД REF. ССЫЛКИ НА СХЕМЕ. ------####*/
/*
  Не знаю зачем, но такая возможность есть. Схема может быть большой и предусмотренна
  на все ключи и вложенность. Обычно что приходит, если проходит проверку, то и возвращается
  в блок then. Можно данные корректировать. test, transform влияют на значения, ref может
  дополнять возвращаемые данные ссылаясь на заданные нам участи.
*/
const schema7 = yup.object({
	months: yup.ref('products[0].id'),
	products: yup.array().of(yup.object({
		id: yup.number().min(3),//ref ссылается на эти данные
		name: yup.string().min(3)
	})),
})

schema7.validate({
		products: [{id: 14, name: 'apple'}],//передаю и ожидаю только это
})
/*
{products: [{…}], months: 12} - вернётся свойство на котором был ref.
свойство months ссылается на id. 
*/
.then(console.dir)
.catch(console.dir)

/*------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------*/
/*######>>>>----МЕТОД LAZY. ЛЕНИВАЯ ЗАГРУЗКА ПРИ ПРОВЕРКЕ. ------####*/

/* Предположим у нас массив и там неизвестно какие данные */
let sch = yup.array().of(yup.mixed().test('test1', function(val){
	console.dir(val);//можно конечно обрабатывать так
}))
sch.validate(['Вася0', 24, null])
.then(console.dir)
.catch(console.dir)

const lazyLoading = yup.lazy((value) => {

  switch (typeof value) {
    case 'number': return yup.number();
    case 'string': return yup.string();
    default: return yup.mixed();
  }
});
//объект lazyLoading (lazy) не подразумевает всякие проверки lazyLoading.min(4) и прочие  
const schema8 = yup.array().of(lazyLoading);

schema8.validate(['Вася0', 24])
.then(console.dir)
.catch(console.dir)
/*
	Можно сделать функции проверки под разные типы и передавать данные в switch.
	Можно пойти дальше. Мы можем не предполагать что за данные и в каком кол-ве
	придут (хотя это мало вероятно) и усложнять логику создав lazy на создавав таких
	методов которые будут вызывать по нужде друг друга. 
*/
const lazyLoading1 = yup.lazy((value) => {
	//у null нет конструктора поэтому typeof value
	let type = (!value && typeof value !== 'string')
						 ? typeof value : value.constructor.name;
  switch (type) {
    case 'Number': return yup.number();
    case 'String': return yup.string();
    case 'Array': return yup.array().of(lazyLoading);//вызывает 1й lazy
    default: return yup.mixed();
  }
});

/* Скажем если мы совсем в слепую получаем данные, то будем передавать через lazy*/
lazyLoading1.validate({ notThis: 'foo', useThis: 4 })
.then(console.dir)
.catch(console.dir)

/*
	Вообщем lazy для динамического использования, только тех проверок которые действительно 
	необходимы. Без lazy обрабатываться может большой участок кода проверки, а использоваться 
	лишь часть. Если хорошенько продумать да ещё с созданием своих методов, то проверку
	можно сделать универсальной и довольно короткой.  
*/


//просто создаёт объект ошибки. В каких случаях пригодиться не понятно. yup сам генерирует ошибки 
new yup.ValidationError('Ошибочка', value, 'age')//msg, value, path

/*@@Некоторые методы@@*/
/*####***MixedSchema***#### */
required('Поле не должно быть пустым')//если стоит default() со значением, то смысла в этом поле нет
//выбрасывает ошибку если null и undefined
defined()//пропускает null, но выбрасывает ошибку если undefined
notRequired()//при undefined не приводит к ошибке. в yup это по умолчанию,  можно не указывать
strip()/*bool удаляет ключ и значение. notThis: string().strip()
 schema.cast({ notThis: 'foo', useThis: 4 }); вернёт { useThis: 4 } 
 если был установлен ref по данному ключу, то данные тоже вернуться без них*/

isType()//разрешает любые типы. yup ничего конвертировать не будет
typeError()//можно задать сообщение о типе. лучше в setLocale задать 
nullable()//null считается допустимым значением типа
strict(true)//yup не преобразует тип. и если тип не соответствует выдаст ошибку типа 
withMutation(cb)//хз. как это работает
.default()//установить значение по умолчанию если передано undefined
oneOf([400,401,402]);/*или*/equals(); //список того чему должно соответствовать иначе ошибка
notOneOf([])//всё что угодно но не то что указанно в массиве
//when динамически подкидывает значение на ключ ориентируясь совершенно на другой ключ
when('age', {//age: 4
  is: 4,//если значение age и is совпадают. можно так: (val) => val == true
  then: yup.number().min(200),//выполним это
  otherwise: yup.number().min(500),//иначе это
})
//альтернатива
when('isBig', (isBig, schema) => isBig ? schema.min(5) : schema.min(0)),

concat()

label()//переопределяет ключ label и path в ошибке свойство param. Так же в setLocale
meta({})//заносит любые данные в свойство _meta
describe()//хз зачем, но установив в конец связки meta,label,test - вернёт объект с этими
          //данными. объект не должен возвращаться на ключ

yup.addMethod(yup.mixed, 'myMethod', function(){
  let a =	this.label('s').meta({key1: 'd'}).test('test1', function(){
    return true
  }).describe()
  console.dir(a);//получили обычный объект из label, meta, tests, type
  return this//возвращаться должна схема для ключа name, а не обычный объект
})

/*
метод test отрабатывает в любом случае, а вот дальше будет зависеть от нас.
Возвращая true гарантирует успех (если не было до test ошибок), false или ничего
не возвращать сгенерирует выдаст нашу ошибку. 
*/
.test('myCheck', 'Проверку не прошла', (value) => {

return false
})
//или создать свою ошибку для этого нужна функция типа es5 для взаимодействия с this
.test('myCheck',  function(...value) {	
const { path, createError } = this;
return createError({ path, message: 'mes' })
})

//принимает cb с 2мя параметрами. Может редактировать значение. Вернуть должен того же типа 
.transform((value,originalValue)=>(`!${value}!`))

/*####***ArraySchema***#### */
of()//принимает схему и проверяет ей каждый элемент массива
/* методы повторяются с другими типами 
min, min, 
ensure - добавляет [] для null, undefined, default и обычные значения тоже приобретают скобки
*/
compact()//вырезает из массива undefined, null, 0, '', false, NaN
//так же имеет не обязательный cb итератор 
/*####***StringSchema***#### */
length(4, 'длинна должна быть в 4 символа')
min(5, '... должно быть больше 5')//в number min это не длинна, а число. n < 5 - то ошибка
max(10, '... не должно превышать')//в number это не длинна, а число. n > 10 - то ошибка
matches(/ваш/i)//если не находит regex то ошибка. 2й пар option
/*{
  excludeEmptyString: true,//при пустой строке matches свою ошибку выбрасывать не будет
  message: 'Такого текста нет'//msg ошибки
}*/      
email('данные не соответствуют email' | cb)
url('это не URL' | cb)//формат должен быть (протокол + домен n уровня + домен 1 уровня)https://yandex.ru/
uuid('message' | cb)//Проверяет UUID значение с помощью регулярного выражения. хз что это
ensure()//Преобразует undefined, null и даже знач. default в пустую строку.

lowercase('message' | cb)
uppercase('message' | cb)
//trim не обрезает, а сообщает и то только если строгий режим .strict()
trim('message' | cb)
/*####***NumberSchema***#### */
min(number | Ref, string | cb)
lessThan(number | Ref, string | cb)//должно быть меньше значения иначе ошибка
moreThan(number | Ref, string | cb)//должно быть больше значения иначе ошибка
positive(string | cb)//только положительные 
negative(string | cb)//только отрицательные
integer(string | cb)//только целые
truncate()//удаляет всё после точки оставляя целое число
round('floor' | 'ceil' | 'trunc' | 'round')//round
/*
'floor' - сокращает в меньшею сторону 21.9 = 21
'ceil'  - сокращает в большую сторону 21.1 = 22
'trunc' - обрезает всё после точки. тот же truncate()
'round' - при достижении середины склоняет в большую иначе в меньшую
*/
/*####***BooleanSchema***#### */
boolean()
/*####***DateSchema***#### */
date()//понимает формат yyyy-mm-dd или new Date()
isType()//не принимает поч такой формат yyyy-mm-dd только объект 

min(Date | string | Ref, string | cb)//max тот же
/*####***ObjectSchema***#### */
object.from('key', 'newKey', boolean = false)//переименовывает ключи.3й пар. Оставить так же старый ключ

let schema9 = yup.object({
  myProp: yup.mixed(),
  Other: yup.mixed(),
})
  .from('prop', 'myProp')
  .from('other', 'Other', true);//

schema9.cast({ prop: 5, other: 6 }); // => { myProp: 5, other: 6, Other: 6 }

noUnknown(boolean = true, string | cb)//оставляет только известные ключи/
constantCase()//преобразует в константу

const schema10 = yup.object({
	products: yup.array().of(yup.object({
		id: yup.number().min(3),//ref ссылается на эти данные
		name: yup.string().min(3)
	}).noUnknown(true)),
})

schema10.validate({
		products: [{id: 14, name: 'apple', html: '<div></div>'}],//передаю и ожидаю только это
})
.then(data => console.dir(data))//{name: "apple", id: 14}

/*####***SchemaTypes***#### */


