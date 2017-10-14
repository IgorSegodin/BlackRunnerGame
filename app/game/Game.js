import {fabric} from 'fabric';

import generateWorld from 'game/generateWorld';
import simulateWorld from 'game/simulateWorld';
import inputListener from 'game/inputListener';

class Game {

	constructor(canvasEl) {
		this.canvas = new fabric.Canvas(canvasEl);
		this.canvas.setHeight(500);
		this.canvas.setWidth(800);
	}

	init() {
		this.start();
	}

	start() {
		generateWorld(800, 500).then((world) => {

			this.clear();

			world.eventCallbacks.gameOver = () => {
				const text = new fabric.Text("Game Over", {
					fontWeight: 'bold',
					fill: 'rgba(246,0,0,1)',
					fontSize: 40
				});

				text.set({
					left: world.width / 2 - 80,
					top: world.height / 2 - text.get('height')
				});

				// TODO text animation

				this.canvas.add(text);
			};

			world.eventCallbacks.success = () => {
				const text = new fabric.Text("Flawless victory", {
					fontWeight: 'bold',
					fill: 'rgba(0,246,0,1)',
					fontSize: 40
				});

				text.set({
					left: world.width / 2 - 80,
					top: world.height / 2 - text.get('height')
				});

				// TODO text animation

				this.canvas.add(text);
			};

			this.canvas.add(world.player);

			for (let obj of world.objects) {
				this.canvas.add(obj);
			}

			inputListener(world);

			this.interval = setInterval(() => {
				simulateWorld(world);
				this.canvas.renderAll();
			}, 40);
		});
	}

	clear() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}

		this.canvas.clear();
	}

}

export default Game