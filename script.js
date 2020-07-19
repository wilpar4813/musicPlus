
$(document).ready(function () {

    //var toggle = true;
    var localPlaylist = localStorage.getItem('playlist');
    var foundSong = false;
    var foundSongName;
    var clickThis;
    var addSongArr = localPlaylist ? JSON.parse(localPlaylist) : [];
    var newSongArr = [];
    var isPlaying = false;
    var imgDataElNum;
    var beenCleared = false;
    var artistName;
    $('#lyrix').hide();
    $('#add').hide();
    $('#remove').hide();
    // $('#playlist').hide();
    $('#searchButton').on('click', function (event) {
        // e.preventDefault();
        $('#songRow').empty();
        
        var artist = $('#searchInput').val();
        
        $.ajax({
            headers: {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "4e31acf4c0mshe9fe802121748ecp15e1f1jsn3259148dce29"
            },
            url: "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $('#add').show();
            //create song div
            for (var i = 0; (i < response.data.length ); i++) {
                artistName = response.data[i].artist.name;
                var titleDiv = $(`<div class="column" id="songSpot" data-number=${i} data-preview=${response.data[i].preview} >`);
                titleDiv.attr('style', 'background-size: cover; background-repeat: no-repeat, repeat; background-image: url("' + response.data[i].album.cover + '");');
                titleDiv.html("<span id='songTitle'>" + response.data[i].title + "<span>");
                // var albumDiv = $('<div id="album">');
                // albumDiv.text("Album: " + response.data[i].album.title);
                //titleDiv.append(albumDiv);
                
                $('#songRow').append(titleDiv);
                $('#songRow').attr('style', 'padding:20px;margin-bottom:20px;');
            }
        })
    })

    function selectToggle(compareSong) {
        //console.log(compareSong);
        $("#songLyrix").html('');
        //get song lyrics
        //console.log(compareSong)
        getLyrix(compareSong, artistName);

        if (addSongArr.length > 0) {
            for (var i = 0; i < addSongArr.length; i++) {
                //console.log(addSongArr[i].title)
                //console.log(compareSong.slice(7))
                if (addSongArr[i].title === compareSong) {
                    foundSongName = addSongArr[i].title;
                    foundSong = true;
                }
            }
        }
        if (!foundSong) {
            //console.log(compareSong)
            //set background color of song div to blue
            clickThis.attr('style', 'border:5px solid purple;');
            // clickThis.attr('style', 'background-size: cover; background-repeat: no-repeat, repeat; background-image: url("' + addSongArr[i].album.cover + '");');
            //push selected song title in array
            addSongArr.push({
                id: clickThis.attr('data-number'),
                title: clickThis.text(),
                preview: clickThis.attr('data-preview'),
                artist: artistName
            });
            //console.log(addSongArr);
        } else {
            clickThis.attr('style', 'border:4px solid black;');
            //remove selected song title out of array
            //filter the array to create a new array minus the selected song
            newSongArr = addSongArr.filter(function (val) {
                //console.log(val.title);
                //console.log(compareSong.slice(7))
                return val.title !== foundSongName;
            });
            //update playlist array in local storage;
            localStorage.setItem('playlist', JSON.stringify(newSongArr));

            //console.log(newSongArr)

            addSongArr = newSongArr;

            //console.log(addSongArr)

            foundSong = false;
        }
        //console.log(addSongArr);
    }

    function addToPlaylist() {
        $('#remove').show();
        //this function stops music so set var to not playing i.e. false
        isPlaying = false;
        //save playlist array to local storage;
        localStorage.setItem('playlist', JSON.stringify(addSongArr));
        //add playlist array to playlist div
        var playlistEl = $('#playlist');
        addSongArr.forEach(function (val) {

            //create new div
            var div = $('<div>');
            var preview = val.preview
            div.attr('id', 'playlistItem');
            div.attr('data-title', val.title);
            div.attr('data-artist', val.artist);
            div.attr('data-play', 'https://img.icons8.com/flat_round/24/000000/play--v1.png');
            div.attr('data-pause', 'https://img.icons8.com/flat_round/24/000000/pause--v1.png')
            div.attr('data-delete', 'https://img.icons8.com/plasticine/100/000000/filled-trash.png')
            div.html(val.title + `<span id='songBtn' style='float: right;'>
        <img src='https://img.icons8.com/flat_round/24/000000/play--v1.png' /></span>`);

            // Gets Link for Theme Song
            var audioElement = $("<audio>");

            audioElement.attr("src", preview);
            div.append(audioElement);
            playlistEl.append(div);

        })
        // var clearBtn = $('<button type="button" id="remove">Clear Playlist</button>');
        // playlistEl.append(clearBtn);
    }

    function initPlaylist() {
        if (addSongArr.length > 0) {
            fromLocal = true;
            addToPlaylist();
        }else{
            $('#playlist').hide();
        }
    }

    $(document).on('click', '#playlistItem', function (e) {
        var playMe = $(this)[0].childNodes[2];
        var thisEl = $(this);

        if (!isPlaying) {
            //console.log(playMe)
            //console.log(thisEl[0])
            playMe.play();
            //add lyrics
            getLyrix(thisEl[0].getAttribute('data-title'), thisEl[0].getAttribute('data-artist'))
            var parentDiv;
            isPlaying = true;
            //get pause button attribute to display
            if (beenCleared) {
                imgDataElNum = 2;
            } else {
                imgDataElNum = 5;
            }
            parentDiv = $(this).parent()[0].childNodes[imgDataElNum];
            // console.log(imgDataElNum)
            // console.log(thisEl.parent()[0].childNodes)
            var pauseBtnData = parentDiv.getAttribute('data-pause');
            //set img src attribute to be pause button
            var pauseLocale = $(this)[0].childNodes[1].childNodes[1];
            pauseLocale.setAttribute('src', pauseBtnData);

            playMe.addEventListener('ended', function () {
                isPlaying = false;
                //console.log($(this)[0].parentNode)
                var parentDiv = $(this)[0].parentNode;
                //console.log(parentDiv)
                var playBtnData = parentDiv.getAttribute('data-play');
                //set img src attribute to be play button
                var imgSrcEl = $(this)[0].previousSibling.children[0];
                imgSrcEl.setAttribute('src', playBtnData);
                // console.log(parentDiv)
            });
        } else {
            playMe.pause();
            isPlaying = false;
            //console.log(thisEl)
            var playBtnData = thisEl.attr('data-play');
            //get img element
            var imgEl = thisEl.children()[0].children[0];
            imgEl.setAttribute('src', playBtnData);
            //console.log(thisEl.children()[0].children[0])
        }
    })

    $('#add').on('click', function (e) {
        //set cleared boolean
        beenCleared = true;
        $('#playlist').show();
        $('#remove').show();
        //remove previous playlist
        $('#playlist').empty();
        //re-add header and hr
        var h1 = $('<h1>');
        h1.text('PlayList');
        var hr = $('<hr>');
        $('#playlist').append(h1);
        $('#playlist').append(hr);
        //add to playlist
        addToPlaylist();
    })

    $('#remove').on('click', function () {
        console.log("clear button hit");
        confirmation = confirm("Confirm to Delete");
        console.log(confirmation);
        if(confirmation === false){
            return;
        };
        beenCleared = true;
        $('#playlist').hide();
        $('#remove').hide();
        $('#add').hide();
        $('#lyrix').hide();
        //clear background color and playlist array
        $('#songRow').children().attr('style', 'background: darkgrey;');
        $('#songRow').empty();
        $('#songLyrix').empty();
        localStorage.setItem('playlist', []);
        addSongArr = [];
        newSongArr = [];
        //get all of the playlist items on the page
        var playlistItems = document.querySelectorAll('#playlistItem');
        var playlistItemsArr = [].slice.call(playlistItems);
        //console.log(playlistItemsArr);
        playlistItemsArr.forEach(function (val) {
            val.remove();
        })
    })

    $(document).on('click', '#songSpot', function (e) {
        var clickedSong = e.target.innerText;
        clickThis = $(this);
        //create toggle function to change background color
        selectToggle(clickedSong);
    })

    //initialize playlist from local storage if available
    initPlaylist();

})

