$(document).ready(function() {
    // variables
    var topics = ["Iron Man", "Deadpool", "Aquaman", "Spiderman", "Hellboy"]
    var alreadyUsed = -1;

    // display button array on page load
    displayButtons();

    $("#buttons").on("click", ".comicHeros", function() {
        // clear out gifs already displayed
        $("#gifs-appear-here").empty();
        var comicHero = $(this).attr("data-hero");
        // debugger;
        // ajax call parameters - get image based on value from clicked button
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            comicHero + "&api_key=I9OLrgjtcwjg6Rgz4T3FC03k9ib5WtSB&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After the data comes back from the API
        .then(function(response) {
            // Storing an array of results in the results variable
            var results = response.data;
            // Looping over every result item
            for (var i = 0; i < results.length; i++) {
                // Only taking action if the photo has an appropriate rating
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    // Creating a div for the gif
                    var gifDiv = $("<div class='gifsDisplay'>");
                    // Storing the result item's rating
                    var rating = results[i].rating;
                    // Storing the result item's title
                    var title = results[i].title;
                    // Creating a paragraph tag with the result item's rating and title
                    var p = $("<p id='gifCaption'>").text("Rating: " + rating + "    Title: " + title);
                     // Creating a paragraph tag with link to Giphy page
//                    var bitly_gif_url = results[i].bitly_gif_url;
//                    var p2 = $("<p><a href='" + bitly_gif_url + "' target='_blank'>View Original</a></p>");
                    var originalImage = results[i].images.original.url;
                    var p2 = $("<p><a href='" + originalImage + "' target='_blank'>View Original</a></p>");		
                    // Creating an image tag
                    var heroImage = $("<img>");
                    // Giving the image tag a 'gif' class
                    heroImage.attr("class", "gif");
                    // Giving the image tag an src attribute of a property pulled off the
                    // result item.  These properties necessary to start/stop gif animation
                    heroImage.attr("src", results[i].images.fixed_height_still.url);
                    heroImage.attr("data-still", results[i].images.fixed_height_still.url);
                    heroImage.attr("data-animate", results[i].images.fixed_height.url);
                    heroImage.attr("data-state", "still");
                    // Appending the paragraph and heroImage created to the "gifDiv" div we created
                    gifDiv.append(p);
                    gifDiv.append(p2);
                    gifDiv.append(heroImage);
                    // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                    $("#gifs-appear-here").prepend(gifDiv);
                    }
            }  
        });     
    });

    $(document).on("click", ".gif", function() {
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // debugger;
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        };
    });

    $("#newHeroes").on("click", function() {
        event.preventDefault();
        var newHero = $("#addHero").val().trim();
        // debugger;
        // duplicates check
        if (newHero !== "") {
            alreadyUsed = topics.indexOf (newHero);
            if (alreadyUsed == -1) {
                topics.push(newHero);
            } else {
                alert(newHero + " has already been selected");
            }
            // can enable the next instruction if need to clear old gifs when new displayed
            //$("#gifs-appear-here").empty();   

            // redisplay the buttons, including newly added hero
            displayButtons();
            // clear new hero text entry field
            $("#addHero").val("");
        } else {
            alert("Please enter a hero name");
        };
    });

    function displayButtons() {
        // debugger;
        $("#buttons").empty();
        // remove the buttons in the buttons div    
        for (var i = 0; i < topics.length; i++) {
            // Loop thru hero array, generate button for each
            var heroBtn = $("<button class='btn-outline-danger'>");
            heroBtn.addClass("comicHeros");
            heroBtn.attr("data-hero", topics[i]);
            heroBtn.text(topics[i]);
            $("#buttons").append(heroBtn);
        }
    };
})