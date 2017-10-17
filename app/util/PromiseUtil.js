function delay(time) {
	return new Promise(function(resolve) {
		setTimeout(resolve, time);
	});
}

function withTimeout(promise, timeout) {
	return Promise.race([
		promise,
		delay(timeout).then(function() {
			throw new Error("Timeout");
		})
	])
}

export {
	delay,
	withTimeout
}