/*eslint-disable*/
const { Sequelize, DataTypes, BelongsTo, Op} = require("sequelize");
const { Model } = require("sequelize");
/*
  Sequelize это класс, что странно он находится в классе Sequelize. Методы у них разные, но
  обращаться к подключению можно и так 
    const Sequelize = require("sequelize");
    const { Sequelize } = require("sequelize");//предпочтение
*/


//Подключение к бд + настройка
const sequelize = new Sequelize("имя базы", "логин", "пароль", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false, //что бы не создавались createdAt updateAt
    freezeTableName: true, //что бы в бд таблице не приписывалось "s"
  },
});

sequelize.authenticate(); //тестирование подключения  SELECT 1+1 AS result

/*-------------------------------------------------------------------------------------------------
#######---------<{ Определение модели }>---------#######*/
//1 способ. sequelize - объект подключения.
const User = sequelize.define(
  "имя модели", {//структура модели
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false },
    name:  DataTypes.STRING,
    family: DataTypes.STRING,
    fullName: {
      type: DataTypes.VIRTUAL,
      get(keyColumn){
        return `${this.firstName} ${this.lastName}`
      },
    },
    age:  DataTypes.INTEGER,
  },
  {
    tableName: "Employees", // имя таблицы в БД
   
  });
 
//2й способ Определяется класс. 
class User1 extends Model {
  /* По всей видимости тут могут описываются собственные методы для дальнейшего
     обращения к ним через класс User1. У методов должен быть префикс static */
}

User1.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
},{
  sequelize, // Передать экземпляр подключения
  modelName: "User1",
});

/*----------------------------------------------------------------------------------------------------*/

//Модели раскидывают по файлам, оборачивают в callback который вызывается в папке моделей в index
module.exports = async (sequelize, DataTypes) =>{

  class Price extends Model { }
  //даже если так получить модель, User1 будет undefined при использовании в файлах из-за параллельного выполнения кода
  let { User } = await sequelize.models;//попытка связать 2 таблицы
  
  Price.init({
    UserId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: User,
        key: 'id',
      }
    },
    firstName: {
      type: DataTypes.STRING,
      get(keyColumn){
        const rawValue = this.getDataValue(keyColumn);//вст.метод. получает значение из колонки
        return rawValue ? rawValue.toUpperCase() : null;
      },
      
      set(keyColumn){
        const rawValue = this.setDataValue('column', keyColumn);//вст.метод. получает значение из колонки
        return rawValue ? rawValue.toUpperCase() : null;
      }},
    lastName: DataTypes.STRING,
    fullName: {
      type: DataTypes.VIRTUAL,
      get(){
        return `${this.firstName} ${this.lastName}`
      },
      references: {},
      validate: {},
    }
  },{
    sequelize, // Передать экземпляр подключения
    modelName: "Price",
  });

  return Price
}
  

 User.destroy({force}) 

/*-------------------------------------------------------------------------------------------------
#######---------<{ Структура модели }>---------#######*/

Имя_колонки: { //по ум. Имя_колонки: тип.данных, 
  type: тип_данных;
  autoIncrement: bool;
  primaryKey: bool; //будет ли основным ключём id
  allowNull: bool; //по ум. true. разрешить null или нет
  defaultValue: "" //значение по умолчанию. если не передали в колонку значение
  unique: bool //будет ли значение уникальным
  validate: {len: [4, 6]}//прежде чем положить в бд проходит валидация. Методы ниже
  values: //
  key: //
  dialectTypes: //
  comment: //
  field: //
  onDelete://
  onUpdate: //
  references: { //При условии что я имею на руках модель на которую ссылаюсь, но почему то нет методов обращения,
                //ни у ведомой ни у ведущей модели. has и belongs смотреть sequelize2.js
    // deferrable: 'какие-то ограничения',
    // key: 'id',
    // model: User1
  }
  //так же методы
  stringify()
  toSql()
  //get не забывать возвращать результат иначе будет видеть undefined
  get(nameColumn)//вызывается автоматически после получении данных из бд. 
  set(nameColumn)//вызывается автоматически перед отправкой данных в бд. 
  toString()
  warn()

  Объект_validate =  {
    //Любое свойство может принять объект {arg: значение, msg: ошибка,...} некоторые свойства имеют больше параметров 
    is: /^[a-z]+$/i,          // соответствует этому RegExp. вариант массива ["^[a-z]+$",'i']
    not: /^[a-z]+$/i,         // не соответствует этому RegExp. тоже самое ["^[a-z]+$",'i']
    isEmail: true,            // проверка email
    isUrl: true,              // проверка URL
    isIP: true,               // проверяет формат IPv4 (129.89.23.1) или IPv6 
    isIPv4: true,             // отдельная проверка IPv4 (129.89.23.1)
    isIPv6: true,             // отдельная проверка IPv6 
    isAlpha: true,            // разрешает только буквы
    isAlphanumeric: true,     // разрешает только буквы и числа
    isNumeric: true,          // разрешает только числа
    isInt: true,              // только целые числа
    isFloat: true,            // только числа с плавающей точкой
    isDecimal: true,          // десятичные числа
    isLowercase: true,        // разрешает нижний регистр букв
    isUppercase: true,        // разрешает верхний регистр букв
    notNull: true,            // null нельзя
    isNull: true,             // можно только null
    notEmpty: true,           // пустым строкам нельзя
    equals: 'моё значение',   // только определённое значение
    contains: 'foo',          // разрешаются какие-то определённые подстроки
    notContains: 'bar',       // не разрешаются определённые подстроки
    notIn: [['foo', 'bar']],  // значение не должно совпадать с одним из них. Передача более 1 аргумента обязательно массив в массиве
    isIn: [['foo', 'bar']],   // значение должно совпадать с одним из них. Передача более 1 аргумента обязательно массив в массиве
    len: [2,10],              // длинна от и до
    isUUID: 4,                // разрешить только uuid v4
    isDate: true,             // разрешить только строки даты
    isAfter: "2011-11-05",    // разрешить строки даты только после определённой строки (или любой или даты хз)
    isBefore: "2011-11-05",   // разрешить строки даты только до определённой строки даты
    max: 23,                  // разрешаем только значения <= 23
    min: 23,                  // разрешаем только значения >= 23
    isCreditCard: true,       // разрешаем только действующие номера кредитных карт

    /*-------------------------------------------------------------------*/
    //Пример: встроенный валидатор пропустит null
    allowNull: true,
    validate: {
      len: [5, 10]//примет строку от 5 до 10 и null тоже примет
    },
    /*-------------------------------------------------------------------*/
    //Пользовательские валидаторы
    //По всей видимости любой метод созданный в объекте validate получит параметр
    isEven(value) {
      if (parseInt(value) % 2 !== 0) {
        throw new Error('Only even values are allowed!');
      }},
    isGreaterThanOtherField(value) {
      if (parseInt(value) <= parseInt(this.otherField)) {
        throw new Error('Bar must be greater than otherField.');
      }}}

}

/*-------------------------------------------------------------------------------------------------
#######---------<{ Возможные типы данных }>---------#######*/

DataTypes.
  VIRTUAL/*даёт возможность создать колонку которая не будет числиться в БД
            При взаимодействии с get() можно склеивать значения после получения данных
            заполняя эту колонку. Преимущество: нет лишних колонок в бд, этим занимается не бд.*/
  SMALLINT, INTEGER, BIGINT, FLOAT, DOUBLE, REAL, DECIMAL /* числовые_типы. Использовать как сво-ва, так и методы 
                                                   INTEGER(11).UNSIGNED  */

  STRING, CHAR, TEXT  //STRING - VARCHAR(255),  STRING(1234) - VARCHAR(1234)
  ENUM('value 1', 'value 2')  // Допустимые значения 'value 1' и 'value 2'
  ARRAY(Sequelize.TEXT)       // Определяет массив для PostgreSQL базы.

  UUIDV4
  UUIDV1
  UUID
  TINYINT
  TIME
  RANGE
  NUMBER
  NOW
  MEDIUMINT
  MACADDR
  JSONTYPE
  JSONB
  INET
  HSTORE
  GEOMETRY
  GEOGRAPHY
  DATEONLY
  DATE
  CITEXT
  CIDR
  BOOLEAN
  BLOB

/*-------------------------------------------------------------------------------------------------
#######---------<{ 2й объект метода init. Общая настройка таблицы }>---------#######*/

  charset: 
  collate: 
  comment: 
  createdAt: 
  defaultScope: 
  deletedAt: ''//переименовать столбец удаляющий записи через paranoid  
  engine: 
  freezeTableName: 
  hasTrigger: 
  hooks: 
  indexes: 
  initialAutoIncrement: 
  name: 
  omitNull: 
  paranoid: bool //При удалении ставит метку времени в deletedAt, элемент виден в бд, но доступа к нему не будет. не работает если timestamps: false
  schema: 
  scopes: 
  tableName: 'имя таблицы' //Если не указано, то имя таблицы буден названо именем модели 
  timestamps: bool //Обязательно ли устанавливать поля createdAt updatedAt
  underscored: 
  updatedAt: 
  version: //...
  getterMethods: //чёт не понял, вроде их исключат
  setterMethods: //чёт не понял, вроде их исключат
  /*
    В этом блоке тоже есть объект validate, но его методы не принимают вроде как значения,
    они лишь могут ожидать что данные колонки на основе указанных в них валидаторов выдадут 
    ошибку
  */
  validate: {
    bothCoordsOrNone: () =>{
      if ((this.firstName === null) !== (this.lastName === null)) {
        throw new Error('Either both latitude and longitude, or neither!');
      }}}


/*-------------------------------------------------------------------------------------------------
#######---------<{ Методы Моделей }>---------#######

    При обращении через общий класс sequelize можно синхронизировать все таблицы ,
    Если синхронизировать в моделе где не объявлены некоторые столбцы, но используются за пределами
    модели методы которые эти столбцы создают (hasOne belongsTo ... и подобные), то синхронизация пройдёт
    по модели без учёта этих методов тем самым столбцы будут стёрты
*/

 User.
  sync({}); //синхронизация с таблицей. имеет значение где использовать
  { force: true }// создает таблицу, по новой удаляя старую
  { alter: true }// если есть отличия модели и таблицы, внесёт изменения.
  drop()//удалить таблицу
  create({}, options1)//создать запись в бд.
  bulkCreate([{},{}], options1)//создаёт одним запросом n кол-во данных. по ум. не будет смотреть на validate.
   let options1 = {
      validate: true, //смотреть на validate в моделе
      fields: ['login'], //какие поля от пользователя принять. Остальные будут отброшены
    }

  let jane = User.build({ name: "Jan", age: 100 });// просто создать без сохранения в бд. 
  jane.save();//сохранение через переменную (это экземпляр. создаётся без new)

  findByPk(2)// получает объект по первичному ключу
  findOne({ where: {} })//находит одну запись.where работает как логический оператор И (AND) 
  findAll({ attributes: ['name', 'age'], raw: true})// вывод по аттрибутам
  findAndCountAll()//сочетание findAll и count
  findOrCreate({ where: {}, defaults: {login: 'Боря'}})//создаст запись если не найдёт в таблице
  update({}, {where: { name: "Bob"}})//обновить. что поменять, где искать
  destroy({})//удалить запись<<кол-во удалённых записей. можно на объекте data на найденном элементе просто вызвать
  restore(option)//восстанавливает запись если удалена не полностью. Режим paranoid
  reload()//передать свойствам экземпляра значения из бд
 
    // ПРИМЕР с учётом того что нужно получать данные через Promise
    const jane1 =  User.create({ name: "Jane" });
    jane1.name = "Jane II";
    jane1.favoriteColor = "blue";
    jane1.save({ fields: ['name'] });//подтвердили изменения только в name 
    console.log(jane.favoriteColor); // "blue" что присвоили, то и есть
    jane1.reload();
    console.log(jane1.name); // "Jane II"
    console.log(jane1.favoriteColor); // "green" что в базе
   
// Op - объект для расширенного взаимодействия с запросами к таблицам
  count({where: {id: {[Op.gt]: 25 }}})//подсчёт чего либо. Принимает те же условия
  max('age', { where: { age: { [Op.lt]: 20 } } }) - max('age')//максимальное число
  min('age', { where: { age: { [Op.lt]: 20 } } }) - min('age')//максимальное число
  sum('age', { where: { age: { [Op.lt]: 20 } } }) 
  increment('age', { by: 2 })// добавить значение
  decrement()//убавить

/*-------------------------------------------------------------------------------------------------
#######---------<{ Продвинутый поиск используя объект Op с where }>---------#######*/

  /* 
   {[Op.and]: [{login: 'SinGlE'}, {age: 28}]}
   {[Op.or]: [{login: 'SinGlE'}, {age: 28}]} //здесь работает ИЛИ

   where: {
       login: {[Op.eq]: 'SinGlE'},   // = 'SinGlE'     
       age: {[Op.ne]: 20,  [Op.is]: null}} // != 20,  IS NULL

  
   {[Op.gt]: 6}                              // > 6
   {[Op.gte]: 6}                             // >= 6
   {[Op.lt]: 10}                             // < 10
   {[Op.lte]: 10}                            // <= 10
   {[Op.between]: [6, 10]}                   // между 6 AND 10
   {[Op.notBetween]: [11, 15]}               // не между 11 AND 15

  Раздел док Model Querying - Basics
*/ 

/*-------------------------------------------------------------------------------------------------
#######---------<{ Свойства методов модели }>---------#######*/
//findOne
    attributes: ['кол1', ['old name', 'new name'], 'кол3']// получение по атрибуту. массив в массиве, переименовывает колонку  
    benchmark: //
    bind: //
    fieldMap: //
    group: ['column']// синтаксис как у order кроме пос. арг. служит для группировки чего-то там
    having: //
    include: Model||{}//получает данные из другой таблицы при условии если есть связь таблиц. см sequelize2.js 
    indexHints: //
    instance: //
    lock://
    logging: () => {}// функция которая будет отрабатывать перед тем как отобразить данные 
    limit: 10 //получить только 10 строк. Обычно вместе с offset
    mapToModel: //
    nest: bool//работает с библиотекой dottie. "foo.bar.baz": 1 приводит в {"foo": {"bar": {"baz": 1}}
    plain: bool// вернуть 1й объект
    paranoid: false//Если таблица в режиме paranoid то эта опция показывает псевда удалённые записи
    offset: 8 // пропустить 8 строк
    order: ['column', 'DESC']// упорядочит столбец. ASC, DESC, NULLS FIRST. так же 1й пар может быть sequelize.fn(). Варианты в Doc
    raw: bool// преобразовать в нормальный объект, но лишает некоторого функционала get set
    replacements: //замена против SQL инъекций { admin: 'admin', log: '%11' } "WHERE role = :admin"
    type: //Принимает Объект_QueryTypes что бы избавиться от meta данных
    useMaster: //
    where: {}//тот же SQL WHERE

    defaults://у findOrCreate. Значение по дефолту если не найдёт

    force:bool//у destroy. Принудительное удаление если таблица paranoid

    benchmark, hooks, individualHooks, limit, logging, transaction, where// restore()



    
    "<{ Объект дата }>"
    /* К данным можно обращаться по ключам так же преобразовать через raw: true или */
    toJSON()//отображает просто объект с данными
    dataValues// свойство отобразит тот же toJSON()
  

/*-------------------------------------------------------------------------------------------------
#######---------<{ Методы и свойства экземпляра подключения sequelize  }>---------#######*/

sequelize.
  query("UPDATE users SET y = 42 WHERE x = 12");//Подробнее в sequelize2.js
  model('')//получить модель
  models//объект моделей


/*-------------------------------------------------------------------------------------------------
#######---------<{ Обработка ошибок Sequelize  }>---------#######*/

SequelizeUniqueConstraintError// unique ограничение. Одинаковое имя вызовет данную ошибку
ValidationError// валидация не прошла
/*
  При проверке валидации через sequelize данные не будет уходить в бд, так же
  allowNull: false пропустит все валидаторы т.к относиться сразу и к ограничению и к валидации



  При ограничениях запрос в бд уходит и бд выдаёт ошибку. 
    Пример unique: true ограничение. Данные запоминает БД поэтому модель лишь
    устанавливает это ограничение в бд. Запрос уходит, бд смотрит на данные и отвечает.
  */

