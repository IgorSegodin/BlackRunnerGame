import 'style.css';
import Game from 'game/Game';

document.addEventListener("DOMContentLoaded", function () {

	const canvasEl = document.createElement('canvas');

	new Game(canvasEl).init();

	document.body.appendChild(canvasEl);
});
