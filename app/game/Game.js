import {fabric} from 'fabric';

import generateWorld from 'game/world/generateWorld';
import simulateWorld from 'game/simulation/simulateWorld';
import simulateTranslation from 'game/simulation/simulateTranslation';
import inputListener from 'game/input/inputListener';
import {rgbaTranslation, scaleTranslation} from 'game/translation/TranslationFactory';

class Game {

	constructor(canvasEl) {
		this.canvas = new fabric.Canvas(canvasEl);
		this.canvas.setHeight(window.innerHeight * 0.98);
		this.canvas.setWidth(window.innerWidth * 0.98);
	}

	init() {
		this.start();
	}

	start() {
		generateWorld(this.canvas.getWidth(), this.canvas.getHeight()).then((world) => {

			this.clear();

			world.eventCallbacks.gameOver = () => {
				this.alert({
					text:"Game Over",
					color: {r: 220, g: 0, b: 0}
				});
			};

			world.eventCallbacks.success = () => {
				this.alert({
					text:"Flawless victory",
					color: {r: 160, g: 220, b: 50}
				});
			};

			this.canvas.add(world.prize);
			this.canvas.add(world.player);

			for (let obj of world.objects) {
				this.canvas.add(obj);
			}

			inputListener(world);

			this.interval = setInterval(() => {
				simulateWorld(world);
				simulateTranslation(this.canvas.getObjects(), world);
				this.canvas.renderAll();
			}, 40);
		});
	}

	alert({text, color:{r, g, b}}) {
		const textElem = new fabric.Text(text, {
			fontWeight: 'bold',
			fill: `rgba(${r},${g},${b},0)`,
			fontSize: this.canvas.getHeight() * 0.15,
			scaleX: 0.2,
			scaleY: 0.2,
			translations: [
				rgbaTranslation({
					duration: 1000,
					finalValue: `rgba(${r},${g},${b},1)`
				}),
				scaleTranslation({
					duration: 1000,
					finalValue: 1
				})
			]
		});

		textElem.set({
			left: this.canvas.getWidth() / 2 - textElem.getWidth() / 2,
			top: this.canvas.getHeight() / 2 - textElem.getHeight() / 2,
		});

		this.canvas.add(textElem);
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