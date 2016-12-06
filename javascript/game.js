exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
  var players          = new Array();
  var places           = new Array(6);
  var purses           = new Array(6);
  var inPenaltyBox     = new Array(6);

  var currentPlayer    = 0;
  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function() {
    return !(players[currentPlayer].Purse == 6);
  };

  var questions = new Questions();

  this.isPlayable = function(howManyPlayers){
    return howManyPlayers >= 2;
  };

  this.add = function(playerName) {
    var player = new Player(playerName);
    players.push(player);

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  var howManyPlayers = function(){
    return players.length;
  };

  this.roll = function(roll) {
    console.log(players[currentPlayer].Name + " is the current player");
    console.log("They have rolled a " + roll);

    if(players[currentPlayer].InPenaltyBox) {
      if(roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(players[currentPlayer].Name + " is getting out of the penalty box");
        players[currentPlayer].Place = players[currentPlayer].Place + roll;
        if(players[currentPlayer].Place > 11){
          players[currentPlayer].Place = players[currentPlayer].Place - 12;
        }

        console.log(players[currentPlayer].Name + "'s new location is " + players[currentPlayer].Place);
        console.log("The category is " + questions.currentCategory());
        questions.askQuestion();
      }
      else {
        console.log(players[currentPlayer].Name + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    }
    else {
      players[currentPlayer].Place = players[currentPlayer].Place + roll;
      if(players[currentPlayer].Place > 11) {
        players[currentPlayer].Place = players[currentPlayer].Place - 12;
      }

      console.log(players[currentPlayer].Name + "'s new location is " + players[currentPlayer].Place);
      console.log("The category is " + currentCategory());
      questions.askQuestion();
    }
  };

  this.isWinnerSettled = function() {
    var winner = didPlayerWin();
    currentPlayer += 1;    
    if(currentPlayer == players.length) {
        currentPlayer = 0;
    }
    return winner;
  }

  this.wasCorrectlyAnswered = function() {
    if(players[currentPlayer].InPenaltyBox) {
      if(isGettingOutOfPenaltyBox) {
        console.log('Answer was correct!!!!');
        players[currentPlayer].Purse += 1;
        console.log(players[currentPlayer].Name + " now has " +
                    players[currentPlayer].Purse  + " Gold Coins.");

        return isWinnerSettled();
      }
      else {
        currentPlayer += 1;
        if(currentPlayer == players.length)
          currentPlayer = 0;
        return true;
      }
    }
    else {

      console.log("Answer was correct!!!!");

      players[currentPlayer].Purse += 1;
      console.log(players[currentPlayer].Name + " now has " +
                  players[currentPlayer].Purse  + " Gold Coins.");

      return isWinnerSettled();
    }
  };

  this.wrongAnswer = function(){
		console.log('Question was incorrectly answered');
		console.log(players[currentPlayer].Name + " was sent to the penalty box");
		inPenaltyBox[currentPlayer] = true;

    currentPlayer += 1;
    if(currentPlayer == players.length)
      currentPlayer = 0;
		return true;
  };
};

exports.Players = function(playerName) {

    this.players = new Array();
    var Name = playerName;
    var Place = 0;
    var Purse = 0;
    var InPenaltyBox = false;
}

exports.Questions = function() {
    var popQuestions     = new Array();
    var scienceQuestions = new Array();
    var sportsQuestions  = new Array();
    var rockQuestions    = new Array();

    this.currentCategory = function() {
      switch(places[currentPlayer]) {
        case '0' : {
          return 'Pop';
        }
        case '4' : {
          return 'Pop';
        }
        case '8' : {
          return 'Pop';
        }
        case '1' : {
          return 'Science';
        }
        case '5': {
          return 'Science';
        }
        case '9': {
          return 'Science';
        }
        case '2': {
          return 'Sports';
        }
        case '6': {
          return 'Sports';
        }
        case '10' : {
          return 'Sports';
        }
        default: {
          return 'Rock';
        }
      }
  };

  var createRockQuestion = function(index){
    return "Rock Question " + index;
  };

  this.askQuestion = function() {
    switch(this.currentCategory()) {
      case 'Pop' : {
        console.log(popQuestions.shift());
        break;
      }
      case 'Science' : {
        console.log(scienceQuestions.shift());
        break;
      }
      case 'Sports' : {
        console.log(sportsQuestions.shift());
        break;
      }
      case 'Rock' : {
        console.log(rockQuestions.shift());
        break;
      }
    }
  };

  for(var i = 0; i < 50; i++){
    popQuestions.push("Pop Question "+i);
    scienceQuestions.push("Science Question "+i);
    sportsQuestions.push("Sports Question "+i);
    rockQuestions.push(createRockQuestion(i));
  };
}

var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do {
  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }
  else {
    notAWinner = game.wasCorrectlyAnswered();
  }
}
while(notAWinner);
