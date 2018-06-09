$(document).ready(function () {
    var characters = [
        { name: "Obi-Wan Kenobi", picture: "../images/obi-wan.jpg", health: 120, attack: 10, counterAttack: 20 },
        { name: "Luke Skywalker", picture: "../images/skywalker.jpg", health: 100, attack: 6, counterAttack: 15 },
        { name: "Darth Sidious", picture: "../images/sidious.jpg", health: 150, attack: 12, counterAttack: 30 },
    ]

    //create divs for each character in the array and add them to the page
    characters.forEach(function (element) {
        var charDiv = $("<div>");
        charDiv.addClass("character");
        charDiv.text(element.name);

        var charHealth = $("<div>");
        charHealth.addClass("health");
        charHealth.text(element.health);
        charHealth.append
        charDiv.append(charHealth);

        $(".characterSelection").append(charDiv);
    });

    //on click of a character, the character is moved to the selectedCharacter 
    //div while the remaining characters are moved to the enemySelection div
    $(".character").on("click", function () {
        var char = $(this);
        char.detach();
        $(".selectedCharacter").append(char);
        $(".character").each(function(index,element) {
            if (char.is($(element))===false) {
                $(element).detach();
                $(element).removeClass("selectedCharacter")
                $(element).addClass("enemy")
                $(".enemySelection").append($(element));
            } 
        })
    })

    //on enemy click, the character is moved into the defender div
    $(".enemy").on("click", function() {
        $(this).detach();
        $(this).addClass("inBattle");
        $(".defender").append($(this));
    })
})

