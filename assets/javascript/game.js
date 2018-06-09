$(document).ready(function () {
    var characters = [
        { name: "Obi-Wan Kenobi", picture: "../images/obi-wan.jpg", health: 120, attack: 10, counterAttack: 20 },
        { name: "Luke Skywalker", picture: "../images/skywalker.jpg", health: 100, attack: 6, counterAttack: 15 },
        { name: "Darth Sidious", picture: "../images/sidious.jpg", health: 150, attack: 12, counterAttack: 30 },
    ]

    var attack = 0;

    //create divs for each character in the array and add them to the page
    characters.forEach(function (element) {
        var charDiv = $("<div class='character'>");

        var charName = $("<div class='name'>");
        charName.text(element.name);

        var charHealth = $("<div class='health'>");
        charHealth.text(element.health);
        
        //Add data attributes to each character
        charDiv.data("health", element.health);
        charDiv.data("attack", element.attack);
        charDiv.data("counterAttack", element.counterAttack);

        charDiv.append(charName,charHealth);

        $(".characterSelection").append(charDiv);
    });

    
    //on click of a character, the character is moved to the selectedCharacter 
    //div while the remaining characters are moved to the enemySelection div
    $(".character").on("click", function () {
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
    
    //on enemy click, the character is moved into the defender div
    $("body").on("click", ".enemy", function() {
        $(this).detach();
        $(this).removeClass("enemy player")
        $(this).addClass("oponent");
        $(".defender").append($(this));
    })

    
    $("button").on("click", function() {
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

    //the checkWin function checks to see if the oponents health is 0 or less and removes the element from the DOM
    function checkWin() {
        if($(".oponent").data("health") <= 0){
            $(".oponent").remove();        
        }
    }
    
})

