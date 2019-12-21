
$(document).ready(function(){

    //var toggle = true;
    var foundSong = false;
    var foundSongName;
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
                var titleDiv = $(`<div class="column" id="songSpot" data-number=${i} data-preview=${response.data[i].preview} >`);
                titleDiv.html("Title: <span id='songTitle'>" + response.data[i].title + "<span>");
                var albumDiv = $('<div id="album">');
                albumDiv.text("Album: " + response.data[i].album.title);
                //titleDiv.append(albumDiv);
                $('#songRow').append(titleDiv);
            }
        })
    })

    function selectToggle(compareSong){
        console.log(compareSong);
        
        if(addSongArr.length > 0){
            for(var i=0; i<addSongArr.length; i++){
                // console.log(addSongArr[i].title)
                // console.log(compareSong.slice(7))
                if (addSongArr[i].title === compareSong.slice(7)) {
                    foundSongName = addSongArr[i].title;
                    foundSong = true;
                }
            }
        }
        if (!foundSong){
            //console.log(compareSong)
            //set background color of song div to blue
            clickThis.attr('style', 'background: blue;');
            //push selected song title in array
            addSongArr.push({
                id: clickThis.attr('data-number'),
                title:  clickThis.text().slice(7),
                preview: clickThis.attr('data-preview')
                    }
                );
                //console.log(addSongArr);
        } else {
            clickThis.attr('style', 'background: darkgrey;');
            //remove selected song title out of array
            //filter the array to create a new array minus the selected song
            var newSongArr = addSongArr.filter(function(val){
                console.log(val.title);
                console.log(compareSong.slice(7))
                return val.title !== foundSongName;
            });

            addSongArr = newSongArr;

            foundSong = false;
        }
        //console.log(addSongArr);
    }

    function addToPlaylist(){
        //add playlist array to playlist div
        var playlistEl = $('#playlist');
        addSongArr.forEach(function(val){
        // //create new div
       
        var div = $('<div>');
        var preview = val.preview
        div.attr('id', 'playlistItem');
        div.attr('data-title', val.title)
        div.text(val.title);
      
        // Gets Link for Theme Song
        var audioElement = $("<audio>");
        
        audioElement.attr("src", preview);
        div.append(audioElement);
        playlistEl.append(div)
                      
        })
    }

    $(document).on('click', '#playlistItem', function(e){
        //console.log($(this).attr('data-title'));    
        $(this)[0].childNodes[1].play();
    })

    $('#add').on('click', function(e){
        //add to playlist
        addToPlaylist();
    })

    $(document).on('click', '#songSpot', function(e){
        var clickedSong = e.target.innerText;
        clickThis = $(this);
        //create toggle function to change background color
        selectToggle(clickedSong);
    })
})

