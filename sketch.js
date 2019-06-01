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
    this.mapTileSize = 12;
    this.textSize = 18;

    this.currentRoomHeight;
    this.currentRoomWidth;
    this.maxRoomSize = 11;
    this.minRoomSize = 4;
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

    this.stairX = 0;
    this.stairY = 0;

    this.entities = [];



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


  //picks a random spot that isn't "." to start a corridor
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



    //sets the last corridor direction
    this.corridorLastDirection = this.corridorDirection;


    //changes the corridor information based on a random number from 0 - 3 (four directions)
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
    while (this.corridorY > 1 && this.corridorY < this.mapSize - 1 && this.corridorX > 1 && this.corridorX < this.mapSize - 1 && this.map[this.corridorY + this.corridorYChange][this.corridorX + this.corridorXChange] !== "#"){
      
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
      if (this.corridorX > 0 && this.corridorX < this.mapSize -1 && this.corridorY > 0 && this.corridorY < this.mapSize -1 && this.map[this.corridorY][this.corridorX] !== "."){
        this.map[this.corridorY][this.corridorX] = "+";


        //changing the tile back to "#" and ends corridor if adjacent and parallel to a room
       
        if (this.corridorDirection === "up" || this.corridorDirection === "down"){
          if (this.map[this.corridorY][this.corridorX -1] === "." || this.map[this.corridorY][this.corridorX + 1] === "."){
            this.map[this.corridorY][this.corridorX] = "#";
            this.corridorLength = 0;

          }
          
       
        }
        else if (this.corridorDirection === "left" || this.corridorDirection === "right"){
          if (this.map[this.corridorY - 1][this.corridorX] === "." || this.map[this.corridorY + 1][this.corridorX] === "."){
            this.map[this.corridorY][this.corridorX] = "#";
            this.corridorLength = 0;

          }

          
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

  //returns true if there is nothing in the way of the potential room and false if there is
  spotEmpty(){
    for (let y = this.roomY - this.roomYChange; y !== this.roomY + this.roomYChange*this.currentRoomHeight + this.roomYChange; y += this.roomYChange){
      for (let x = this.roomX - this.roomXChange; x !== this.roomX + this.roomXChange*this.currentRoomWidth + this.roomXChange; x += this.roomXChange){

        if (x <= 0 || x >= this.mapSize || y <= 0 || y >= this.mapSize) return false;

        if (this.map[y][x] === ".") return false;

       
       

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
    else {
      this.pickCorridorDirectionAndLength();
      this.addCorridor();
    }
    
  }

  placeStair(){
    while(this.map[this.stairY][this.stairX] !== "."){
      this.stairY = Math.floor(random(0, this.mapSize));
      this.stairX = Math.floor(random(0, this.mapSize));
    }
    this.map[this.stairY][this.stairX] = "<";

  }

  addEntities(){
    this.entities.push(new Character);
  }

  placeEntities(){
    for (let entity = 0; entity < this.entities.length; entity++){
      this.map[this.entities[entity].y][this.entities[entity].x] = this.entities[entity].avatar;
    }
  }

  passTurn(){
    for (let entity = 0; entity < this.entities.length; entity++){
      this.entities[entity].move(this.map);

    }
  }

  

  generateDungeon(iterations){
 
    
    for (let i = 0; i < iterations; i++){
      this.pickCorridorSpot();
      this.pickCorridorDirectionAndLength();
      this.addCorridor();
      this.placeRoom();
    }
    this.placeStair();
  }


  
  //draws the map
  drawMap(size){
    textSize(this.textSize);
    for (let y = 0; y < size; y++){
      for (let x = 0; x < size; x++){
        fill(183, 150, 124);
        text(this.map[y][x], x * this.mapTileSize, y * this.mapTileSize);
      }
    }
  }

 

}

class Character{
  constructor(){
    this.y = 25;
    this.x = 25;
    this.currentTile = ".";
    this.avatar = "@";

    this.moveDirection = "stationary";
    this.yChange = 0;
    this.xChange = 0;


    this.health;
    this.weapon;

  }

  changeMoveDirection(direction){

    if (direction === "up"){
      this.yChange = -1;
      this.xChange = 0;
      this.moveDirection = "up";

    }
    if (direction === "down"){
      this.yChange = 1;
      this.xChange = 0;
      this.moveDirection = "down";

    }
    if (direction === "left"){
      this.yChange = 0;
      this.xChange = -1;
      this.moveDirection = "left";

    }
    if (direction === "right"){
      this.yChange = 0;
      this.xChange = 1;
      this.moveDirection = "right";

    }

  }

  move(map){
    if (0 < this.x + this.xChange && 50 > this.x + this.xChange && 0 < this.y + this.yChange && 50 > this.y + this.yChange){
      if (map[this.y + this.yChange][this.x + this.xChange] !== "#"){
        map[this.y][this.x] = this.currentTile;
        this.y += this.yChange;
        this.x += this.xChange;
        this.currentTile = map[this.y][this.x];
        this.yChange = 0;
        this.Change = 0;
        this.moveDirection = "stationary";
        
      }
    }
  
  }






}



let map1;


function keyPressed(){
  if (keyCode === RIGHT_ARROW){
    map1.entities[0].changeMoveDirection("right");
    map1.passTurn();
    
  }
  if (keyCode === LEFT_ARROW){
    map1.entities[0].changeMoveDirection("left");
    map1.passTurn();
    
  }
  if (keyCode === UP_ARROW){
    map1.entities[0].changeMoveDirection("up");
    map1.passTurn();
    
  }
  if (keyCode === DOWN_ARROW){
    map1.entities[0].changeMoveDirection("down");
    map1.passTurn();
    
  }
}





function setup() {
  createCanvas(windowWidth, windowHeight);
  map1 = new Map();
  map1.createEmptyMap(map1.mapSize);
  map1.placeSeedRoom(25, 25);
  /* map1.addCorridor();
  map1.potentialRoom();
  map1.placeRoom();
  */
  map1.generateDungeon(10);
  map1.addEntities();
  map1.placeEntities();
}

function draw() {
  background(0);

  map1.placeEntities();
  map1.drawMap(map1.mapSize);
  

}
