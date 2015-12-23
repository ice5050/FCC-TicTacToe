var game = {
  player: 'O',
  ai: 'X',
  table: [null, null, null, null, null, null, null, null, null],
  turn: 1,
  win: null
};

var TABLE_MAP = {
  'top-left': 0,
  'top-mid': 1,
  'top-right': 2,
  'mid-left': 3,
  'mid-mid': 4,
  'mid-right': 5,
  'bot-left': 6,
  'bot-mid': 7,
  'bot-right': 8
};

var TABLE_MAP_BACK = [
  'top-left',
  'top-mid',
  'top-right',
  'mid-left',
  'mid-mid',
  'mid-right',
  'bot-left',
  'bot-mid',
  'bot-right'
];

$(document).ready(function() {
  $('.table').on('click', '.cell', function(e) {
    var $cell = $(e.currentTarget),
        position = $cell.data('pos');
    if (game.table[TABLE_MAP[position]] || !!game.win) {
      return;
    }
    playerPlay(position);
  });

  $('.control').on('click', 'a', function(e) {
    var $player = $(e.currentTarget);
    $('.control a').removeClass('active');
    $player.addClass('active');
    resetGame($player.data('player'));
  });
});

function playerPlay(position) {
  game.table[TABLE_MAP[position]] = game.player;
  $('.table .' + position).html(game.player);
  game.turn += 1;
  check();
}

function check() {
  var winner = isThereWin();
  if (winner) {
    game.win = winner;
    $('.winner p').html('Winner : ' + winner);
    $('.winner').removeClass('hide');
  }else if (game.turn > 9) {
    game.win = 'tie';
  }else {
    if (((game.turn % 2 === 0) && (game.ai === 'O'))
        || ((game.turn % 2 === 1) && (game.ai === 'X'))) {
      return;
    }
    aiPlay();
  }
}

function isThereWin() {
  var winPatternsVal = [
    [game.table[0], game.table[1], game.table[2]],
    [game.table[3], game.table[4], game.table[5]],
    [game.table[6], game.table[7], game.table[8]],
    [game.table[0], game.table[3], game.table[6]],
    [game.table[1], game.table[4], game.table[7]],
    [game.table[2], game.table[5], game.table[8]],
    [game.table[0], game.table[4], game.table[8]],
    [game.table[2], game.table[4], game.table[6]]
  ];
  var found = false;
  for (var patternIndex = 0; (patternIndex < winPatternsVal.length) && (!found); patternIndex += 1) {
    var pattern = winPatternsVal[patternIndex];
    if ((pattern[0])
        && (pattern[0] === pattern[1])
        && (pattern[1] === pattern[2])) {
      found = pattern[0];
    }
  }
  return found;
}

function aiPlay() {
  var cell,
      playerPosWin,
      aiPosWin,
      turn = game.turn;
  if (turn === 1) {
    cell = 0;
  }else if (turn === 2) {
    cell = (!game.table[4])? 4: 0;
  }else if (turn === 3) {
    cell = (!game.table[8])? 8: 2;
  }else if (turn === 4) {
    playerPosWin = possibleWin(game.player);
    cell = (playerPosWin !== null)? playerPosWin: findNext();
  }else if (turn === 5) {
    aiPosWin = possibleWin(game.ai);
    playerPosWin = possibleWin(game.player);
    if (aiPosWin !== null) {
      cell = aiPosWin;
    }else if (playerPosWin !== null) {
      cell = playerPosWin;
    }else if (!game.table[6]){
      cell = 6;
    }else {
      cell = 3;
    }
  }else if (turn === 6) {
    aiPosWin = possibleWin(game.ai);
    playerPosWin = possibleWin(game.player);
    if (aiPosWin !== null) {
      cell = aiPosWin;
    }else if (playerPosWin !== null) {
      cell = playerPosWin;
    }else {
      cell = findNext();
    }
  }else if ((turn > 6) && (turn < 10)) {
    aiPosWin = possibleWin(game.ai);
    playerPosWin = possibleWin(game.player);
    if (aiPosWin !== null) {
      cell = aiPosWin;
    }else if (playerPosWin !== null) {
      cell = playerPosWin;
    }else {
      cell = findBlank();
    }
  }
  game.table[cell] = game.ai;
  $('.table .' + TABLE_MAP_BACK[cell]).html(game.ai);
  game.turn += 1;
  check();
}

function findNext() {
  var next;
  if (!game.table[4]) {
    next = 4;
  }else if (!game.table[1]) {
    next = 1;
  }else if (!game.table[3]) {
    next = 3;
  }else if (!game.table[5]) {
    next = 5;
  }else if (!game.table[7]) {
    next = 7;
  }
  return next;
}

function findBlank() {
  for (var i = 0; i < game.table.length; i += 1) {
    if (!game.table[i]) {
      return i;
    }
  }
}

function possibleWin(player) {
  var winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  var winPatternsVal = [
    [game.table[0], game.table[1], game.table[2]],
    [game.table[3], game.table[4], game.table[5]],
    [game.table[6], game.table[7], game.table[8]],
    [game.table[0], game.table[3], game.table[6]],
    [game.table[1], game.table[4], game.table[7]],
    [game.table[2], game.table[5], game.table[8]],
    [game.table[0], game.table[4], game.table[8]],
    [game.table[2], game.table[4], game.table[6]]
  ];
  var posWin = null;
  for (var i = 0; (i < winPatternsVal.length) && (posWin === null); i += 1) {
    var pattern = winPatternsVal[i];
    if ((count(pattern, player) === 2)
        && (count(pattern, null) === 1)) {
      posWin = winPatterns[i][pattern.indexOf(null)];
    }
  }
  return posWin;
}

function count(arr, val) {
  var found = 0;
  for (var i = 0; i < arr.length; i += 1) {
    if (val === arr[i]) {
      found += 1;
    }
  }
  return found;
}

function resetGame(player) {
  game = {
    player: player,
    ai: (player === 'O')? 'X': 'O',
    table: [null, null, null, null, null, null, null, null, null],
    turn: 1,
    win: null
  };
  $('.table .cell').html('');
  $('.winner').addClass('hide');
  if (game.ai === "O") {
    aiPlay();
  }
}
