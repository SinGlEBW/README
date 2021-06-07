const { Sequelize, DataTypes, BelongsTo, Op, Model, QueryTypes } = require("sequelize");

/* Sequelize большой класс который вмещает в себя большое кол-во свойств и методов. 
   Передав подключение, создаём экземпляр на котором имеем методы обращения к базе. */


let sequelize = new Sequelize("database", "username", "password", {});

/*-------------------------------------------------------------------------------------------------
#######---------<{ Не обработанные запросы  }>---------#######*/
// Возвращает Promise
sequelize.query("", option); //SQL запрос. 
sequelize.query("", { type: QueryTypes.SELECT }); //SQL запрос. можно убрать metadata и получить чистый объект

sequelize.query("SELECT role AS 'baz.vaz.gaz' FROM users");
/*
  Что то было на php называлось Плейсхолдеры (защита от SQL инъекций). Данные экранируются перед отправкой, в option
  данные передаются в replacements
*/
sequelize.query("SELECT role, phone FROM users WHERE role = ? AND phone= ?"); //работаем с заменой
sequelize.query("SELECT role, login FROM users WHERE role = :admin AND login LIKE :log"); //для LIKE = не нужно
sequelize.query("SELECT role, phone FROM users WHERE phone = $tel AND role = $1"); //работаем с привязкой

option = {//для sequelize.query
  model: объект_модели, //можно передать модель вместо type: QueryTypes.SELECT
  raw: true,
  logging: console.log("Запрос пришёл"), //будет выполняться всякий раз перед тем как показать данные
  plain: true, //возвращает только первую запись
  nest: true, //вместо {baz.vaz.gaz: 'user'} будет {baz: {vaz: {gaz: 'user'}}}
  //параметры замены
  replacements: ["user", 89303467323], //значения передаются в ? в том порядке в котором установлены
  replacements: { admin: "admin", log: "%11" }, //подставит ключи. LIKE в SQL принимает свои какие-то REGEXP
  replacements: { admin: ["admin", "user"] }, // вариант для SQL метода IN(:admin)
  //параметры привязки. Рассчитано что мы включаем что-то одно. или замену или привязку
  bind: ["user", 89303467323], // $1 индекс, $2 индекс
  bind: { tel: "admin" }, // $tel,   Что-то там писалось про 2 $$ не понял, да и не понадобиться
};

let Объект_QueryTypes = {
  SELECT: "SELECT",
  INSERT: "INSERT",
  UPDATE: "UPDATE",
  BULKUPDATE: "BULKUPDATE",
  BULKDELETE: "BULKDELETE",
  DELETE: "DELETE",
  UPSERT: "UPSERT",
  VERSION: "VERSION",
  SHOWTABLES: "SHOWTABLES",
  SHOWINDEXES: "SHOWINDEXES",
  DESCRIBE: "DESCRIBE",
  RAW: "RAW",
  FOREIGNKEYS: "FOREIGNKEYS",
  SHOWCONSTRAINTS: "SHOWCONSTRAINTS",
};

/*-------------------------------------------------------------------------------------------------
#######---------<{ Ассоциации  }>---------#######

  Ассоциации нужны для связи моделей между собой при обращении в БД
  Поддержка ассоциаций:
  One-To-One (один к одному), (1 объект из одной таблицы ссылается на 1 объект другой таблицы)
  One-To-Many (один к многим), (1 объект из одной таблицы ссылается на много объектов другой таблицы)
  Many-To-Many(многие к многим) 

4 способа ассоциаций
  HasOne, BelongsTo, HasMany, BelongsToMany
*/
//обычные модели
let User = sequelize.define("User", {
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING }, {}
);

let Phone = sequelize.define("Phone", {
    model: DataTypes.STRING,
    serries: DataTypes.STRING }, {}
);

/*
  Условно. Ведущая модель(главная) - у которой вызываем методы hasOne..., ведомая - которую передаём.
  Всегда у ведущей модели при вызове ассоциации появляются дополнительные методы, а у ведомой нет.
  Поэтому если хотим общаться из обоих направлений то можно указывать парами. hasOne-belongsTo, hasMany-belongsTo
*/

User.hasOne(Phone, option);//Ведущая User создаёт в ведомой B UserId колонку. обращение:  data.getPhone()
User.belongsTo(Phone, option);//Ведущая User создаёт у себя колонку PhoneId. обращение. data.getUser()
                     //B.belongsTo(User, option) тогда колонка как и hasOne, но обращение уже от Phone
User.hasMany(Phone, option); //Ведущая User создаёт в ведомой B UserId колонку. обращение:  data.getPhone(), получить можем все ссылки, а не одну
User.belongsToMany(Phone, { through: "C", });//User принадлежит Phone данные будут записаны в С
/*
  Что должно способствовать выбору того или иного метода. 
  1. От какой модели я хочу обращаться к данным из другой модели - должна быть ведущей
  2. Какая модель должна содержать столбец содержащий ссылки на другую модель. Если 1 к 1 то без разницы, по удобству обращения.
  3. Если в одной таблице будет ссылаться много объектов на 1 элемент из другой таблицы,
      то выбор "Один.hasMany(Много)" 
  get... - Имя ведомой модели к данным которым обращаемся. 
  В ведущей модели, появляются методы через которые мы сможем обращаться ко 2й модели (таблице).
  В hasOne, belongsTo - (get..., set..., create...),
  в hasMany и belongsToMany  (+ has..., add..., remove..., count...) как с приставкой так и без s
*/

option = {
  //hasOne и hasMany
  as: 'Псевдоним',//название колонки, префикс id auto. Нужны если требуется 2 разные связи между одними и теми же моделями 
  constraints,
  foreignKey: "" || { type, name, allowNull }, //Можно задать полное имя или параметры внешнего ключа.(колонки)
  keyType,
  hooks,
  onDelete, //RESTRICT, CASCADE, NO ACTION, SET DEFAULT и SET NULL
  onUpdate, //RESTRICT, CASCADE, NO ACTION, SET DEFAULT и SET NULL
  /* onDelete может багануть и не удалять, проверить в БД Таблица ... -> Внешние ключи: возможно там кучу хлама */
  scope,
  sourceKey: 'имя колонки вместо id', //(для этого нужны уникальные значения)
  //belongsTo -sourceKey
  targetKey: 'имя колонки вместо id',//(для этого нужны уникальные значения)
  //belongsToMany +
  through, //создать 3ю таблицу куда запишутся данные A и B
  timestamps,
  uniqueKey,
  sourceKey: 'имя колонки вместо id',//смотреть на колонку в ведущей модели
  targetKey: 'имя колонки вместо id'//смотреть на колонку в ведомой модели
};

/*
  _____________User_________________              _____________Phone_________________
  | id  | login | password  | name |              | id  | model | series  | UserId  |
  ----------------------------------              ----------------------------------
  |  1  |'admin'| 123456789 |'Вася'| <--belongs  |  1  |'Nokia'|  3310   |    1    | 
  |  2  |'user1'| 987654321 |'Петя'|   --->has    Ошибка user1 может и не ссылаться, но можем добавить через create
  |  3  |'user2'| 123456789 |'Жора'|             |  2  |'Nokia'|  6300   |    3    | 
  |  4  |'user3'| 987654321 |'Гена'|             |  3  |'Nokia'|  5200   |    3    |
*/
//Ведущая User получает(из), передаёт(в), привязывает(свои в) данные в ведомой Phone создав в ней колонку UserId
User.hasOne(Phone);

User.findOne({ where: { id: 2 } }).then((data) => {
  data.getPhone(); //Promise.У этого нет телефона, Ошибка
  //data 2го id. добавим по связи в таблицу Phone данные. UserId: 2 само пропишет
  data.createPhone({ model:'Nokia', series: 7610 })
  data.setPhone(id)//Привязывает User id 2 к нужному id в таблице Phone 
});
/**----------------------------------------------------------------------------------------------- */
//Что бы мы могли наоборот по Phone найти User, тем более вероятней всего Phone ссылается на User
Phone.belongsTo(User);

Phone.findOne({ where: { id: 1 } }).then((data) => {
  data.getUser(); //Promise. {id: 1,login: 'admin',...}
});
/*
  но что hasOne, что belongsTo дают возможность через get set ... только с 1 элементом
  не смотря на то что на User = 'Жора' ссылается 2 телефона, поэтому
*/
/**----------------------------------------------------------------------------------------------- */

User.hasMany(Phone);
User.findOne({ where: { id: 2 } }).then((data) => {
  data.getPhones().then(console.dir); 
});

/*
  add...(), как и set может напрямую принять id места куда привязать. Множественное значение может принимать массив
  мест куда привязать.
  отличия set и add. Если в set передать один id, что означает "Привяжи User id того User от которого обращаешься к тому id который я передал",
  он отвяжет все связи с этим User и привяжет лишь к тем которые указаны. Add не отвязывает.
  add ...s и ass... разницы не заметил, оба принимают массив
*/
//бальной случай. Создать, Найти кого-то и через него добавить то что создал
User.hasMany(Phone);
Phone.create({model: 'Xiaomi', series: 7})
 .then(({id}) => {
   User.findOne({where: {id: 61}})
   .then(data1 => {
     d.addPhone(id || data1)//можно передать data
   })
 })
/*----------------------------------------------------------------------------------------------- */
//норма. Создать и указать кому создал
Phone.belongsTo(User)//там где буду создавать от туда и обращаться
Phone.create({model: 'Xiaomi', series: 9})
 .then(data => {
   data.setUser(4)
 })
/**----------------------------------------------------------------------------------------------- */
User.hasMany(Phone);

User.findOne({where: {id: 4}})
.then(data => {
/* User id: 8 требует привязать свои данные к таблице Phone по id: 167 -----------------*/
  data.addPhone_s(2)//можно передать data

/* User id: 8 требует создать новые данные в таблице Phone с автоматической привязкой--*/
  data.createPhone({model: 'Xiaomi', series: 8})//<< объект data

/* User id: 8 требует прекратить связь по id: [168, 178, 182] в Phone таблице ---------*/
  data.removePhone_s([4, 5, 6])//<< объект HasMany

/* User id: 8 имеет ли связь в таблице Phone по id: 180 --------------------------------*/
  data.hasPhone_s(4).then(console.dir)//<< bool

/* User id: 8 Ко скольким объектам привязан в таблице Phone ---------------------------*/
  data.countPhone().then(console.dir)

/* User id: 8 Получить возможные данные из таблицы Phone ссылающиеся на этот id ------*/
  data.getPhone().then(console.dir)

/*get принимает те же параметры что и findAll, findOne и подобные. При использовании hasMany через
  get мы получаем массив мы таким образом можем отфильтровать и получить нужные только нам ссылки
*/
  data.getPhone({where: {model: 'Nokia'}, raw: true}).then(console.dir)
})

"<{ Ассоциации. Не терпеливая или отложенная загрузка }>"
/*
  Все новые методы, в объекте data, ведущей модели относятся к ленивой загрузке т.к. мы ищем сначала, что-то 
  из ведущей модели, а потом обращаемся к ведомой и таким образом делаем 2 запроса

  Не терпеливая же загрузка с помощью include за 1 запрос приносит данные из нескольких таблиц если есть ссылки
*/
/*ВАЖНО. ЕСЛИ колонка модели была переименована через as в has или belongs, то include потребует этот псевдоним, а не модель или 
  передавать модель и псевдоним как опции.
  Так же include указываться только тогда когда есть связь и мы хотим достать из ведомой таблицы, а не наоборот
*/
include: Модель || {
  //Модель как в виде строки так и саму модель. 
  model: Модель,
  as: "передать_псевдоним_модели",//Если в has, belongs... передан псевдоним, его сюда передать
  association: '',//вроде как полная запись от as
  required: true//
}

/* Phone id: 3 получим данные по id и заберём данные из таблицы User по тому id на который ссылается UserId  */
Phone.belongsTo(User);//колонка ссылок в Phone. действуем от места ссылающегося на таблицу User
Phone.findOne({where: {id: 3}, include: User, raw: true})//как я понял
.then((data) => {
  console.dir(data);
})
Phone.findOne({ include: User });//найдёт id:1 и доставит данные по ссылке 
User.findOne({ include: Phone });//как я говорил. не сработает User не имеет PhoneId

"#####------<{ Параноик }>------#####";
/*
  Режим таблицы paranoid: true нужен для того что бы была возможность удалять не
  жёстким способом сразу и навсегда, а предварительно при вызове destroy() указывать
  записи метку времени удаления в колонке deletedAt. Доступ к записи в таком случае прекращается, 
  будет null, но сама запись остаётся в бд. Повторное обращение data.destroy() приводит к ошибке
  Если предварительно пред удалением поставить force: true запись будет удалена навсегда.
*/
User.findOne({where: {id: 1}})
.then(data => {
  data.destroy({force: true})//удалит навсегда 
})

User.restore({})//восстановить если была удалена не полностью

