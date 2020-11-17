/*eslint-disable*/
/*
  Component - это функция которая принимает props и возвращает JSX
  HOC (High Order Component) - Функция(Component) высшего порядка. почему высшего? 
  Да потому что раньше отрабатывает. На деле это функция принимающая компонент
  (функцию или класс), возвращает новый компонент.
  Это такой ход в программировании. HOC это по сути декоратор только работа с компонентами.

  1.HOC не являются частью API React,
  2.HOC является чистой функцией без побочных эффектов.

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
  state = { comments: data.getComments() };
   
  componentDidMount = () => data.addChangeListener(this.handleChange);
  componentWillUnmount = () => data.removeChangeListener(this.handleChange);
  handleChange = () => this.setState({ comments: data.getComments() });
  render = () => (
    <div>
      {this.state.comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
)}


//Разница в том что они рендерят разные компоненты и вызывают разные методы
//HOC
function withSubscription(WrappedComponent, selectData) {
  
  return class extends React.Component {
    //если все эти действия повторяются то мы можем отдельно создать функцию 
    state = { data: selectData(data, this.props) };
    componentDidMount = () => data.addChangeListener(this.handleChange);
    componentWillUnmount = () => data.removeChangeListener(this.handleChange);

    handleChange = () => this.setState( {data: selectData(data, this.props)} );

    render = () => <WrappedComponent data={this.state.data} {...this.props} />;
}}
//получаем просто класс Который будем вызывать <CommentListWithSubscription/> Что бы React получил объект компонента
const CommentListWithSubscription = withSubscription(
  CommentList1,
  data.getComments
);


/*
  Как я понял есть несколько видов HOK. Пример 1: 
  обычный вызов, с передачей в него 
  withSubscription()
*/