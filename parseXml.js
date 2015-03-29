var http = require('http');
var parseString = require('xml2js').parseString;
var request = require('request');
var fs = require('fs');




var createURL = function (market, article, entries) {
	var chartsUrl = {
		root :"https://itunes.apple.com/", 
		folder: "/limit=" + entries +"/xml"
	};
	var url = chartsUrl.root + market +"/rss/" + article+ chartsUrl.folder;
	console.log(url);
	return url;
};

var cleanText = function(album) {

	var text = /\s[\(\-]|\:/i;
	var index = album[1].search(text)
	var search = album[0].search("T");
	album[0] = album[0].slice(0,search);
	album[1] = album[1].replace(/,/g,"")
	if (index != -1) {

		album[1] = album[1].slice(0,index);
	};

	return album
};



var saveList = function (result, market, article, entries) {
	var text = "";
	var header = "artist, artist url, item, item url, genre, release date";
	var v = ",";
	for (var i = 0; i < entries; i++) {

		var f = result.feed.entry[i];
		var artistURL = null;
		var date = f['im:releaseDate'][0]['_'];
		var album = f["im:name"][0];
		var albumURL = f["id"][0]["_"].replace("?uo=2", "?ls=1");
		var artist = f['im:artist'][0]["_"];
		var genre = f["category"][0]['$']['term'].replace(/,/g,"");
		var clean = cleanText([date, album]);

		if (artist) {
			artistURL = f['im:artist'][0]["$"]["href"].replace("?uo=2", "?ls=1");
		}
		var lista = artist + v + artistURL + v + clean[1] + v + albumURL + v + genre + v + clean[0] + "\n";
		var file = "/Users/rocco/desktop/liste/"+ article + "_" + market.toUpperCase() + ".csv"	
		text = text + lista;
	};
	text = header + "\n" + text;
	return text;
};


exports.createURL = createURL;
exports.saveList = saveList;








	
	
	

