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

    this.currentRoomWidth;
    this.currentRoomHeight;
    this.maxRoomSize = 10;
    this.minRoomSize = 4;
    this.roomAdded;
    this.roomXSide;
    this.roomYSide;

    this.corridorX;
    this.corridorY;
    this.corridorDirection;
    this.corridorLength;
    this.roomEdge = false;
    this.corridorXChange = 0;
    this.corridorYChange = 0;
    this.maxCorridorLength = 10;
    this.minCorridorLength = 4;
    this.timesRoomPlaceFailed = 0;
    this.corridorTurnDirection;

    
    


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

  //picks a random corridor spot in which a corridor will branch out from
  findCorridorSpot(){

    this.corridorXChange = 0;
    this.corridorYChange = 0;
    this.roomEdge = false;

    while (this.roomEdge === false){
      this.corridorX = Math.floor(random(1, this.mapSize - 1));
      this.corridorY = Math.floor(random(1, this.mapSize - 1));

      if (this.map[this.corridorY][this.corridorX] === "#"){

        if (this.map[this.corridorY + 1][this.corridorX] === "."){
          this.corridorDirection = "up";
          this.corridorYChange = -1;
          this.roomEdge = true;
        }

        else if (this.map[this.corridorY - 1][this.corridorX] === "."){
          this.corridorDirection = "down";
          this.corridorYChange = 1;
          this.roomEdge = true;
        }

        else if (this.map[this.corridorY][this.corridorX + 1] === "."){
          this.corridorDirection = "left";
          this.corridorXChange = -1;
          this.roomEdge = true;
        }

        else if (this.map[this.corridorY][this.corridorX - 1] === "."){
          this.corridorDirection = "right";
          this.corridorXChange = 1;
          this.roomEdge = true;
        }


      }
    }
  }


  addCorridor(){
    this.corridorLength = random(this.minCorridorLength, this.maxCorridorLength);

    while (this.corridorLength > 0 && this.corridorX + this.corridorXChange > 0 && this.corridorX + this.corridorXChange < this.mapSize && this.corridorY + this.corridorYChange > 0 && this.corridorY + this.corridorYChange < this.mapSize && this.corridorLength < this.maxCorridorLength){

      //end corridor if it intersects an existing corridor
      if (this.map[this.corridorY][this.corridorX] === "." || this.map[this.corridorY][this.corridorX] === "+") this.corridorLength = 0;

      //end coridor if adjacent to a parallel corridor (to ensure corridors are merely one tile wide)
      //if (this.corridorXChange === 0 && this.map[this.corridorY][this.corridorX + 1] === "+" || this.corridorXChange === 0 && this.map[this.corridorY][this.corridorX - 1]) this.corridorLength = 0;
      //if (this.corridorYChange === 0 && this.map[this.corridorY + 1][this.corridorX] === "+" || this.corridorYChange === 0 && this.map[this.corridorY - 1][this.corridorX]) this.corridorLength = 0;


      this.map[this.corridorY][this.corridorX] = ".";
      this.corridorY += this.corridorYChange;
      this.corridorX += this.corridorXChange;
      this.corridorLength--;
    }

  }

  addCorridors(iterations){
    for (let i = 0; i < iterations; i++){
      this.findCorridorSpot();
      this.addCorridor();
    }

  }

  turnCorridor(){
    this.corridorTurnDirection = random(3);

    if (this.corridorTurnDirection === 0) {
      this.corridorDirection = "left";
      this.corridorXChange = -1;
      this.corridorYChange = 0;
    }
    if (this.corridorTurnDirection === 1) {
      this.corridorDirection = "right";
      this.corridorXChange = 1;
      this.corridorYChange = 0;
    }
    if (this.corridorTurnDirection === 2) {
      this.corridorDirection = "up";
      this.corridorXChange = 0;
      this.corridorYChange = -1;
    }
    if (this.corridorTurnDirection === 3) {
      this.corridorDirection = "down";
      this.corridorXChange = 0;
      this.corridorYChange = 1;
    }
   
    
  }

  addRoom(){
    this.currentRoomHeight = Math.floor(random(this.minRoomSize, this.maxRoomSize));
    this.currentRoomWidth = Math.floor(random(this.minRoomSize, this.maxRoomSize));
    this.roomAdded = false;

    if (this.corridorY + this.currentRoomHeight < this.mapSize && this.corridorX + this.currentRoomWidth < this.mapSize){
      for (let y = this.corridorY; y < this.corridorY + this.currentRoomHeight; y++){
        for (let x = this.corridorX; x < this.corridorX + this.currentRoomWidth; x++){
          this.map[y][x] = ".";
  
        }
      }

    }
 
    
  }

  noRoomPresent(){

    if (this.corridorY + this.currentRoomHeight < this.mapSize && this.corridorX + this.currentRoomWidth < this.mapSize){

      for (let y = this.corridorY; y < this.corridorY + this.currentRoomHeight; y++){
        for (let x = this.corridorX; x < this.corridorX + this.currentRoomWidth; x++){
          if (this.map[y][x] === ".") return false;
        }
      }
    }

    
    return true;

  }


  
  generateMap(iterations){
    for (let i = 0; i < iterations; i++){

      if (this.noRoomPresent() === true) {
        
        this.addRoom();
        
        

      }
      

      this.addCorridors(1);
      this.turnCorridor();
      

      
     
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
  map1.generateMap(35);
}

function draw() {
  background(220);
 
  map1.drawMap(map1.mapSize);
  

}
