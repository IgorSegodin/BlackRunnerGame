import {MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT} from 'game/inputListener';

function isIntersected(obj1, obj2) {
	const x1 = obj1.get('left') + (obj1.get('width') / 2);
	const y1 = obj1.get('top') + (obj1.get('height') / 2);
	const w1 = obj1.get('width');
	const h1 = obj1.get('height');

	const x2 = obj2.get('left') + (obj2.get('width') / 2);
	const y2 = obj2.get('top') + (obj2.get('height') / 2);
	const w2 = obj2.get('width');
	const h2 = obj2.get('height');

	return Math.abs(x1 - x2) <= w1 / 2 + w2 / 2 &&
		Math.abs(y1 - y2) <= h1 / 2 + h2 / 2;
}

function simulateWorld(world) {

	for (let obj of world.objects) {
		let left = obj.get("left") + obj.get("speed");

		const right = left + obj.get('width');

		if (right >= world.totalRowWidth) {
			left = right - world.totalRowWidth - obj.get('width');
		}

		obj.set({
			left: left
		});

		if (world.player.get('canMove') && isIntersected(world.player, obj)) {
			world.player.set({canMove: false});
			world.eventCallbacks.gameOver();
		}
	}

	if (world.player.get('canMove')) {

		if (world.player.get('top') + world.player.get('height') <= world.rowHeight ) {
			world.player.set({canMove: false});
			world.eventCallbacks.success();
		}

		const playerPosition = {
			top: world.player.get('top'),
			left: world.player.get('left')
		};

		if (world.input[MOVE_UP]) {
			playerPosition.top = playerPosition.top - world.player.speed;
			if (playerPosition.top < 0) {
				playerPosition.top = 0;
			}
		}

		if (world.input[MOVE_DOWN]) {
			playerPosition.top = playerPosition.top + world.player.speed;
			if (playerPosition.top + world.player.get('height') > world.height) {
				playerPosition.top = world.height - world.player.get('height');
			}
		}

		if (world.input[MOVE_LEFT]) {
			playerPosition.left = playerPosition.left - world.player.speed;
			if (playerPosition.left < 0) {
				playerPosition.left = 0;
			}
		}

		if (world.input[MOVE_RIGHT]) {
			playerPosition.left = playerPosition.left + world.player.speed;
			if (playerPosition.left + world.player.get('width') > world.width) {
				playerPosition.left = world.width - world.player.get('width');
			}
		}

		world.player.set(playerPosition);
	}
}

export default simulateWorld;