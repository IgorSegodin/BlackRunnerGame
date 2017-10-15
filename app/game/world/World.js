// TODO implement World wrapper, to incapsulate some internal logic (like Timer thread)


class InputProcessor {

	onKeyDown(keyCode, world) {}
	onKeyUp(keyCode, world) {}
}

class WorldSimulator {

	simulate(/** TODO some time period, passed between simulations */) {

	}
}


class World {

	constructor() {
		this.inputProcessors = [];
		this.worldSimulators = [];
		this.eventListeners = [];

	}

	/**
	 * @param processor {InputProcessor}
	 */
	addInputProcessor(processor) {

	}

	/**
	 * @param simulator {WorldSimulator}
	 */
	addSimulator(simulator) {

	}

	addEventListener(listener) {}

	pauseTime() {}
	resumeTime() {}

	getTime() {

	}

	triggerEvent({type, props}) {}

	processTick() {}

	destroy() {}

}

export default World;
export {World, WorldSimulator, InputProcessor}
