class Player{
    constructor(){
        this.name= null;
        this.index= null;
        this.positionX= 0;
        this.positionY= 0;
        this.rank= 0;
        this.fuel= 180;
        this.life= 180;
        this.score= 0 
    }

    addPlayer(){
        var playerindex = "players/player" + this.index;
        
        if(this.index===1){
            this.positionX= width/2 - 100;
        } else{
            this.positionX= width/2 + 100;
        }

        database.ref(playerindex).set({
            name: this.name,
            positionX: this.positionX,
            positionY: this.positionY,
            rank: this.rank,
            score: this.score,
        });
    }

    getPlayerDistance(){
        var refPlayerDistance= database.ref("players/player" + this.index);
        refPlayerDistance.on("value", data => {
            var data= data.val();
            this.positionY= data.positionY;
            this.positionX= data.positionX;
        });
    }

    refCount(){
        var refPlayerCount= database.ref("playerCount");
        refPlayerCount.on("value", data => {
            refPlayerCount= data.val();
        })
    }

    updateCount(count){
        database.ref("/").update({
            playerCount: count
        });
    }

    updating(){
        var playerindex = "players/player" + this.index;
        database.ref(playerindex).set({
            name: this.name,
            positionX: this.positionX,
            positionY: this.positionY,
            rank: this.rank,
            score: this.score,
            life: this.life
        });
    }

    static collectPlayersInfo(){
        var refPlayerInfo= database.ref("players")
        refPlayerInfo.on("value", data =>{
            allPlayers= data.val();
        })
    }

    getRocketsAtEnd(){
        database.ref('rocketsAtEnd').on("value", data =>{
            this.rank= data.val();
        })
    }

    static updateRocketsAtEnd(){
        database.ref("/").update({
            rocketsAtEnd: rank
        })
    }
}