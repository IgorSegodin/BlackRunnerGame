import {Rgba, parseRgba} from 'util/FabricUtil';

function calcLinearValue(start, end, progress) {
	return start + (end - start) * progress;
}

/**
 * Translates given property
 * @param property
 * @param finalValue
 * @param duration
 * @return {{updateValue: (function({timePassed: *, linearProgress?: *, translationData: *, targetObject: *})), duration: *}}
 */
function propertyTranslation({property, finalValue, duration}) {
	return {
		updateValue: ({timePassed, linearProgress, translationData, targetObject}) => {
			if (!translationData._simulation.startValue) {
				translationData._simulation.startValue = targetObject.get(property)
			}

			const value = calcLinearValue(translationData._simulation.startValue, finalValue, linearProgress);

			targetObject.set({
				[property]: value
			});
		},
		duration: duration,
	}
}

/**
 * Translates 'fill' RGBA values
 * @param finalValue
 * @param duration
 * @return {{updateValue: (function({timePassed: *, linearProgress?: *, translationData: *, targetObject: *})), duration: *}}
 */
function rgbaTranslation({finalValue, duration}) {
	return {
		updateValue: ({timePassed, linearProgress, translationData, targetObject}) => {
			if (!translationData._simulation.startValue) {
				translationData._simulation.startValue = parseRgba(targetObject.get('fill'));
			}
			if (!translationData._simulation.finalValue) {
				translationData._simulation.finalValue = parseRgba(finalValue);
			}
			const startRgba = translationData._simulation.startValue;
			const finalRgba = translationData._simulation.finalValue;

			const red = calcLinearValue(startRgba.getRed(), finalRgba.getRed(), linearProgress);
			const green = calcLinearValue(startRgba.getGreen(), finalRgba.getGreen(), linearProgress);
			const blue = calcLinearValue(startRgba.getBlue(), finalRgba.getBlue(), linearProgress);
			const alpha = calcLinearValue(startRgba.getAlpha(), finalRgba.getAlpha(), linearProgress);

			targetObject.set({
				fill: new Rgba(red, green, blue, alpha).toString()
			});
		},
		duration: duration,
	}
}

/**
 * Translates 'scaleX' and 'scaleY', also changes 'left' and 'top' proportionally to changed size
 * @param finalValue
 * @param duration
 * @return {{updateValue: (function({timePassed: *, linearProgress?: *, translationData: *, targetObject: *})), duration: *}}
 */
function scaleTranslation({finalValue, duration}) {
	return {
		updateValue: ({timePassed, linearProgress, translationData, targetObject}) => {
			if (!translationData._simulation.startValue) {
				translationData._simulation.startValue = {
					x: targetObject.get('scaleX'),
					y: targetObject.get('scaleY'),
				}
			}
			const startValue = translationData._simulation.startValue;

			const scaleX = calcLinearValue(startValue.x, finalValue, linearProgress);
			const scaleY = calcLinearValue(startValue.y, finalValue, linearProgress);

			const width = targetObject.getWidth();
			const height = targetObject.getHeight();

			targetObject.set({
				scaleX, scaleY
			});

			targetObject.set({
				left: targetObject.get("left") - (targetObject.getWidth() - width) / 2,
				top: targetObject.get("top") - (targetObject.getHeight() - height) / 2,
			});
		},
		duration: duration,
	}
}

export {
	propertyTranslation,
	rgbaTranslation,
	scaleTranslation
}