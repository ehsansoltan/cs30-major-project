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
    this.clipped;

    this.stairX = 0;
    this.stairY = 0;

    this.entities = [];
    this.items = [];
    this.maxItemsOnMap = 5;
    this.itemsOnMap;

    this.maxMonstersOnMap = 5;
    this.monstersOnMap;



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
          if (this.map[this.corridorY + 1][this.corridorX -1] === "+" && this.map[this.corridorY - 1][this.corridorX -1] === "+" || this.map[this.corridorY + 1][this.corridorX + 1] === "+" && this.map[this.corridorY - 1][this.corridorX + 1] === "+"){
            this.map[this.corridorY][this.corridorX] = "#";
            this.corridorLength = 0;

          }
          
       
        }
        else if (this.corridorDirection === "left" || this.corridorDirection === "right"){
          if (this.map[this.corridorY - 1][this.corridorX + 1] === "+" && this.map[this.corridorY - 1][this.corridorX - 1] === "+" || this.map[this.corridorY + 1][this.corridorX + 1] === "+" && this.map[this.corridorY + 1][this.corridorX - 1] === "+"){
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

    //changes the xChange and yChange variables based on the direction of the corridor
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

        if (this.map[y][x] === "."){
          
          return false;
        }

       
       

      }
    }
    return true;

  }

  //places the room into the map array if the spot is empty
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

  //places the stair which leads to the next floor
  placeStair(){
    while(this.map[this.stairY][this.stairX] !== "."){
      this.stairY = Math.floor(random(0, this.mapSize));
      this.stairX = Math.floor(random(0, this.mapSize));
    }
    this.map[this.stairY][this.stairX] = "<";

  }

  //adds all the entities into the entity list
  addEntities(){
    this.entities.push(new Character);
    this.addMonsters();
    this.placeMonsters();
  }

  //places the entities into the map array
  placeEntities(){
    for (let entity = 0; entity < this.entities.length; entity++){
      this.map[this.entities[entity].y][this.entities[entity].x] = this.entities[entity].avatar;
    }
  }

  //adds all the items into the items list
  addItems(){
    this.items = [];
    this.itemsOnMap = Math.floor(random(this.maxItemsOnMap));
    for (let item = 0; item < this.itemsOnMap; item++){
      this.items.push(new Weapon);
    }

  }

  //places all items onto the map
  placeItems(){
    for (let item = 0; item < this.items.length; item++){
      this.items[item].y = Math.floor(random(this.mapSize));
      this.items[item].x = Math.floor(random(this.mapSize));
      while (this.map[this.items[item].y][this.items[item].x] !== "."){
        this.items[item].y = Math.floor(random(this.mapSize));
        this.items[item].x = Math.floor(random(this.mapSize));
      }
      this.map[this.items[item].y][this.items[item].x] = this.items[item].avatar;
 
    }
  }

  //picks up items if the player is on them
  pickupItems(){
    for (let item = 0; item < this.items.length; item++){
      this.items[item].checkIfFound(this.entities[0], this.items, item, this.map);
    }
  }

  //adds monsters into the entities list
  addMonsters(){
    this.entities.splice(1);
    this.monstersOnMap = Math.floor(random(this.maxMonstersOnMap));
    for (let monster = 0; monster < this.monstersOnMap; monster++){
      this.entities.push(new Monster);
    }
  }

  //places the monsters onto the map array
  placeMonsters(){
    for (let monster = 1; monster < this.entities.length; monster++){
      this.entities[monster].y = Math.floor(random(this.mapSize));
      this.entities[monster].x = Math.floor(random(this.mapSize));
      while (this.map[this.entities[monster].y][this.entities[monster].x] !== "."){
        this.entities[monster].y = Math.floor(random(this.mapSize));
        this.entities[monster].x = Math.floor(random(this.mapSize));
      }
      
 
    }
  }

  //kills monsters and displays a message if their health reaches 0
  killMonsters(messageObject){
    for (let monster = 1; monster < this.entities.length; monster++){
      if (this.entities[monster].health <= 0){
        messageObject.addCustomMessage("You killed the " + this.entities[monster].name + ".");
        this.map[this.entities[monster].y][this.entities[monster].x] = this.entities[monster].currentTile;
        this.entities.splice(monster, 1);
        
      }
    }
  }




  //calls functions from this class to reset the map
  resetMap(){
    this.map = [];
    this.createEmptyMap(this.mapSize);
    this.placeSeedRoom(this.entities[0].x, this.entities[0].y);
    this.generateDungeon(10);
    this.entities[0].currentTile = ".";
    this.placeStair();
    this.addMonsters();
    this.placeMonsters();
    
  }

  //checks if the players on the stairs and resets the map
  checkIfOnStair(){
    if (this.entities[0].currentTile === "<"){
      this.resetMap();
    } 
  }

  //passes a unit of time, moving all entities
  passTurn(messageObject){
    messageObject.clearMessages();
    for (let entity = 0; entity < this.entities.length; entity++){
      this.entities[entity].move(this.map, messageObject);

    }
  }

  

  //generates the dungeon
  generateDungeon(iterations){
 
    
    for (let i = 0; i < iterations; i++){
      this.pickCorridorSpot();
      this.pickCorridorDirectionAndLength();
      this.addCorridor();
      this.placeRoom();
    }
   
    this.placeStair();
    this.addItems();
    this.placeItems();
    

  }


  
  //draws the map onto the screen with different colors for different tiles
  drawMap(size){
    textSize(this.textSize);
    for (let y = 0; y < size; y++){
      for (let x = 0; x < size; x++){
        if (this.map[y][x] === "#" || this.map[y][x] === "." || this.map[y][x] === "<") {
          fill(183, 150, 124);
          text(this.map[y][x], x * this.mapTileSize, y * this.mapTileSize);
        }
        
         else if (this.map[y][x] === "+") {
          fill(183, 150, 124);
          text(".", x * this.mapTileSize, y * this.mapTileSize);
         }

         else if (this.map[y][x] === "*"){
          for (let item = 0; item < this.items.length; item++){
            if (this.items[item].y === y && this.items[item].x === x){
              fill(this.items[item].color);
              text(this.map[y][x], x * this.mapTileSize, y * this.mapTileSize);

            }
          }

         }

         else{
           for (let entity = 0; entity < this.entities.length; entity++){
             if (this.entities[entity].y === y && this.entities[entity].x === x){
               fill(this.entities[entity].color);
               text(this.map[y][x], x * this.mapTileSize, y * this.mapTileSize);

             }
           }
         }
         
      }
    }
  }

 

}

//the class for the character which the player controls
class Character{

  //initializing variables such as the player's health and x and y values etc
  constructor(){
    this.dead = false;
    this.y = 25;
    this.x = 25;
    this.currentTile = ".";
    this.avatar = "@";
    this.color = [240, 200, 70];
    this.state = "standard";

    this.moveDirection = "stationary";
    this.yChange = 0;
    this.xChange = 0;
    this.lastDirection = "";


    this.health = 50;
    this.weapon = "fists";
    this.attack = 1;
    this.weaponAttack = 0;
    this.totalAttack = this.attack + this.weaponAttack;

    this.itemPendingPickup;
    

  }


  //changes the yChange and xChange variables based on the direction the player is facing
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


 
  //attacks enemies if they are in front of the player, who is trying to move into the space the enemy occupies
  attackEnemy(){
    this.totalAttack = this.attack + this.weaponAttack;
    for (let entity = 1; entity < map1.entities.length; entity++){
      if (map1.entities[entity].y === this.y + this.yChange && map1.entities[entity].x === this.x + this.xChange){
        map1.entities[entity].health -= this.totalAttack;
        messages1.addCustomMessage("You attack the " + map1.entities[entity].name + ", dealing " + this.totalAttack + " damage. (" + map1.entities[entity].health + " health remaining)");
      }
    }

    
  }
  

  //moves the player if they are trying to move into a moveable tile
  move(map, messageObject){
    if (0 < this.x + this.xChange && 50 > this.x + this.xChange && 0 < this.y + this.yChange && 50 > this.y + this.yChange){
      if (map[this.y + this.yChange][this.x + this.xChange] === "." || map[this.y + this.yChange][this.x + this.xChange] === "+" || map[this.y + this.yChange][this.x + this.xChange] === "<" || map[this.y + this.yChange][this.x + this.xChange] === "*"){
        map[this.y][this.x] = this.currentTile;
        this.y += this.yChange;
        this.x += this.xChange;
        this.currentTile = map[this.y][this.x];
        map[this.y][this.x] = this.avatar;
        this.yChange = 0;
        this.Change = 0;
        messageObject.addMoveMessage(this.moveDirection);
        this.moveDirection = "stationary";
       
        
      }

      
      else{
        this.attackEnemy();
      }
     
    }

    
  
  }

  //kills player and displays message if health reaches 0
  killIfHealthZero(){
    if (this.health <= 0){
      this.dead = true;
      messages1.addCustomMessage("You died!");
      this.avatar = "X";

    }
  }
}

//the class for the monsters
class Monster{
  constructor(){
    this.y;
    this.x;
    this.currentTile = ".";
    

    //[name, avatar, health, attack, color, moveRoll]
    this.possibleTypes = [["goblin", "G", 5, 2, [4, 247, 65], 4], ["troll", "T", 10, 4, [140, 140, 140], 2], ["orc", "O", 8, 3, [11, 140, 26], 3], ["daemon", "D", 5, 4, [188, 0, 0], 3]];
    this.type = this.possibleTypes[Math.floor(random(this.possibleTypes.length))];
    this.name = this.type[0];
    this.avatar = this.type[1];
    this.color = this.type[4];

    this.moveDirection;
    this.moveRoll = this.type[5];
    this.yChange = 0;
    this.xChange = 0;

    this.health = this.type[2];
    this.attack = this.type[3];
    this.range = 7;
    this.playerInRange;
    this.attackSynonyms = ["strikes", "pummels", "kicks", "punches", "slashes", "tackles"];
    
  }


  //picks a move direction based on the position of the player
  pickMoveDirection(player){
    if (Math.floor(random(this.moveRoll)) !== 0){
      if (player.x < this.x){
        this.xChange = -1;
        this.yChange = 0;
      }
      if (player.x > this.x){
        this.xChange = 1;
        this.yChange = 0;
      }
      if (player.y < this.y){
        this.yChange = -1;
        this.xChange = 0;
      }
      if (player.y > this.y){
        this.yChange = 1;
        this.xChange = 0;
      }

    }
    else{
      this.xChange = 0;
      this.yChange = 0;
    }
    

  }

  //checks if the player is in range
  inRange(player){
    if (Math.abs(player.x - this.x) < this.range && Math.abs(player.y - this.y) < this.range) return true;
    else return false;
  }

  //attacks the player, dealing damage equal to its attack
  attackPlayer(player){
    if (this.y + this.yChange === player.y && this.x + this.xChange === player.x){
      player.health -= this.attack;
      messages1.addCustomMessage("The " + this.name + " " + this.attackSynonyms[Math.floor(random(this.attackSynonyms.length))] + " you, dealing " + this.attack + " damage!");
    }


  }

  //moves if the player is in range and if trying to move into an empty space
  move(){
    this.pickMoveDirection(map1.entities[0]);
    if (map1.map[this.y + this.yChange][this.x + this.xChange] === "." || map1.map[this.y + this.yChange][this.x + this.xChange] === "+"){
      map1.map[this.y][this.x] = this.currentTile;
      if (this.inRange(map1.entities[0]) === true){
        this.y += this.yChange;
        this.x += this.xChange;
      }
     
      map1.map[this.y][this.x] = this.avatar;
    }
    else{
      this.attackPlayer(map1.entities[0]);
    }


  }
}

//the class for the weapons which the player can pick up
class Weapon{
  constructor(){
    this.avatar = "*";
    this.found = false;
    
    //[name, max power, color]
    this.possibleMaterials = [["wooden", 4, [114, 63, 0]], ["copper", 7, [211, 151, 12]], ["bronze", 10, [231, 169, 29]], ["iron", 12, [200, 200, 200]], ["dragonslayer", 18, [147, 0, 0]]];
    this.possibleWeapons = ["longsword", "spear", "scimitar", "halberd", "mace", "warhammer", "dagger"];
    this.type = this.possibleMaterials[Math.floor(random(this.possibleMaterials.length))]
    this.name = this.type[0] + " " + this.possibleWeapons[Math.floor(random(this.possibleWeapons.length))];
    this.power = Math.floor(random(this.type[1]));
    this.color = this.type[2];
    if (this.power < 4) this.name += " (broken)";
    

    this.x;
    this.y;
  }

  //checks if the player is on the weapon
  checkIfFound(character, itemArray, itemArrayIndex){
    if (this.x === character.x && this.y === character.y){
     

      messages1.addWeaponFoundMessage(itemArray[itemArrayIndex]);
      messages1.weaponFoundDecision(itemArray[itemArrayIndex], character);
      messages1.weaponFoundQuestion();
      itemArray.splice(itemArrayIndex, 1);

    }


  }
}

//a simple message handler class
class Messages{
  constructor(){
    this.y = 600;
    this.currentMessages = [];
  }

  //adds various messages when called
  clearMessages(){
    this.currentMessages = [];
  }

  addMoveMessage(direction){
    this.currentMessages.push("You move " + direction + ".");
  }

  addDeadEndMessage(){
    this.currentMessages.push("It's a dead end!");
  }

  addWeaponFoundMessage(weapon){
    this.currentMessages.push("You found a " + weapon.name + ".");
  }

  weaponFoundQuestion(){
    if (map1.entities[0].state === "weaponPickup"){
      this.currentMessages.push("Would you like to replace your " + map1.entities[0].weapon + " with this " + map1.entities[0].itemPendingPickup.name + " (" + map1.entities[0].itemPendingPickup.power + " atk)? y/n");
    }
  }

  //adds a custom message which must be specified
  addCustomMessage(message){
    this.currentMessages.push(message);
  }

  //changes the character state to weaponPickup (the player can't move until it's decided whether the weapon will be picked up or discarded)
  weaponFoundDecision(weapon, character){
    character.itemPendingPickup = weapon;
    character.state = "weaponPickup";
  }




  //displays all the messages in the currentMessages list
  displayMessages(){
    for (let message = 0; message < this.currentMessages.length; message++){
      textSize(15);
      text(this.currentMessages[message], 0, this.y + 15*message);

    }
    
  }

}

//draws stats like player health etc
class Stats{
  constructor(){
    this.x = 650;

  }

  displayHealth(character){
    text("Health: " + character.health, 630, 50);
  }

  displayAttack(character){
    text("Attack: " + character.attack  + " (+ " + character.weaponAttack + ")", 630, 70);
  }

  displayWeapon(character){
    text("Weapon: " + character.weapon, 630, 90);
  }

  drawStats(){
    textSize(15);
    this.displayHealth(map1.entities[0]);
    this.displayAttack(map1.entities[0]);
    this.displayWeapon(map1.entities[0]);
  }
  
}



let map1;
let messages1;
let stats1;

//handles key presses and changes the move direction of the player and then passes the turn
function keyPressed(){

  if (map1.entities[0].state === "standard"){
    if (keyCode === RIGHT_ARROW){
      map1.entities[0].changeMoveDirection("right");
      map1.passTurn(messages1);
     
     
      
    }
    if (keyCode === LEFT_ARROW){
      map1.entities[0].changeMoveDirection("left");
      map1.passTurn(messages1);
      
    
      
    }
    if (keyCode === UP_ARROW){
      map1.entities[0].changeMoveDirection("up");
      map1.passTurn(messages1);
     
      
      
    }
    if (keyCode === DOWN_ARROW){
      map1.entities[0].changeMoveDirection("down");
      map1.passTurn(messages1);
     

    }

  }

  
  
}


//handles instances where the player must pick up or discard a weapon
function keyTyped(){
  if (map1.entities[0].state === "weaponPickup"){

    //if the player chooses to pick up the weapon
    if (key === 'y'){
      map1.entities[0].weapon = map1.entities[0].itemPendingPickup.name;
      map1.entities[0].weaponAttack = map1.entities[0].itemPendingPickup.power;
      map1.entities[0].currentTile = ".";
      map1.entities[0].itemPendingPickup.found = true;
      map1.entities[0].state = "standard";
      messages1.addCustomMessage("You picked up the " + map1.entities[0].itemPendingPickup.name + ".");

    }
    //if the weapon is discarded
    else if (key === 'n'){
      map1.entities[0].currentTile = ".";
      map1.entities[0].itemPendingPickup.found = true;
      map1.entities[0].state = "standard";
      messages1.addCustomMessage("You discarded the " + map1.entities[0].itemPendingPickup.name + ".");


    }
    else{
      messages1.addCustomMessage("Incorrect command.");

    }
  }
}





function setup() {
  createCanvas(windowWidth, windowHeight);
  map1 = new Map();
  messages1 = new Messages();
  stats1 = new Stats();
  map1.createEmptyMap(map1.mapSize);
  map1.placeSeedRoom(25, 25);
  
  map1.generateDungeon(10);
  map1.addEntities();
  map1.placeEntities();
}

function draw() {
  if (map1.entities[0].dead === false){
    background(0);
  map1.entities[0].killIfHealthZero();
  map1.placeEntities();
  map1.drawMap(map1.mapSize);
  map1.checkIfOnStair();
  map1.pickupItems();
  map1.killMonsters(messages1);
  messages1.displayMessages();
  stats1.drawStats();
  }


  

  

}
