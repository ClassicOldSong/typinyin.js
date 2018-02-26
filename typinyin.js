// The MIT License (MIT)

// Typinyin.js | Copyright (c) 2016 ClassicOldSong | classicoldsong.me

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


"use strict";

(function() {
	/*jshint validthis:true */
	// Default settings
	var defaults = {
		sentences: [{
			ch: ["这是", "一个", "实例", "示例"],
			py: ["zheshi", "yige", "shili", "shili"],
		}, {
			ch: ["This is an example."],
			py: ["This is an exaaaaaaaa\b\b\b\b\b\b\bmple."]
		}], // Sentences needs to be typed
		startDelay: 0, // Time before typing starts, in ms
		typeSpeed: 100, // Time gap between each character, in ms
		pause: 1000, // Time waiting before each sentence is to be deleted, in ms
		backSpeed: 60, // Backspacing speed, in ms
		cursorChar: "|", // Character for cursor, you may want to use "_" if you are emulating a console
		loop: false, // Loop when finished typing
	};
	var finished;

	function typinyin() {
		return ('Typinyin - Ver 0.1.3 \n Please use "new" to create a typinin element.');
	}

	// Attach to element
	function attach(element) {
		this.element = element;
		if (typeof element === "string") {
			this.element = document.querySelector(this.element);
		}
		if (!(this.element && (this.element.nodeType !== null))) {
			throw new Error("Invalid typinyin element.");
		}
		if (this.element.typinyin) {
			throw new Error("Typinyin already attached.");
		}
		this.element.typinyin = true;
		return this;
	}

	// Set options
	function setOptions(optioninput) {
		this.options = optioninput;
		return this;
	}

	function checkOptions() {
		if (typeof this.options === "undefined") {
			this.options = defaults;
		} else {
			for (var i in defaults) {
				if (typeof this.options[i] === "undefined") {
					this.options[i] = defaults[i];
				}
			}
		}
	}

	// Iniialize Typinyin
	function init() {
		var _this = this;
		checkOptions.call(_this);

		var sentenceCount = 0;

		// Delete characters
		function del(num, callback) {
			var delCount = num;
			function _del() {
				if (delCount > 0) {
					setTimeout(function() {
						typingArea.textContent = typingArea.textContent.substr(0, typingArea.textContent.length - 1);
						delCount--;
						_del();
					}, _this.options.backSpeed);
				} else if (typeof callback === "function") {
					callback();
				}
			}
			_del();
		}

		// Pause for a given time
		function pause(time, callback) {
			setTimeout(function() {
				callback();
			}, time);
		}

		// Switch to the next sentence
		function nextSentence() {
			_typingArea = typingArea.textContent;
			var wordCount = 0;
			var word;
			var charCount = 0;
			var partCount = 0;
			var wordArea = "";

			function nextChar() {
				if (charCount < word.length) {
					if (word[charCount] === "\b") {
						charCount++;
						del(1, nextChar);
						wordArea = wordArea.slice(0, wordArea.length - 1);
					} else {
						setTimeout(function() {
							wordArea += word[charCount];
							typingArea.textContent = _typingArea + wordArea;
							charCount++;
							nextChar();
						}, _this.options.typeSpeed);
					}
				} else {
					setTimeout(function() {
						wordArea = _this.options.sentences[sentenceCount].ch[wordCount];
						typingArea.textContent = _typingArea + wordArea;
						_typingArea = typingArea.textContent;
						wordCount++;
						nextWord();
					}, _this.options.typeSpeed);
				}
			}

			function nextPart() {
				var _charCount = 0;
					function _nextChar() {
					if (_charCount < word[partCount].length) {
						if (word[partCount][_charCount] === "\b") {
							del(1, _nextChar);
							wordArea = wordArea.slice(0, wordArea.length - 1);
							_charCount++;
						} else {
							setTimeout(function() {
								wordArea += word[partCount][_charCount];
								typingArea.textContent = _typingArea + wordArea;
								_charCount++;
								_nextChar();
							}, _this.options.typeSpeed);
						}
					} else {
						setTimeout(function() {
							partCount++;
							nextPart();
						}, _this.options.typeSpeed);
					}
				}
				if (partCount < word.length) {
					if (typeof word[partCount] === "object") {
						if (typeof word[partCount].del != "undefined") {
							del(word[partCount].del, nextPart);
							wordArea = wordArea.slice(0, wordArea.length - word[partCount].del);
							partCount++;
						} else if (typeof word[partCount].pause != "undefined") {
							pause(word[partCount].pause, nextPart);
							partCount++;
						} else {
							throw new Error("Invalid word or method!");
						}
					} else {
						_nextChar();
					}
				} else {
					setTimeout(function() {
						wordArea = _this.options.sentences[sentenceCount].ch[wordCount];
						typingArea.textContent = _typingArea + wordArea;
						_typingArea = typingArea.textContent;
						wordCount++;
						nextWord();
					}, _this.options.typeSpeed);
				}
			}

			function nextWord() {
				if (_this.options.sentences[sentenceCount].ch[wordCount] === "\b") {
					del(1, function() {
						_typingArea = typingArea.textContent;
						nextWord();
					});
					wordCount++;
				} else if (typeof _this.options.sentences[sentenceCount].ch[wordCount] === "object") {
					if (typeof _this.options.sentences[sentenceCount].ch[wordCount].del != "undefined") {
						del(_this.options.sentences[sentenceCount].ch[wordCount].del, function() {
							_typingArea = typingArea.textContent;
							nextWord();
						});
						wordCount++;
					} else if (typeof _this.options.sentences[sentenceCount].ch[wordCount].pause != "undefined") {
						pause(_this.options.sentences[sentenceCount].ch[wordCount].pause, nextWord);
						wordCount++;
					} else {
						throw new Error("Invalid word or method!");
					}
				} else if (wordCount < _this.options.sentences[sentenceCount].ch.length) {
					word = _this.options.sentences[sentenceCount].py[wordCount];
					charCount = 0;
					partCount = 0;
					wordArea = "";

					if (typeof word === "object") {
						nextPart();
					} else {
						nextChar();
					}
				} else {
					setTimeout(function() {
						if (sentenceCount < _this.options.sentences.length - 1 || _this.options.loop) {
                            // Don't clear type history
							//del(typingArea.textContent.length, nextSentence);
							sentenceCount++;
                            nextSentence();
						} else {
							if (typeof _this.finished === "function") {
								_this.finished();
							}
							return;
						}
					}, _this.options.pause);
				}
			}
			if (sentenceCount < _this.options.sentences.length) {
				wordCount = 0;
                // Don't clear type history
				// typingArea.innerHTML = '';
				nextWord();
			} else if (_this.options.loop) {
				_this.init();
			}
		}

		var typingArea = document.createElement('span');
		var _typingArea = "";
		typingArea.style.cssText = "white-space:pre-wrap;";
		var cursor = document.createElement('span');
		cursor.className = 'typing-cursor';
		cursor.textContent = _this.options.cursorChar;

		_this.element.innerHTML = '';
		_this.element.appendChild(typingArea);
		_this.element.appendChild(cursor);
		setTimeout(function() {
			nextSentence();
		}, _this.options.startDelay);
	}

	typinyin.prototype.attach = attach;
	typinyin.prototype.setOptions = setOptions;
	typinyin.prototype.finished = finished;
	typinyin.prototype.init = init;

	// Register to window
	window.Typinyin = typinyin;

})();