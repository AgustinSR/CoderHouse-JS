const items = [
  { nombre: "Daga", ataque:115, defensa:0, velocidad:10},
  { nombre: "Espada", ataque:120, defensa:0, velocidad:2},
  { nombre: "Lucero del Alba", ataque:215, defensa:0, velocidad:0},
  { nombre: "Puños Americanos", ataque:110, defensa:0, velocidad:13},
  { nombre: "Escudo", ataque:115, defensa:10, velocidad:0},
  { nombre: "Mandoble", ataque:310, defensa:0, velocidad:0}
]


function creacionPersonaje(){
  const vidaAleatoria = Math.floor(Math.random() * 101)+100;
  return{
    nombre,
    vida: vidaAleatoria,
    vidaMaxima: vidaAleatoria,
    ataque: Math.floor(Math.random() * 10)+1,
    defensa: Math.floor(Math.random() * 10)+1,
    velocidad: Math.floor(Math.random() * 10)+1,
    items: []
}
}

function agregarItem(jugador1) {
  const disponibles = [...items];
  for (let i= 0; i < 3; i++) {
    const indice = Math.floor(Math.random() * disponibles.length);
    const items = disponibles.splice(indice, 1)[0];	
    
    jugador1.items.push(items);
  }
  guardarJugador1(jugador1);
}


function creacionPersonaje2(){
  const vidaAleatoria1 = Math.floor(Math.random() * 101)+100;
  const nombre = ["Juan", "Pedro", "Martin", "Lucas", "Maria", "Ana", "Laura", "Sofia", "Valentina", "Camila"][Math.floor(Math.random() * 10)];
  return{
    nombre,
    vida: vidaAleatoria1,
    vidaMaxima: vidaAleatoria1,
    ataque: Math.floor(Math.random() * 10)+1,
    defensa: Math.floor(Math.random() * 10)+1,
    velocidad: Math.floor(Math.random() * 10)+1,
    items: []
  };
}
creacionPersonaje2();

function agregarItem2(jugador2) {
  const disponibles = [...items];
  for (let i= 0; i < 3; i++) {
    const indice = Math.floor(Math.random() * disponibles.length);
    const items = disponibles.splice(indice, 1)[0];	
    
    jugador2.items.push(items);
  }
  guardarJugador2(jugador2);
}
agregarItem2(creacionPersonaje2());

  function reroll1(jugador1) {
    let reroll = 3;
      if (reroll>0){
        jugador1 = rerollPersonaje1();
        agregarItem(jugador1);     
        reroll--;
        } else {
        alert("No te quedan reroles.");
      }
      console.log("Jugador 1:", jugador1);
    }

function check(jugador1){
  console.log("Jugador 1:", jugador1);
}
function guardarJugador1(j1) {
  localStorage.setItem("jugador1", JSON.stringify(j1));
}

function guardarJugador2(j2){
  localStorage.setItem("jugador2", JSON.stringify(j2));
}




function cargarJugadores() {
  const j1 = JSON.parse(localStorage.getItem("jugador1"));
  const j2 = JSON.parse(localStorage.getItem("jugador2"));
  return { j1, j2 };
}


const btnPersonaje = document.getElementById("crearJugador").addEventListener("click", function(){        
    const input = document.getElementById("nombreJugador1");
    nombre = input.value.trim();

    if(nombre !== ""){
      const jugador1 = creacionPersonaje();
        console.log("jugador 1 creado:", jugador1);
        input.value = "";
        agregarItem(jugador1);
        console.log("Jugador 1:", jugador1);
        document.getElementById("infoJugador1").textContent = JSON.stringify(jugador1, null, 2);
      } else {
        alert("Por favor, escribe un nombre válido.");
    }
    
}); 

const btnCombate = document.getElementById("empezarCombate").addEventListener("click", empezarCombate);


function combate(j1, j2){
  let log = [];
  let turno = j1.velocidad >= j2.velocidad ? j1 : j2;
  let rival = turno === j1 ? j2 : j1;

  log.push(`Pelea entre ${j1.nombre} y ${j2.nombre}`);

    while (j1.vida > 0 && j2.vida >0){    
      let itemEquipado = turno.items.find(item => item.equipado);

      if (!itemEquipado) {
      const itemNoEquipado = turno.items.find(item => !item.equipado);
          if (itemNoEquipado && Math.random() < 0.35) {
          turno.ataque += itemNoEquipado.ataque || 0;
          turno.defensa += itemNoEquipado.defensa || 0;
          turno.velocidad += itemNoEquipado.velocidad || 0; 
          itemNoEquipado.equipado = true;
          log.push(`${turno.nombre} equipa ${itemNoEquipado.nombre} y aumenta sus stats`); // bendito sea copilot y su habilidad de rellenar codigo jaja
          itemEquipado = itemNoEquipado;
        }         
      }



      if (itemEquipado && Math.random() < 0.2){
          const dañoArrojado = (itemEquipado.ataque ||0)* 2;
          rival.vida -= dañoArrojado;
          log.push(`${turno.nombre} Lanza su ${itemEquipado.nombre} y causa ${dañoArrojado} de daño a ${rival.nombre}`);
          log.push(`${rival.nombre} tiene ${rival.vida} de vida restante`);


          turno.ataque -= itemEquipado.ataque || 0;
          turno.defensa -= itemEquipado.defensa || 0;
          turno.velocidad -= itemEquipado.velocidad || 0;
          itemEquipado.equipado = false;
          turno.items = turno.items.filter(i => i !== itemEquipado);
          

          if (rival.vida <= 0) {
            log.push(`${rival.nombre} ha sido derrotado.`);
            log.push(`¡${turno.nombre} gana!`);
            break;
          }
          [turno, rival] = [rival, turno];
          continue;
        } 
                //estos porcentajes son para ver si arroja el item o lo usa para pegar :P           
      
      // aca ya empieza el combate pero normalito
      
      const esquivarProb = (turno.ataque * turno.velocidad) / Math.max(rival.velocidad, 1);
      const esquiva = Math.random() < Math.min(esquivarProb, 70) / 100;


      if (esquiva) {
        log.push(`${turno.nombre} esquiva el ataque de ${rival.nombre}!`);        
        [turno, rival] = [rival, turno];
        continue;
      }
      else {
        const dañoReducido = Math.floor((rival.defensa + (rival.vidaMaxima * 0.05)));
        const dañoFinal = Math.max(turno.ataque - dañoReducido, 5);
        rival.vida -= dañoFinal;
        log.push(`${turno.nombre} ataca a ${rival.nombre} y causa ${dañoFinal} de daño`);
        log.push(`${rival.nombre} tiene ${rival.vida} de vida restante`); 


        if (rival.vida <= 0) {
        log.push(`${rival.nombre} ha sido derrotado.`);
        log.push(`¡${turno.nombre} gana!`);
        break;
          }
          [turno, rival] = [rival, turno];
        }     
    }

  
  return log.join("\n");
} 

  
function empezarCombate() {
    const {j1, j2} = cargarJugadores();
    const resultado = combate(j1, j2);
    document.getElementById("resultado").textContent = resultado;
  }
