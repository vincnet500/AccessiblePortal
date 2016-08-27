/*
Examples :
http://api.deezer.com/search/album?q=daniel guichard
http://api.deezer.com/oembed?url=https://www.deezer.com/album/215359
*/

var openWeatherAPPID = "ec336bb0586c8da694f909d8b3d05329";
var weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

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
			 $("#play-content").html(getAlbumsLink() + getIndexLink() + response.html);
		}
	});
}

function getIndexLink() {
    return "<a href=\"deezer.html\">Autre recherche</a><br/>";
}
function getAlbumsLink() {
    return "<a href=\"albums.html\">Autre album</a><br/>";
}

function loadMeteoNow(searchValue) {
    $.ajax({
		url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + openWeatherAPPID + "&units=metric&lang=fr",
		dataType: "json",
		data: {
			format: "json"
		},
		success: function(response) {
            var htmlContent = "";
            if (typeof(response.weather) != "undefined") {
                var meteoDescription = response.weather[0].description;
                var meteoTemperature = response.main.temp;
                var htmlContent = "Aujourd'hui, en ce moment, " + meteoDescription + ", " + meteoTemperature + " degrés."
            }
            $("#meteo-now-content").html(htmlContent);
		}
	});
}

function loadMeteoForecast(searchValue, count) {
    $.ajax({
		url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + openWeatherAPPID + "&units=metric&lang=fr",
		dataType: "json",
		data: {
			format: "json"
		},
		success: function(response) {
            var htmlContent = "";
            var index = 0;
            var now = new Date();
            var currentDay = now.getUTCDate();
            if (typeof(response.list) != "undefined") {
                for (var x = 0; x < response.list.length; x++) {
                    var currentForecast = response.list[x];
                    var cfDate = new Date(1000*currentForecast.dt);
                    var cfDateDay = cfDate.getUTCDate();
                    var cdDateDayLabel = weekdays[cfDate.getDay()];
                    var cfDateMonthLabel = months[cfDate.getMonth()]
                    var dtTxt = currentForecast.dt_txt;
                    if (currentDay != cfDateDay && index < count && dtTxt.indexOf("12:00") !== -1) {
                        htmlContent += cdDateDayLabel + " " + cfDateDay + " " + cfDateMonthLabel + ", " + currentForecast.weather[0].description + ", " + currentForecast.main.temp + " degrés.<br/>"
                        currentDay = cfDateDay;
                        index++;
                    }
                }
            }
            $("#meteo-forecast-content").html(htmlContent);
		}
	});
}

