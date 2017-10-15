const MOVE_UP = "MOVE_UP";
const MOVE_DOWN = "MOVE_DOWN";
const MOVE_LEFT = "MOVE_LEFT";
const MOVE_RIGHT = "MOVE_RIGHT";

function process(keyCode, world, isUp) {
	let move;
	switch (keyCode) {
		case 40: {
			move = MOVE_DOWN;
			break;
		}
		case 38: {
			move = MOVE_UP;
			break;
		}
		case 37: {
			move = MOVE_LEFT;
			break;
		}
		case 39: {
			move = MOVE_RIGHT;
			break;
		}
	}
	if (move) {
		world.input[move] = isUp ? 0 : 1;
	}
}

// TODO return function to be able to clear listener
function inputListener(world) {
	document.addEventListener("keydown", function(e){
		process(e.keyCode, world, false);
	});
	document.addEventListener("keyup", function(e){
		process(e.keyCode, world, true);
	});

	return function() {};
}


export default inputListener

export {MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT}