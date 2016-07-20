/*
Examples :
http://api.deezer.com/search/album?q=daniel guichard
http://api.deezer.com/oembed?url=https://www.deezer.com/album/215359
*/

// Just to get input parameter from URL (stupid js language !)
var getQueryParam = function(param) {
    var found;
    window.location.search.substr(1).split("&").forEach(function(item) {
        if (param ==  item.split("=")[0]) {
            found = item.split("=")[1];
        }
    });
    return found;
};

// Call first API to get albums from search request as a JSON format response
function newSearchValueSubmit(searchValue) {
    $.ajax({
		url: "http://api.deezer.com/search/album?q=" + searchValue + "&output=jsonp&index=0&limit=1000",
		dataType: "jsonp",
		data: {
			format: "json"
		},
		success: function( response ) {
			sessionStorage.setItem("albums", JSON.stringify(response.data));
			window.location.href = "albums.html";
		}
	});
}

// Browse reponse to build links, one for each album
function loadAlbums() {
    var htmlContent = "";
    var albumsData = JSON.parse(sessionStorage.getItem("albums"));
    for (var albumIndex in albumsData) {
        var albumTitle = albumsData[albumIndex].title;
        var albumLink = albumsData[albumIndex].link;
        htmlContent += "<a href=\"play.html?url=" + albumLink + "\">" + albumTitle + "</a><br/>"
    }
    if (htmlContent == "") {
        $("#albums-content").html("Aucun album" + getIndexLink());
    } else {
        $("#albums-content").html(htmlContent);
    }
}

// Call second API to get HTML embed
function loadPlay() {
    $.ajax({
		url: "http://api.deezer.com/oembed?url=" + getQueryParam("url") + "&output=jsonp&autoplay=true&width=800&height=600",
		dataType: "jsonp",
		data: {
			format: "json"
		},
		success: function( response ) {
			 $("#play-content").html(response.html + getAlbumsLink() + getIndexLink());
		}
	});
}

function getIndexLink() {
    return "<br/><a href=\"index.html\">Autre recherche</a>";
}
function getAlbumsLink() {
    return "<br/><a href=\"albums.html\">Autre album</a>";
}
