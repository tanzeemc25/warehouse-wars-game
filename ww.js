// Stage -------------------------------------------------------------------------------------------------------------------------
function Stage(width, height,monsters, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player
	this.playTime = 0; // Seconds played
	this.pause = false; // Holds whether the game is paused or not

	// the logical width and height of the stage
	this.monsters = monsters;
	this.width=width;
	this.height=height;

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	
	// Create a table of blank images, give each image an ID so we can reference it later
	var s="<table id='ww' cellpadding='0' cellspacing='0'>";
			for(var y=0;y<this.height;y++){
				s+="<tr>";
				for(var x=0;x<this.width;x++){
					s=s + '<td><img src="' + this.blankImageSrc +'" id="' + this.getStageId(x,y) + '" /></td>';
				}
				s+="</tr>";
			}
			s+="</table>";

	// Put it in the stageElementID (innerHTML)
	document.getElementById("stage").innerHTML=s; 

	// Add the player to the center of the stage
	player = new Player(this, Math.round((this.width/2)-1), Math.round((this.height/2)-1));
	this.addPlayer(player);

	// Add walls around the outside of the stage, so actors can't leave the stage
	for(var y=0; y<this.height; y++) {
		for(var x=0; x < this.width; x++){
			if(y==0 || x==0 || y==this.height-1 || x==this.width-1){
				wall = new Wall(this, x, y);
				this.addActor(wall);
			}
		}
	}

	// Add some Boxes to the stage
	var i = 0
	while (i < Math.round( (this.height*this.width)*0.20) ) {
  		randx = this.getRandomInt(1, x-2);
  		randy = this.getRandomInt(1, y-2);
  		if (document.getElementById(this.getStageId(randx,randy)).src==this.blankImageSrc){
  			box = new Box(this, randx, randy);
  			this.addActor(box);
  			i++;
  		}
  	}

	// Add in some Smart Monsters
	var i = 0
	var maxmon =  Math.min( Math.round((this.height*this.width)*0.1), this.monsters);
	while (i < maxmon) {
  		randx = this.getRandomInt(1, x-2);
  		randy = this.getRandomInt(1, y-2);
  		if (document.getElementById(this.getStageId(randx,randy)).src==this.blankImageSrc){
  			monster = new Monster(this, randx, randy);
  			this.addActor(monster);
  			i++;
  		}
  	}

  	//Enable controls
  	this.controls(this.player, false);

}

// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){
	return "stage_"+x+"_"+y}

Stage.prototype.addPlayer=function(player){
	this.addActor(player);
	this.player=player;
}

Stage.prototype.removePlayer=function(){
	this.removeActor(this.player);
	this.player=null;	

}

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).

	var aid = this.actors.indexOf(actor);
	this.setImage(actor.x, actor.y, this.blankImageSrc);
	this.actors.splice(aid, 1);
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	document.getElementById(this.getStageId(x,y)).src=src;
}

// Take one step in the animation of the game.  
// Do this by asking each of the actors to take a single step. Each actor should
// have a step function.
Stage.prototype.step=function(){

	if (this.getNumMonster()==0){ 

		// Check if there is no monsters in the actors array, then game is won
	    // Execute animation for winning the game

		try{stage.controls(stage.player, true);}catch(err){}
  		snd.play();
  		msgBox.innerHTML = "YOU GOT THEM ALL! YOU WIN! <br />PUT THE VOLUME UP!";
		document.getElementById("btnPause").style.display="none";
		document.getElementById("btnResume").style.display="none";  		
  		var images = document.getElementsByTagName("img");
  		var boximages = [];

  			for(i=0; i<images.length; i++){
  				if(images[i].src == this.boxImageSrc && images[i].id != "boxImage"){
  					boximages.push(images[i]);
  				}
  			}  		
		boximages[0].className = "shake";
		//document.getElementById("playerImage").className = "shake";  			
  		var bshake = setTimeout(function(){
  			for(i=1; i<boximages.length; i++){
  				if(boximages[i].className !== "shake"){
  					boximages[i].className = "shake";	
  				}		
  			} 
  		},16000)

	} else if (this.player == null ){ 

		// Check if this.player is null, then user lost game
		// Execute animation for losing the game

		try{stage.controls(stage.player, true);}catch(err){}
  		snd.play();
  		msgBox.innerHTML = "A MONSTER ATE YOU, YOU LOSE! <br />PUT THE VOLUME UP!";  
		document.getElementById("btnPause").style.display="none";
		document.getElementById("btnResume").style.display="none";   				
  		var images = document.getElementsByTagName("img");
  		var monimages = [];

  			for(i=0; i<images.length; i++){
  				if(images[i].src == this.monsterImageSrc && images[i].id != "monsterImage"){
  					monimages.push(images[i]);
  				}
  			} 
		
		monimages[0].className = "shake";
		//document.getElementById("monsterImage").className = "shake";  			
  		var mshake = setTimeout(function(){
  			for(i=1; i<monimages.length; i++){
  				if(monimages[i].className != "shake"){
  					monimages[i].className = "shake";	
  				}		
  			} 
  		},16000)
  		
	} else if (this.pause == false){

		// If the game is not paused, cal lall actors' step

		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
		this.playTime++;
		timeLabel.value = this.playTime;
	} 
}

// return the first actor at coordinates (x,y) return null if there is no such actor
Stage.prototype.getActor=function(x, y){
	var found = null;
	for(i = 0; i < this.actors.length; i++ ){
		if(this.actors[i].x == x && this.actors[i].y == y){
			found = this.actors[i];
		}
	}
	return found;
}

// get the number monsters in the actors array
Stage.prototype.getNumMonster=function(){
	var numMon = 0
	for (var i=0; i < this.actors.length; i++){
		if (this.actors[i] instanceof Monster){
			numMon++;
		}
	}
	console.log(numMon);
	return numMon;
}

// Return a random number between the range of a min and max
Stage.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Setup controls for using the arrows on the page, or numpad
// If game is paused, won or lost, deactivate the controls
Stage.prototype.controls=function(player, inactive){

	if(inactive == true) {
		document.onkeydown = null;
		document.getElementById("nw").onclick = null;
		document.getElementById("n").onclick = null;
		document.getElementById("ne").onclick = null;
		document.getElementById("w").onclick = null;
		document.getElementById("e").onclick = null;
		document.getElementById("sw").onclick = null;
		document.getElementById("s").onclick = null;
		document.getElementById("se").onclick = null;
		return;
	}
	else {
		document.onkeydown = function(event) {
			var kc = event.keyCode;
			if (kc == 103) {
				try{player.move(player, -1, -1);}catch(err){}
	 		} else if (kc == 104) {
	 			try{player.move(player, 0, -1);}catch(err){}
	 		} else if (kc == 105) {
	 			try{player.move(player, 1, -1);}catch(err){}
	 		} else if (kc == 100 ) {
	 			try{player.move(player, -1, 0);}catch(err){}
	 		} else if (kc == 102) {
	 			try{player.move(player, 1, 0);}catch(err){}
	 		} else if (kc == 97) {
	 			try{player.move(player, -1, 1);}catch(err){}
	 		} else if (kc == 98) {
	 			try{player.move(player, 0, 1);}catch(err){}
	 		} else if (kc == 99) {
	 			try{player.move(player, 1, 1);}catch(err){}
	 		}
		};
		document.getElementById("nw").onclick = function(){
			try{player.move(player, -1, -1)}catch(err){}
		};
		document.getElementById("n").onclick = function(){
			try{player.move(player, 0, -1)}catch(err){}
		};
		document.getElementById("ne").onclick = function(){
			try{player.move(player, 1, -1)}catch(err){}
		};	
		document.getElementById("w").onclick = function(){
			try{player.move(player, -1, 0)}catch(err){}
		};	
		document.getElementById("e").onclick = function(){
			try{player.move(player, 1, 0)}catch(err){}
		};	
		document.getElementById("sw").onclick = function(){
			try{player.move(player, -1, 1)}catch(err){}
		};	
		document.getElementById("s").onclick = function(){
			try{player.move(player, 0, 1)}catch(err){}
		};	
		document.getElementById("se").onclick = function(){
			try{player.move(player, 1, 1)}catch(err){}
		};			
	}
}
// End Class Stage ----------------------------------------------------------------------------------------------------------------

// Class Player -------------------------------------------------------------------------------------------------------------------
function Player(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.playerImageSrc);
}

// What we do at each tick of the clock
Player.prototype.step=function(){ return; }

/* other asked this to move. In this case, move if possible, return whether I moved.
if there is a space available go to it, otherwise, we may need to ask a neighbour 
to move to get our work done. */
Player.prototype.move=function(other, dx, dy){

	// Where we are supposed to move. 
	var newx=this.x+dx;
	var newy=this.y+dy;

	/* Determine if another Actor is occupying (newx, newy). If so,
	this asks them to move. If they moved, then we can occupy the spot. Otherwise
	we can't move. We return true if we moved and false otherwise. */
	if (other instanceof Monster) {
		this.stage.removePlayer();
		return true;
	} else {
		adjacent = this.stage.getActor(newx,newy);
		if(adjacent instanceof Monster){
			this.stage.removePlayer();
			return false;
		}
		else if(adjacent == null || adjacent.move(this , dx, dy)){	
			this.stage.removeActor(this);
			this.x = newx;
			this.y = newy;
			this.stage.addActor(this);
			this.stage.setImage(this.x, this.y, this.stage.playerImageSrc);
			return true;
		} else {
			return false;
		}
	}
	// We move both logically, and on the screen (change the images in the table)
}
// End Class Player ---------------------------------------------------------------------------------------------------------------

// Class Wall (COMPLETE AS IS!) ---------------------------------------------------------------------------------------------------
function Wall(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.wallImageSrc);
}

// What we do at each tick of the clock
Wall.prototype.step=function(){ return; }

// No one can push me around!
Wall.prototype.move=function(other, dx, dy){
	return false;
}
// End Class Wall -----------------------------------------------------------------------------------------------------------------

// Class Box ----------------------------------------------------------------------------------------------------------------------
function Box(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.boxImageSrc);
}

// What we do at each tick of the clock
Box.prototype.step=function(){ return; }

// If the Player or another Box asked us to me, we try. 
// return true if we moved, false otherwise.
Box.prototype.move=function(other, dx, dy){
	// See http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class

// execute code if other is only a player or another box

	// Where we are supposed to move. 
	var newx=this.x+dx;
	var newy=this.y+dy;

	/* Determine if another Actor is occupying (newx, newy). If so,
	this asks them to move. If they moved, then we can occupy the spot. Otherwise
	we can't move. We return true if we moved and false otherwise. */

	adjacent = this.stage.getActor(newx,newy);
	if( (other instanceof Player || other instanceof Box) && (adjacent == null || adjacent.move(this, dx, dy)) ){	
		this.stage.removeActor(this);
		this.x = newx;
		this.y = newy;
		this.stage.addActor(this);
		this.stage.setImage(this.x, this.y, this.stage.boxImageSrc);
		return true;
	} else {
		return false;
	}
}
// End Class Box ------------------------------------------------------------------------------------------------------------------

// Class Monster ------------------------------------------------------------------------------------------------------------------
function Monster(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.dx=-1;
	this.dy=-1;

	// Combining xmoves and ymoves gives us [ NW, N, NE, W, E, SW, S, SE ]
	// For regular monsters, choose a random index, to move.
	// For smart monsters, we will check first if the index points to a 
	//   movable direction, if not, rerandomize the index until it does.
	this.xmoves = [-1, 0, 1, -1, 1, -1, 0, 1];
	this.ymoves = [-1, -1, -1, 0, 0, 1, 1, 1];
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.monsterImageSrc);
}

// What we do at each tick of the clock
Monster.prototype.step=function(){

	// we may be dead, so we had better check if we should be removed from the stage
	// otherwise we should move
	if (this.is_dead()==true){
		this.stage.removeActor(this);
	} else {
		// Randomize a direction. If there is an object in that direction, rerandomize another
		// direction to move. Do this until the direction found has no barriers. This way,
		// the monster determines an empty direction to move. (Smart monster) 
		var moveable = false;
		while (moveable == false){
			var randMove = this.stage.getRandomInt(0, 7);
			direction = this.stage.getActor(this.x + this.xmoves[randMove], this.y + this.ymoves[randMove]);
			if (!(direction instanceof Box || direction instanceof Wall || direction instanceof Monster)){
				this.move(this, this.xmoves[randMove], this.ymoves[randMove]);
				moveable = true;
			}
		}		
	}
}

// Move the way we wish to move. no one can push a monster around.
// return true if we moved, false otherwise
Monster.prototype.move=function(other, dx, dy){
	if(!(other===this))return false;
	var newx=this.x+dx;
	var newy=this.y+dy;

	adjacent = this.stage.getActor(newx,newy);
	if(adjacent == null || adjacent.move(this, dx, dy)){	
		this.stage.removeActor(this);
		this.x = newx;
		this.y = newy;
		this.stage.addActor(this);
		this.stage.setImage(this.x, this.y, this.stage.monsterImageSrc);
		return true;
	} else {
		return false;
	}
}

// Return whether this is dead, that is, completely urrounded by non-player actors.
Monster.prototype.is_dead=function(){

	// Get the 8 actors or null squares surrounding the monster and using xmoves and ymoves.
	// Check whether the surrounding element is a box/wall/another monster (true), or something else (false).
	// Count the total number of surrounding boxes/walls found.
	var numSurroundElement = 0;
	var i = 0;
	while (i<this.xmoves.length){
		direction = this.stage.getActor(this.x + this.xmoves[i], this.y + this.ymoves[i]);
		if (direction instanceof Box || direction instanceof Wall || direction instanceof Monster){
			numSurroundElement += 1;
		}
		i++;
	}

	// If numSurroundElement is 8, all surround elements are box/wall/another monster, and monster dies, else monster is alive. 
	if (numSurroundElement==8){
		return true;
	} else {
		return false;
	}
}
// End Class Monster ----------------------------------------------------------------------------------------------------------------

