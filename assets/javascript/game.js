$(document).ready(function () {
    //Play star wars theme song. Attach embeded souncloud player for sound, with height of 0
    var synth = window.speechSynthesis;
    $("body").append('<iframe width="100%" height="1" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/130680658&color=%23f4f2f2&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>');

    var characters = [
        { name: "Obi-Wan Kenobi", picture: "./assets/images/obi-wan.jpg", health: 120, attack: 10, counterAttack: 20, speech: new SpeechSynthesisUtterance('Obi Wan Kenobi') },
        { name: "Luke Skywalker", picture: "./assets/images/skywalker.jpg", health: 100, attack: 6, counterAttack: 15, speech: new SpeechSynthesisUtterance('Luke Skywalker') },
        { name: "Darth Vader", picture: "./assets/images/vader.jpg", health: 150, attack: 12, counterAttack: 30, speech: new SpeechSynthesisUtterance('Darth Vader') },
        { name: "Storm Trooper", picture: "./assets/images/storm-trooper.jpg", health: 100, attack: 5, counterAttack: 10, speech: new SpeechSynthesisUtterance('Storm Trooper') },
    ]

    //Global attack variable to keep track of increasing attack damage for each game
    var attack = 0;
    var oponent = false;
    var alive = false;
    var gameStarted = false;
    
    //launches starGame function that creates and displays divs for each character
    $("body").on("click", function() {
        if (!gameStarted) {
            gameStarted = true;
            $("#startGameMessage").animate({
                opacity:0,
            },2000, function() {
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
        sayName(char.data("nameAudio"));
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
                $(".enemySelection").append($(element));
            } 
        })
        
        
    })
    
    //on enemy click, the character is moved into the selectedOponent div
    $("body").on("click", ".enemy", function() {
        if(!oponent) {
            sayName($(this).data("nameAudio"));
            $(this).detach();
            $(this).removeClass("enemy player")
            $(this).addClass("oponent");
            $(".selectedOponent").append($(this));
            oponent = true;
        }
    })

    
    $("body").on("click", "button#attackBtn", function() {
        if (oponent && alive) {
            attack += $(".player").data("attack");
            var counterAttack = $(".oponent").data("counterAttack");
            var playerHealth = $(".player").data("health");
            var oponentHealth =  $(".oponent").data("health");
            
            //1. subtract the player's attack from the oponent's health
            oponentHealth -= attack;
            
            //2. subtract the oponent's counterAttack from the oponent's health
            playerHealth -= counterAttack;
            
            //3. update new element data and text attributes. Render text statement of attacks.
            $(".player").data("health", playerHealth);
            $(".player .health").text(playerHealth);
            $(".message").text("You attacked "+$(".oponent .name").text()+ "for " + attack + " damage!")   
    
            $(".oponent").data("health", oponentHealth);
            $(".oponent .health").text(oponentHealth);
            $(".message").append($(".oponent .name").text() + " attacked you for " + counterAttack + "!")  
    
            $(".attackMessage").text("You attacked "+$(".oponent .name").text()+ " for " + attack + " damage!") 
            $(".counterAttackMessage").text($(".oponent .name").text() + " attacked you for " + counterAttack + " damage!")  
            
            //4. execute checkWin() function 
            checkWin();
        } else if (!oponent && alive) {
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
        $(".oponent").remove();
        oponent = false;
        alive = true;
        startGame();
    })

    //this function initializes all variables and divs before the game starts
    

    function startGame() {
        //create divs for each character in the array and add them to the page
        characters.forEach(function (element) {
            var charDiv = $("<div class='character'>");
    
            var charPic = $("<img class='picture'>");
            charPic.attr("src", element.picture);
            charPic.attr("alt", element.name);
    
            var charName = $("<div class='name'>");
            charName.text(element.name);
    
            var charHealth = $("<div class='health'>");
            charHealth.text(element.health);
            
            //Add data attributes to each character
            charDiv.data("health", element.health);
            charDiv.data("attack", element.attack);
            charDiv.data("counterAttack", element.counterAttack);
            charDiv.data("nameAudio", element.speech);
    
            charDiv.append(charName,charPic,charHealth);
    
            $(".characterSelection").animate({
                opacity: 1,
            }, 500, function() {
                $(this).append(charDiv);
            })
        });
    }

    //the checkWin function checks to see if the oponent or player's health is 0 or less and removes the element from the DOM
    function checkWin() {
        if ($(".player").data("health") <= 0) {
            $(".matchResult").text("You've been defeated...GAME OVER!");
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text("");
            $(".messages").append("<button id='newGameBtn'>New Game</button>")
            alive = false;
        } else if($(".oponent").data("health") <= 0){
            $(".matchResult").text("You have defeated " + $(".oponent .name").text() + ", choose another enemy.");
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text("");     
            $(".oponent").remove();
            oponent = false;
        } else {
            $(".matchResult").text("");
        }
    }

    function sayName(utterance) {
        var voices = synth.getVoices()
        utterance.voice = voices[49];
        synth.speak(utterance);
    }

    function renderPageStructure() {
        var characterSelection = $(' <div class="characterSelection"></div>');
        var selectedCharacter = $('<div class="selectedCharacter"><h2>Your Character</h2></div>');
        var enemySelection = $('<div class="enemySelection"><h2>Enemies Available to Attack</h2></div>');
        var attack = $('<div class="attack"><button id="attackBtn">Attack</button></div>');
        var selectedOponent = $('<div class="selectedOponent"><h2>Oponent</h2></div>');
        var messages = $('<div class="messages"><div class="attackMessage"></div><div class="counterAttackMessage"></div><div class="matchResult"></div></div>');
        $("body").append(characterSelection,selectedCharacter,enemySelection,attack,selectedOponent,messages);
    }
})

