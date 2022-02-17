class Form {
    constructor(){
        this.input = createInput("").attribute("placeholder", "Enter your name");
        this.play = createButton("Play");
        this.title= createImg ("./assets/Title.png", "game title");
        this.title.scale= 40;
        this.greeting = createElement("h2");
    }

    setElementsPosition(){
        this.title.position(120,160);
        this.input.position(width/2 - 110, height / 2 + 30);
        this.play.position(width / 2 - 90, height / 2 + 100);
        this.greeting.position(width / 2 - 300, height / 2 - 100);
    }

    elementsStyle(){
        this.title.class("gameTitle");
        this.input.class("customInput");
        this.play.class("customButton");
        this.greeting.class("greeting");
    }

    hide(){
        this.play.hide();
        this.greeting.hide();
        this.input.hide();
    }

    mousePressed(){
        this.play.mousePressed(()=>{
          this.play.hide();
          this.input.hide();
          var message = `
          Hello ${this.input. value()}
          </br>wait for another player to join...`;
          this.greeting.html(message);
          playerCount+= 1;
          player.name = this.input.value();
          player.index = playerCount;
          player.addPlayer();
          player.updateCount(playerCount);
          player.getDistance();
        });
    }

    displayElements(){
        this.setElementsPosition();
        this.elementsStyle();
        this.mousePressed();
    }
}