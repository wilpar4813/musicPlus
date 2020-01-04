
function getLyrix(artist, song) {
    //console.log("getLyrix function was called")
    //Look for empty artist or song string
    if (artist != '' || song != '') {
        // AJAX call for current conditions
        $.ajax({ 
            url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&callback=callback&q_track=" + song + "&q_artist=" + artist + "&apikey=057fcae6cc1599a783e98bf3f2153ced",
            method: "GET"
        }).then(function (response) {
             //Response is returned as a string.  Parse string here to convert to JSON object assigned to var data
            if (JSON.parse(response).message.header.status_code != 404) {
                var data = JSON.parse(response);
                //Call function to post to HTML
                postToHtml(data);
            } else {
                var data = { message: { body: { lyrics: { lyrics_body: "Lyrics Not Available!" } } } };
                postToHtml(data);
            }
        });
    } else { // Error message if user doesn't enter anything
        $("#error").html('Field cannot be empty');
    }
}

function postToHtml(response) {
    //console.log(response);
    //console.log("post to html called")
    //Clear previous lyrics from screen
    $("#songLyrix").empty;
    //Stringify lyrics response to replace MusixMatch new line 
    //characters with <br> tags so each lyric displays on a new line in html.
    //https://stackoverflow.com/questions/4253367/how-to-escape-a-json-string-containing-newline-characters-using-javascript
    var myLyrixString = JSON.stringify(response.message.body.lyrics.lyrics_body);//response.message.body.lyrics.lyrics_body not working
    //console.log(myLyrixString);
    var myEscapedLyrixString = myLyrixString.replace(/\\n/g, "<br>")
        .replace(/\\'|\\"|\\&|\\r|\\t|\\b|\\f/g, function (x) {
            return x.slice(1);
        })
    //console.log(myEscapedLyrixString);
    // Remove quotation marks from the beginning and end of lyrics string
    $("#songLyrix").html(myEscapedLyrixString.slice(1, myEscapedLyrixString.length - 1));
    //$("#songLyrix").append(response.message.body.lyrics_copyright)
}
