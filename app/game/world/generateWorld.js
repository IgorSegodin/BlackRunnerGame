import {fabric} from 'fabric';
import PekaImage from 'peka.png';
import DollarImage from 'dollar.png';
import {promiseImage} from 'util/FabricUtil';

function random(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function findSegmentBorders(index, map) {
	if (index > map.length - 1) {
		throw new Error("IndexOutOfBoundsException");
	}
	const val = map[index];

	let left = index;
	let right = index;

	while (true) {
		let found = true;
		if (left > 0 && map[left - 1] === val) {
			left--;
			found = false;
		}
		if (right < map.length - 1 && map[right + 1] === val) {
			right++;
			found = false;
		}
		if (found) {
			break;
		}
	}
	return {left, right};
}

function generateMap(totalSegmentCount, rowSegmentCount, maxSegmentCountPerRow) {
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

	// Fix super long segments, they should not be longer that maxSegmentCountPerRow
	for (let i = 0; i < map.length;i++)  {
		const value = map[i];
		if (value === 0) {
			continue;
		}
		const borders = findSegmentBorders(i, map);
		const segmentLength = borders.right - borders.left;

		if (segmentLength > maxSegmentCountPerRow) {
			map[segmentLength / 2] = 0;
		}

		i = borders.right;
	}

	return map;
}

function promiseGenerateWorld(width, height) {
	const rowNumber = 7;
	const rowHeight = height / rowNumber;
	const playerSize = height * 0.10; // 10% of total visible screen

	const segmentWidth = width * 0.10; // 10% of total visible screen
	const totalRowWidth = width * 3; // 3 times of visible screen

	const totalSegmentCount = Math.round(totalRowWidth / segmentWidth);
	const minSegmentCount = Math.round(totalSegmentCount * 0.2);
	const maxSegmentCount = Math.round(totalSegmentCount * 0.8);

	return new Promise(function(resolve, reject) {
		const objects = [];

		// skip first, last row, and each second row
		for (let row = 1; row < rowNumber - 1; row++) {
			if (row % 2 == 0) {
				continue;
			}
			const rowSegmentCount = random(minSegmentCount, maxSegmentCount);

			const map = generateMap(totalSegmentCount, rowSegmentCount, Math.round(maxSegmentCount * 0.66));

			const rowSpeed = random(1, 20);

			let stackSize = 0;
			for (let cell = 0; cell < map.length; cell++) {
				if (map[cell] === 1) {
					stackSize++;
				} else  if (map[cell] === 0 && stackSize > 0) {
					objects.push(
						new fabric.Rect({
							left: (cell - stackSize) * segmentWidth,
							top: row * rowHeight,
							fill: 'black',
							width: segmentWidth * stackSize,
							height: rowHeight,
							speed: rowSpeed
						})
					);
					stackSize = 0;
				}
			}
		}

		resolve(objects);

	}).then(function(objects) {
		return new Promise((resolve, reject) => {
			Promise.all([promiseImage(PekaImage), promiseImage(DollarImage)]).then((images) => {
				resolve({images, objects});
			});
		});
	}).then(({images, objects}) => {
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

export default promiseGenerateWorld;