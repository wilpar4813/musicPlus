
$(document).ready(function(){

    var toggle = true;
    var clickThis;
    var addSongArr = [];

    $('#searchButton').on('click', function(){
        var artist = $('#searchInput').val();
        $.ajax({
            headers: {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "4e31acf4c0mshe9fe802121748ecp15e1f1jsn3259148dce29" 
            },
            url: "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist,
            method: "GET"
        }).then(function(response){
            console.log(response);
            //create song div
            for(var i=0; (i<response.data.length && i<10); i++){
                var div = $(`<div class="column" id="songSpot" data-number=${i}>`);
                div.html("Title: <span id='songTitle'>" + response.data[i].title + "<span>");
                $('#songRow').append(div);
            }
        })
    })

    function selectToggle(compareSong){
        console.log(compareSong)
        if (toggle){
            //set background color of song div to blue
            clickThis.attr('style', 'background: blue;');
            //push selected song title in array
            addSongArr.push(clickThis.text().slice(7));
            toggle = false;
        } else {
            clickThis.attr('style', 'background: darkgrey;');
            //pop selected song title out of array
            if(clickThis.text() === compareSong){
                addSongArr.pop();
                toggle = true;
            }
        }
    }

    $(document).on('click', '#songSpot', function(e){
        var clickedSong = e.target.innerText;
        clickThis = $(this);
        //create toggle function to change background color
        selectToggle(clickedSong);
        console.log(clickThis.text())
        console.log(addSongArr)
    })
})

