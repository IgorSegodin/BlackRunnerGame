function simulateTranslation(objects, world) {

	// TODO use world timer
	const now = new Date().getTime();

	for (let obj of objects) {
		let translations = obj.get("translations");
		if (!translations || translations.length === 0) {
			continue;
		}

		let finishedTranslationIndexes = [];

		for (let idx = 0; idx < translations.length; idx++) {
			const translationData = translations[idx];

			if (!translationData._simulation) {
				translationData._simulation = {
					startTime: now,
					finishTime: now + translationData.duration
				};
			}

			const timePassed = now - translationData._simulation.startTime;

			const linearProgress = timePassed / translationData.duration;

			translationData.updateValue({timePassed, linearProgress, translationData, targetObject: obj});

			if (now >= translationData._simulation.finishTime) {
				if (translationData.infinite) {
					throw new Error('Infinite animation is not implemented yet');
				} else {
					finishedTranslationIndexes.push(idx);
				}
			}
		}

		for (let idx of finishedTranslationIndexes) {
			const translationData = translations[idx];
			translations = translations.splice(idx + 1, 1);

			if (translationData.onFinish) {
				translationData.onFinish({translationData, targetObject: obj});
			}
		}

		obj.set({
			translations
		});
	}

}

export default simulateTranslation;