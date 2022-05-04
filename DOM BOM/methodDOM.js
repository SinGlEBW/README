"#####------<{ Структура DOM }> ---------#####"
div, button, и_т.п.
  HTMLDivElement, HTMLButtonElement, и_т.п.
                                HTMLElement|"<-->"|HTMLDocument
                                    Element|"<-->"|Document|"<-->"|  Window
                                            Node      |"<-->"|    WindowProperties
                                          EventTarget     
                                            Object               
  
"#####---------<{ Свойства и методы объекта document }>--------#######"

//информация.только чтение
document.characterSet,inputEncoding//показывает кодировку страницы
document.contentType//возвращает MIME-тип заголовка. "text/html"
document.doctype//возвращает <!DOCTYPE html>
document.styleSheets//возвращает массив объектов подключённых стилей
document.activeElement//возвращает текущий сфокусированный элемент 
document.lastModified//получить дату последнего изменения документа
document.plugins//получить массив плагинов. хз что за плагины и как они туда должны попасть

//получение элементов
document.title//заголовок документа
document.head//head документа
document.body//тело документа
document.documentElement//возвращает 1й элемент документа. объект html
document.forms//получить массив форм
document.images//получить массив изображений
document.links//получить массив ссылок
document.scripts//получить массив js подключений скриптов

//rest информация
document.cookie//Возвращает куки.
document.domain//Возвращает домен.
document.location//Возвращает объект. host,hostname,pathname и т.д.
document.URL//строка текущего URL.
document.referrer//Возвращает URI страницы, связанной с этой страницей.

//вид. можно задавать или читать
document.alinkColor//Возвращает или задает цвет активных ссылок в теле документа.
document.bgColor//цвет фона документа.
document.vlinkColor//цвет посещённых ссылок.

//состояние
document.readyState/*состояние загрузки документа: "loading"-ещё грузит, "interactive" - DOM построен ресурсы грузит, "complete" - всё загружено*/

//управление
document.designMode//получить/установить редактирование документа

//всё что создаётся висит в воздухе, это нужно добавлять
document.createElement('div')//создаёт объект элемента, и возвращает его
document.createTextNode('some text')//создаёт объект текста, и возвращает
document.createAttribute(имя)//создаёт атрибуты. фигня
document.createComment(comment)//узел комментария
document.importNode(el, true)/*создаёт копию элемента. true - дочерние элементы тоже копировать. У элемент есть
                              cloneNode() */

document.elementFromPoint(300, 18)//возвращает элемент попадающий по данным координатам
document.hasFocus()//<bool если любой элемент в документе в фокусе 
   
document.open();//открывает страницу браузера. Можно конкретно указать. browser-sync так же наверно открывает
document.write("<p>Hello world!</p>");
document.write("<p>I am a fish</p>");
document.write("<p>The number is 42</p>");
document.close();

//работа со 2м документом.
svg.contentDocument.querySelectorAll('path')//подключиться к другому документу и что-то получить
document.adoptNode(el)/*прежде чем засунуть что либо в документ из другова документа, 
                        нужно зарегистрировать и регистрированный прогонять через append */

//события
document.onreadystatechange = function(){}//отрабатывает в момент загрузки страницы readyState


//#####===== Специфичные методы =====######
document.createNodeIterator()//создать итератор
document.createTreeWalker();//непонятный 
document.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');//не ясно. написано элемент создаёт какой-то
document.createRange()//создаёт какой-то объект createRange. хранящий информацию о выделении текста
/*Создание собственного Event */
var event = document.createEvent('Event');//создать
  event.initEvent('build', true, true);//инициализировать
  el.dispatchEvent(event);
  el.addEventListener('build', function (e) {}, false);//использовать



"#####---------<{ Свойства и методы объекта Element }>--------#######"
/******{ Передвижение по дереву }>------->*/

//Получить. только чтение
el.previousSibling //предыдущий элемент
el.nextSibling  //следующий элемент
el.firstChild, firstElementChild  //первый дочерний элемент
el.lastChild, lastElementChild  //последний дочерний элемент
el.childNodes  //массив дочерних элементов с их текстовой nodes. [div, text, a, text, ...] 
el.children  //массив дочерних элементов без текстовой nodes. [div, a, ...] 
el.parentElement  //родительский элемент
el.parentNode   //родительский элемент, но с текстовым вложением если есть
el.nodeValue  //если есть текс вернёт его
el.childElementCount //возвращает кол-во дочерних элементов.

//внести изменение
el.textContent  //положить текст
el.innerHTML
// манипуляция со стилями
el.style.cssText = "display: block; position: absolute"; /*можно занести строку свойств */
el.style.display = "block;"; /* или менять одно свойство */
Object.assign(el.style, {fontsize:"12px",left:"200px",top:"100px"});//один из способов добавлять как свои так и перезаписывать
//манипуляция с классами
el.classList.contains('класс')//проверяет есть ли класс у данного элемента 
el.classList.add('класс')//добавляет класс элементу 
el.classList.remove('класс')//удаляет класс у данного элемента 
el.classList.toggle('класс')//добавляет если есть или удаляет класс у данного элемента 
el.classList.replace('старый класс', 'новый класс')//заменяет класс у данного элемента 

//ПРОВЕРИТЬ
el.matches(selector);//<bool. если el === указанному селектору то true. el. true 0.15, false 0.56
                     // el === e.target0.12, тот же эффект что и matches
el.closest(selector);//ищет по цепочке вверх элемент с данным селектором
el.hasAttributes()//<bool. есть ли у элемента какие-либо атрибуты.
el.hasChildNodes()//<bool. есть ли у элемента дочерние узлы или нет.


el.cloneNode(true)//<el. клонирует элемент. true - дочерние элементы так же скопировать. 
elParent.removeChild(child);//удаляет дочерний элемент
elParent.replaceChild(newEl, oldChild)//<oldChild. Заменяет один элемент на другой. Возвращает старый элемент

//ВСТАВИТЬ
elParent.insertBefore(newEl, childEl)//<bool.вставляет в родителе новый элемент перед указанным дочерним элементов
el.appendChild()//вставить после элемента
el.append();//добавляет текст в элемент. Тоже самое el.textContent. Строка html экранируется
"beforebegin - перед элементом"
"afterbegin - внутрь элемента, в начало" 

"beforeend - внутрь элемента, в конец";
"afterend -  после элемента"

el.insertAdjacentElement(InsertPosition,  Element);
el.insertAdjacentHTML(InsertPosition, htmlString);
el.insertAdjacentText(InsertPosition, textString);


el.getClientRects(); //DOMRectList 
el.getBoundingClientRect(); //DOMRect здесь указаны подробно координаты объекта и его размер

b = new DOMRect(100,100,100,100);
/*------------------------------------------------------------------------------------------*/
"#####------<{ Обработка ошибок }>------########"
new DOMException(message, name)// вызывает сразу же ошибку. 
new Error('Ошибка')//так же вызывает сразу ошибку
new DOMError (message, name)//вернёт объект ошибки