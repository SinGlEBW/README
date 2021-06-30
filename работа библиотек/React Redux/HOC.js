/*eslint-disable*/
/*
  Component - это функция которая принимает props и возвращает JSX
  HOC (High Order Component) - Функция(Component) высшего порядка. почему высшего? 
  Да потому что раньше отрабатывает. На деле это функция принимающая компонент
  (функцию или класс), возвращает новый компонент.
  Это такой ход в программировании. HOC это по сути декоратор только работа с компонентами.

  ** Важная идея заключается в том что бы вынести дублирование кода в отдельную компоненту.

  Когда видим кучу повторяющихся компонентов, следует создать HOC взяв за основу 
  общий шаблон и занести в эту функцию HOC которая будет принимать компонент и отдельные для него props.
  
  1. HOC не являются частью API React,
  2. HOC является чистой функцией без побочных эффектов.
  3. Не использовать создание HOC В render
  4. Создавать лучше именованный HOC. (Создать в функции функцию с именем и вернуть имя, а не безымянную функцию)
  5. Нет смысла передавать в шаблоне HOC key, ref


  HOC обычно возвращает Component, props или просто функцию или класс. 

  
  Предположим есть кнопка отдельным компонентом. Мы расплодили её в 10 местах.
  Возникла необходимость добавить ей функциональности.

1.способ.
  Можем всю функциональность повесить на эту кнопку и в 10 местах будет лишний груз
  функциональности, но использовать мы будем эту функциональность только в пару местах.
2.способ.
  Написать функцию HOC с доп функционалом обернуть только те кнопки которым необходим функционал.

*/
//стандартный способ заполнения компонента
class Lesson extends React.Component {
  render() {
    return (
      <Router>
        //строка может содержать намного больше одинаковых параметров
        <Link to="/home" className="active">Home</Link>
        <Link to="/portfolio" className="active">Portfolio</Link>
        <Link to="/contacts" className="active">Contacts</Link>
      </Router>
)}}

//HOC чтоб не повторяться
const AppLink = ({children, ...props}) => <Link {...props} className="active">{children}</Link>

class Lesson1 extends React.Component {
  render() {
    return (
      <Router>
        <AppLink to="/home">Home</AppLink>
        <AppLink to="/portfolio">Portfolio</AppLink>
        <AppLink to="/contacts">Contacts</AppLink>
      </Router>
)}}






/*
  пример посложней.
  HOC предварительная проверка на основе переданных данных
*/
//Ну или класс вернуть
function LoadingHOC1 (loadingProp) {
  return function (Component) {
    return function (props) {
      return <Component {...props}/>
}}}
/*
  можно и из глобального пространства взять. Но стараются не зависеть от глобальной памяти,
  а то функция не работа способна в других местах без её указания.
*/
function LoadingHOC2 (loadingProp) {
  return function (props) {
    return <Component {...props}/>
}}
//ES6
const LoadingHOC = (loadingProp) => (Component) => 
  (props) => (loadingProp) ? <Component {...props}/> : <div></div>
     


class AppComponent extends React.Component {
  render = () => <div>{this.props.data.title}</div>
}

let MyComponent = LoadingHOC('что-то есть')(AppComponent)//отрабатывает сначала HOC а уж потом и 

class Lesson2 extends React.Component {
  render = () => <MyComponent {...this.props}/> 
}


/*--------------------------------------------------------------------------*/

class CommentList extends React.Component {
   // "DataSource" -- произвольный глобальный источник данных
  state = { comments: DataSource.getComments() };
   
  componentDidMount = () => DataSource.addChangeListener(this.handleChange);
  componentWillUnmount = () => DataSource.removeChangeListener(this.handleChange);
  handleChange = () => this.setState({ comments: DataSource.getComments() });
  render = () => (
    <div>
      {this.state.comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
)}


class BlogPost extends React.Component {
  state = { blogPost: DataSource.getBlogPost(props.id) };

  componentDidMount = () => DataSource.addChangeListener(this.handleChange);
  componentWillUnmount = () => DataSource.removeChangeListener(this.handleChange);
  handleChange = () => this.setState({ comments: DataSource.getComments() });

  render = () => <TextBlock text={this.state.blogPost} />;
}
 


//Разница в том что они рендерят разные компоненты и вызывают разные методы (getComments, getBlogPost)
//HOC
function withSubscription(WrappedComponent, selectData) {
  
  return class extends React.Component {
    /*
    т.к. мы не знаем какие данные хотим присвоить в "data" вызывая HOC под разными компонентами,
    просто решим принимать callback и в него передавать предполагаемые данные которые возможно
    понадобятся, а передавая callback в HOC мы решим воспользоваться ими или нет */
    state = { data: selectData(DataSource, this.props) };
    componentDidMount = () => data.addChangeListener(this.handleChange);
    componentWillUnmount = () => data.removeChangeListener(this.handleChange);
    handleChange = () => this.setState( {data: selectData(data, this.props)} );
//  не забыть передать {...this.props}  т.к. там передаётся ещё children который несёт jsx или функцию компонента
    render = () => <WrappedComponent data={this.state.data} {...this.props} />;
}}
//получаем просто класс Который будем вызывать <CommentListWithSubscription/> Что бы React получил объект компонента
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()//
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);


/*
  Как я понял есть несколько видов HOK. Пример 1: 
  обычный вызов, с передачей в него 
  withSubscription()
*/


/*#######------<{ Пример на деле }>--------######### */
class HeaderContainer extends Component {
  render() {
    console.dir(this);
    return (
      <>
        <AutoHeader isDarkTheme={this.props.isDarkTheme}  />
        <TitlePages isDarkTheme={this.props.isDarkTheme}  />
      </>
    );
  }
}

const withDarkMode = (Component) => {
  /* 1. HOC зависит от переданной в обязательном порядке данного метода toggleDarkModeAC
     2. В HeaderContainer props получим  toggleDarkMode,  toggleDarkModeAC*/
  return class DarkMode extends Component {
    toggleDarkMode = () => {
      let checkMode = this.props.isDarkTheme;
      this.props.toggleDarkModeAC(!checkMode);
    }
    render = () => {
    //Как бы взять всё кроме toggleDarkModeAC?
      return <Component {...this.props} toggleDarkMode={this.toggleDarkMode}/>
    }
  }
}

const mapStateToProps = ({ darkMode }) => ({ isDarkTheme: darkMode.isDarkTheme })

let Com = withDarkMode(HeaderContainer);

export default connect(mapStateToProps, {
  toggleDarkModeAC
})(Com);

/* 1й вопрос не решить, 2й просто action называть так же как и метод, но отслеживать будет посложней */