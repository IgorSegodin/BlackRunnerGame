import {fabric} from 'fabric';
import PekaImage from 'peka.png';
import DollarImage from 'dollar.png';
import {promiseImage} from 'util/FabricUtil';

function random(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function generateMap(totalSegmentCount, rowSegmentCount) {
	const map = [];

	for (let i = 1; i <= totalSegmentCount; i++) {
		map.push(i <= rowSegmentCount ? 1 : 0);
	}

	const numberOfShuffles = random(totalSegmentCount / 2, totalSegmentCount * 2);

	for (let i = 0; i <= numberOfShuffles; i++) {
		const p1 = random(0, map.length - 1);
		const p2 = random(0, map.length - 1);

		const tmp = map[p1];
		map[p1] = map[p2];
		map[p2] = tmp;
	}

	return map;
}

function generateWorld(width, height) {
	const rowNumber = 7;
	const rowHeight = height / rowNumber;
	const playerSize = height * 0.10; // 10% of total visible screen

	const segmentWidth = width * 0.10; // 10% of total visible screen
	const totalRowWidth = width * 3; // 3 times of visible screen

	const totalSegmentCount = totalRowWidth / segmentWidth;
	const minSegmentCount = totalSegmentCount * 0.2;
	const maxSegmentCount = totalSegmentCount * 0.8;

	const objects = [];

	// skip first, last row, and each second row
	for (let row = 1; row < rowNumber - 1; row++) {
		if (row % 2 == 0) {
			continue;
		}
		const rowSegmentCount = random(minSegmentCount, maxSegmentCount);

		const map = generateMap(totalSegmentCount, rowSegmentCount);

		const rowSpeed = random(1, 20);

		for (let cell = 0; cell < map.length; cell++) {
			if (map[cell] === 0) {
				continue;
			}
			objects.push(
				new fabric.Rect({
					left: cell * segmentWidth,
					top: row * rowHeight,
					fill: 'black',
					width: segmentWidth,
					height: rowHeight,
					speed: rowSpeed
				})
			);
		}
	}

	return Promise.all([promiseImage(PekaImage), promiseImage(DollarImage)]).then((images) => {

		const world = {
			width: width,
			height: height,
			rowHeight: rowHeight,
			totalRowWidth: totalRowWidth,
			objects: objects,
			input: {},
			eventCallbacks: {}
		};

		world.player = images[0];

		world.player.set({
			width: playerSize,
			height: playerSize,
			left: (width / 2) - (playerSize / 2),
			top: height - playerSize,
			speed: 10,
			canMove: true
		});

		world.prize = images[1];

		world.prize.set({
			width: rowHeight,
			height: rowHeight / 2,
			left: (width / 2) - (rowHeight / 2),
			top: 0
		});

		return world;
	});
}

export default generateWorld;