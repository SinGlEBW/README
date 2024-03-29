/*eslint-disable*/
//Domain Driven Design
TDD  //Test Driven Development - сначала пишем тесты, а потом остальной код.
BDD  //что-то знакомое, вроде как, тоже тесты, но особенные.
TDD  //Type Driven Development снова? Так, стоп, тут речь уже не о тестах совсем. Но почему называется так же?

DDD  // bound contexts, ubiquitous language, domain...
FDD  //да сколько можно?
MDD  //cерьезно, на основе диаграмм?
PDD  // ...
BLL  /* Business Logic Layer технология предназначена для разделения обязанностей в коде. BLL отвечает за контроль над
       данными которые в процессе взаимодействия с сайтом должны изменяться только тогда, когда данные приходят с сервера.*/
UI   /* User Interface это непосредственно то, что видит пользователь(то есть сайт или "Представление").
       UI разрабатывают таким образом, что бы изменения на сайте происходили только тогда, когда BLL изменится.*/
DAL  // Data Access Layer Этот уровень обычно содержит все модели данных, хранящихся в БД, а также классы, через которые идет взаимодействие с БД.

/*
TDD Test Driven Development - считается одной из форм правильного метода построения приложения. 
    Можно почувствовать, что работа идёт медленнее, чем обычно. 
    Так происходит потому что работаем вне «зоны комфорта», и это вполне нормально. 
    Тем не менее, исследования показали, что разработка, основанная на тестировании, 
    может привести к снижению ошибок на 40-80% в производстве.
    Также TDD часто упрощает программную реализацию: исключается избыточность кол-ва
    реализаций — если компонент проходит тест, то он считается готовым.
    Разработчики могут не бояться вносить изменения в код, если что-то пойдёт не так,
    то об этом сообщат результаты автоматического тестирования.
    Книга по этому поводу
    Кент Бек "Экстремальное программирование. Разработка через тестирование.
*/

/*
TDD Type Driven Development - Разработка по типу — это еще один правильный метод построения приложения.
    Как и в случае разработки на основе тестирования, разработка на основе типов может повысить 
    вашу уверенность в коде и сэкономить ваше время при внесении изменений в большую кодовую базу.
    Из минусов только возрастающая сложность у языков с динамической типизацией. К примеру, 
    для JavaScript этот подход тяжелее применить, чем для TypeScript.
*/
/*
BDD Behaviour Driven Development - предполагает описание тестировщиком или аналитиком пользовательских 
    сценариев на естественном языке — если можно так выразиться, на языке бизнеса.

    это разработка, основанная на описании поведения. Определенный человек(или люди) пишет описания 
    вида "я как пользователь хочу когда нажали кнопку пуск тогда показывалось меню как на картинке" 
    (там есть специально выделенные ключевые слова). Программисты давно написали специальные тулы,
    которые подобные описания переводят в тесты (иногда совсем прозрачно для программиста). 
    А дальше классическая разработка с тестами.
    Интересная затея если давать людям заполнять свои требования к разработке использовав ключевые слова

    Имея (прим. given — данное) какой-то контекст,
    Когда (прим. when) происходит событие,
    Тогда (прим. then) проверить результат.

    +Сценарий 1: На счету есть деньги+
    "Имея" счет с деньгами
    "И" валидную карточку
    "И" банкомат с наличными
    "Когда" клиент запрашивает наличные
    "Тогда" убедиться, что со счета было списание
    "И" убедиться, что наличные выданы
    "И" убедиться, что карточка возвращена
*/