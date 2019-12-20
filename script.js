
$(document).ready(function(){

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
            for(var i=0; i<10; i++){
                var div = $('<div class="column" id="songSpot">');
                div.html("Title: <span id='songTitle'>" + response.data[i].title + "<span>");
                $('#songRow').append(div);
            }
        })
    })

    $(document).on('click', '#songSpot', function(){
        console.log($(this).text().slice(7));
    })
})

