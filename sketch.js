var canvas;
var backgroundImg, rocket1img, rocket2img;
var database, gameState;
var form, player, playerCount;
var allPlayers, rocket1, rocket2, laser;
var rockets = [];
var fuelImg, fuels, lifeImg, laserImg;
var starImg, stars;
var meteor, meteorImg; 
var blastImage; 

function preload(){
    backgroundImg = loadImage("./assets/Background.jpg")
    rocket1img = loadImage("./assets/player.gif")
    rocket2img = loadImage("./assets/player2.gif")
    fuelImg = loadImage("./assets/fuel.png")
    lifeImg = loadImage("./assets/life.png")
    meteorImg = loadImage("./assets/meteor.png")
    blastImage = loadImage("./assets/blast.png")
    starImg= loadImage("./assets/Gold Star.png")
}

function setup(){
    canvas= createCanvas(windowWidth, windowHeight)
    database= firebase.database();
    game= new Game
    game.getGameState();
    game.startGame();
}

function draw(){
    background(backgroundImg)

    if(playerCount===2){
        game.update(1)
    }

    if(gameState===1){
        game.play();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }