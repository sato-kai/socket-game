'use strict';

const socket = io();
const canvas = document.querySelector('#canvas-2d');
const context = canvas.getContext('2d');
const playerImage = document.querySelector('#player-image');
let movement = {};


function gameStart(){
    socket.emit('game-start');
}

function keyAction(event){
  const KeyToCommand = {
    'ArrowUp': 'forward',
    'ArrowDown': 'back',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
  };
  const command = KeyToCommand[event.key];
  if(command){
      if(event.type === 'keydown'){
          movement[command] = true;
      }else{ /* keyup */
          movement[command] = false;
      }
      socket.emit('movement', movement);
  }
}

document.addEventListener('keyup', (event) => {
  keyAction(event);
});
document.addEventListener('keydown', (event) => {
  keyAction(event);
});

socket.on('state', (players, bullets, walls) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 10;
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();

    Object.values(players).forEach((player) => {
        context.drawImage(playerImage, player.x, player.y);
        context.font = '30px Bold Arial';
        context.fillText('Player', player.x, player.y - 20);
    });
});

socket.on('connect', gameStart);