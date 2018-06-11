$(document).ready(function () {
    var characters = [
        { name: "Obi-Wan Kenobi", picture: "./assets/images/obi-wan.jpg", health: 120, attack: 10, counterAttack: 20 },
        { name: "Luke Skywalker", picture: "./assets/images/skywalker.jpg", health: 100, attack: 6, counterAttack: 15 },
        { name: "Darth Vader", picture: "./assets/images/vader.jpg", health: 150, attack: 12, counterAttack: 30 },
        { name: "Storm Trooper", picture: "./assets/images/storm-trooper.jpg", health: 100, attack: 5, counterAttack: 10 }
    ]

    //Global attack variable to keep track of increasing attack damage for each game
    var attack = 0;
    
    //launches starGame function that creates and displays divs for each character
    startGame();
    
    //on click of a character, the character is moved to the selectedCharacter 
    //div while the remaining characters are moved to the enemySelection div
    $("body").on("click", ".character", function () {
        var char = $(this);
        char.detach();
        char.removeClass("character");
        char.addClass("player");
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
        $(this).detach();
        $(this).removeClass("enemy player")
        $(this).addClass("oponent");
        $(".selectedOponent").append($(this));
    })

    
    $("button#attackBtn").on("click", function() {
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
    })

    //this function is envoked when the newGame Button is clicked. The function will clear all divs and call the startGame() function
    $("body").on("click", "button#newGameBtn",function() {
        $(this).remove();
        $(".matchResult").text("");
        $(".player").remove();
        $(".enemy").remove();
        $(".oponent").remove();
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
    
            charDiv.append(charName,charPic,charHealth);
    
            $(".characterSelection").append(charDiv);
        });
    }

    //the checkWin function checks to see if the oponent or player's health is 0 or less and removes the element from the DOM
    function checkWin() {
        if ($(".player").data("health") <= 0) {
            $(".matchResult").text("You've been defeated...GAME OVER!");
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text("");
            $(".messages").append("<button id='newGameBtn'>New Game</button>")
        } else if($(".oponent").data("health") <= 0){
            $(".matchResult").text("You have defeated " + $(".oponent .name").text() + ", choose another enemy.");
            $(".attackMessage").text(""); 
            $(".counterAttackMessage").text("");     
            $(".oponent").remove();
        } else {
            $(".matchResult").text("");
        }
    }
    
})

