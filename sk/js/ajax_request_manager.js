function AjaxManager() {
  this.timeout = 5000;
  this.moveTimeout = 1000;
  this.movesQueue = [];
  this.ajaxInProgress = false;

  this.request = new XMLHttpRequest();
  try
  {
    this.request = new XMLHttpRequest();
  }
  catch(e)
  {
    try
    {
        this.request = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
      try
      {
        this.request = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e)
      {
        return false;
      }
    }
  }
}

AjaxManager.prototype.newPlayer = function (exp, birth, gender, weekly, genres) {
  var genresJSON = JSON.stringify(genres);
  this.playerCreated = false;
  var thatAjax = this;
  this.request.onreadystatechange = function(){
    if (thatAjax.request.readyState == 4)
    {
      if (thatAjax.request.status==200 || window.location.href.indexOf("http")==-1)
      {
        thatAjax.playerCreated = true;
        gm.getPlayerUUID(thatAjax.request.responseText);
      }
      else{
        alert("An error has occured making the request to create player. Try to refresh browser (F5)");
        gm.getPlayerUUID(null);
      }
    }
  }
  this.request.open("GET", "/server/?new=player&experience="+exp+"&birth_year="+birth+"&gender="+gender+"&weekly="+weekly+"&genres="+encodeURIComponent(genresJSON), true);
  this.request.send();

  setTimeout(function() {
                thatAjax.request.abort();
                if(!thatAjax.playerCreated) {
                  alert("An error has occured making the request to create player. Try to refresh browser (F5)");
                  gm.getPlayerUUID(null);   
                }
    }, this.timeout);
}

AjaxManager.prototype.newGame = function (playerUUID) {
  this.gameCreated = false;
  var thatAjax = this;
  this.request.onreadystatechange = function() {
    if (thatAjax.request.readyState == 4)
    {
      if (thatAjax.request.status==200 || window.location.href.indexOf("http")==-1)
      {
        thatAjax.gameCreated = true;
        gm.getGameUUID(thatAjax.request.responseText);
      }
      else{
        alert("An error has occured making the request to create game. Try to refresh browser (F5)");
        gm.getPlayerUUID(null);
      }
    }
  }

  this.request.open("GET", "/server/?new=game&player="+playerUUID, true);
  this.request.send();
  setTimeout(function() {
                thatAjax.request.abort();
                if(!thatAjax.gameCreated) {
                  alert("An error has occured making the request to create game. Try to refresh browser (F5)");
                  gm.getGameUUID(null);
                }
    }, this.timeout);
}


AjaxManager.prototype.startSendingMoves = function () {
  this.ajaxInProgress = true;
  var thatAjax = this;
  this.movesRecorded = false;

  var sending = this.movesQueue;
  this.movesQueue = [];

  if(sending.length > 0) {
    var gameStateArray = JSON.stringify(sending);

    this.request.onreadystatechange = function() {
      if (thatAjax.request.readyState == 4)
      {
        if (thatAjax.request.status==200 || window.location.href.indexOf("http")==-1)
        {
          thatAjax.movesRecorded = true;
          clearInterval(thatAjax.retry);
          thatAjax.startSendingMoves()
        }
      }
    }

    this.request.open("POST", "/server/?new=moves", true);
    this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.request.send("gameMoves="+encodeURIComponent(gameStateArray));

    this.retry = setInterval(function() {
      thatAjax.request.abort();
      if(!thatAjax.moveRecorded) {
        thatAjax.request.open("POST", "/server/?new=moves", true);
        thatAjax.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        thatAjax.request.send("gameMoves="+encodeURIComponent(gameStateArray));
      }
    }, thatAjax.moveTimeout);
  }
  else {
    setTimeout(function() {
        thatAjax.startSendingMoves();
      }
    , this.moveTimeout);
  }
}

AjaxManager.prototype.newMove = function (gameState) {
  this.movesQueue.push(gameState);
  if(!this.ajaxInProgress) {
    this.startSendingMoves();
  }
}
