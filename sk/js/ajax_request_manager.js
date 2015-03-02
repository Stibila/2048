function AjaxManager() {
  this.timeout = 5000;
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
  var that = this;
  this.request.onreadystatechange = function(){
    if (that.request.readyState == 4)
    {
      if (that.request.status==200 || window.location.href.indexOf("http")==-1)
      {
        that.playerCreated = true;
        gm.getPlayerUUID(that.request.responseText);
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
                that.request.abort();
                if(!that.playerCreated) {
                  alert("An error has occured making the request to create player. Try to refresh browser (F5)");
                  gm.getPlayerUUID(null);   
                }
    }, this.timeout);
}

AjaxManager.prototype.newGame = function (playerUUID) {
  this.gameCreated = false;
  var that = this;
  this.request.onreadystatechange = function() {
    if (that.request.readyState == 4)
    {
      if (that.request.status==200 || window.location.href.indexOf("http")==-1)
      {
        that.gameCreated = true;
        gm.getGameUUID(that.request.responseText);
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
                that.request.abort();
                if(!that.gameCreated) {
                  alert("An error has occured making the request to create game. Try to refresh browser (F5)");
                  gm.getGameUUID(null);
                }
    }, this.timeout);
}

AjaxManager.prototype.newMove = function (gameState) {
  var gameStateJSON = JSON.stringify(gameState);
  this.moveRecorded = false;
  this.tries = 0;

  this.moveCreated = false;
  var that = this;

  this.request.onreadystatechange = function() {
    if (that.request.readyState == 4)
    {
      if (that.request.status==200 || window.location.href.indexOf("http")==-1)
      {
        that.moveRecorded = true;
      }
      else{
      }
    }
  }

  this.request.open("GET", "/server/?new=move&game="+encodeURIComponent(gameStateJSON), true);
  this.request.send();

  (function retry() {
    setTimeout(function() {
      that.request.abort();
      if(!that.moveRecorded && that.tries < 10) {
        that.request.open("GET", "/server/?new=move&game="+encodeURIComponent(gameStateJSON), true);
        that.request.send();
        that.tries ++;
        retry();
      }
    }, that.timeout);
  })();
}
