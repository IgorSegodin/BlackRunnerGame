import {MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT} from 'game/input/inputListener';
import {isIntersected} from 'util/FabricUtil';

function simulateWorld(world) {

	// TODO calculate values depending on passed time (use Timer)
	// TODO divide into diferent simulators (player input simulator)
	// TODO improve player and world properties (canMove, isAlive etc.)

	const playerIntersectionTolerance = (world.player.getWidth() + world.player.getHeight()) / 2 * 0.1; // 10% of player size

	for (let obj of world.objects) {
		let left = obj.get("left") + obj.get("speed");

		const right = left + obj.getWidth();

		if (right >= world.totalRowWidth) {
			left = right - world.totalRowWidth - obj.getWidth();
		}

		obj.set({
			left: left
		});

		if (world.player.get('canMove') && isIntersected(world.player, obj, playerIntersectionTolerance)) {
			world.player.set({canMove: false});
			world.eventCallbacks.gameOver();
		}
	}

	if (world.player.get('canMove')) {

		if (isIntersected(world.player, world.prize, playerIntersectionTolerance)) {
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
			if (playerPosition.top + world.player.getHeight() > world.height) {
				playerPosition.top = world.height - world.player.getHeight();
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
			if (playerPosition.left + world.player.getWidth() > world.width) {
				playerPosition.left = world.width - world.player.getWidth();
			}
		}

		world.player.set(playerPosition);
	}
}

export default simulateWorld;