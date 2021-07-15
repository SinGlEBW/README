   
/*########----------<{ Слайдер Carousel }>---------##########

Carousel props:
  fade  - анимация перехода 
  slide={true} - false плавная анимация перехода будет выключена 

  controls={false} - стрелки,  indicators={false} - полоски
  variant="dark"  
  prevIcon & nextIcon = {el} можно заменить стрелки 
                    
  onSelect 
  onSlide - срабатывает при начале переходе
  onSlid - срабатывает когда переход закончен
  activeIndex={2}  

  interval={null} - прекратить движение, wrap={true} - тот же loop(движение по кругу),
  pause={'hover'} - при наведении
             
  bsPrefix={'carousel'} - можно изменить префикс классов css


Carousel.Item props:

  interval={1000}
  bsPrefix={'carousel-item'}
*/
<Carousel controls={false} interval={null} indicators={false}>
  {pageSlider.map((keyUrl, inx) => {
         
    return (
      <Carousel.Item >
        {components[keyUrl]}
      </Carousel.Item>
    );
  })}

</Carousel>