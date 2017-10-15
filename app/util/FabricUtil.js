import {fabric} from 'fabric';

function Rgba(red, green, blue, alpha) {
	let r = Math.round(+red);
	let g = Math.round(+green);
	let b = Math.round(+blue);
	let a = +alpha;

	this.getRed = function () {
		return r;
	};
	this.setRed = function (value) {
		r = value;
	};
	this.getGreen = function () {
		return g;
	};
	this.setGreen = function (value) {
		g = value;
	};
	this.getBlue = function () {
		return b;
	};
	this.setBlue = function (value) {
		b = value;
	};
	this.getAlpha = function () {
		return a;
	};
	this.setAlpha = function (value) {
		a = value;
	};
	this.toString = function () {
		return `rgba(${r},${g},${b},${a})`;
	};
	this.copy = function () {
		return new Rgba(r, g, b, a);
	}
}

/**
 * @param imageUrl {String}
 * @return {Object} fabric image object
 */
function promiseImage(imageUrl) {
	return new Promise((resolve, reject) => {
		fabric.Image.fromURL(imageUrl, (image) => {
			resolve(image);
		});
	});
}

/**
 * @param obj1 {Object}
 * @param obj2 {Object}
 * @param tolerance {Number} possible delta, when object is treated as still not intersected
 * @return {Boolean} true, if objects intersect with each other
 */
function isIntersected(obj1, obj2, tolerance = 0) {
	const x1 = obj1.get('left') + (obj1.getWidth() / 2);
	const y1 = obj1.get('top') + (obj1.getHeight() / 2);
	const w1 = obj1.getWidth();
	const h1 = obj1.getHeight();

	const x2 = obj2.get('left') + (obj2.getWidth() / 2);
	const y2 = obj2.get('top') + (obj2.getHeight() / 2);
	const w2 = obj2.getWidth();
	const h2 = obj2.getHeight();

	return Math.abs(x1 - x2) + tolerance <= w1 / 2 + w2 / 2 &&
		Math.abs(y1 - y2) + tolerance <= h1 / 2 + h2 / 2;
}

/**
 * @param valueString {String} text like: rgba(255,255,255,1)
 * @return {Object} wrapped RGBA values
 */
function parseRgba(valueString) {
	const expression = /^\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/gi;

	const result = expression.exec(valueString);

	if (!result) {
		throw new Error(`Unexpected input: ${valueString}`);
	}

	return new Rgba(result[1], result[2], result[3], result[4]);
}

export {
	promiseImage,
	isIntersected,
	Rgba,
	parseRgba
}