
import Formik, { Field, useFormik } from 'formik';
/*
  Formik собственные методы в props. 
  onSubmit={(value, objectFormic) => {}} - исполнитель handleSubmit. Настройка события отправки
  validate={(value) => {}} - исполнитель handleChange. Настройка события изменения ввода
  validationSchema={(value) => {}} - исполнитель так же handleChange, но props работает с Yup валлидатором
  validateOnBlur={(value) => {}} - исполнитель handleBlur.Событие на потерю фокуса
*/
/*
  touched - при взаимодействии с полями формы отмечает у себя объект ключ=имя поля, value=bool
            относительно этого объекта удобно выводить ошибки. Объект errors заполниться, но выведем
            то поле с которым щас взаимодействовали, на не все ошибки

  getFieldProps('login') - возвращает объект атрибутов поля: name, onBlur, onChange, value
                           вместо указания 4х атрибутов можно указать так 
                           {...getFieldProps('login')}
  isSubmitting - true если без ошибок. При ошибках быстро переходит с true на false 
  isValid - является ли валидным
  dirty - есть ли где нибудь заполнение
  выключить кнопку пока не будут заполнены данные без ошибок
  {!formik.isValid || !formik.dirty}
  выключить так же после нажатия
  {!formik.isValid || !formik.dirty || formik.isSubmitting}
 */
<Formik onSubmit={(val, obFormik) => {}}>
//Здесь по сути мы в children Formik передаём компонент
{//Все props описанные в component Formik попадают в основной callback 
  (props) => (//Принимает свои props и свои несколько событий
    <form >
      <input type="email" name="email" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.email} />
			<p>{props.touched.email && props.errors.email}</p>
      <button type="submit" disabled={props.isSubmitting}>Submit</button>
    </form> 
  )
}

</Formik >;
"-----------------------------------------------------------------------"
"########---------<{ Варианты через HOOK }>---------#########"

const Component1 = (props) => {
  const hForm = useFormik({
    initialValues: { login: '', password: '', email: '' },
    validate: (value) => {
      const errors = {};
      if(!value.password) errors.password = 'Введите пароль'
      else
      if(value.password.length > 0 && value.password.length < 5)
        errors.password = 'Пароль слишком короткий'
      return errors
    },
    
    onSubmit: (value, objHelper) => {} //построить логику
  })
  
  return (
    <form onSubmit={hForm.handleSubmit}>
      <input type="text" name="login" onChange={hForm.handleChange} value={hForm.values.login} />
      <p>{hForm.touched.password && hForm.errors.password }</p>
      //куча повторяющихся элементов
      <input type="password" name="password" onChange={hForm.handleChange} value={hForm.values.password} />
      <p>{hForm.touched.password && hForm.errors.password }</p>
      <button type="submit" disabled={hForm.isSubmitting}>Submit</button>
    </form>
  )
}
//Подключение Yup валидатора и используем getFieldProps вместо кучи аргументов
const schema = Yup.object(
  {
    email: yup.string().email('Не верный email').required('Поле не должно быть пустым'),
    password: yup.string()
              .min(5, 'Придумайте пароль мин 5 символов')
              .max(15, 'Логин превышает 15 символов').required('Поле не должно быть пустым'),
  })


const Component2 = (props) => {
  const hForm = useFormik({
    initialValues: { login: '', password: '', email: '' },
    //метод validate приоритетней чем validationSchema для handleChange который срабатывает при вводе
    validationSchema: schema,
    onSubmit: (values, objHelper) => {
      
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
    <form onSubmit={hForm.handleSubmit}>
      <input type="email" {...hForm.getFieldProps('email')} />
      //вывод возможных ошибок колхозным способом
      <p>{hForm.touched.email && hForm.errors.email }</p>
      <input type="password" {...hForm.getFieldProps('password')} />
      <p>{hForm.touched.password && hForm.errors.password }</p>
      <button type="submit" disabled={hForm.isSubmitting}>Submit</button>
    </form>
  )
}

"-----------------------------------------------------------------------"
"########---------<{ Готовые компоненты }>---------#########"
let validationComponent = ({ isSubmitting }) => {

  return (
  <Form>//не надо указывать handleSubmit
    
    <Field as='textarea' name="textarea" />
    <ErrorMessage name="textarea" component="div" />
    <Field as="select" name="select">
      <option>Один</option>
    </Field>
    <Field type="password" name="password" />
    <ErrorMessage name="password" component="div" />
    <button type="submit" disabled={isSubmitting}>Submit</button>//получили
  </Form>
  )
};

<Formik initialValues={{ email: '', password: '' }} 
				validationSchema={schema}
				onSubmit={(value, objHelper) => {}}>//построить логику
  { validationComponent }//валидируемый компонент в компоненте Formik
</Formik>
validate={}

Field_параметры
  validate = (value)=> { }, //можно валидировать поле
  name = 'Имя поля', 
  render = (field,form,meta) => {},//пример ниже
  children = (field,form,meta) => {},//тоже самое
  component = 'div',//  или (field,form,meta) => {}
  type = 'text',//только_к_input;
  as = 'textarea', 'select', 'button'; //вместо_type. Так же принимает переменную стилизации  

  const MyStyledInput = styled(Input)({
    padding: '.5em',
    border: '1px solid #eee'
  })
  as={MyStyledInput}
 
ErrorMessage_параметры
  component: ;//принимает как имя тега HTML так и компонент можно засунуть cb


// Если требуется создать собственное поле,
const MyInput = ({label, ...props}) => {

	const [field, meta, set] = useField(props);//field тот же getFieldProps
	return (
		<>
			<p><label htmlFor={props.id || props.name}>{label}</label></p>
			<input className="text-input" {...field} {...props} />
			{meta.touched && meta.error && <div className="error">{meta.error}</div>}
		</>
	);
};
// родитель. Код сокращённый
<Formik>
  <Form>
    <MyInput name='login' label='Логин'/>
    <MyInput name='password' label='Пароль'/>
  </Form>
</Formik>
/*
  Такой подход удобен тем что не приходиться плодить. Если конечно все имеет type="text"
  <Field type='text' name="login" />
  <ErrorMessage name="login" component="div" />
*/

/*Самый короткий вариант*/
const MyInput1 = ({label, ...props}) => (
  <>
    <p><label htmlFor={props.id || props.name}>{label}</label></p>
    <Field {...props}/>//не требует getFieldProps. Всё включено
    <Field render={({field,form,meta}) => { 
      //можем взаимодействовать со значениями каждого поля. или использовать useField(props)
      //таким подходом type не передаётся почему-то
      //Можно конечно вот так. В компоненте A {0:{field, form, meta} type: 'text', name: 'ff' ... короче не шляпно }, 
      <Field render={(...a) => <A type="text" name="ff" placeholder='ff' {...a} />}/>

      return <input {...props}/>
    }} {...props}/>

    <ErrorMessage name={props.name} component='div'/> 
  </>
);

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

"-----------------------------------------------------------------------"
"########---------<{ HOC withFormik }>---------#########"

const MyForm = props => {
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.name} name="name"/>
      {errors.name && touched.name && <div id="feedback">{errors.name}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};
//или короче
const MyForm1 = props => {
  return (
    <Form className={c.form}>
      <MyInput1 className={c.item} type="text" name="login" placeholder='Login' autoFocus/>
      <MyInput1 className={c.item} type="password" name="pass" placeholder='Password'/>
    </Form>
  );
};

const MyEnhancedForm = withFormik({
  //не указав mapPropsToValues, объект values будет заполняться теми ключами в которых был ввод
  mapPropsToValues: () => ({ name: '' }),//тот же initialValues в Formik. Заполняет объект values
  mapPropsToTouched: () => ({ name: '' }),//будет заполнять объект touched bool значениями, если нам нужен 
  mapPropsToStatus: () => ({ name: '' }),//такая же тема со статусом, но объект почему-то не заполняет. Не понял как работает. Возможно с валидацией
  validate: (values) => {//тут же и асинхронную валидацию можно указывать
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    }
    return errors;
  },
  //тот же onSubmit в компоненте Formik. Реагирует на отправку формы
  handleSubmit: (values, FormikBag) => {
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
  displayName: 'myForm',
})(MyForm);


FormikBag = {
  props: {},//задумано для передачи пропсов в обёрнутый компонент. Не работает
  resetForm: ƒ (n,extState),
  setErrors: ƒ (errors),
  setFieldError: ƒ (field, value),
  setFieldTouched: ƒ (),
  setFieldValue: ƒ (),
  setFormikState: ƒ (s,tateOrCb),
  setStatus: ƒ (status),//поместить может что угодно. Перейдёт в объект status
  setSubmitting: ƒ (false),//bool передаст значение в isSubmitting
  setTouched: ƒ (),
  setValues: ƒ (),
  submitForm: ƒ (),
  validateField: ƒ (),
  validateForm: ƒ (),
}
"-----------------------------------------------------------------------"