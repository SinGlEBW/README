
import Formik, { Field, useFormik } from 'formik';
import { bool } from 'prop-types';
import { FieldArray, Form } from 'redux-form';

/* 
  Formik имеет несколько объектов. 
    obFormik - основной объект, 
    actionsFormik - объект с методами при отправке,
    arrayHelpers - объект для работы с динамическими полями через FieldArray

    Мелкие вспомогающие объекты. 
      FieldHelpers, FieldProps, FieldMeta



    Использование HOC withFormik как по мне не очень т.к. в основных props становиться бардак, всё в перемешку с прокинутыми ранее props. 

*/


<Formik 
  initialValues={{login: '', password: ''}}
  onSubmit={(val, actionsFormik) => {
    actionsFormik.setSubmitting(false); //изменим состояние кнопки на которой привязан isSubmitting
  }}//2й параметр с методами для управления формой после нажатия. 
  validate={(value) => {}}>
    { forma }
</Formik >;

const forma = ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => {//obFormik
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
      <p>{touched.email && errors.email}</p> /* Обработать ошибку */
      <button type="submit" disabled={isSubmitting}>Submit</button>
    </form> 
  ) 
}


/*
  1. Formik вызывает у себя дочерний элемент через props.children(props) поэтому нужно передавать ему обычную
     функцию а не компонент. 

  2. Требуется накинуть на форму некоторые методы и свойства что бы formik мог собрать нужную информацию
     и в зависимости от её состояния приводить форму к тем или иным состояниям. ЕСТЬ КОРОТКАЯ ЗАПИСЬ, ОБ ЭТОМ НИЖЕ.
  
  3. Можем передать в компонент Formik свои слушатели 
  <Formik 
    initialValues={{login: '', password: ''}} - Обязательный пропс. начальное значение полей.
    onSubmit={(value, actionsFormik) => {}} - Функция которая отработает если были переданы данные в слушатель handleSubmit.
    validate={(value) => {}} - исполнитель handleChange. Настройка события изменения ввода
    validationSchema={ schema } - исполнитель так же handleChange, но props работает с Yup валлидатором
*/

/*Важные объекты и свойства основного obFormik: */

  touched: {} // собирает у себя имена полей (поле=true) на которых побывал. Фиксирует это если с поля перешли на другое поле. 
  errors: {} // собирает поля с ошибками в случае если предусмотрена валидация и поля не соответствуют ей.
  isSubmitting: true // если без ошибок значит предпринимается отправка формы. При ошибках быстро переходит с true на false 
  isValid: bool // является ли форма валидной
  dirty: bool // есть ли где-нибудь заполнение

      Пример:
        {!formik.isValid || !formik.dirty};  //-  выключить кнопку пока не будут заполнены данные без ошибок
        {!formik.isValid || !formik.dirty || formik.isSubmitting};  //-  выключить так же после нажатия

Методы:
  getFieldProps('login');// возвращает объект обвесов для атрибутов поля                
      { //вместо указания 4х атрибутов можно указать так <input type="email"  {...getFieldProps('login')} />
        name: "login"
        onBlur: ƒ ()
        onChange: ƒ ()
        value: "jared"
      }

  getFieldHelpers('login');// возвращает объект методов   
      {
        setError:  setError(value) //Не использовать!! Удалят со временем, лучше найти в props setStatus - это налог.
        setTouched:  setTouched(value, shouldValidate)//хз. Можно сказать что поля коснулись
        setValue:  setValue(value, shouldValidate)    
      }               
 
  getFieldMeta('login');//Можно получить конкретную информацию по полю
      {
        error: "Пустое поле"
        initialError: undefined
        initialTouched: false
        initialValue: ""
        touched: true
        value: ""
      }





/*----------------------------------------------------------------------------------------------
"########---------<{ Варианты через HOOK }>---------#########"

    Вместо компонента <Formik>. Недостаток:
** Компоненты <Field>, <FastField>, <ErrorMessage>, connect()и <FieldArray> не будет работать с
    useFormik().
*/

const Component1 = (props) => {// Эти props чистые. С HOC withFormik такого не будет. Хорошо это или плохо время покажет.
  
  const obFormik = useFormik({
    initialValues: { login: '', password: '', email: '' },
    validate: validator,//метод validate приоритетней чем validationSchema для handleChange который срабатывает при вводе
    onSubmit: (value, actionsFormik) => {} //построить логику
  })
  
  return (
    // Это принцип работы. Ниже показана чуть покороче запись.
    <form onSubmit={obFormik.handleSubmit}>
      <input type="text" name="login" onChange={obFormik.handleChange} value={obFormik.values.login} />
      <p>{obFormik.touched.password && obFormik.errors.password }</p>
      <input type="password" name="password" onChange={obFormik.handleChange} value={obFormik.values.password} />
      <p>{obFormik.touched.password && obFormik.errors.password }</p>
      <button type="submit" disabled={obFormik.isSubmitting}>Submit</button>
    </form>
  )
}
//колхозный валидатор.
let validator = (value) => {
  const errors = {};
  if(!value.password) errors.password = 'Введите пароль'
  else
  if(value.password.length > 0 && value.password.length < 5)
    errors.password = 'Пароль слишком короткий'
  return errors
}



/*
  Валидация через Yup и немного сокращённый код.
*/
const Component2 = (props) => {
  const obFormik = useFormik({
    initialValues: { login: '', password: '', email: '' },
    validationSchema: schema,
    onSubmit: (values, actionsFormik) => {
      
      let data = Object.entries(values).reduce((pValue, arrKeyVal) => (
        {//обрезаю пробелы
          ...pValue,
          [arrKeyVal[0]]: arrKeyVal[1].trim()
        }), {})
    }
  })
  /*
    имя присваивается то которое указал в getFieldProps, если оно не будет соответствовать
    имени в объекте initialValues, то передаваемое свойство value будет undefined 
  */
  return (
    <form onSubmit={obFormik.handleSubmit}>
      <input type="email" {...obFormik.getFieldProps('email')} />
      <p>{obFormik.touched.email && obFormik.errors.email }</p> //вывод возможных ошибок колхозным способом
      <input type="password" {...obFormik.getFieldProps('password')} />
      <p>{obFormik.touched.password && obFormik.errors.password }</p>
      <button type="submit" disabled={obFormik.isSubmitting}>Submit</button>
    </form>
  )
}

const schema = Yup.object(
  {
    email: yup.string().email('Не верный email').required('Поле не должно быть пустым'),
    password: yup.string()
              .min(5, 'Придумайте пароль мин 5 символов')
              .max(15, 'Логин превышает 15 символов').required('Поле не должно быть пустым'),
  })




// Ещё ступень сокращённого кода. Можно создать собственное поле,
const MyInput = ({label, ...props}) => {

	const [fieldProps, fieldMeta, fieldHelpers] = useField(props);//getFieldProps() getFieldMeta() getFieldHelpers()
	return (
		<>
			<p><label htmlFor={props.id || props.name}>{label}</label></p>
			<input className="text-input" {...fieldProps} {...props} />
			{fieldMeta.touched && fieldMeta.error && <div className="error">{fieldMeta.error}</div>}
		</>
	);
};

<Formik
  initialValues={{login: '', password: '', email: '' }}
  validationSchema={schema}>
    {({handleSubmit})=>{//obFormik
      return (
        <form onSubmit={handleSubmit}>
          <MyInput name='login' label='Логин'/>
          <MyInput name='password' label='Пароль'/>
      </form>
      )
    }}
</Formik>

/*----------------------------------------------------------------------------------------------
"########---------<{ Готовые компоненты }>---------#########"

    Есть готовые компоненты из которых можно сделать самый короткий вариант.
    Убираем вообще лишние обвесы. 
*/

let validationComponent = ({ isSubmitting }) => {//obFormik

  return (
  <Form>
    <Field as='textarea' name="textarea" />
    <ErrorMessage name="textarea" component="div" />
    <Field as="select" name="select">
      <option>Один</option>
    </Field>
    <Field type="password" name="password" />
    <ErrorMessage name="password">{(msg) => (<div>{msg}</div>)}</ErrorMessage>    {/* 2й вариант обработать ошибку */}
    <button type="submit" disabled={isSubmitting}>Submit</button>//получили
  </Form>
  )
};

<Formik initialValues={{ email: '', password: '' }} 
				validationSchema={schema}
				onSubmit={(value, actionFormic) => {}}>
  { validationComponent }
</Formik>



//Поля имеют некоторые атрибуты. Можно даже отдельно поле валидировать, но не встречал необходимости т.к. есть Yup
Field_атрибуты
  validate = (value)=> { }, //можно валидировать поле
  name = 'Имя поля', 
  render = (field,form,meta) => {},//пример ниже
  children = (field,form,meta) => {},//тоже самое
  component = 'div',//  или (field,form,meta) => {}
  type = 'text',//только_к_input;
  as = 'textarea'| 'select'| 'button' | {MyStyledInput}; //вместо_type. Так же принимает переменную стилизации  

  const MyStyledInput = styled(Input)({
    padding: '.5em',
    border: '1px solid #eee'
  })
 
ErrorMessage_атрибуты
  component = 'div';//или (field,form,meta) => {}


/* Сделал полную запись что бы видно было разницу с использованием HOC witobFormikic */
export const Registration = (props) => (
   /*  Без HOC witobFormikic наши props имеют только то что было передано из предыдущего компонента, например пару наших методов
      stepBelow: (e, numInp) => {…}  и  sendRegister() */
      
  
  <div className={c.wrap}>
    <h1>Friend List</h1>
    <Formik initialValues={{ email: '', password: '' }} 
        validationSchema={schema}
        onSubmit={(value, actionFormic) => {}}
        render={ forma }/>{/* Немного сократим код передав так, избавляемся от закрывающего тега </Formik>. */}
  </div>
);

const forma = ({isSubmitting, ...props}) => { //obFormik

  return (
    <Form>
      <MyInput1 name='login' label='Логин'/>
      <button type="submit" disabled={isSubmitting}>Submit</button>
    </Form>
  ) 
}


/*САМЫЙ КОРОТКИЙ ВАРИАНТ*/
const MyInput1 = ({label, ...props}) => (
  <>
    <p><label htmlFor={props.id || props.name}>{label}</label></p>
    <Field {...props}/>
    <div className='errorBox'>{/* резервное место под ошибку */}
      <ErrorMessage name={props.name} component='div'/> 
    </div>
  </>
);





/*----------------------------------------------------------------------------------------------*/
//В итоге: ЭТО
const MyForm = (props) => {//obFormik
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.name} name="name"/>
      {errors.name && touched.name && <div id="feedback">{errors.name}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};
//Против ЭТОГО
const MyForm1 = (props) => {
  return (
    <Form className={c.form}>
      <MyInput1 className={c.item} type="text" name="login" placeholder='Login' autoFocus/>
      <MyInput1 className={c.item} type="password" name="pass" placeholder='Password'/>
    </Form>
  );
};



/*
  Если использовать Yup и возвращать ошибки через setLocale в виде объекта а не строки,
  то придётся ловить в ручную через meta. let [field, meta] = useField(props).
  ErrorMessage надеяться что в meta.errors стока и тогда придётся в ручную делать вывод ошибки.
  Лучше подготовить правильную строку на основе параметров cb метода min и подобных ему                                                                                       
*/
yup.setLocale({
	number: {
    min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
  }
})



/*----------------------------------------------------------------------------------------------*/


actionsFormik = {
  resetForm: ƒ (n,extState),
  setErrors: ƒ (errors),
  setFieldError: ƒ (field, value),
  setFieldTouched: ƒ (),
  setFieldValue: ƒ (),
  setFormikState: ƒ (s,tateOrCb),
  setStatus: ƒ (status),//поместить может что угодно. Перейдёт в объект status для удобства.
  setSubmitting: ƒ (false),//bool передаст значение в isSubmitting
  setTouched: ƒ (),
  setValues: ƒ (),
  submitForm: ƒ (),
  validateField: ƒ (),
  validateForm: ƒ (),
};



/*----------------------------------------------------------------------------------------------
"########---------<{ HOC withFormik }>---------#########"

  Запись через HOC withFormik немного измениться наполнив наш основной компонент своим объектом.
*/





const MyEnhancedForm = withFormik({
  //не указав mapPropsToValues, объект values будет заполняться теми ключами в которых был ввод
  mapPropsToValues: (props) => ({ name: '' }),/* тот же initialValues в Formik. Кстате тут props видим из предыдущего компонента, то есть 
                                                перед тем как произойдёт слияние с obFormik*/
  mapPropsToTouched: () => ({ name: '' }),//будет заполнять объект touched bool значениями, если нам нужен 
  mapPropsToStatus: () => ({ name: '' }),//такая же тема со статусом, но объект почему-то не заполняет. Не понял как работает. Возможно с валидацией
  validate: (values) => {//тут же и асинхронную валидацию можно указывать
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    }
    return errors;
  },
  //тот же <Formik onSubmit={(values, actionFormic)=>{}}>  Реагирует на отправку формы
  handleSubmit: (values, actionFormic) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  enableReinitialize: false,//должен ли Formik сбрасывать форму при изменении свойств обернутого компонента. короч хз
  isInitialValid:  (prop) => {},//||bool Что-то про изначальный контроль свойств
  mapPropsToErrors,//не рекомендуется
  validateOnBlur: bool,//по ум. true.проверки blur событий. handleBlur, setFieldTouched, setTouched 
  validateOnChange: bool,//по ум. true. проверки change событий. handleChange, setFieldValue, setValues
  validateOnMount: bool,
  validationSchema,//Schema | ((props: Props) => Schema) Указывать YUP схему
  displayName: 'myForm', //форма должна иметь имя.
})(MyForm);





/*--------------------------------------------------------------------------------------------*/
/*#######--------<{ Продвинутые темы }>---------######### */
<FieldArray/>; // обёрнутые поля в этот компонент получают функционал для динамического создания, удаления полей.

const evSubmit = (values, actionsFormik) => { }

<Formik
  initialValues={{ friends: ['jared', 'ian', 'brent'] }}
  onSubmit={ evSubmit }
  render={ forma }/>

  /*
    FieldArray даёт методы манипулирования массивом полей.
    1. Для начала отрисуем поля из state.
    2. Добавим кнопки Добавить и Удалить поле.(добавление удаление в конец массива)
  */

const forma = ({values, handleSubmit, ...props}) => {
  let renderFields = () => values.friends.map((valField, inx) => <Field key={inx} name={`friends[${inx}]`}/>)

  return (
    <Form className={c.wrap}>
      {renderFields()}{/* 1. Отрисуем имеющиеся поля */}
      <FieldArray name="friends" render={ managementFields } />{/*говорю о том что будет какое-то кол-во полей */}
      <button onSubmit={handleSubmit}>Отправить</button>
    </Form>
  )
}
  
const managementFields = (arrayHelpers) => {
  let lastItemArr = arrayHelpers.form.values.friends.length
  return (
    <>
      <button onClick={()=>arrayHelpers.push('')}>Добавить поле</button>
      <button onClick={()=>arrayHelpers.remove(lastItemArr - 1)}>Удалить последнее поле</button>
    </>
  )
}

/*
      ________________
     |__ jared ______|
      ________________
     |__ ian ________|
      ________________
     |__ brent ______|
      ________________
     | Добавить поле |
      ________________
     | Удалить поле  |
 
*/
/*
  В оф.док. замудрённый немного пример, но смысл его: 

      ________________  ____ ____
     |__ jared ______| |_+_||_-_|
      ________________  ____ ____
     |__ ian ________| |_+_||_-_|
      ________________  ____ ____
     |__ brent ______| |_+_||_-_|
      
*/
/*
  Мой 2й пример: 

      ________________  ____
     |__ jared ______| |_-_|
      ________________  ____
     |__ ian ________| |_-_|
      ________________  ____
     |__ brent ______| |_-_|
      ________________
     | Добавить поле |
      
*/

export const Registration = () => (
  <div className={c.wrap}>
    <h1>Friend List</h1>
    <Formik
      initialValues={{ friends: ['jared', 'ian', 'brent'] }}
      onSubmit={values => {}}
      render={ forma }/>
  </div>
);

const forma = ({values, handleSubmit, ...props}) => {
  return (
    <Form className={c.wrap}>
      <FieldArray name="friends" render={managementFields} />
      <button onSubmit={handleSubmit}>Отправить</button>
    </Form>
  )
}

const managementFields = ({form, ...arrayHelpers}) => {

  let renderFields = () => form.values.friends.map((valField, inx) => (
      <div key={inx}>
        <Field name={`friends[${inx}]`}/>
        <button onClick={()=>arrayHelpers.remove(inx)}>&nbsp;-&nbsp;</button>
        {/*
          Надобавлять кнопок с разными индексами и в случае нажатия на одну из них будет расширяться массив в
          добавляя данные в нужный индекс смещая тем самым оставшиеся данные.
        */}
        {/* <button onClick={()=>arrayHelpers.insert(inx, 'dd')}>&nbsp;хз&nbsp;</button> */}
      </div>
  ))

  return (
    <>
      {renderFields()}{/* 1. Отрисуем имеющиеся поля уже с управлением */}
      <button onClick={()=>arrayHelpers.push('')}>Добавить поле</button>
      <button onClick={()=>arrayHelpers.swap(0, 1)}>поменять местами поле 1-2 </button>
      <button onClick={()=>arrayHelpers.insert(1, 'dd')}>&nbsp;хз&nbsp;</button>
      <button onClick={()=>arrayHelpers.replace(0, 'wwww')}>заменить на wwww </button>
    </>
  )
}


//С использованием HOC

export const Registration = ({values, handleSubmit, ...props}) => (

  <div className={c.wrap}>
    <h1>Friend List</h1>
     <Form className={c.wrap}>
        <FieldArray name="friends" render={managementFields} />
        <button onSubmit={handleSubmit}>Отправить</button>
      </Form>
  </div>
);
  
let managementFields = ({form, ...arrayHelpers}) => {
  
  let renderFields = () => form.values.friends.map((valField, inx) => (
      <div key={inx}>
        <Field name={`friends[${inx}]`}/>
        <button onClick={()=>arrayHelpers.remove(inx)}>&nbsp;-&nbsp;</button>
        <span>{inx}</span>
      </div>
  ))

  return (
    <>
      {renderFields()}{/* 1. Отрисуем имеющиеся поля */}
      <button onClick={()=>arrayHelpers.push('dd')}>Добавить поле</button>
      <button onClick={()=>arrayHelpers.insert(1, 'fffff')}>&nbsp;хз&nbsp;</button>
      <button onClick={()=>arrayHelpers.swap(0, 1)}>поменять местами поле 1-2 </button>
      <button onClick={()=>arrayHelpers.move(2, 3)}>Переместить 3-2 </button>
      <button onClick={()=>arrayHelpers.replace(0, 'wwww')}>заменить на wwww </button>
    </>
  )
}

export default withFormik({
  mapPropsToValues: () => ({ friends: ['jared', 'ian', 'brent'] }),
  handleSubmit: (values, actionsFormik) => { console.dir(values);},
})(Registration);






arrayHelpers = {
  form: {values: {}, errors: {}, touched: {}, status: undefined, isSubmitting: false, },
  handleInsert: ƒ (index, value),
  handleMove: ƒ (from, to),
  handlePop: ƒ (),
  handlePush: ƒ (value),
  handleRemove: ƒ (index),
  handleReplace: ƒ (index, value),
  handleSwap: ƒ (indexA, indexB),
  handleUnshift: ƒ (value),
 
  name: "fields",
  pop: ƒ (),//удаляет по 1-2 элемента. Лучше использовать remove.
  push: ƒ (value),//добавление данных в конец массива
  insert: ƒ (index, value),/*добавляет значение на указанную позицию в inx, тем самым сдвигает оставшиеся элементы.
                             ['a', 'б', ...[data] ,'с']*/ 
  replace: ƒ (index, value),//заменить данные в о индексу
  remove: ƒ (inx),//удаляет элемент. Использовать вместо pop.
 
  swap: ƒ (indexA, indexB),//поменять местами 2 элемента в массиве
  move: ƒ (from, to),// переместить элемент с одно места в другое от чего элементы в массиве меняют своё положение
  unshift: ƒ (value)//добавить элемент в начало массива 
}






/*#######--------<{ Идеи для валидации }>---------######### */

const validator = (values) => {
  let errors = {};

  Object.keys(values).map((key) => {
    if(values[key] === '') {
      errors[key] = 'Заполните поле'
    }
    else
    if(values[key].length > 0 && values[key].length < 5){
      errors[key] = `${key} слишком короткий`
    }  
  })
 
  return errors
}
