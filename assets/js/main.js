"use strict";

const bashar = {

        lexicon: {
                header: document.getElementById("header"),
                svg: document.getElementById("headerSVG"),
                fStop: document.getElementById("fStop"),
                sStop: document.getElementById("sStop"),
                sparkleArea: document.getElementById("sparkleArea"),
                sparkle: document.getElementById("sparkle"),
        },

        initAllScripts: function() {
                bashar.header.initHeaderScripts();
        },

        header: {
                initHeaderScripts: function() {
                        bashar.header.trackCursorY();
                },
                trackCursorY: function() {
                        window.addEventListener("mousemove", (event) => {
                                if (!bashar.util.deviceCanHover) { return; }
                                let cursorYPos = event.clientY;
                                let headerOffsetTop = bashar.lexicon.header.getBoundingClientRect().top;
                                let headerHeight = bashar.lexicon.header.clientHeight;
                                let cursorYRatio = (cursorYPos - headerOffsetTop) / headerHeight;
                                let clampedCursorYRatio = bashar.util.clamp(0, cursorYRatio, 1);
                                bashar.header.reportCursorY(clampedCursorYRatio);
                        });
                },
                reportCursorY: function(clampedCursorYRatio) {
                        bashar.header.opacifyStops(clampedCursorYRatio);
                        bashar.header.offsetStops(clampedCursorYRatio);
                        bashar.header.shiftSparkleArea(clampedCursorYRatio);
                },
                opacifyStops: function(clampedCursorYRatio) {
                        let opacificationRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.fStop.setAttribute("stop-opacity", opacificationRate);
                        bashar.lexicon.sStop.setAttribute("stop-opacity", opacificationRate);
                },
                offsetStops: function(clampedCursorYRatio) {
                        let offsettingRate = parseInt(clampedCursorYRatio * 100) + "%";
                        bashar.lexicon.fStop.setAttribute("offset", offsettingRate);
                        bashar.lexicon.sStop.setAttribute("offset", offsettingRate);
                },
                shiftSparkleArea: function(clampedCursorYRatio) {
                        let sparkleAreaHalfHeight = parseFloat(bashar.lexicon.sparkleArea.getAttribute("height")) / 2;
                        let shiftingRate = parseInt(clampedCursorYRatio * 100) - sparkleAreaHalfHeight + "%";
                        bashar.lexicon.sparkleArea.setAttribute("y", shiftingRate);
                        bashar.header.situateSparkle();
                },
                situateSparkle: function() {
                        let minSparkleRangeX = parseFloat(bashar.lexicon.sparkleArea.getAttribute("x")) / 100 * parseFloat(bashar.lexicon.svg.getAttribute("width"));
                        let maxSparkleRangeX = parseFloat(bashar.lexicon.sparkleArea.getAttribute("width")) / 100 * parseFloat(bashar.lexicon.svg.getAttribute("width")) + minSparkleRangeX;
                        let minSparkleRangeY = parseFloat(bashar.lexicon.sparkleArea.getAttribute("y")) / 100 * parseFloat(bashar.lexicon.svg.getAttribute("height"));
                        let maxSparkleRangeY = parseFloat(bashar.lexicon.sparkleArea.getAttribute("height")) / 100 * parseFloat(bashar.lexicon.svg.getAttribute("height")) + minSparkleRangeY;
                        let sparkleX = bashar.util.randomIntBetween(minSparkleRangeX, maxSparkleRangeX);
                        let sparkleY = bashar.util.randomIntBetween(minSparkleRangeY, maxSparkleRangeY);
                        bashar.header.validateSparkle(sparkleX, sparkleY);
                },
                validateSparkle: function(sparkleX, sparkleY) {
                        let validPoint = false;
                        const testZones = document.querySelectorAll("path");
                        testZones.forEach((testZone) => {
                                if (testZone.isPointInFill(new DOMPoint(sparkleX, sparkleY))) {
                                        validPoint = true;
                                }
                        });
                        if (!validPoint) { return; }
                        bashar.header.generateSparkle(sparkleX, sparkleY);
                },
                generateSparkle: function(sparkleX, sparkleY) {
                        bashar.lexicon.sparkle.setAttribute("cx", sparkleX);
                        bashar.lexicon.sparkle.setAttribute("cy", sparkleY);
                },
        },

        util: {
                timer: 0,
                debounce: function(callback, delay) {
                        clearTimeout(bashar.util.timer);
        		return bashar.util.timer = setTimeout(callback, delay);
                },
                clamp: function(min, number, max) {
                        return Math.max(min, Math.min(number, max));
                },
                randomIntBetween: function(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min) + min);
                },
                deviceCanHover: window.matchMedia("(any-hover: hover)").matches,
                debug: false,
        },

}

bashar.initAllScripts();
