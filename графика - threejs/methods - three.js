
/*
  В начале комментария указываю имена объектов в сокращённом виде в консоли. Возможно это и не нужно запоминать, потому что
  это генерирует min версия в консоль. 
*/

/*#######---------<{ Ключевые объекты настройки 3d пространства }>--------########*/
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });//ng - подключение холста куда отрисовывать графику

  renderer.setClearColor("#111111")

/*-------------------------------------------------------------------------------*/
let scene = new THREE.Scene();//ob - 3д пространство


/*-------------------------------------------------------------------------------*/
let light = new THREE.AmbientLight(""); //mf - цвет света, [2й параметр хз]


/*-------------------------------------------------------------------------------*/
let camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 0.1, 5000) ; //ba - угол обзора, пропорция отношения ширины на высоту, видим: не ближе, не дальше
  camera.position.set(0, 30, 500); //смещение камеры вправо, вверх и расстояние до объекта



/*-------------------------------------------------------------------------------*/
/*#######---------<{ Методы построения фигур фигур }>--------########*/
let geometry3d = new THREE.SphereGeometry( 100, 15, 15 ); //ie - радиус, грани по вертикали и горизонтали, вращение, сворачивание граней, 2 последних непонятных эффекта

  geometry3d.faces //

    faces : {
      color: { setRGB() }
    }
        

/*-------------------------------------------------------------------------------*/
let material = new THREE.MeshBasicMaterial({ color: "teal", wireframe: false, vertexColors: true }); //Oa - цвет материала и включить грани.


/*-------------------------------------------------------------------------------*/
let mesh = new THREE.Mesh( geometry3d, material );//S

  scene.add(mesh);




/* Пример: */
  let rotation = 0;
    //Шаг 1. задали цвет каждому полигону
  for (let i = 0; i < geometry3d.faces.length; i++) {
    geometry3d.faces[i].color.setRGB(Math.random(), Math.random(), Math.random()); //цвет геометрии зависит от цвета матерьяла
  }


/*-------------------------------------------------------------------------------*/
/*#####------<{ библиотека DAT-GUI }>-----####
  DAT-GUI -  библиотека для управления 3д объектом через интерфейс

*/
let ball = {
    rotateX: 0.1,
    rotateY: 0.1,
    rotateZ: 0.1,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
}


let gui = new dat.GUI();

for(key in ball){
   gui.add(ball, key).min(-2).max(2).step(0.1);
}




/*------------------------------------------------- */

window.animation = (function (callback) { //крос платформеный вариант обращения к requestAnimationFrame 
    return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame || 
           window.oRequestAnimationFrame || 
           window.msRequestAnimationFrame || 
          function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();


function draw() {
    mesh.rotation.x += ball.rotateX / 200;
    mesh.rotation.y += ball.rotateY / 200;
    mesh.rotation.z += ball.rotateZ / 200;
    mesh.position.x += ball.positionX;
    mesh.position.y += ball.positionY;
    mesh.position.z += ball.positionZ;
    
    renderer.render(scene, camera);
    animation(draw);
}
//Дерево прототипа db / E,K,N / Ea / Object
draw();

