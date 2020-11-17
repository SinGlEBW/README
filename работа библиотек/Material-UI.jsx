/*eslint-disable*/
//Material-UI вроде как построен на основе Material- Design
//Не зависит от normalize.css
"##########-------<{ Шрифты и иконки }>-------##########"
/*
  Material-UI был разработан на основе шрифта Roboto. 
  Шрифты можно устанавливать через npm и импортировать, но нафиг надо js пачкать css'ом
*/
/*
  Компонент Typography служит для изменения компонента
*/

/*
  3 способа использовать иконки. Работа с иконками 
  npm install @material-ui/icons

*/
"---------------------------------------------------------------------------------"
"##########-------<{ Компоненты }>-------##########";
<CssBaseline />;//типа normalize.css установить можно в index.jsx
<ScopedCssBaseline></ScopedCssBaseline>;//локальный norma. обернуть Компонент. Достаётся из папки.
//в некоторых компонентах стили менять можно через props, как по мне лучше оставить это в css. в Typography можно много чего менять
<Typography variant='h1' color='error'/>;//универсальный компонент для которого заготованы профили в variant. Так же есть component
//его color: 'primary' 'secondary' 'textPrimary' 'textSecondary' 'error'

<Button />;
/* свойства кнопки + стилизация*/
variant="text, outlined, contained";//покрасить или текс, текс-контур, Залить кнопку
color="primary, secondary";//цвет  #3F51B5, #F50057

classes={MI_class};//принимает объект с ключами своих классов относящихся к Material-Ui см. ниже
"---------------------------------------------------------------------------------"
"##########-------<{ Изменение стиля }>-------##########";
/* Есть подвох при использовании стилей через css. 
  Работаем с Material-UI с одним компонентом, а он отрисовывает вложенные теги. 
Пример: <Button /> -будет иметь вложенность:
<button root >
  <span label> Хранит тут текст </span>
  <span TouchRipple-root> Здесь анимация по нажатию </span>
</button> 

  Применяя стили к root, стили label не изменяются нам придётся делать отдельные стили для label
  и делать так classes={{root: c.btn, label: c.label}}.А задумка что бы в root был указан color
  который будет распространятся на дочерний элемент. можно ставить !important  

*/


"---------------------------------------------------------------------------------"
"##########-------<{ HOC }>-------##########";
import { withStyles } from '@material-ui/core';
/* 
  Если нужно хотя бы 3 компонента стилизовать, то придётся 3 withStyles вызывать описывать 
  стили и использовать компоненты. Получиться в js бардак. Но если у меня компонент кнопки другова 
  размера, но стили чем то схожи, всё равно что обычный css подключим хоть от другой кнопки, хоть
  withStyles будем держать в отдельном файле для цепляния в разных местах, преимущества только в том
  что компоненту Material-UI имеющему свою вложенность можно передать каждому тегу свой класс.
*/
withStyles({
  root: {/* стили для MuiКомпонент-root*/},
  label: {/* стили для MuiКомпонент-root*/}
})(Компонент)


"---------------------------------------------------------------------------------"
"##########-------<{ Работа с классами Material-UI }>-------##########";

/*
  через проп classes={{key: myClass}} можем добавлять свои классы не только к root но и к вложенным элементам
  className={c.btn} - только для root добавим
*/
MI_class = {
// ключи    относиться к классу  --  К чему относится
  root,             // .MuiTypography-root	
  body2,            // .MuiTypography-body2	-- (variant="body2")
  body1,            // .MuiTypography-body1	-- (variant="body1")
  caption,          // .MuiTypography-caption	-- (variant="caption")
  button,           // .MuiTypography-button	-- (variant="button")
  h1,               // .MuiTypography-h1	-- (variant="h1")
  h2,               // .MuiTypography-h2	-- (variant="h2")
  h3,               // .MuiTypography-h3	-- (variant="h3")
  h4,               // .MuiTypography-h4	-- (variant="h4")
  h5,               // .MuiTypography-h5	-- (variant="h5")
  h6,               // .MuiTypography-h6	-- (variant="h6")
  subtitle1,        // .MuiTypography-subtitle1	-- (variant="subtitle1")
  subtitle2,        // .MuiTypography-subtitle2	-- (variant="subtitle2")
  overline,         // .MuiTypography-overline	-- (variant="overline")
  srOnly,           // .MuiTypography-srOnly	-- (variant="srOnly") Only accessible to screen readers.
  alignLeft,        // .MuiTypography-alignLeft	-- (align="left")
  alignCenter,      // .MuiTypography-alignCenter	-- (align="center")
  alignRight,       // .MuiTypography-alignRight	-- (align="right")
  alignJustify,     // .MuiTypography-alignJustify	-- (align="justify")
  noWrap,           // .MuiTypography-noWrap	-- (nowrap={true})
  gutterBottom,     // .MuiTypography-gutterBottom	-- (gutterBottom={true})
  paragraph,        // .MuiTypography-paragraph	-- (paragraph={true})
  colorInherit,     // .MuiTypography-colorInherit	-- (color="inherit")
  colorPrimary,     // .MuiTypography-colorPrimary	-- (color="primary")
  colorSecondary,   // .MuiTypography-colorSecondary	-- (color="secondary")
  colorTextPrimary, // .MuiTypography-colorTextPrimary	-- (color="textPrimary")
  colorTextSecondary,//.MuiTypography-colorTextSecondary	-- (color="textSecondary")
  colorError,       // .MuiTypography-colorError	-- (color="error")
  displayInline,    // .MuiTypography-displayInline	-- (display="inline")
  displayBlock,     // .MuiTypography-displayBlock	-- (display="block")
}

makeStyles({
	root: {
		background: 'red',
		colors: dark
	}
},{ name: 'Button' })