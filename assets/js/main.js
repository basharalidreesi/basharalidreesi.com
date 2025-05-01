"use strict";

const b = {

	lexicon: {

		header: document.querySelector("#header"),
		graphic: document.querySelector("#header__graphic"),
		flStop: document.querySelector("#flStop"),
		stStop: document.querySelector("#stStop"),
		spZone: document.querySelector("#spZone"),
		sparkle: document.querySelector("#sparkle"),

		main: document.querySelector("#main"),
		jsOnly: document.querySelectorAll(".generic--jsOnly"),
		disabledAnchors: document.querySelectorAll(".generic--disabled"),
		numeros: document.querySelectorAll(".indexOfWorks__work__numero"),

		notes: document.querySelectorAll(".note__content"),

	},

	initAllScripts: function() {
		b.header.initHeaderScripts();
		b.main.initMainScripts();
	},

	header: {
		initHeaderScripts: function() {
			if (!b.lexicon.header
			    || !b.lexicon.graphic
			    || !b.lexicon.stStop
			    || !b.lexicon.spZone
			    || !b.lexicon.sparkle
			) {
				return;
			}
			b.header.trackCursorY();
		},
		trackCursorY: function() {
			window.addEventListener("mousemove", (event) => {
				if (!b.util.queryMedia("(any-hover: hover)")) { return; }
				if (b.util.queryMedia("(prefers-reduced-motion: reduce)")) { return; }
				let cursorYPos = event.clientY;
				let headerOffsetTop = b.lexicon.header.getBoundingClientRect().top;
				let headerHeight = b.lexicon.header.clientHeight;
				let cursorYRatio = (cursorYPos - headerOffsetTop) / headerHeight;
				let clampedCursorYRatio = b.util.clamp(0, cursorYRatio, 1);
				b.header.reportCursorY(clampedCursorYRatio);
			}, { passive: true });
		},
		reportCursorY: function(clampedCursorYRatio) {
			b.header.opacifyStops(clampedCursorYRatio);
			b.header.offsetStops(clampedCursorYRatio);
			b.header.shiftSpZone(clampedCursorYRatio);
		},
		opacifyStops: function(clampedCursorYRatio) {
			let opacificationRate = b.util.parabola(-4, clampedCursorYRatio, -0.5, 1);
			b.lexicon.flStop.setAttribute("stop-opacity", opacificationRate);
			b.lexicon.stStop.setAttribute("stop-opacity", opacificationRate);
		},
		offsetStops: function(clampedCursorYRatio) {
			let offsettingRate = parseInt(clampedCursorYRatio * 100) + "%";
			b.lexicon.flStop.setAttribute("offset", offsettingRate);
			b.lexicon.stStop.setAttribute("offset", offsettingRate);
		},
		shiftSpZone: function(clampedCursorYRatio) {
			let spZoneHalfHeight = parseFloat(b.lexicon.spZone.getAttribute("height")) / 2;
			let shiftingRate = parseInt(clampedCursorYRatio * 100) - spZoneHalfHeight + "%";
			b.lexicon.spZone.setAttribute("y", shiftingRate);
			b.header.proposeSparkle(clampedCursorYRatio);
		},
		proposeSparkle: function(clampedCursorYRatio) {
			let minSparkleRangeX =
				parseFloat(b.lexicon.spZone.getAttribute("x")) / 100
				* parseFloat(b.lexicon.graphic.getAttribute("width"));
			let maxSparkleRangeX =
				parseFloat(b.lexicon.spZone.getAttribute("width")) / 100
				* parseFloat(b.lexicon.graphic.getAttribute("width"))
				+ minSparkleRangeX;
			let minSparkleRangeY =
				parseFloat(b.lexicon.spZone.getAttribute("y")) / 100
				* parseFloat(b.lexicon.graphic.getAttribute("height"));
			let maxSparkleRangeY =
				parseFloat(b.lexicon.spZone.getAttribute("height")) / 100
				* parseFloat(b.lexicon.graphic.getAttribute("height"))
				+ minSparkleRangeY;
			let sparkleX = b.util.randomIntBetween(minSparkleRangeX, maxSparkleRangeX);
			let sparkleY = b.util.randomIntBetween(minSparkleRangeY, maxSparkleRangeY);
			b.header.validateSparkle(sparkleX, sparkleY, clampedCursorYRatio);
		},
		validateSparkle: function(sparkleX, sparkleY, clampedCursorYRatio) {
			let validSparkle = false;
			let validationZones = b.lexicon.graphic.querySelectorAll("#g > *");
			let validationPoint = b.lexicon.graphic.createSVGPoint();
			validationPoint.x = sparkleX;
			validationPoint.y = sparkleY;
			validationZones.forEach((validationZone) => {
				if (validationZone.isPointInFill(validationPoint)) {
					validSparkle = true;
				}
			});
			if (!validSparkle) { return; }
			b.header.acceptSparkle(sparkleX, sparkleY, clampedCursorYRatio);
		},
		acceptSparkle: function(sparkleX, sparkleY, clampedCursorYRatio) {
			let opacity = b.util.parabola(-4, clampedCursorYRatio, -0.5, 1);
			var scale = b.util.clamp(
				0,
				b.util.randomFloatBetween(opacity - 0.25, opacity + 0.25),
				1.25
			);
			if (b.util.queryMedia("(max-width: 768px)")) {
				scale = scale * 1.5;
			}
			b.lexicon.sparkle.setAttribute("fill-opacity", opacity);
			b.lexicon.sparkle.setAttribute("stroke-opacity", opacity);
			if(clampedCursorYRatio >= 1 || clampedCursorYRatio <= 0) { return; }
			b.lexicon.sparkle.setAttribute(
				"transform",
					"translate(" + sparkleX + ", " + sparkleY + ")"
					+ " scale(" + scale + ")"
					+ " rotate(45)"
			);
		},
	},

	main: {
		initMainScripts: function() {
			b.main.displayJsOnly();
			// b.main.disableFolioAnchors();
			// b.main.distributeNotes();
			// b.main.trackNotes();
		},
		displayJsOnly: function() {
			if (!b.lexicon.jsOnly) { return; }
			b.lexicon.jsOnly.forEach((jsOnly) => {
				jsOnly.classList.remove("generic--jsOnly");
			});
		},
		// disableFolioAnchors: function() {
		// 	if (!b.lexicon.disabledAnchors) { return; }
		// 	b.lexicon.disabledAnchors.forEach((anchor) => {
		// 		anchor.addEventListener("click", (event) => {
		// 			event.preventDefault();
		// 			event.target.closest(".indexOfWorks__work__folio").classList.toggle("generic--flipped");
		// 			plausible("Flip");
		// 		});
		// 	});

		// },
		// trackNotes: function() {
		// 	window.addEventListener("resize", b.util.debounce(() => {
		// 		b.main.checkOverlappingNotes();
		// 	}, 500));
		// },
		// checkOverlappingNotes: function() {
		// 	if (b.util.queryMedia("(max-width: 1280px)")) {
		// 		b.main.resetNoteOffsets();
		// 		return;
		// 	}
		// 	var previousNoteOffsetTop = 0;
		// 	var previousNoteOffsetBottom = 0;
		// 	var noteOffsetDelta = 0;
		// 	var previousNoteOffsetDelta = 0;
		// 	var continuityCounter = 0;
		// 	b.lexicon.notes.forEach((note) => {
		// 		let noteOffsetTop = note.getBoundingClientRect().top;
		// 		let noteOffsetBottom = note.getBoundingClientRect().bottom;
		// 		if (noteOffsetTop < previousNoteOffsetBottom) {
		// 			noteOffsetDelta = previousNoteOffsetBottom - noteOffsetTop;
		// 			continuityCounter++;
		// 			let newOffsetTop = "calc(" + "-3.35rem + " + noteOffsetDelta + "px + " + previousNoteOffsetDelta + "px - " + continuityCounter + "px)";
		// 			note.style.marginTop = newOffsetTop;
		// 		} else {
		// 			noteOffsetDelta = 0;
		// 			continuityCounter = 0;
		// 		}
		// 		previousNoteOffsetTop = noteOffsetTop;
		// 		previousNoteOffsetBottom = noteOffsetBottom;
		// 		previousNoteOffsetDelta = noteOffsetDelta;
		// 	});
		// },
		// offsetOverlappingNotes: function(note, noteOffsetDelta) {

		// },
		// resetNoteOffsets: function() {
		// 	b.lexicon.notes.forEach((note) => {
		// 		note.style.removeProperty("margin-top");
		// 	});
		// },
		// distributeNotes: function() {
		// 	var previousNoteOffsetTop = 0;
		// 	var previousNoteOffsetBottom = 0;
		// 	var noteOffsetDelta = 0;
		// 	var previousNoteOffsetDelta = 0;
		// 	var continuityCounter = 0;
		// 	// if (b.util.queryMedia("(max-width: 1280px)")) { return; }
		// 	b.lexicon.notes.forEach((note) => {
		// 		let noteOffsetTop = note.getBoundingClientRect().top;
		// 		let noteOffsetBottom = note.getBoundingClientRect().bottom;
		// 		if (noteOffsetTop < previousNoteOffsetBottom) {
		// 			noteOffsetDelta = previousNoteOffsetBottom - noteOffsetTop;
		// 			continuityCounter++;
		// 			let newOffsetTop = "calc(" + "-3.35rem + " + noteOffsetDelta + "px + " + previousNoteOffsetDelta + "px - " + continuityCounter + "px)";
		// 			note.style.marginTop = newOffsetTop;
		// 		} else {
		// 			noteOffsetDelta = 0;
		// 			continuityCounter = 0;
		// 		}
		// 		previousNoteOffsetTop = noteOffsetTop;
		// 		previousNoteOffsetBottom = noteOffsetBottom;
		// 		previousNoteOffsetDelta = noteOffsetDelta;
		// 	});
		// },
	},

	util: {
		dTimer: 0,
		debounce: function(callback, delay) {
			clearTimeout(b.util.dTimer);
			return b.util.dTimer = setTimeout(callback, delay);
		},
		tTimer: 0,
		throttle: function(callback, delay) {
			if (b.util.tTimer) { return; }
			return b.util.tTimer = setTimeout(() => {
				if (callback) {
					callback();
				}
				b.util.tTimer = 0;
			}, delay);
		},
		clamp: function(min, number, max) {
			return Math.max(min, Math.min(number, max));
		},
		line: function(a, x, b) {
                        /* https://www.desmos.com/calculator */
                        return (a * x) + b;
                },
		parabola: function(a, x, b, c) {
			/* https://www.desmos.com/calculator */
			return a * (x + b) ** 2 + c;
		},
		randomIntBetween: function(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min);
		},
		randomFloatBetween: function(min, max) {
			return Math.random() * (max - min) + min;
		},
		queryMedia: function(query) {
			return window.matchMedia(query).matches;
		},
	},

}

b.initAllScripts();
