(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//config
"use strict";

var ww = 344;
var wh = 344;
var minSquareSize = 10;
var sizeTimeRatio = 1;
var svg = d3.select('svg');

//'global' variables
var startRandom = 0;
var lastMaxRandom = 1;
var maxRandom = 1;

//Setting canvas
var canvas = document.getElementById("myCanvas");
canvas.width = ww;
canvas.height = wh;
var ctx = canvas.getContext("2d");
var imgLoaded = function imgLoaded() {
	ctx.drawImage(img, 0, 0);
	process();
};

//Loadin img and calling recursive process
var img = new Image();
img.src = "hqdefault.jpg";
//has the img been loaded
if (img.completed || img.readyState == 4) {
	imgLoaded();
} else {
	img.onload = imgLoaded;
}

//defualt data
var process = function process(_x) {
	var _again = true;

	_function: while (_again) {
		var data = _x;
		_again = false;

		var size = undefined;

		if (!data) {

			data = [{ x: 0, y: 0, w: ww, h: wh, childs: [0, 1, 2, 3] }];
		} else {

			//pick element and store
			var candidates = data.slice(startRandom, startRandom + maxRandom).filter(function (x) {
				return x.childs.length > 0;
			});

			if (!candidates.length) {

				if (data[data.length - 1].w < minSquareSize) {
					return;
				}

				startRandom += lastMaxRandom;
				maxRandom = lastMaxRandom * 4;
				lastMaxRandom = maxRandom;
				_x = data;
				_again = true;
				size = candidates = undefined;
				continue _function;
			}

			var sqIndex = Math.random() * candidates.length | 0;
			var _parent = candidates[sqIndex];

			//pick child element
			var childIndex = Math.random() * _parent.childs.length | 0;
			var childId = _parent.childs[childIndex];

			size = _parent.w / 2;

			//add the new block
			data.push({
				w: size,
				h: size,
				x: childId % 2 == 0 ? _parent.x : _parent.x + size,
				y: childId < 2 ? _parent.y : _parent.y + size,
				childs: size > minSquareSize ? [0, 1, 2, 3] : []
			});

			//remove child index already used
			_parent.childs.splice(childIndex, 1);
		}

		var rects = svg.selectAll('rect').data(data);

		var sizeTransition = 0,
		    maxTransition = 0;

		rects.enter().append('rect').attr('x', function (d) {
			return Math.random() < 0.5 ? d.x : d.x + d.w;
		}).attr('y', function (d) {
			return Math.random() < 0.5 ? d.y : d.y + d.h;
		}).attr('width', 0).attr('height', 0).attr('fill', function (d) {
			sizeTransition = d.w * sizeTimeRatio;
			maxTransition = Math.max(sizeTransition, maxTransition);
			var gray = d.w * 255 / ww | 0;
			var _ctx$getImageData$data = ctx.getImageData(d.x + d.w / 2, d.y + d.h / 2, 1, 1).data;
			var r = _ctx$getImageData$data[0];
			var g = _ctx$getImageData$data[1];
			var b = _ctx$getImageData$data[2];

			return "rgb(" + r + ", " + g + ", " + b + ")";
		}).transition().duration(maxTransition * 8).attr('x', function (d) {
			return d.x;
		}).attr('y', function (d) {
			return d.y;
		}).attr('width', function (d) {
			return d.w;
		}).attr('height', function (d) {
			return d.h;
		});

		if (data.length) {
			setTimeout(function () {
				process(data);
			}, size * sizeTimeRatio);
		}
	}
};

},{}]},{},[1]);
