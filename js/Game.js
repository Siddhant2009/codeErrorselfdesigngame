class Game{
    constructor(){
        //Creating the reset button
        this.resetText= createElement("h2");
        this.resetButton= createButton("");

        //Creating leaderboard title
        this.titleLeaderboard= createElement("h2");

        //Creating elements on leaderboard
        this.firstLeader= createElement("h2");
        this.secondLeader= createElement("h2");
        this.playerMoving= false;

        //Creating the blast property if rockets hit meteors or collide
        this.blast= false
        this.leftKeyClick= false
    }

    getGameState(){
        var refgameState= database.ref("gameState");
        refgameState.on("value",function (data){
            gameState = data.val();
        });
    }

    updateGameState(state){
        database.ref("/").update({
            gameState: state
        });
    }

    startGame(){
       player= new Player(); 
       playerCount= player.refCount();

       form= new Form(); 
       form.displayElements();

       rocket1= createSprite(width/2 + 50, height - 100);
       rocket1.addImage("rocket1",rocket1img)
       rocket1.scale= 0.5
       rocket1.addImage("explosion", blastImage)

       rocket2= createSprite(width/2 + 100, height - 100);
       rocket2.addImage("rocket2",rocket2img)
       rocket2.scale= 0.5
       rocket2.addImage("explosion", blastImage)

       rockets= [rocket1, rocket2];

       meteor= new Group ();
       fuels= new Group ();
       stars= new Group ();

       var meteor1Positions = [
        { x: width / 2 - 150, y: height - 1300, image: meteorImg },
        { x: width / 2 + 250, y: height - 1800, image: meteorImg },
        { x: width / 2 - 180, y: height - 3300, image: meteorImg },
       
        { x: width / 2 - 150, y: height - 4300, image: meteorImg },
        { x: width / 2, y: height - 5300, image: meteorImg },
      ];

      var meteorPositions2= [
        { x: width / 2 + 250, y: height - 800, image: meteorImg },
        { x: width / 2 - 180, y: height - 2300, image: meteorImg },
        { x: width / 2, y: height - 2800, image: meteorImg },
       
        { x: width / 2 + 180, y: height - 3300, image: meteorImg },
        { x: width / 2 + 250, y: height - 3800, image: meteorImg },
        { x: width / 2 + 250, y: height - 4800, image: meteorImg },
        { x: width / 2 - 180, y: height - 5500, image: meteorImg }
      ]

      this.addSprites(fuels, 4, fuelImg, 0.02);
      this.addSprites(stars, 18, starImg, 0.04)
      this.addSprites(meteor,meteorImg, 0.04, meteor1Positions.length, meteorPositions2);
    
    }

    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
        for (var i = 0; i < numberOfSprites; i++) {
          var x, y;
    
          //C41 //SA
          if (positions.length > 0) {
            x = positions[i].x;
            y = positions[i].y;
            spriteImage = positions[i].image;
          } else {
            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);
          }
          var sprite = createSprite(x, y);
          sprite.addImage("sprite", spriteImage);
    
          sprite.scale = scale;
          spriteGroup.add(sprite);
        }
      }

      controlElements(){
          form.hide();
          form.title.position(40, 60);
          form.title.class("gameTitleAfterStart");

          this.resetText.html("Reset Game");
          this.resetText.class("resetText");
          this.resetText.position(width/2 + 195, 40);

          this.resetButton.class("resetButton");
          this.resetButton.position(width/2 - 229, 100);

          this.titleLeaderboard.html("Leaderboard");
          this.titleLeaderboard.class("resetText");
          this.titleLeaderboard.position(width/3 - 60, 40)

          this.firstLeader.class("gameLeaderText")
          this.firstLeader.position(width/3 - 40, 80)

          this.secondLeader.class("gameLeaderText")
          this.secondLeader.position(width/3 - 40, 130)
      }

      playGame(){
        this.controlElements();
        this.controlResetButton();

        Player.collectPlayersInfo();
        player.getRocketsAtEnd();

        if(allPlayers!==undefined){
          this.displayLife();
          this.displayFuelBar();
          this.displayLeaderboard();
          
          //Index of rockets array
          var index= 0;
          for(var plr in allPlayers){
              //increase the index by 1 for every loop
              index= index + 1;

              //Apply data from the database to calculate the positions of rocket on the database
              var x = allPlayers[plr].positionX;
              var y = height - allPlayers[plr].positionY;
              var presentLife = allPlayers[plr].life;

              if(presentLife <= 0){
                  rockets[index - 1].changeImage("explosion");
                  rockets[index - 1].scale= 0.3;
              }

              rockets[index - 1].position.x= x;
              rockets[index - 1].position.y= y;

              if(index===player.index){
                  stroke(9);
                  fill ("yellow");
                  ellipse(x, y, 70, 70);

                  this.handleFuel();
                  this.controlStars(index);
                  this.controlMeteorCollision(index);

                  if(player.life<=0){
                      this.blast= true;
                      this.playerMoving= false;
                  }

                  //Changing player camera in y position
                  camera.position.y= cars[index - 1].position.y;
              }
          
          }

          if(this.playerMoving){
              player.positionX += 5;
              player.update();
          }

          //Handling the events occuring on the keyboard
          this.controlPlayerControls();

          if(player.score>=15){
              gameState= 2;
              player.rank +=1;
              Player.updateRocketsAtEnd();
              player.update();
              this.displayRank();
          }

          drawSprites();
        }
    }
    
}

handleFuel(index)
{
   rockets[index - 1].overlap(fuels, function(collector, collected){
     player.fuel= 180;

     collected.remove();
   });

   if (player.fuel > 0 && this.playerMoving) {
    player.fuel -= 0.3;
  }

  if(player.fuel <=0){
    gameState= 2;
    this.gameOver();
  }
}

controlStars(index)
{
  rockets[index - 1].overlap(stars, function(collector, collected){
    player.score +=2;
    player.update();

    collected.remove();
  })
}

controlResetButton()
{
  this.resetButton.mousePressed(()=>{
    database.ref("/").set({
      rocketsAtEnd: 0,
      playerCount: 0,
      gameState: 0,
      players: {}
    });
    window.location.reload();
  });
}

displayFuelBar()
{
  push ();
  image(fuelImg, width/2 - 130, height - player.positionY - 350, 20, 20);
  fill("white");
  rect(width/2 - 100, height - player.positionY - 350, 185, 20);
  fill("yellow");
  rect(width/2 - 100, height - player.positionY - 400, 20, 20);
  noStroke();
  pop ();
}

displayLife()
{
  push();
  image(lifeImg, width / 2 - 130, height - player.positionY - 400, 20, 20);
  fill("white");
  rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
  fill("red");
  rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
  noStroke();
  pop();
}

displayLeaderboard()
{
  
}