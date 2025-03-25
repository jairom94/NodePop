class Model {
    constructor(){
        if(new.target === Model){
            throw new Error('Can´t be instance')
        }
    }
    clear() {
        throw new Error('Must be implement in the subclass')
    }
}

class Email extends Model {
    constructor(email,owner){
        this.email = email;
        this.owner = owner;
    }
    clear(){
        this.email = ''
        this.owner = null
    }
}
class ErrorInput extends Model{
    constructor(field,type){
        this.field = field;
        this.type = type;
    }
    clear(){
        this.email = ''
        this.owner = null
    }
}


/*
const min = document.querySelector('.min');
const line = document.querySelector('.line');
let isDragging = false;
let startX;
let startLeft;
min.addEventListener('mousedown',(e)=>{
  isDragging=true;
  startX = e.clientX;
  startLeft = parseInt(window.getComputedStyle(min).left) || 0;
  e.preventDefault();
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  // Calcular nueva posición X
  const deltaX = e.clientX - startX;
  let nuevaX = startLeft + deltaX;

  // Limitar movimiento dentro del contenedor
  const maxX = line.offsetWidth - min.offsetWidth;
  nuevaX = Math.max(0, Math.min(nuevaX, maxX));

  // Actualizar posición
  min.style.left = `${nuevaX}px`;
  const valueMin = document.querySelector('.value-min');
  valueMin.innerText = nuevaX;
  console.log(nuevaX);
});

// Evento al soltar el mouse
document.addEventListener("mouseup", () => {
  isDragging = false;
});
// console.log(line.clientWidth)
line.addEventListener('click',(e)=>{
   const {left} = e.target.getBoundingClientRect();
  // console.log(e.clientX-left)
  const posNew = e.clientX - left;
  min.style.left = `${posNew}px`;
  const valueMin = document.querySelector('.value-min');
  valueMin.innerText = Math.round(posNew);
})
*/