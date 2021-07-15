import { bool } from 'prop-types';
/*eslint-disable*/
import { Field, reducer as formReducer, reduxForm, propTypes, FormSection} from 'redux-form'
/*
  Знать надо но использовать не надо т.к. 
  1. При клике на форму redux-form перерисовывает компоненты до самого верха
  2. Redux-Form - 22,5 КБ минифицированного gzip-архива (Formik - 12,7 КБ).
*/

/*
  propTypes хоть он не находит, но он там есть
  При использовании reduxForm высвечиваются проблемы с жизненными циклами. 
  1. помещаем в объект со всеми reducer в combineReducers
  2. Не указав type='button' в input отправка формы формы будет происходить по клику Enter,
     если в форме есть места где мы делаем изменения по клику кнопки, то будет по нажатию и отправка
     и изменение при каждом клике 
*/
{
  form: formReducer // ниже описан способ formReducer.plugin как вмешаться в reducer формы и по возможности управлять state
}

/*
  2. formRedux вызывается как HOC, в файле где форма, передаём параметры и результат экспортируется
     родителю. Если вызвать в Container и передавать ниже, то метод onSubmit который 
     требуется redux-form придётся или в options объявлять или на голову выше родителя создавать. 
*/

//props пополнится методами redux-form. В дальнейшем props - основного компонента (ОК)
let login = (propsOK) => {
  let { handleSubmit, submitting, pristine, reset } = propsOK;
  return (
    <form onSubmit={ handleSubmit }>
      <Field  component='input' type='password' name='pass'/>
      <button type="submit" disabled={pristine || submitting}> Submit </button>
    </form>
  )
}
export default formRedux({
  form: 'имя формы'
})
/*
  3. в родителе вызываем компонент и передаём пропс названный onSubmit
    Как работает redux-form.
      onChange скрыт в Field, заполняя данными локальный state
      при клике handleSubmit должен передать данные в метод который мы ему
      передаём под именем пропс onSubmit. onSubmit передаёт данные как объект JSON .
*/

let parent = (props) => {
  let method = (val) => {}
  return <Login onSubmit={ method }/>
}



"------------------------------------------------------------------------------------"
"########------------------<{ Работа с mapStateToProps }>--------------------########";
/*
  Можно из родителя передавать эти методы, главное чтобы props были так же названы.
  Можно пойти дальше и свойства определить в mapStateToProps добавляя данные из других хранилищ
  перед отправкой, но есть но. Получив через хранилище form мы не сможем адекватно обращаться к его свойствам. 
*/
Пример_1;
let mapStateToProps = (props) => ({
  auth: props.auth,
  initialValues: {
    login: 'sss',
    pass: 'dd',
    someKey: props.footer.num.d,//но обращение возможно только одно как я понял иначе цикл перезагрузки
    count: 4,
    counter: {
      num: 14//что бы определить вложенное свойство нужен FormSection
    }
   }
})

let Comp = (props) => {
  return (
    <>
    <Field name='count' component='input'></Field>
    <FormSection name='counter'>
      <Field name='num' component='input'></Field>
    </FormSection>
    </>
  )
}
//--------------------------------------------------------------------
Пример_1;
let mapStateToProps1 = (props) => ({
  auth: props.auth,
  count: props.footer.num.d
})

let Comp1 = (props) => {
  props.initialize({age: props.num})
  return (
    <>
    <Field name='age' component='input'></Field>
    <button onClick={() => props.dispatch(action(props.count+1))}></button>
    </>
  )
}

/*
  Смысл в том чтобы получить из state данные и что бы они от рисовались понадобиться 
  enableReinitialize: true. Хотя в примере RF показывают без него, но воспроизвёл пример и без
  enableReinitialize: true не в какую не обновляет форму.
*/ 
Пример_3;
let mapStateToProps2 = (props) => ({
  auth: props.auth,
  initialValues: props.auth.user
})

let Comp2 = (props) => {

  let user = {
    login: 'SinGlEBW',
    pass: 123
  }
  return (
    <>
    <Field name='login' component='input'></Field>
    <Field name='pass' component='input'></Field>
    <button onClick={() => props.dispatch(action(user))}>Загрузить пользователя</button>
    </>
  )
}
/* Так же если всё таки через mapStateToProps передать данные из хранилища то получим объект примерно такой структуры*/

{//объект формы в хранилище заполняется по мере возникновений событий
  anyTouched: true
  fields: {login: {//действия с полями
    touched: true
    visited: true
  }};
  registeredFields: {login: {//описание поля
    count: 1 
    name: "login"
    type: "Field"
  }};
  syncErrors: {login: "Required"}; //Ошибки при валидации
  asyncErrors: {login: "Required"};
  submitErrors: {login: 'mySubmitError'};//Ошибки вызванные через SubmissionError
  values: { login: 'данные' };
  initial: {login: ''};//сокращенно от initialValues, то есть начальные значения
}
/*ВАЖНО: При обращении к свойствам такого объекта, получим undefined. Объект отрисовывается позже.
         Так что смысла прокидывать такой объект я не вижу.
*/

"------------<{ Странные наблюдения }>------------------------------------------"
/*
  Во всех reducer'ах все action мы почему то получают объект типа
{
  meta: {form: "имя формы", keepDirty: undefined}
  payload: {age: 0}
  type: "@@redux-form/INITIALIZE"
}
 При этом использовать продолжаем обычным способом не устанавливая action.payload.age, а просто action.key
 и даже при попытке посмотреть action.key мы будем видеть там undefined, хотя если посмотреть в метод Action
 то данные будут передаваться и всё будет работать и state будет заполняться.
*/
"------------------------------------------------------------------------------------"
"########--------<{ Варианты Field + остальные компоненты }>----------------########";

Компонент_Field________________________________________________________________________________;

<Field name='login' component={renderField}></Field>;
/*  
  input: {name: "h", onBlur: ƒ, …}
  meta: {active: false, …} 
*/
__
const renderField = ({input, meta}) => {
	console.dir(input);
	return <input {...input}/>
		
};
Компонент_Fields________________________________________________________________________________;

<Fields type={['text', 'password']} names={['firstName', 'lastName']} placeholder={['Логин', 'Пароль']} component={renderFields} validate={{firstName: ()=>{}}}/>;
/* Одной записью создали 2 поля вот и всё преимущество. Пока всё что я вижу, это как дурак плодить всё массивами. 
  Потом вот так обрабатывать*/
const renderFields = ({names, placeholder, type, ...fields}) => {
  console.dir(fields[names[0]].input);
  return names.map((key,inx) => (
      <div className="input-row">
        <input {...fields[key].input} type={type[inx]} placeholder={placeholder[inx]}/>
        {fields[key].meta.touched && fields[key].meta.error &&
        <span className="error">{fields[key].meta.error}</span>}
      </div>
))};
/*
Любое изменение в одном поле перебираются снова и снова все поля вместо одного над которым работали. Короч шляпа а не метод.
  login1: {input: {…}, meta: {…}}
  login2: {input: {…}, meta: {…}} 
  names: ['login1', 'login2']
  ...
*/

Компонент_FieldArray_________________________________________________________________________;
//Динамическое создание полей пользователем.
<FieldArray name='user' component={renderArray} />
/* 
 Как пишут похож на обычный Field и вроде как требуется для создания полей динамически.
 То есть без ручного прокидывания программистом этих полей.
 Смысл в том что FieldArray это обёртка с инструментами. 

 Поля где-то складываются и видно в fields лишь счётчик и методы для взаимодействия.
 1й раз вижу объект в таком образе.
  fields: Object(0) {forEach: ƒ, get: ƒ, getAll: ƒ, insert: ƒ, …}
  meta: {dirty: false, error: undefined, …}
  В примере renderField возвращает кучу Field. Зачем писать повторяющиеся поля не ясно пока.
*/
/*
  Как это сие работает. FieldArray говорим что будем работать с неопределённым кол-вом полей
  которые будет создавать пользователь. Даём имя объекту который будет содержать наши поля.
  renderArray - готова пушить просто пустую ячейку создавая таким образом пространство. (push не оригинальный)
  Каждую ячейку заполняем нужными элементами. Здесь приведён пример когда в массиве можно расположить
  ещё массив таких полей. ВАЖНО: здесь имена задаются в ООП и если есть вложенность FieldArray то
  обязательно не забыть указывать имя объекта каждой итерации {`${user}.name`} как для
  FieldArray так и для обычных Field

*/

const renderArray = ({ fieldsA, meta: { error, submitFailed } }) => 
(
  <>
    <button type="button" onClick={() => fieldsA.push()}>Добавить Пользователя</button>
    {fieldsA.map((user, index) => 
      (
        <div key={index}>
          <Field name={`${user}.name`} type="text" component={renderField1} label="Имя"/>
          <button type="button" onClick={() => fieldsA.remove(index)}> УДАЛИТЬ</button>
          <FieldArray name={`${user}.hobbies`} component={renderHobbies} />
        </div>
      ))} 	
  </>
);

const renderField1 = ({ input, label, type, meta: { touched, error } }) => 
(
	<div>
		<input {...input} type={type} placeholder={label} />
		{touched && error && <span>{error}</span>}
	</div>
);

const renderHobbies = ({ fieldsA, meta: { error } }) => 
(
	<>
		<button type="button" onClick={() => fieldsA.push()}> Добавить хобби </button>
		{fieldsA.map((name, index) => 
			(
				<div key={index}>
					<button type="button" onClick={() => fieldsA.remove(index)}> Удалить хобби</button>
					<Field name={name} type="text" label="Хобби" component={renderField}/>
				</div>
		))}
	</>
);


fieldsA;
  Object(0)//Объект имеет такой вид. Показывает кол-во созданных полей 
  forEach((name, inx, _this));//Имена строка - как массив "myName[0]"
  map((name, inx, _this));//
  get(index);
  getAll();//получить все данные полей
  insert(index, value);//вставляет в field новое значение
  move(from, to);//перемещает откуда куда элемент в массиве
  pop();
  push();//Пушит в field поле. Можно не передавать. С встроенным в JS так не прокатит.
  reduce(callback, initial);
  remove(index);
  removeAll();
  shift();
  splice();
  swap(indexA, indexB);//Меняет местами элементы в массиве
  unshift();
  name: "arrField";
  length: 0;


Компонент_Form__________________________________________________________________;
/*
  Form - не вижу разницы использования с и без этого компонента. 
*/
Компонент_FormName______________________________________________________________;
/* Так же не особо полезный компонент. Компонент FormName через метод children может передать имя формы любому
   компоненту при условии что сам FormName используется в компоненте передаваемом в reduxForm.
*/
<FormName children={({form}) =><myComponent formName={form}/>}></FormName>;
//в чём смысл гениальности если можно передать так:
<myComponent formName={props.form}/>

"------------------------------------------------------------------------------------"
"########----<{ Доп Методы из redux-form }>-------------########";
/*
  Т.к. ссылаться на данные полученные из хранилища "form" через mapStateToProps особо не выходит,
  вот метод который получает введённые данные. 
  Подключение: это HOC который передаётся в компонент reduxForm*/
   
formValues('login' || {newKeyName: 'login'} || function(props){ return 'login'} )(Компонент)//метод декоратор. Вызов до formRedux. 

/* Передав имя поля, или перечисляя их или объектом ключ который выступает в роли нового имени или cb от которого толку особо нет.
   В компоненте формы в propsOk получим данные. Обычно доступ к данным получаем в renderInput и событиях, но не в главном компоненте. 
   Переданные свойства в propsOk будут тупо россыпью, их нельзя закинуть в отдельный объект например value: {}, .

Смысла использовать cb не вижу да и для передачи всех полей придётся возвращать объект и воздействовать.
formValues((props)=> ({login: 'login', pass: 'pass'}));
formValues('login','pass'); Проще сделать так 
*/
____________________________________________________________________________
/* 
  Вот метод способный определить данные в mapStateToProps. Определяется selector который принимает хранилище и имя поля. 
*/
const selector = formValueSelector('имя формы');

let mapStateToProps3 = (props) => ({
  //вариант россыпью
  login: selector(props, 'login'), 
  pass: selector(props, 'pass'),
  //уже можно сгруппировать по сравнению с formValues методом
  val: selector(props, 'login','pass')
})

____________________________________________________________________________
/* 
  Во всех случаях мы управляем reducer'ами самостоятельно. redux-form берёт эту ответственность на себя
  и создаёт все переменные в reducer самостоятельно. Что бы частично контролировать redux-form можно 
  воспользоваться методом plugin у formReducer
*/
formReducer.plugin({
  имя_формы: (state, action) => {
    switch (action.type) {
			case "RESET_LOGIN": return {
        ...state,
        values: { ...state.values, login: '' },
				registeredFields: {  ...state.registeredFields, login: '' } 
			}
			default: return state
}}})



/* К примеру если задиспачить action на очистку логина. Никогда не задумывался, но когда происходит 
  dispatch то все reducer'ы отрабатывают и идёт поиск нужного нам action.type   */
____________________________________________________________________________

throw new SubmissionError({login: 'ошибка логина', _error: 'общая ошибка'});
/*
  метод передаёт в meta переданные в него ошибки. Можно и самому организовать всё через state
  В reducer класс SubmissionError заполняет свойство submitErrors: {login: "ошибка логина"},
  при передаче ошибки _error создаст свойство error: общая ошибка и будет это в props отображаться 

Тут я встретился не сказать что с проблемой, но придерживаться како-то структуры стало сложней потому что
код начал разбредаться.
контроль ввода-вывода формы через formReducer.plugin и передача-получение валидных или не валидных данных с сервера через authReducer
дал задуматься стоит ли диспачить из одного файла в другой reducer. Т.к. Ошибки в приходят в authReducer
варианты у нас следующие:
1. dispatch({type: 'ERROR_SUBMIT_FIELD', err: response.data.err})//по хардкору передадим в state submitErrors
2. вернуть response.data.err из catch используемого Thunk метода из authReducer, ошибки на UI в Container обработаем Promise и 
   закинем в state через класс SubmissionError
3. воспользуемся в классом SubmissionError прямо в authReducer в нашем методе Thunk. Всё же короче 1 пункта.
*/

"------------------------------------------------------------------------------------"
"########----<{ Короткое описание formRedux методов и свойств }>-------------########"; 

formRedux({
  form:"Имя формы",//* обязательный.
  asyncChangeFields:['login', 'pass'],//asyncValidate будет запускаться на каждое нажатие в данных полях
  asyncBlurFields: ['login', 'pass'],//asyncValidate получит данные после потери фокуса. см.ниже
  asyncValidate,// асинхронная валидация. в спарке с asyncBlurFields меняется режим. см.ниже
  destroyOnUnmount: bool,//По ум. true удаляет значения из формы когда компонент отключён (перешли на другую страницу)
  forceUnregisterOnUnmount:bool,/*По.ум. false. Когда компонент отключили и включили, Заполнит теми же данными которые вводил пользователь
                                  а не подкинет значения по умолчанию из объекта initialValues. Конечно если не 
                                  установлен метод destroyOnUnmount: true который удалит тогда хранилище данных*/
  getFormState: (state) => state.form1,//если в reducer'ах поменять стандартное имя "form" то в reduxForm и formValueSelector нужно в ручную передать state формы
  immutableProps:[],//не изменяемые свойства. Что это значит хз
  initialValues:{login: 'SinGlE', pass: 123},//начальные значения в полях
  enableReinitialize:bool,/*По.ум. false. смотрит на initialValues свойство. Если initialValues установлен в mapStateToProps и использует значения из 
                            другого хранилища которое обновляется что бы это обновление увидеть требуется enableReinitialize: true */
  keepDirtyOnReinitialize:bool,//По.ум. false. Хоть и значения в хранилище меняются, изменения не будет в field, как я понял равносильно enableReinitialize: false
  keepValues:"",//
  onChange:(val, dispatch, rfOb,prevVal) => {},//отрабатывает по вводу
  onSubmit:(val, dispatch, props) => {},//можно тут определять метод
  onSubmitFail:(err, dispatch, subErr, props) => {},//отрабатывает если попытались отправить, но валидация не прошла
  onSubmitSuccess:(result, dispatch, props) => {},//отрабатывает при успешной валидации
  shouldAsyncValidate:(param) => {},//отрабатывает при асинхронных ошибках. Возвращая true свойство submitSucceeded останется false
  persistentSubmitErrors: bool,//
  propNamespace:"",//что-то с декорированием связано и с использованием других библиотек
  pure:bool,//По ум. true. что-то там "реализует метод shouldComponentUpdate и предотвращает ненужные обновления". Короч не ясно, не понятно.
  /*----------------------------------*/
  shouldError:"",//устарело
  shouldValidate:"",//устарело
  shouldWarn:"",//устарело
  /*-------------------------------- */
  submitAsSideEffect:bool,//По ум. false. Не обновлять данные объекта после отправки?
  touchOnBlur:bool,//По ум true помечает поля при взаимодействии с полем
  touchOnChange: bool, //По ум true помечает поля при непосредственном вводе в поле
  updateUnregisteredFields:bool,//хз
  validate,//синхронная валидация формы
  warn:(val, rfOb) => {},//тот же validate просто при ошибках заполняют объект warnings и потом смотрят на warning, а не error
})(Компонент);
/*
  Какие можно рассмотреть валидации
  validate- варианты: метод валидации поместить в конт. комп., далее передать или в field validate
                      или в reduxForm  validate: (val, rfOb) => rfOb.validateRf(val) обращаться к своему методу 
  Недостаток reduxForm что доступ к методам из Container компонента осуществляется через метод если у него есть
  аргумент  rfOb.  Смысла методы экспортировать не вижу т.к. из одного места гнать что-то через пропс, а что-то импортом
  грязная затея уж лучше сразу отказаться от записи в reduxForm что бы придерживаться концепции UI->BLL->DAL.

  Как validate работает. (validate для Field возвращает не объект, а Message ошибки)
  Запускается сразу же. Ошибка пустоты куда-то улетает и передаётся если было касание, ничего не ввели
  потеряли фокус. Тогда ошибка вызовется. Отслеживает только ввод здесь и сейчас.
  rfOb это расширенный объект propsOK
  */
let validate = (val, rfOb) => {
  const errors = {}
  if (!val.login) errors.login = 'Required'
  if (!val.pass) errors.pass = 'Required'
  return errors
}
/* 
Предназначено для валидации на стороне backEnd. Ждём ответ работа с промисами.  
  Без asyncBlurFields, валидация asyncValidate будет отслеживать с первого ввода значения и последующий 
  ввод + потеря фокуса.  
  C asyncBlurFields валидация asyncValidate ввод по символьный.

	asyncValidate с этим методом мы можем напрямую общаться через DAL уровень и работать с Promise,
	но если мы придерживаемся структуры UI->BLL->DAL то этот метод не подходит. Из-за того что
	метод должен работать с Promise и хоть мы и можем через 3й аргумент rfOb прокинуть Thunk'у 
	работающую с DAL уровнем нам нужно тогда возвращать промис и обрабатывать на уровне формы в UI, 
  а мы хотим обрабатывать на уровне BLL, а то получается фигня, на BLL промисами работает,
  потом возвращаем те же промисы и на UI работает. Поэтому нужно использовать обычную валидацию, но там тоже есть подвох
	для такой структуры как у меня. 

*/
let asyncValidate = (val, dispatch, rfOb, nameField) => {
	
		try {
			if ((!val.login) && nameField === 'login') throw Promise.reject({login: 'Required'})
			if ((!val.pass) && nameField === 'pass')  throw Promise.reject({pass: 'Required'})
		} catch (error) {
			
			return error
		}
    //-------
    rfOb.authT(rf.form, val)
	}
let asyncBlurFields = ['login','pass'];
/*
  Для асинхронного вызова нужно получить нужные и отправить. Ей не нужно валидировать 
  каждое нажатие. Данный параметр соберёт с полей данные и передаст в asyncValidate 
*/

"------------------------------------------------------------------------------------"
"########------<{ Реализация ошибок }>-------###########"
Важно_в_любой_версии: "Практика показала в mapStateToProps форму не доставать иначе в некоторых случаях циклически обновляется"
____v5____
/* Указываем в formRedux временные имена. Если в mapStateToProps был передан из state
   объект формы ...props.form.myForm то при фокусе в props объектов fields который заменит массив.
   Не знаю как раньше но такой подход щас не работает т.к.пока нет этого объекта мы не можем обращаться к его свойствам
   получается мы требует undefined.touched. Что странно объект value появляться тогда когда в mapStateToProps
   передаём ...props.form. И обращаясь к console.dir(props.entrance); мы получим сначала undefined потом объект,
   что говорит проблеме синхронности данного кода.
*/
//при вводе заменит массив fields в redux-form
const { fields: { username }, handleSubmit } = props

{username.touched && username.error && (<span className="error">{username.error}</span>)}
//установили значения пока не сгенерирован объект. Имя формы откинул
formRedux({ fields: ['username', 'password'] })(Компонент);

____v6____
/* Создаётся метод, для того что бы его передать в пропс component. Почему метод?
   потому что так задумано и использовать его как компонент смысла нет (<renderInput> и не с заглавной буквы),
   кроме своих же  передаваемых props мы не увидим ничего, getFieldProps нету как в formik что бы получить всё необходимое*/
  
const renderInput = ({label,input, meta: { touched, error }, ...props}, ob) => {
/*Такой подход обрабатывает ошибки под каждым полем, но что если надо обрабатывать ошибки под формой? */
	let checkbox = (props.type === 'checkbox');
	let cl = (checkbox) ? c.checked : c.item;
	let checkErr = touched && error;

	return (
	<div className={c.boxInput}>{(checkbox) ? 'Сохранить пароль?' : ''}
		<p><label htmlFor={props.id || props.name}>{label}</label></p>
    <input className={checkErr ? `${cl} ${c.itemErr}` : cl} {...input} {...props} />
		{checkErr && <div className={c.error}>{error}</div>}         
  </div>
)}



let Login = (props) => 
(
  <form>
    <Field type='text' name='login' component={renderInput} placeholder='Login' autoFocus />
      ...
  </form>
)

field = {
  meta: {
    active: false,//при фокусе и вводе true, при потере фокуса false
    asyncValidating: false,
    autofilled: false,
    dirty: false,//если хоть раз был ввод будет true. Если поле отличается от заданного по ум. значения в initialValues
    dispatch: ƒ (action),
    error: undefined,//* есть ли ошибка
    form: "entrance",
    initial: undefined,
    invalid: true,//true если есть ошибки и валидация не проходит иначе false
    pristine: true,//true если поля формы совпадают с указанными по умолчанию значениями в initialValues иначе false
    submitFailed: false,
    submitting: false, //состояние кнопки.
    touched: false,//* "коснулся и покинул" будет true
    valid: true,
    visited: false,//пришёл на поле будет true
    warning: undefined,
  
  }
}
"------------------------------------------------------------------------------------"
"########------<{ Основные методы и свойства объекта propsOK и rfOb }>-------###########"
//некоторые методы делают то что можно сделать через reduxForm, просто это через props
{ //общие

  autofill(field, value)//автоматическое заполнение поля
  asyncValidating: bool//сработала ли асинхронная валидация.(если была установлена)
  blur('login', 123)//добавляет в поле если там ничего нет
  change('login', 123)//autofill,blur,change как-то одинаково работают
  destroy()//очистить состояние формы даже если компонент отключен
  reset()//сбрасывает форму полей до значений по умолчанию
  resetSection('')//сбрасывает секцию поля до значения по умолчанию
  submit('имя формы')/* провоцирует нажатие к кнопки. Может возникнуть ситуация когда кнопка за пределами формы, тогда можно в каком-нибудь месте
                        повесить на кнопку Клик и этим методом. Метод вызовет handleSubmit который и обрабатывает данные и вызывает наше событие в 
                        props onSubmit которое мы прокидывает или через reduxForm или из Container*/
  handleSubmit: ƒ (submitOrEvent)//должна быть передана в onSubmit формы. она будет запускать наш метод onSubmit который мы должны положить в props 
  /*
      <form onSubmit={handleSubmit((ev)=>{})}>//передали прямо в вызов
    	<form onSubmit={handleSubmit}>//в props подготовили onSubmit
    	<form onSubmit={(ev)=>{}}>//полностью под нашим контролем
  */
  initialize({login: props.num})/*метод получает и держит фиксированно значение. Форма не редактируется. Возможно имеет смысл подкидывать значения через 
                             onChange или передавать значения через mapStateToProps и ловить их в props.num, а num по клику менять*/
  //свойства для чтения
  anyTouched: true//если было какое-то касание любого поля
  array: Object//методы для полей
  error: {}// возможные ошибки
  initialized: bool//true если было установлено значение через initialize или initialValues
  initialValues: {login: 'qq'}//
  submitting: bool //true если поле в настоящее время отправляется
  submitFailed : bool //true если отправка формы не удалась по какой-либо причине
  pristine: bool//true если данные формы совпадают с initialValues
  valid: bool//true если нет ошибок иначе false
  invalid: bool//true если поля не проходят валидацию иначе false. Противоположность valid
  //rfOb
  values: {login: "был ввод"}
}

array = {
  insert: ƒ (field, index, value),//вставляет в поле
  move: ƒ (field, from, to),//перемещает значение в поле
  pop: ƒ (field),//извлекает из конца
  push: ƒ (field),//помещает в конец
  remove: ƒ (field, index),//удаляет по заданному индексу
  removeAll: ƒ (field),//удаляет все значения в поле
  shift: ƒ (field),//удаляет из начала
  splice: ƒ (field, index, removeNum, value),//вырезает откуда покуда и что вставить на это место
  swap: ƒ (field, indexA, indexB),//меняет значения местами
  unshift: ƒ (field)//вставляет в начало
}
"------------------------------------------------------------------------------------"
"########------<{ встроенные пропс для Field. (не все) }>-------###########"
/* Событие onChange на компоненте Field не воздействует на введённые значения.
   а ставить это событие непосредственно input который подключён через component={renderInput} это установить
   всем полям этот метод или писать для поля новый метод renderInput. Для воздействия есть метод normalize*/
normalize: {(...a) => a[0].toUpperCase()}//изменения попадают в хранилище
/*0: "FSAf" //настоящее значение
  1: "FSA" //прошлое значение. после потери фокуса приобретает настоящее значение
  2: {login: "FSAf"} //настоящее значение
  3: {login: "FSA"} //прошлое значение. после потери фокуса приобретает настоящее значение
  4: "login" //имя инпута*/
format: {(val, field)=> (val) && val.toUpperCase()}// похож на normalize. без блокировки значений
parse: {(val, field)=> val}// похож на normalize. 
component: ''//или передать метод для обработки ошибок или строку 'input' 'textarea' 'select'
validate: (val, obVal, rfOb, key) => {} //или [методы валидации] поля. Если ошибка в одном из методов, дальше проверка не идёт 
поддерживает_события
props: {aaa: 14}//передать значения в component={MyComponent}, можно просто и так: aaa={14}



"------------------------------------------------------------------------------------"

Action_Creators

/*из redux-form можно экспортировать нужные нам действия */
arrayInsert(form, field, index, value)
arrayMove(form, field, from, to)
arrayPop(form, field)
arrayPush(form, field, value)
arrayRemove(form, field, index)
arrayRemoveAll(form, field)
arrayShift(form, field)
arraySplice(form, field, index, removeNum, value)
arraySwap(form, field, indexA, indexB)
arrayUnshift(form, field, value)
autofill(form, field, value)
blur(form, field, value)
change(form, field, value)
clearAsyncError(form, field)//Очистить асинхронную ошибку
clearSubmitErrors(form)//Удаляет submitErrors и error
clearFields(form, keepTouched/*boolean*/, persistentSubmitErrors/*boolean*/, ...fields)
/*Очищает значения всех переданных полей. Будет сброшено на initialValue если оно есть для поля.
keepTouched если имеет true, значения полей, будут сохранены.
persistentSubmitErrors если имеет true, сохраняет ошибки полей.*/
destroy(...forms)//Уничтожает формы, удаляя все их состояния
focus(form, field)//Отмечает данное поле как активное и посещенное
initialize(form, data, [keepDirty/*bool*/], [options]);
options
  keepDirty:boolean
  keepSubmitSucceeded:boolean
  updateUnregisteredFields:boolean
  keepValues:boolean

/*
Устанавливает начальные значения в форме, с которыми будут сравниваться будущие значения данных для вычисления грязных и нетронутых. 
Параметр данных может содержать глубоко вложенный массив и значения объектов, которые соответствуют форме полей вашей формы.
Если параметр keepDirty имеет значение true, значения текущих «грязных» полей будут сохранены, чтобы избежать перезаписи пользовательских
изменений. (keepDirty может отображаться как третий аргумент или свойство параметров как 3-й или 4-й аргумент для обеспечения обратной 
совместимости).
Если параметр keepSubmitSucceeded имеет значение true, он не сбрасывает флаг submitSucceeded, если он установлен.
Если параметр updateUnregisteredFields имеет значение true, он будет обновлять все значения initialValue, если они все еще нетронутые,
а не только зарегистрированные поля. Настоятельно рекомендуется, по умолчанию -false из-за неразрывной обратной совместимости.
Если параметр keepValues ​​равен true, он сохранит старые значения и начальные значения.

*/
registerField(form, name, type)//Регистрирует поле в форме. Параметр типа может быть Field или FieldArray.
reset(form)//Сбрасывает значения в форме обратно к значениям, переданным с помощью самого последнего действия инициализации.
resetSection(form, ...sections)//Сбрасывает значения в разделах формы обратно к значениям, переданным с помощью самого последнего действия инициализации. 
setSubmitFailed(form, ...fields)//Отменяет флаг submitFailed в значение true, удаляет submitSucceeded и отправку, отмечает все переданные поля как затронутые, и, если было передано хотя бы одно поле, меняет значение anyTouched на true. 
setSubmitSucceeded(form)//Отменяет флаг submitSucceeded на значение true и удаляет submitFailed.
startAsyncValidation(form)//Отменяет флаг asyncValidating на значение true. 
startSubmit(form)//Отменяет флаг отправки на истинное значение.
stopSubmit(form, errorsOb)//Отменяет флаг отправки на false и заполняет submitError для каждого поля.
stopAsyncValidation(form, errorsOb)//Отменяет флаг asyncValidating на ложное и заполняет asyncError для каждого поля.
submit(form)//Запускает отправку указанной формы. 
touch(form, ...fields)//Отмечает все переданные поля как затронутые.
unregisterField(form, name)//Отменяет регистрацию поля в форме.
untouch(form, ...fields)//Сбрасывает отмеченный флаг для всех переданных полей.

