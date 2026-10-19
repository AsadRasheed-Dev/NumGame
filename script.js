(function(){
  var MAX = 7;
  var secret = 0, attempts = 0, score = 0, round = 1;
  var player = "Player";

  var $ = function(id){ return document.getElementById(id); };

  function rnd(){ return Math.floor(Math.random()*100)+1; }

  function startRound(){
    secret = rnd();
    attempts = 0;
    $('log').innerHTML = '';
    $('msg').className = 'msg info';
    $('msg').textContent = "I'm thinking of a number between 1 and 100...";
    $('guessInput').value = '';
    $('guessInput').disabled = false;
    $('guessBtn').disabled = false;
    $('roundNo').textContent = round;
    $('pnameShow').textContent = player;
    renderPips();
    $('guessInput').focus();
  }

  function renderPips(){
    var html = '';
    for(var i=0;i<MAX;i++){
      var cls = 'pip';
      if(i < attempts) cls += ' used';
      else if(i === MAX-1) cls += ' last';
      html += '<span class="'+cls+'"></span>';
    }
    $('pips').innerHTML = html;
    $('attLeft').textContent = MAX - attempts;
  }

  function addLog(html){
    var li = document.createElement('li');
    li.innerHTML = html;
    $('log').appendChild(li);
    $('log').scrollTop = $('log').scrollHeight;
  }

  function endRound(won, guess){
    $('guessInput').disabled = true;
    $('guessBtn').disabled = true;
    if(won){
      var pts = (MAX - attempts) + 1;
      score += pts;
      $('score').textContent = score;
      $('msg').className = 'msg good';
      $('msg').textContent = 'You got it! +'+pts+' points.';
      addLog('<span class="win">&gt; '+guess+' &mdash; CORRECT! +' + pts + ' pts</span>');
    }else{
      $('msg').className = 'msg bad';
      $('msg').textContent = 'Out of attempts! The number was ' + secret + '.';
      addLog('<span class="dim">&gt; game over &mdash; it was ' + secret + '</span>');
    }
  }

  function makeGuess(){
    var raw = $('guessInput').value.trim();
    var g = Number(raw);
    if(raw === '' || isNaN(g) || g < 1 || g > 100){
      $('msg').className = 'msg bad';
      $('msg').textContent = 'Invalid input! Enter a number between 1 and 100.';
      $('guessInput').focus();
      return;
    }

    attempts++;
    if(g === secret){
      endRound(true, g);
    }else{
      var hint = (g < secret) ? 'TOO LOW' : 'TOO HIGH';
      var cls  = (g < secret) ? 'low' : 'high';
      addLog('<span class="'+cls+'">&gt; '+g+' &mdash; '+hint+'</span>');
      $('msg').className = 'msg info';
      $('msg').textContent = hint.charAt(0) + hint.slice(1).toLowerCase() + '! Try ' + (g < secret ? 'higher' : 'lower') + '.';
      if(attempts >= MAX){ endRound(false, g); }
    }
    renderPips();
    $('guessInput').value = '';
    $('guessInput').focus();
  }

  /* ---- wiring ---- */
  $('startBtn').addEventListener('click', function(){
    var n = $('pname').value.trim();
    player = n === '' ? 'Player' : n;
    $('nameScreen').classList.add('hidden');
    $('gameScreen').classList.remove('hidden');
    startRound();
  });
  $('pname').addEventListener('keydown', function(e){
    if(e.key === 'Enter') $('startBtn').click();
  });

  $('guessBtn').addEventListener('click', makeGuess);
  $('guessInput').addEventListener('keydown', function(e){
    if(e.key === 'Enter') makeGuess();
  });

  $('newRoundBtn').addEventListener('click', function(){
    round++;
    startRound();
  });
  $('quitBtn').addEventListener('click', function(){
    $('gameScreen').classList.add('hidden');
    $('nameScreen').classList.remove('hidden');
    round = 1; score = 0;
    $('score').textContent = '0';
    $('pname').focus();
  });
})();