window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
//  this.bestScoreKey     = "bestScore";
//  this.gameStateKey     = "gameState";
//  this.playersList      = "players";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function (player) {
  var stateJSON = this.storage.getItem(player);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (player, gameState) {
  this.storage.setItem(player, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function (player) {

  var stateJSON = this.storage.getItem(player);
  var state = JSON.parse(stateJSON);
  state.grid        = null;
  state.score       = 0;
  state.over        = false;
  state.won         = false;
  state.keepPlaying = false;
  state.gameUUID    = null;
  state.moveDirection = null;
  state.move        = 0;
  state.timestamp   = Date.now();
  stateJSON = JSON.stringify(state);
  this.storage.setItem(player, stateJSON);
};

LocalStorageManager.prototype.getPlayers = function () {
  var players = [];

  for(var key in this.storage) {
    var value = this.storage[key];
    var getType = {};    

    try {    
      var element = JSON.parse(this.storage.getItem(key));
      if(element.playerUUID && && element.playerUUID.substring(0,3) == 'v1_' && element.playerUUID.length == 26) {
        players.push(key);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return players;
}


LocalStorageManager.prototype.savePlayer = function(name, uuid) {
  
//  this.storage.setItem(name, uuid);
}
