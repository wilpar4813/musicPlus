
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

    $('#searchButton').on('click', function () {
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
            //console.log(response);
            //create song div
            for (var i = 0; (i < response.data.length && i < 10); i++) {
                var titleDiv = $(`<div class="column" id="songSpot" data-number=${i} data-preview=${response.data[i].preview} >`);
                titleDiv.html("Title: <span id='songTitle'>" + response.data[i].title + "<span>");
                var albumDiv = $('<div id="album">');
                albumDiv.text("Album: " + response.data[i].album.title);
                //titleDiv.append(albumDiv);
                $('#songRow').append(titleDiv);
            }
        })
    })

    function selectToggle(compareSong) {
        //console.log(compareSong);

        if (addSongArr.length > 0) {
            for (var i = 0; i < addSongArr.length; i++) {
                //console.log(addSongArr[i].title)
                //console.log(compareSong.slice(7))
                if (addSongArr[i].title === compareSong.slice(7)) {
                    foundSongName = addSongArr[i].title;
                    foundSong = true;
                }
            }
        }
        if (!foundSong) {
            //console.log(compareSong)
            //set background color of song div to blue
            clickThis.attr('style', 'background: blue;');
            //push selected song title in array
            addSongArr.push({
                id: clickThis.attr('data-number'),
                title: clickThis.text().slice(7),
                preview: clickThis.attr('data-preview')
            });
            //console.log(addSongArr);
            //save playlist array to local storage;
            localStorage.setItem('playlist', JSON.stringify(addSongArr));
        } else {
            clickThis.attr('style', 'background: darkgrey;');
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
        //add playlist array to playlist div
        var playlistEl = $('#playlist');
        addSongArr.forEach(function (val) {

            //create new div
            var div = $('<div>');
            var preview = val.preview
            div.attr('id', 'playlistItem');
            div.attr('data-title', val.title);
            div.attr('data-play', 'https://img.icons8.com/flat_round/24/000000/play--v1.png');
            div.attr('data-pause', 'https://img.icons8.com/flat_round/24/000000/pause--v1.png')
            div.html(val.title + `<span id='songBtn' style='float: right;'>
        <img src='https://img.icons8.com/flat_round/24/000000/play--v1.png' /></span>`);

            // Gets Link for Theme Song
            var audioElement = $("<audio>");

            audioElement.attr("src", preview);
            div.append(audioElement);
            playlistEl.append(div)

        })
    }

    function initPlaylist() {
        if (addSongArr.length > 0) {
            fromLocal = true;
            addToPlaylist();
        }
    }

    $(document).on('click', '#playlistItem', function (e) {
        var playMe = $(this)[0].childNodes[2];
        var thisEl = $(this);

        if (!isPlaying) {
            //console.log(playMe)
            playMe.play();
            var parentDiv;
            isPlaying = true;
            //get pause button attribute to display
            if (beenCleared) {
                imgDataElNum = 2;
            } else {
                imgDataElNum = 5;
            }
            parentDiv = $(this).parent()[0].childNodes[imgDataElNum];
            //console.log(parentDiv)
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
        beenCleared = true;
        //clear background color and playlist array
        $('#songRow').children().attr('style', 'background: darkgrey;');
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

