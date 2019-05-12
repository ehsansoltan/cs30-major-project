// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


class Map{
  constructor(){
    this.map = [];
    this.mapSize = 50;
    this.mapTileSize = 13;
    this.textSize = 25;

    this.currentRoomHeight;
    this.currentRoomWidth;
    this.maxRoomSize = 8;
    this.roomX;
    this.roomY;
    this.roomXChange;
    this.roomYChange;

    this.corridorX;
    this.corridorY;
    this.corridorDirection;
    this.corridorXChange;
    this.corridorYChange;
    this.corridorMaxLength = 12;
    this.corridorMinLength = 5;
    this.corridorLength;


   

    

    
    


  }

  //fills empty map with wall ("#");
  createEmptyMap(size){
    for (let columns = 0; columns < size; columns++){
      this.map.push([]);
      for (let rows = 0; rows < size; rows++){
        this.map[columns].push("#");
      }
    }
  }

  //places the "seed room" into map, which will be used as a base to draw the other rooms
  placeSeedRoom(x, y){
    this.currentRoomWidth = random(2, this.maxRoomSize);
    this.currentRoomHeight = random(2, this.maxRoomSize);

    for (let yPos = y; yPos < y + this.currentRoomHeight; yPos++){
      for (let xPos = x; xPos < x + this.currentRoomWidth; xPos++){
        this.map[yPos][xPos] = ".";
      }

    }
  }

  //finds a suitable spot to place a corridor
  pickCorridorSpot(){

    this.corridorX = Math.floor(random(1, this.mapSize));
    this.corridorY = Math.floor(random(1, this.mapSize));

    while (this.map[this.corridorY][this.corridorX] !== "."){
      this.corridorX = Math.floor(random(1, this.mapSize));
      this.corridorY = Math.floor(random(1, this.mapSize));
    }
    

    this.corridorDirection = Math.floor(random(4));

    switch(this.corridorDirection){

      case 0:
        this.corridorDirection = "left";
        this.corridorXChange = -1;
        this.corridorYChange = 0;
      break;

      case 1:
        this.corridorDirection = "right";
        this.corridorXChange = 1;
        this.corridorYChange = 0;
      break;

      case 2:
        this.corridorDirection = "up";
        this.corridorXChange = 0;
        this.corridorYChange = -1;
      break;

      case 3:
        this.corridorDirection = "down";
        this.corridorXChange = 0;
        this.corridorYChange = 1;
      break;
    }

    while (this.map[this.corridorY + this.corridorYChange][this.corridorX + this.corridorXChange] !== "#"){
      this.corridorX += this.corridorXChange;
      this.corridorY += this.corridorYChange;
    }
  }

   //calls pickCorridorSpot to find the spot and then draws the corridor
  drawCorridor(){

   
    this.pickCorridorSpot()
    this.corridorLength = Math.floor(random(this.corridorMinLength, this.corridorMaxLength));

      for (let i = 0; i < this.corridorLength; i++){
        if (this.corridorX > 0 && this.corridorX < this.mapSize && this.corridorY > 0 && this.corridorY < this.mapSize){
          this.corridorX += this.corridorXChange;
          this.corridorY += this.corridorYChange;
          this.map[this.corridorY][this.corridorX] = "+";
        }
      }
    
  }


  //generates coordinates and dimensions of potential room and returns boolean based on if there's enough space for it
  potentialRoom(){

    //sets initial room location to end of corridor
    this.roomX = this.corridorX;
    this.roomy = this.corridorY;

    //sets size
    this.currentRoomHeight = random()

    if (this.corridorDirection === "up"){
      this.roomYChange = -1;
      if (this.roomX - this.)
      if (this.roomX < Math.floor(this.mapSize/2)) this.

    }
    else if (corridorDirection === "down"){
      
    }
    else if (corridorDirection === "left"){
      
    }
    else if (corridorDirection === "right"){
      
    }


  }


  
  //draws the map
  drawMap(size){
    textSize(this.textSize);
    for (let y = 0; y < size; y++){
      for (let x = 0; x < size; x++){
        text(this.map[y][x], x * this.mapTileSize, y * this.mapTileSize);
      }
    }
  }

}





let map1;
function setup() {
  createCanvas(windowWidth, windowHeight);
  map1 = new Map();
  map1.createEmptyMap(map1.mapSize);
  map1.placeSeedRoom(25, 25);
  map1.drawCorridor();
}

function draw() {
  background(220);
 
  map1.drawMap(map1.mapSize);
  

}
