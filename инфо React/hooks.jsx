const { useState } = require('react');

let [count, setCount] = useState(0);//принимает начальное значение, возвращает его и метод
setCount(count + 1); //метод должен вызываться по событию
setCount((count) => (count + 1)); //асинхронный вариант

useEffect(()=>{}) //тот же componentDidMouth  
let ref = useRef(null);//присвоив переменную ref компоненту, получим доступ к DOM элементу
