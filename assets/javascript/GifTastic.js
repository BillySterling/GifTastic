/*eslint-env jquery*/
$(document).ready(function() {
    // variables
    var topics = ["Iron Man", "Deadpool", "Aquaman", "Spiderman", "Hellboy"]
    var alreadyUsed = -1;
    var comicHero = "";
    var moreBtn = "";
    var offset = 0;

    // display button array on page load
    displayButtons();

    $("#buttons").on("click", ".comicHeros", function() {
        // clear out gifs already displayed
        $("#gifs-appear-here").empty();
        comicHero = $(this).attr("data-hero");
        getGifs(comicHero, offset);
        // added 'More' button - to display next 10 gifs for same search
        // clear the 'More' button - prevent multiple display of button
        $("#moreButton").empty();
        // create 'More' button and set tags
        moreBtn = $("<button class='btn-outline-danger'>");
        moreBtn.addClass("moreHeroes");
        moreBtn.text("Want to See More?");
        $("#moreButton").append(moreBtn);
    });

    $("#moreButton").on("click", function() {
        offset +=10;
        getGifs(comicHero, offset);
        });  

    $(document).on("click", ".gif", function() {
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

    // added thie following (from StackOverflow search) - when enter key pressed causes "Submit" click event
    $("#addHero").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#newHeroes").click();
        }
    });

    $("#newHeroes").on("click", function() {
        event.preventDefault();
        var newHero = $("#addHero").val().trim();
        // duplicates check
        if (newHero !== "") {
            alreadyUsed = topics.indexOf (newHero);
            if (alreadyUsed == -1) {
                topics.push(newHero);
            } else {
                $("#dupModal").modal()
            }
            // redisplay the buttons, including newly added hero
            displayButtons();
            // clear new hero text entry field
            $("#addHero").val("");
        }
    });

    function getGifs(comicHero, offset) {
        // ajax call parameters - get image based on value from clicked button
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        comicHero + "&api_key=I9OLrgjtcwjg6Rgz4T3FC03k9ib5WtSB&limit=10&offset=" + offset;
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After the data comes back from the API
        .then(function(response) {
            //console.log(response.data);
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
                    var originalImage = results[i].images.original.url;
                    var p2 = $("<p><a href='" + originalImage + "' target='_blank'>See on Giphy</a></p>");		
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
    }

    function displayButtons() {
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
    }
});