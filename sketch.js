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
    this.minRoomSize = 3;
    this.roomX;
    this.roomY;
    this.roomXChange;
    this.roomYChange;

    this.corridorX;
    this.corridorY;
    this.corridorDirection;
    this.corridorLastDirection;
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

  pickCorridorSpot(){
    this.corridorX = Math.floor(random(1, this.mapSize));
    this.corridorY = Math.floor(random(1, this.mapSize));

    while (this.map[this.corridorY][this.corridorX] !== "."){
      this.corridorX = Math.floor(random(1, this.mapSize));
      this.corridorY = Math.floor(random(1, this.mapSize));
    }
  }

  //finds a suitable spot to place next corridor
  pickCorridorDirectionAndLength(){

    this.corridorDirection = Math.floor(random(4));

    //sets new direction if new one was same as old one
    while (this.corridorDirection === this.corridorLastDirection){
      this.corridorDirection = Math.floor(random(4));
    }



    this.corridorLastDirection = this.corridorDirection;

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



    //snaps the start of the potential corridor to past the wall

    while (this.corridorY > 1 && this.corridorY < this.mapSize + 1 && this.corridorX > 1 && this.corridorX < this.mapSize - 1 && this.map[this.corridorY + this.corridorYChange][this.corridorX + this.corridorXChange] !== "#"){
      
      this.corridorX += this.corridorXChange;
      this.corridorY += this.corridorYChange;
      
    }

 
 
  }

  //calls pickCorridorSpot to find the spot and then draws the corridor
  addCorridor(){

   
    this.pickCorridorDirectionAndLength();
    this.corridorLength = Math.floor(random(this.corridorMinLength, this.corridorMaxLength));

    for (let i = 0; i < this.corridorLength; i++){
      this.corridorX += this.corridorXChange;
      this.corridorY += this.corridorYChange;
      if (this.corridorX > 0 && this.corridorX < this.mapSize && this.corridorY > 0 && this.corridorY < this.mapSize && this.map[this.corridorY][this.corridorX] !== "."){
        this.map[this.corridorY][this.corridorX] = "+";
      }

      //ending the corridor before it starts if it's both adjacent and parallel to an existing corridor or a room

      if (this.corridorY + 1 < this.mapSize - 1 && this.corridorY - 1 > 0){
        if (this.corridorDirection === "left"  || this.corridorDirection === "right"){
          if (this.map[this.corridorY + 1][this.corridorX] !== "#" || this.map[this.corridorY - 1][this.corridorX] !== "#") this.corridorLength = 0;
        }

      }
      
      if (this.corridorX + 1 < this.mapSize - 1 && this.corridorX - 1 > 0){
        if (this.corridorDirection === "up" || this.corridorDirection === "down"){
          
          if (this.map[this.corridorY][this.corridorX + 1] !== "#" || this.map[this.corridorY][this.corridorX - 1] !== "#") this.corridorLength = 0;
        
        }
      }
      
    


    }
    
  }


  //generates coordinates and dimensions of potential room
  potentialRoom(){

    //sets initial room location to end of corridor
    this.roomX = this.corridorX;
    this.roomY = this.corridorY;

    //sets size
    this.currentRoomHeight = Math.floor(random(this.minRoomSize, this.maxRoomSize));
    this.currentRoomWidth = Math.floor(random(this.minRoomSize, this.maxRoomSize));

    if (this.corridorDirection === "up"){
      this.roomYChange = -1;
      this.roomXChange = 1;
      if (this.roomX - Math.floor(this.currentRoomWidth/2) > 0) this.roomX -= Math.floor(this.currentRoomWidth/2);
    }
    else if (this.corridorDirection === "down"){
      this.roomYChange = 1;
      this.roomXChange = 1;
      if (this.roomX - Math.floor(this.currentRoomWidth/2) > 0) this.roomX -= Math.floor(this.currentRoomWidth/2);
      
    }
    else if (this.corridorDirection === "left"){
      this.roomXChange = -1;
      this.roomYChange = 1;
      if (this.roomY - Math.floor(this.currentRoomHeight/2) > 0) this.roomY -= Math.floor(this.currentRoomHeight/2);
      
    }
    else if (this.corridorDirection === "right"){
      this.roomXChange = 1;
      this.roomYChange = 1;
      if (this.roomY - Math.floor(this.currentRoomHeight/2) > 0) this.roomY -= Math.floor(this.currentRoomHeight/2);
    }

    //makes the room start after the corridor so it doesnt go into the corridor
    this.roomX += this.roomXChange;
    this.roomY += this.roomYChange;
  }

  //returns a boolean if there is nothing in the way of the potential room
  spotEmpty(){
    for (let y = this.roomY; y !== this.roomY + this.roomYChange*this.currentRoomHeight; y += this.roomYChange){
      for (let x = this.roomX; x !== this.roomX + this.roomXChange*this.currentRoomWidth; x += this.roomXChange){

        if (x <= 0 || x >= this.mapSize || y <= 0 || y >= this.mapSize) return false;
        if (this.map[y][x] !== "#") return false;
        
        
       

      }
    }
    return true;

  }

  placeRoom(){
    this.potentialRoom();

    if (this.spotEmpty() === true){
      for (let y = this.roomY; y !== this.roomY + this.roomYChange*this.currentRoomHeight; y += this.roomYChange){
        for (let x = this.roomX; x !== this.roomX + this.roomXChange*this.currentRoomWidth; x += this.roomXChange){
          this.map[y][x] = ".";
        }
      }


    }
    
  }

  generateDungeon(iterations){
 
    
    for (let i = 0; i < iterations; i++){
      this.pickCorridorSpot();
      this.pickCorridorDirectionAndLength();
      this.addCorridor();
      this.placeRoom();
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
  /* map1.addCorridor();
  map1.potentialRoom();
  map1.placeRoom();
  */
  map1.generateDungeon(4);
}

function draw() {
  background(220);
 
  map1.drawMap(map1.mapSize);
  

}
