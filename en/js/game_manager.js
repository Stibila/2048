function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
//  this.ajaxManager    = new AjaxManager;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

GameManager.prototype.hideEverything = function () {
  popdown();
  elements = [this.divOverlay, this.divPlayerSelector, this.divPlayerCreator, this.divPlayerList, this.divWait];

  elements.forEach(function(div)
  {
    if(div != null)
    {
      div.parentNode.removeChild(div);
      div = null;
    }
  })

  this.divOverlay = null;
  this.divPlayerCreator = null;
  this.divPlayerSelector = null;
  this.divPlayerList = null;
  this.divWait = null;
}

//Zobrazi overlay (prekryje stranku sedou farbou)
GameManager.prototype.showOverlay = function () {
  this.divOverlay = document.createElement('div');
  document.body.insertBefore(this.divOverlay, document.body.firstChild);
  this.divOverlay.style.background = 'rgba(0,0,0,0.7)';
  this.divOverlay.style.position = 'fixed';
  this.divOverlay.style.zIndex = '100';
  this.divOverlay.style.top = '0';
  this.divOverlay.style.bottom = '0';
  this.divOverlay.style.left = '0';
  this.divOverlay.style.right = '0';
  this.divOverlay.name = "overlay";
  this.divOverlay.id = 'overlay';
  while (this.divOverlay.firstChild) {
    this.divOverlay.removeChild(this.divOverlay.firstChild);
  }
}

GameManager.prototype.showWaiting = function (message) {
  this.hideEverything();
  this.showOverlay();
  this.divWait = document.createElement('div');
  document.body.insertBefore(this.divWait, document.body.firstChild);
  this.divWait.style.background = 'rgba(0,0,0,0.8)';
  this.divWait.style.borderRadius = '20px';
  this.divWait.style.position = 'absolute';
  this.divWait.style.marginLeft = 'auto';
  this.divWait.style.marginRight = 'auto';
  this.divWait.style.paddingTop = '10px';
  this.divWait.style.paddingBottom = '10px';
  this.divWait.style.zIndex = '101';
  this.divWait.style.top = '250px';
  this.divWait.style.left = '0';
  this.divWait.style.right = '0';
  this.divWait.style.width = '500px';
  this.divWait.style.textAlign = 'center';
  this.divWait.name = "Wait";
  this.divWait.id = 'Wait';
  this.divWait.innerHTML = message;
}

//Zobrazi menu vyberania hraca
GameManager.prototype.showPlayerSelector = function (playerList) {
  this.hideEverything();
  this.showOverlay();

  this.divPlayerSelector = document.createElement('div');
  document.body.insertBefore(this.divPlayerSelector, document.body.firstChild);
  this.divPlayerSelector.style.background = 'rgba(0,0,0,0.8)';
  this.divPlayerSelector.style.borderRadius = '50px';
  this.divPlayerSelector.style.position = 'absolute';
  this.divPlayerSelector.style.marginLeft = 'auto';
  this.divPlayerSelector.style.marginRight = 'auto';
  this.divPlayerSelector.style.paddingTop = '50px';
  this.divPlayerSelector.style.paddingBottom = '100px';
  this.divPlayerSelector.style.zIndex = '101';
  this.divPlayerSelector.style.top = '50px';
  this.divPlayerSelector.style.left = '0';
  this.divPlayerSelector.style.right = '0';

  this.divPlayerSelector.style.maxWidth = '500px';
  this.divPlayerSelector.style.textAlign = 'center';
  this.divPlayerSelector.name = "SelectPlayer";
  this.divPlayerSelector.id = 'SelectPlayer';

  this.p0 = document.createElement('p');
  this.p1 = document.createElement('p');

  this.p0.innerHTML = '<a href="../sk/">Slovak language / Slovenský jazyk</a>';
  this.p1.innerHTML = 'This allow multiple players from same computer. Please, create only one player for a person.';

  this.divPlayerSelector.appendChild(this.p0);
  this.divPlayerSelector.appendChild(this.p1);

  var that = this;
  playerList.forEach(function (player) {
    var divPlayer = document.createElement('div');
    divPlayer.style.borderStyle = 'solid';
    divPlayer.style.borderRadius = '10px';
    divPlayer.style.borderColor = 'rgb(48,48,48)';
    divPlayer.style.marginBottom = '5px';
    divPlayer.style.width = '60%';
    divPlayer.style.display = 'inline-block';
    divPlayer.style.fontSize = '200%';
    divPlayer.style.background = 'rgba(0,0,0,0.8)';
    divPlayer.style.color = 'white';
    divPlayer.addEventListener('mouseover', function() {divPlayer.style.background = 'silver'; divPlayer.style.color = 'black'}, false);
    divPlayer.addEventListener('mouseout', function() {divPlayer.style.background = 'black'; divPlayer.style.color = 'white'}, false);
    divPlayer.addEventListener('click', function() {that.player = player; that.setup()} ,false);
    divPlayer.innerHTML = (player == "") ? "Unnamed Player" : player;
    that.divPlayerSelector.appendChild(divPlayer);
  });

  var divAddPlayer = document.createElement('div');
  divAddPlayer.style.borderStyle = 'solid';
  divAddPlayer.style.borderRadius = '10px';
  divAddPlayer.style.borderColor = 'rgb(48,128,48)';
  divAddPlayer.style.marginBottom = '5px';
  divAddPlayer.style.width = '60%';
  divAddPlayer.style.display = 'inline-block';
  divAddPlayer.style.fontSize = '200%';
  divAddPlayer.style.background = 'rgb(32,128,32)';
  divAddPlayer.style.color = 'black';
  divAddPlayer.addEventListener('mouseover', function() {divAddPlayer.style.background = 'rgb(32,192,32)'; divAddPlayer.style.color = 'white'}, false);
  divAddPlayer.addEventListener('mouseout', function() {divAddPlayer.style.background = 'rgb(32,128,32)'; divAddPlayer.style.color = 'black'}, false);
  divAddPlayer.addEventListener('click', function() {that.showPlayerCreator()} ,false);
  divAddPlayer.innerHTML = 'New Player';
  that.divPlayerSelector.appendChild(divAddPlayer);


}

//Zobrazi menu vytvorenia noveho hraca!
GameManager.prototype.showPlayerCreator = function () {
  this.hideEverything();
  this.showOverlay();
  this.divPlayerCreator = document.createElement('div');
  document.body.insertBefore(this.divPlayerCreator, document.body.firstChild);
  this.divPlayerCreator.style.background = 'rgba(0,0,0,0.8)';
  this.divPlayerCreator.style.borderRadius = '50px';
  this.divPlayerCreator.style.position = 'absolute';
  this.divPlayerCreator.style.marginLeft = 'auto';
  this.divPlayerCreator.style.marginRight = 'auto';
  this.divPlayerCreator.style.paddingTop = '20px';
  this.divPlayerCreator.style.paddingBottom = '50px';
  this.divPlayerCreator.style.zIndex = '101';
  this.divPlayerCreator.style.top = '50px';
  this.divPlayerCreator.style.left = '0';
  this.divPlayerCreator.style.right = '0';
  this.divPlayerCreator.style.color = 'rgb(224,224,224)';

  this.divPlayerCreator.style.maxWidth = '500px';
  this.divPlayerCreator.style.textAlign = 'center';
  this.divPlayerCreator.name = "CreatePlayer";
  this.divPlayerCreator.id = 'CreatePlayer';

  var ageOptions = '';
//  var def = '';
  var year = new Date().getFullYear();
  for(i = year - 100; i < year; i++)
  {
    if(i == year - 20) var sel = ' selected="selected"';
    else var sel = '';
    ageOptions += '<option '+sel+' value="'+i+'">'+i+'</option>'
  }

  this.form = document.createElement("form");
//  this.form.onSubmit = "alert('Teraz sa tento formular odosle asynchronne na server a spusti sa nova hra.'); this.hideEverything(); return false;"
  this.form.addEventListener('submit', this.submitPlayer, false);
  this.form.action = "/server/";

  this.submit = document.createElement("button");

  this.submit.style.borderStyle = 'solid';
  this.submit.style.borderRadius = '10px';
  this.submit.style.borderColor = 'rgb(48,128,48)';
  this.submit.style.marginBottom = '5px';
  this.submit.style.width = '60%';
  this.submit.style.display = 'inline-block';
  this.submit.style.fontSize = '200%';
  this.submit.style.background = 'rgb(32,128,32)';
  this.submit.style.color = 'black';
  this.submit.addEventListener('mouseover', function() {gm.submit.style.background = 'rgb(32,192,32)'; gm.submit.style.color = 'white'}, false);
  this.submit.addEventListener('mouseout', function() {gm.submit.style.background = 'rgb(32,128,32)'; gm.submit.style.color = 'black'}, false);
  this.submit.innerHTML = 'Start Game';

  this.p0 = document.createElement("p");
  this.p1 = document.createElement("p");
  this.p2 = document.createElement("p");
  this.p3 = document.createElement("p");
  this.p4 = document.createElement("p");
  this.p5 = document.createElement("p");
  this.p6 = document.createElement("p");

  this.p0.style.margin = '20px';
  this.p0.style.color = 'rgb(192,192,192)';

  this.p1.addEventListener('mouseover', function() {popup('Your name is stored locally on your computer. It will not be sent to our servers');}, false);
  this.p1.addEventListener('mouseout', function() {popdown();}, false);
  this.p2.addEventListener('mouseover', function() {popup('Your age will be recorded for statistic purpose.');}, false);
  this.p2.addEventListener('mouseout', function() {popdown();}, false);
  this.p3.addEventListener('mouseover', function() {popup('Your gender will be recorded for statistic purpose.');}, false);
  this.p3.addEventListener('mouseout', function() {popdown();}, false);
  this.p4.addEventListener('mouseover', function() {popup('How much time you spend playing video games weekly?');}, false);
  this.p4.addEventListener('mouseout', function() {popdown();}, false);
  this.p5.addEventListener('mouseover', function() {popup('Please, select game genres, that you play the most.');}, false);
  this.p5.addEventListener('mouseout', function() {popdown();}, false);
  this.p6.addEventListener('mouseover', function() {popup('How many experience do you have with the 2048 game?');}, false);
  this.p6.addEventListener('mouseout', function() {popdown();}, false);

  this.p0.innerHTML = '<a href="../sk/">Slovak language / Slovenský jazyk</a><br />This version of 2048 game was created for the purpose of my Bachelor thesis. Your gameplay will be recorded and analyze. Please, before you start, tell us something about You:';
  this.p1.innerHTML = '<b>Your name:</b><br /><input type="text" name="name" placeholder="Your Name" />';
  this.p2.innerHTML = '<b>Your birth year:</b><br /><select name="birth">'+ageOptions+'</select>';
  this.p3.innerHTML = '<b>Gender:</b><br /><select name="gender"> <option value="m">Male</option> <option value="f">Female</option> </select>';
  this.p4.innerHTML = '<b>How much time you spend playing videogames weekly:</b><br /><select name="weekly">' + 
                          '<option value="0">I don\'t play games</option>' +
                          '<option value="1">Less than 2 hours</option>' +
                          '<option value="2">Between 2-10 hours</option>' +
                          '<option value="3">Between 10-20 hours</option>' +
                          '<option value="4">Between 20-40 hours</option>' +
                          '<option value="5">More than 40 hours</option> </select>';
  //4 kolko casu travia hranim
  //5ake hry hraju
	  this.p5.innerHTML = '<b>Select your favorite genres:</b><br />' +
                          '<table style="margin-left:auto; margin-right:auto; text-align:left;">' +
                          '<tr><td><label><input type="checkbox" name="g0" value="1">Action</label></td>' +
                          '<td>    <label><input type="checkbox" name="g1" value="1">Shooters</label></td></tr>' +
                          '<tr><td><label><input type="checkbox" name="g2" value="1">Adventure</label></td>' +
                          '<td>    <label><input type="checkbox" name="g3" value="1">Role-playing (RPG)</label></td></tr>' +
                          '<tr><td><label><input type="checkbox" name="g4" value="1">Simulations</label></td>' +
                          '<td>    <label><input type="checkbox" name="g5" value="1">Strategy</label></td></tr>' +
                          '<tr><td><label><input type="checkbox" name="g6" value="1">Sports</label></td>' +
                          '<td>    <label><input type="checkbox" name="g7" value="1">Logical</label></td></tr>' +
                          '</table>';

  this.p6.innerHTML = '<b>Your experience with 2048 game:</b><br /><select name="experience">' +
                          '<option value="0">[0] I Never hear of it before.</option>' +
                          '<option value="1">[1] I know it, but never played it.</option>' +
                          '<option value="2">[2] I never made it to 2048.</option>' +
                          '<option value="3">[3] I reached 2048 few times.</option>' +
                          '<option value="4">[4] I made it up to 4096 or 8192.</option> </select>';
//  this.p3.innerHTML = '<b>Your experience with 2048:</b><br /><select name="experience"> <option value="0">0</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> </select>';
 
  this.divPlayerCreator.appendChild(this.form);
  this.form.appendChild(this.p0);
  this.form.appendChild(this.p1);
  this.form.appendChild(this.p2);
  this.form.appendChild(this.p3);
  this.form.appendChild(this.p4);
  this.form.appendChild(this.p5);
  this.form.appendChild(this.p6);
  this.form.appendChild(this.submit);
} 

GameManager.prototype.submitPlayer = function (e) {
  e.preventDefault(); 
  e.stopPropagation();

  gm.showWaiting("Wait a second, creating  new player");
  
  var exp = gm.form.elements['experience'].value;
  var birth = gm.form.elements['birth'].value;
  var gender = gm.form.elements['gender'].value;
  var weekly = gm.form.elements['weekly'].value;

  var genres = {
    'action':          gm.form.elements['g0'].checked,
    'shooter':         gm.form.elements['g1'].checked,
    'adventure':       gm.form.elements['g2'].checked,
    'rpg':             gm.form.elements['g3'].checked,
    'simulation':      gm.form.elements['g4'].checked,
    'strategy':        gm.form.elements['g5'].checked,
    'sport':           gm.form.elements['g6'].checked,
    'logical':         gm.form.elements['g7'].checked
  };
 
  var ajaxManager = new AjaxManager;
  ajaxManager.newPlayer(exp, birth, gender, weekly, genres);
  gm.player = gm.form.elements['name'].value;
}

GameManager.prototype.getPlayerUUID = function (uuid) {
  gm.playerUUID = uuid;
  gm.hideEverything();
  gm.storageManager.setGameState(gm.player, gm.serialize());
  gm.setup();
}

GameManager.prototype.selectPlayer = function () {
  //tu sa zobrazi vyber hraca
  var players = this.storageManager.getPlayers();
  if(players == null || players.length < 1)
  {
    //show player creator page:
    this.showPlayerCreator();
  }
  else
  {
    this.showPlayerSelector(players);
  }
/*
  else if (players.length == 1)
  {
    //players obsahuje len jedneho hraca, okamzite ho pouzijeme
alert('Defaultne pouzity hrac: ' + players[0] + '\nZatial chyba podpora viacerych hracov.');
    this.player = players[0];
    this.setup();
  }
  else
  {
    //players obsahuje viacero hracov, zobrazime moznost vyberu z nich
alert('Defaultne pouzity hrac: ' + players[0] + '\nZatial chyba podpora viacerych hracov.');
    this.player = players[0];
    this.setup();
  }
/**/
}


// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState(this.player);
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  this.hideEverything();

  if(this.player == null) {
    this.selectPlayer();
    return;
  }

  //ak uz je listener zadefinovany, znovu ho nenastavujeme
  if(!this.listenerIsSet) {
    this.inputManager.listen();
    this.listenerIsSet = true;
  }

  var previousState = this.storageManager.getGameState(this.player);

  // Reload the game from a previous game if present
  if(previousState) {
    this.score       = ((previousState.score) ? previousState.score : 0); 
    this.bestScore   = ((previousState.bestScore) ? previousState.bestScore : 0); 
    this.over        = ((previousState.over) ? previousState.over : false);
    this.won         = ((previousState.won) ? previousState.won : false);
    this.keepPlaying = ((previousState.keepPlaying) ? previousState.keepPlaying : false)
    this.playerUUID  = ((previousState.playerUUID) ? previousState.playerUUID : null);
    this.gameUUID    = ((previousState.gameUUID) ? previousState.gameUUID : null);
    this.moveDirection = ((previousState.moveDirection) ? previousState.moveDirection : null);
    this.move        = ((previousState.move) ? previousState.move : 0);
    this.timestamp   = ((previousState.timestamp) ? previousState.timestamp : Date.now());
  }
  else {
    this.score       = 0;
    this.bestScore   = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.moveDirection = null;
    this.move = 0;
    this.timestamp   = Date.now();
  }
  if(previousState && previousState.grid) {
    this.grid        = new Grid(previousState.grid.size, previousState.grid.cells);
    this.fromMove    = '';
    // Update the actuator
    this.actuate(); 
  }
  else {
    gm.showWaiting("Wait a second, creating  new game");
    ajaxManager = new AjaxManager();
    ajaxManager.newGame(this.playerUUID);
  }
};

GameManager.prototype.getGameUUID = function(uuid) {
  this.gameUUID = uuid;
  this.hideEverything();
  this.grid        = new Grid(this.size);
  this.addStartTiles();

  // Update the actuator
  this.actuate(); 
}

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  ajaxManager = new AjaxManager();
  ajaxManager.newMove(this.serialize());


  if (!this.bestScore || this.bestScore < this.score) {
    this.bestScore = this.score;
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState(this.player);
  } else {
    this.storageManager.setGameState(this.player, this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.bestScore,
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        ((this.grid) ? this.grid.serialize() : null),
    score:       this.score,
    bestScore:   this.bestScore,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying,
    playerUUID:  this.playerUUID,
    gameUUID:    this.gameUUID,
    moveDirection: this.moveDirection,
    move:        this.move,
    timestamp:   this.timestamp
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  //pri kazdom pohybe si zapiseme smer ktorym sa hybeme.
  var moves = ['U','R','D','L'];
  this.moveDirection = moves[direction];
  this.move++;
  this.timestamp = Date.now();

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;
  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
