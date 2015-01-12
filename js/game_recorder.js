function GameRecorder() {    
          

  
}

GameRecorder.prototype.recordStartGame = function (gameState) {
  var guid = (function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return function() {
      return s4() + s4() + s4() + s4() + s4();
    };
  })();

  var token = guid();
  
  var JSONpretty = JSON.stringify(gameState, null, 2);
  this.log.innerHTML = "Started new game. Token: " + token + "\n"
                     + JSONpretty;
           
  return token;
};

GameRecorder.prototype.recordMove = function (gameState) {

  var JSONpretty = JSON.stringify(gameState, null, 2);
  this.log.innerHTML = "Game move\n"
                     + JSONpretty;

};
