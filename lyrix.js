//Comment this out.  Only for function testing
<<<<<<< HEAD
//$(document).ready(function () {  
//getLyrix("blues traveler", "hook");
//})


=======
// $(document).ready(function () {  
// getLyrix("blues traveler", "hook");
// })
>>>>>>> 03872c6f9c1a098604c107971e624f5b7c9be479
function getLyrix(artist, song) {
    //console.log("getLyrix function was called")
    if (artist != '' || song != '') {

        $.ajax({ // AJAX call for current conditions

            //https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=alone&q_artist=blues%20traveler

            url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&callback=callback&q_track=" + song + "&q_artist=" + artist + "&apikey=057fcae6cc1599a783e98bf3f2153ced",
            method: "GET"
        }).then(function (response) {
            if (JSON.parse(response).message.header.status_code != 404) {
                var data = JSON.parse(response);
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
    //console.log(response.body);
    $("#songLyrix").empty;
    //https://stackoverflow.com/questions/4253367/how-to-escape-a-json-string-containing-newline-characters-using-javascript
    var myLyrixString = JSON.stringify(response.message.body.lyrics.lyrics_body);//response.message.body.lyrics.lyrics_body not working
    //console.log(myLyrixString);
    var myEscapedLyrixString = myLyrixString.replace(/\\n/g, "<br>")
        .replace(/\\'|\\"|\\&|\\r|\\t|\\b|\\f/g, function (x) {
            return x.slice(1);
        })
    //console.log(myEscapedLyrixString);
    $("#songLyrix").html(myEscapedLyrixString.slice(1, myEscapedLyrixString.length - 1));
    //$("#songLyrix").append(response.message.body.lyrics_copyright)
}