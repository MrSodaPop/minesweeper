$(document).ready(function(){
  generateGameArea();
  $('.game-tile').hover(function(event){
      if (!!g.over || event.target.id === 'p') {
          return;
      }
      let x = parseInt($(event.target).attr('class').split(' ')[1]);
      let y = parseInt($(event.target).attr('class').split(' ')[2]);
      hover(x,y);
  });
  $('html').keypress(function(key){
      if (!!g.over) {
          return;
      }
      if (key.key === ' ') {
          flag();
      }
  });
  $('.game-tile').click(function(event){
      let x = parseInt($(event.target).attr('class').split(' ')[1]);
      let y = parseInt($(event.target).attr('class').split(' ')[2]);
      if (!!g.over || !!g.tiles[x][y].a) {
          return;
      }
      click(x,y);
  });
});

var hover = function(x,y) {
  if (!!!g.tiles[g.sTile.x][g.sTile.y].a) {
      if (!!!g.sTile.f) {
          $('#' + g.sTile.x + "-" + g.sTile.y).css('background-color','slategrey');
      }
      else {
          $('#' + g.sTile.x + "-" + g.sTile.y).css('background-color','red');
      }
  }
  g.sTile = {
      x: x,
      y: y,
      a: g.tiles[x][y].a,
      b: g.tiles[x][y].b,
      c: g.tiles[x][y].c,
      f: g.tiles[x][y].f
  }
  if (!!!g.sTile.a) {
      if (!!g.sTile.f) {
          $('#' + g.sTile.x + "-" + g.sTile.y).css('background-color','darkred');
      }
      else {
          $('#' + g.sTile.x + "-" + g.sTile.y).css('background-color','darkslategrey');
      }
  } 
}

var flag = function() {
  if (!!!g.sTile.a) {
      if (!!!g.sTile.f) {
          g.tiles[g.sTile.x][g.sTile.y].f = 1;
          $('#' + g.sTile.x + "-" + g.sTile.y).css('background-color','darkred');
          g.fC++;
      }
      else {
          g.tiles[g.sTile.x][g.sTile.y].f = 0;
          $('#' + g.sTile.x + "-" + g.sTile.y).css('background-color','darkslategrey');
          g.fC--;
      }
      if (g.fC === g.bC) {
          checkWin();
      }
  }
}

var checkWin = function() {
  for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
          if (!!!g.tiles[i][j].f && !!g.tiles[i][j].b) {
              return;
          }
      }
  }
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (!!!g.tiles[i][j].a && !!!g.tiles[i][j].b){
        $('#' + i + '-' + j).css('background-color', 'slateblue');
      }
      if (g.tiles[i][j] > 0 && !!!g.tiles[i][j].b) {
        $('#' + x + '-' + y).append("<p id=\'p\'>" + g.tiles[x][y].c + "</p>");
      }
    }
  }
  $('.instructions').html('<strong>You Win!</strong>');
  $('.instructions').css('font-size','4vw');
  $('#' + g.sTile.x + '-' + g.sTile.y).css('background-color','red');
  g.over = 1;
}

var click = function(x,y) {
  if (!!g.tiles[x][y].b) {
      endGame();
      return;
  }
  if (!!g.tiles[x][y].f) {
      g.fC--;
  }
  if (g.tiles[x][y].c > 0) {
      g.tiles[x][y].a = 1;
      $('#' + x + '-' + y).append("<p id=\'p\'>" + g.tiles[x][y].c + "</p>");
      $('#' + x + '-' + y).css('background-color','slateblue');
  }
  if (g.tiles[x][y].c === 0) {
      chain(x,y);
  }
}

var chain = function(x,y) {
  $('#' + x + '-' + y).css('background-color', 'slateblue');
  g.tiles[x][y].a = 1;
  search(false,x,y);
  search(true,x,y);
}

var search = function(zero, i, j) {
  if (!!!g.tiles[i][j].b) {
      let nums = [{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1}];
      for (let k = 0; k < 8; k++) {
          if (i+nums[k].x > -1 && j+nums[k].y > -1 && i+nums[k].x < 20 && j+nums[k].y < 20) {
              if (zero) {
                  if (!!!g.tiles[i+nums[k].x][j+nums[k].y].a && g.tiles[i+nums[k].x][j+nums[k].y].c === 0) {
                      chain(i+nums[k].x,j+nums[k].y);
                  }
              }
              else {
                  if (!!!g.tiles[i+nums[k].x][j+nums[k].y].a && g.tiles[i+nums[k].x][j+nums[k].y].c !== 0) {
                      let x = (i+nums[k].x);
                      let y = (j+nums[k].y);
                      g.tiles[x][y].a = 1;
                      $('#' + x + '-' + y).css('background-color','slateblue')
                      $('#' + x + '-' + y).append("<p id=\'p\'>" + g.tiles[x][y].c + "</p>");
                  }
              }
          }
      }
  }
}

var endGame = function() {
  g.over = 1;
  for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
          if (!!g.tiles[i][j].b) {
              $('#' + i + "-" + j).css('background-color','black');
              $('.instructions').html('You Lose!');
              $('.insturctions').css('font-size','4vw');
          }
      }
  }
}

var bombCount = function() {
  for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
          let c = 0;
          if (!!!g.tiles[i][j].b) {
              let nums = [{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1}];
              for (let k = 0; k < 8; k++) {
                  if (i+nums[k].x > -1 && j+nums[k].y > -1 && i+nums[k].x < 20 && j+nums[k].y < 20) {
                      if (!!g.tiles[i+nums[k].x][j+nums[k].y].b) {
                          c++;
                      }
                  }
              }
              g.tiles[i][j].c = c;
          }
      }
  }
}

var generateGameArea = function() {
  let tiles = [];
  for (let i = 0; i < 20; i++) {
      tiles[i] = [];
      for (let j = 0; j < 20; j++) {
          $('#game-area').append("<div class=\'game-tile " + i + " " + j + "\' id=\'" + i + "-" + j + "\'></div>");
          tiles[i][j] = {
              a: 0, //activated
              b: 0, //bomb tile
              c: 0, //surrounding bomb count
              f: 0 // flagged
          };
      }
  }
  generateGameData(tiles);
}

var generateGameData = function(tiles) {
  let bombTiles = 0;
  let bC = 60 //bomb count
  while (bombTiles < bC) {
      let x = Math.floor(Math.random() * 20);
      let y = Math.floor(Math.random() * 20);
      if (!!!tiles[x][y].b) {
          tiles[x][y].b = 1;
          bombTiles++;
      }
  }
  g = { // game
      tiles: tiles,
      sTile: { // selected tile
          x: 0,
          y: 0,
          a: 0,
          b: 0,
          c: 0,
          f: 0
      },
      over: 0,
      fC: 0,
      bC: bC
  }
  bombCount();
}

var g;