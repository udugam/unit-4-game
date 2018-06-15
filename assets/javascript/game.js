$(document).ready(function () {
    //Play star wars theme song. Attach embeded souncloud player for sound, with height of 0
    var synth = window.speechSynthesis;
    $("body").append('<iframe width="100%" height="1" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/130680658&color=%23f4f2f2&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>');

    var characters = [
        { name: "Obi-Wan Kenobi", picture: "./assets/images/obi-wan.jpg", health: 120, attack: 10, counterAttack: 20, speech: new SpeechSynthesisUtterance('Obi Wan Kenobi') },
        { name: "Luke Skywalker", picture: "./assets/images/skywalker.jpg", health: 100, attack: 6, counterAttack: 15, speech: new SpeechSynthesisUtterance('Luke Skywalker') },
        { name: "Darth Vader", picture: "./assets/images/vader.jpg", health: 150, attack: 12, counterAttack: 30, speech: new SpeechSynthesisUtterance('Darth Vader') },
        { name: "Storm Trooper", picture: "./assets/images/storm-trooper.jpg", health: 100, attack: 5, counterAttack: 5, speech: new SpeechSynthesisUtterance('Storm Trooper') },
    ]

    //Global attack variable to keep track of increasing attack damage for each game
    var attack = 0;
    var opponent = false;
    var alive = false;
    var gameStarted = false;
    var opponents = characters.length-1;
    
    //launches starGame function that creates and displays divs for each character
    $("body").on("click", function() {
        if (!gameStarted) {
            gameStarted = true;
            $("#startGameMessage").fadeOut(1000, function() {
                $(this).remove()
                renderPageStructure();
                startGame();
            });
            
        }  
    })
    
    
    //on click of a character, the character is moved to the selectedCharacter 
    //div while the remaining characters are moved to the enemySelection div
    $("body").on("click", ".character", function () {
        var char = $(this);
        sayText(char.data("nameAudio"));
        char.detach();
        char.removeClass("character");
        char.addClass("player");
        alive = true;
        $(".selectedCharacter").append(char);
        $(".character").each(function(index,element) {
            if (char.is($(element))===false) {
                $(element).detach();
                $(element).removeClass("character")
                $(element).addClass("enemy")
                $(".characterSelection").fadeOut(1500);
                $(".selectedCharacter").fadeIn(1500);
                $(".messages").fadeIn(1500);
                $(".enemySelection").fadeIn(1500).append($(element));
            } 
        })
        $(".announcement").fadeOut(750, function() {
            $(this).html('<h1>Choose an Enemy to Attack<h1>').fadeIn(1500);
            sayText(new SpeechSynthesisUtterance('choose an enemy to attack'));
        })
    })
    
    //on enemy click, the character is moved into the selectedopponent div
    $("body").on("click", ".enemy", function() {
        if(!opponent) {
            sayText($(this).data("nameAudio"));
            $(this).detach();
            $(this).removeClass("enemy player")
            $(this).addClass("opponent");
            $(".attack").fadeIn(1500);
            $(".selectedopponent").fadeIn(1500).append($(this));
            sayText(new SpeechSynthesisUtterance('press the attack button to start your battle'));
            opponent = true;
        }
    })

    
    $("body").on("click", "button#attackBtn", function() {
        if (opponent && alive) {
            attack += $(".player").data("attack");
            var counterAttack = $(".opponent").data("counterAttack");
            var playerHealth = $(".player").data("health");
            var opponentHealth =  $(".opponent").data("health");
            
            //1. subtract the player's attack from the opponent's health
            opponentHealth -= attack;
            
            //2. subtract the opponent's counterAttack from the opponent's health
            playerHealth -= counterAttack;
            
            //3. update new element data and text attributes. Render text statement of attacks.
            $(".player").data("health", playerHealth);
            $(".player .health").text(playerHealth);
            $(".message").text("You attacked "+$(".opponent .name").text()+ "for " + attack + " damage!")   
    
            $(".opponent").data("health", opponentHealth);
            $(".opponent .health").text(opponentHealth);
            $(".message").append($(".opponent .name").text() + " attacked you for " + counterAttack + "!")  
    
            $(".attackMessage").text("You attacked "+$(".opponent .name").text()+ " for " + attack + " damage!")
            sayText(new SpeechSynthesisUtterance(attack+'damage'));
            sayText(new SpeechSynthesisUtterance(playerHealth+'health left')); 
            $(".counterAttackMessage").text($(".opponent .name").text() + " attacked you for " + counterAttack + " damage!")  
            
            //4. execute checkWin() function 
            checkWin();
        } else if (!opponent && alive) {
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text(""); 
            $(".matchResult").text("Select an enemy first to attack!"); 
        } else if (!alive) {
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text(""); 
            $(".matchResult").text("Click New Game to Play Again!");
            
        }
    })

    //this function is envoked when the newGame Button is clicked. The function will clear all divs and call the startGame() function
    $("body").on("click", "button#newGameBtn",function() {
        $(this).remove();
        $(".matchResult").text("");
        $(".player").remove();
        $(".enemy").remove();
        $(".opponent").remove();
        initHtmlStructure()
        opponent = false;
        alive = true;
        startGame();
    })

    //this function initializes all variables and divs before the game starts
    

    function startGame() {
        //create divs for each character in the array and add them to the page
        opponents = characters.length-1;
        characters.forEach(function (element) {
            var charDiv = $("<div class='character'>");
    
            var charPic = $("<img class='picture'>");
            charPic.attr("src", element.picture).attr("alt", element.name);
    
            var charName = $("<div class='name'>");
            charName.text(element.name);
    
            var charHealth = $("<div class='health'>");
            charHealth.text(element.health);
            
            //Add data attributes to each character
            charDiv.data("health", element.health).data("attack", element.attack).data("counterAttack", element.counterAttack).data("nameAudio", element.speech);
            
            //Append Name, Picture, & Health display divs
            charDiv.append(charName,charPic,charHealth);

            //Add completed character div to the character Selection div
            $(".characterSelection").append(charDiv);     
        });
        $(".announcement").html('<h1>Choose Your Character</h1>').fadeIn(1500);
        $(".characterSelection").fadeIn(1500);
        sayText(new SpeechSynthesisUtterance('choose your character'));
    }

    //the checkWin function checks to see if the opponent or player's health is 0 or less and removes the element from the DOM
    function checkWin() {
        if ($(".player").data("health") <= 0) {
            $(".matchResult").text("You've been defeated...GAME OVER!");
            sayText(new SpeechSynthesisUtterance("you've been defeated, click new game to try again"));
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text("");
            $(".messages").append("<button id='newGameBtn'>New Game</button>")
            alive = false;
        } else if($(".opponent").data("health") <= 0){
            opponents--;
            if (opponents <= 0) {
                $(".matchResult").text("You Have Defeated All Enemies! Click New Game to Play Again");
                sayText(new SpeechSynthesisUtterance("winner! you are the ultimate champion"));
                $(".attackMessage").text(""); 
                $(".counterAttackMessage").text("");   
                $(".messages").append("<button id='newGameBtn'>New Game</button>")
            } else {
                $(".matchResult").text("You have defeated " + $(".opponent .name").text() + ", choose another enemy.");
                sayText(new SpeechSynthesisUtterance("you have defeated"+$(".opponent .name").text()+".choose another enemy to attack"));
                $(".attackMessage").text(""); 
                $(".counterAttackMessage").text("");     
                $(".opponent").remove();
                opponent = false;
            }
        } else {
            $(".matchResult").text("");
        }
    }

    function sayText(utterance) {
        var voices = synth.getVoices()
        utterance.voice = voices[49];
        synth.speak(utterance); 
    }

    function renderPageStructure() {
        var announcement = $('<div class="announcement"></div>')
        var characterSelection = $(' <div class="characterSelection"></div>');
        var selectedCharacter = $('<div class="selectedCharacter"><h2>Your Character</h2></div>');
        var enemySelection = $('<div class="enemySelection"><h2>Enemies Available to Attack</h2></div>');
        var attack = $('<div class="attack"><button id="attackBtn">Attack</button></div>');
        var selectedopponent = $('<div class="selectedopponent"><h2>Opponent</h2></div>');
        var messages = $('<div class="messages"><div class="attackMessage"></div><div class="counterAttackMessage"></div><div class="matchResult"></div></div>');
        $("body").append(announcement,characterSelection,selectedCharacter,enemySelection,attack,selectedopponent,messages);
        initHtmlStructure();
    }

    function initHtmlStructure() {
        $(".announcement").fadeOut(0);
        $(".characterSelection").fadeOut(0);
        $(".selectedCharacter").fadeOut(0);
        $(".enemySelection").fadeOut(0);
        $(".attack").fadeOut(0);
        $(".selectedopponent").fadeOut(0);
        $(".messages").fadeOut(0);
    }
})

