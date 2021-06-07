/* Чем-то смахивает на React */
class MyElem extends HTMLElement{
  constructor(){
    super();
    /*тут дом не построен */
  }
  render(){
    /*... */
  }
  connectedCallback(){ /*это основной метод. можно разбивать логику и закидывать сюда вызов. */
  /*  браузер вызывает этот метод при добавлении элемента в документ. когда дом построен
      (может вызываться много раз, если элемент многократно добавляется/удаляется) */
    this.getAttribute('myAttr1');//получим атрибуты
    this.setAttribute('myAttr1', 'val');//получим атрибуты
    
    this.render();
  }

  disconnectedCallback(){
  }

  static get observedAttributes(){
  /*  браузер рассчитывает что get свойство будет непосредственно классовый. 
      static тож самое что MyElem. методы без static уходят в prototype*/
    return ["myAttr1", "myAttr2"]//атрибуты для отслеживания
  }

  attributeChangedCallback(name, oldValue, newValue) {
  /*  вызывается при изменении одного из перечисленных выше атрибутов */
  }

  adoptedCallback() {
  /*  вызывается, когда элемент перемещается в новый документ
      (происходит в document.adoptNode, используется очень редко)*/
  }
  //есть ещё методы и свойства
}
//customElements - специальный объект в DOM, регистрирует свои элементы
customElements.define('my-el', MyElem);//имя лучше создавать с - что бы было понятно что пользовательский элемент