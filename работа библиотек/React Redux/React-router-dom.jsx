import {BrowserRouter, Route, Switch, NavLink, withRouter} from 'react-router-dom';
/*

  
*/
<BrowserRouter>
 
    {/*Route смотрит на GET запрос который меняет NavLink. Route должен обёрнут в BrowserRouter обязательно.*/}
    <Route exact path='/' render={(props) =>  <Home {...props}/>}/>
     {/* Route загрузит компонент products в том случае если в get строке будет данный path. Route - это слушатель*/}
    <Route path='/catalog' render={(props) => <Products  {...props} />}/>
    {/* Предположим у нас есть 2 обработчика слушающих путь  '/phones' и '/phones/honer', 
        в таком случае если обратиться по пути '/phones/honer', то отработает 2 компоненты т.к. '/phones' так же подходит под описание
        и получается что 2 компонента будут друг под другом. */}
    <Route path='/phones' render={(props) => <Phones  {...props} />}/>
    <Route path='/phones/honer' render={(props) => <Honer  {...props} />}/>
    {/* Но если был бы указан exact то Route отобразил бы '/phones' только если бы было бы точное указание get пути 
        '/phones' или '/phones/'
   */}
    <Route exact path='/phones' render={(props) => <Phones  {...props} />}/>
    <Route path='/phones/honer' render={(props) => <Honer  {...props} />}/>


</BrowserRouter>;

/* 
   Если нам не нужно отображать несколько компонентов в зависимости нашего get запроса, то придётся везде указывать exact,
   что бы этого не делать есть компонент Switch который делает тоже самое. 
   Как работает Switch?
   Switch реагирует на изменение get запроса, и отдаёт точное совпадение get запроса и path Route и прекращает цикл.
   
   При запросе '/phones/honer':
*/
<BrowserRouter>
  <Switch>
    <Route path='/phones' render={(props) => <Phones  {...props} />}/>   {/* проверил, не подходит */}
    <Route path='/phones/honer' render={(props) => <Honer  {...props} />}/> {/*подходит и прекращает цикл */}
    <Route path='/phones/huawei' render={(props) => <Honer  {...props} />}/>
    {/* ... */}
 </Switch>
</BrowserRouter>;

/* Есть и нюансы: При запросе /phones/honer */
<BrowserRouter>
  <Switch>
    {/* отрендерит Home и цикл прекращает т.к.  /phones/honer начинается с /, что бы это предотвратить придётся воспользоваться  exact  */}
    <Route path='/' render={(props) => <Home  {...props} />}/>
    <Route path='/phones' render={(props) => <Phones  {...props} />}/>      {/* не отрендерит */}
    <Route path='/phones/honer' render={(props) => <Honer  {...props} />}/> {/* не отрендерит */}
 
    {/* Так же если  get запрос не удовлетворит всем Route, то отработает path="*" на который можно повесить 404*/}
    <Route path='*' render={(props) => <div>404</div> }/>
 </Switch>
</BrowserRouter>;



/* Что бы в ручную не забивать get запрос можно использовать <a></a>, но браузер будет перезагружаться,
  для этого существует компонент NavLink который провоцирует запись в GET строку */
<NavLink to="catalog">Все товары</NavLink>;
<NavLink to="catalog/phone">Телефоны</NavLink>;


let HeaderContainerWR = withRouter(HeaderContainer);//HOC withRouter нужен тогда когда нет нужды оборачивать в Router и указывать путь