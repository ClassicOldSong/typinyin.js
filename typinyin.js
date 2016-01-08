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



(function() {
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
	var del = "del";
	var pause = "pause";

	function typinyin() {
		return ('Typinyin - Ver 0.1.2 \n Please use "new" to create a typinin element.');
	};

	// Attach to element
	function attach(element) {
		this.element = element;
		if (typeof element === "string") {
			this.element = document.querySelector(this.element);
		}
		if (!(this.element && (this.element.nodeType != null))) {
			throw new Error("Invalid typinyin element.");
		}
		if (this.element.typinyin) {
			throw new Error("Typinyin already attached.");
		}
		this.element.typinyin = true;
		return this;
	};

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
			var _this_ = this;
			var delCount = num;
			function _del() {
				if (delCount > 0) {
					setTimeout(function() {
						_this_.textContent = _this_.textContent.substr(0, _this_.textContent.length - 1);
						delCount--;
						_del();
					}, _this.options.backSpeed);
				} else if (typeof callback === "function") {
					callback();
				}
			};
			_del();
		};

		// Pause for a given time
		function pause(time, callback) {
			setTimeout(function() {
				callback();
			}, time);
		};

		// Switch to the next sentence
		function nextSentence() {
			if (sentenceCount < _this.options.sentences.length) {
				var wordCount = 0;

				function nextWord() {
					if (_this.options.sentences[sentenceCount].ch[wordCount] === "\b") {
						del.call(typingArea, 1, nextWord);
						wordCount++;
					} else if (typeof _this.options.sentences[sentenceCount].ch[wordCount] === "object") {
						if (typeof _this.options.sentences[sentenceCount].ch[wordCount].del != "undefined") {
							del.call(typingArea, _this.options.sentences[sentenceCount].ch[wordCount].del, nextWord);
							wordCount++;
						} else if (typeof _this.options.sentences[sentenceCount].ch[wordCount].pause != "undefined") {
							pause(_this.options.sentences[sentenceCount].ch[wordCount].pause, nextWord);
							wordCount++;
						} else {
							throw new Error("Invalid word or method!");
						}
					} else if (wordCount < _this.options.sentences[sentenceCount].ch.length) {
						var word = _this.options.sentences[sentenceCount].py[wordCount];
						var charCount = 0;
						var partCount = 0;
						var wordArea = document.createElement('span');
						typingArea.appendChild(wordArea);

						function nextChar() {
							if (charCount < word.length) {
								if (word[charCount] === "\b") {
									charCount++;
									del.call(wordArea, 1, nextChar);
								} else {
									setTimeout(function() {
										wordArea.textContent = wordArea.textContent + word[charCount];
										charCount++;
										nextChar();
									}, _this.options.typeSpeed);
								}
							} else {
								setTimeout(function() {
									wordArea.textContent = _this.options.sentences[sentenceCount].ch[wordCount];
									wordCount++;
									nextWord();
								}, _this.options.typeSpeed);
							}
						};

						function nextPart() {
							var _charCount = 0;

							function _nextChar() {
								if (_charCount < word[partCount].length) {
									if (word[partCount][_charCount] === "\b") {
										del.call(wordArea, 1, _nextChar);
										_charCount++;
									} else {
										setTimeout(function() {
											wordArea.textContent = wordArea.textContent + word[partCount][_charCount];
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
										del.call(wordArea, word[partCount].del, nextPart);
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
									wordArea.textContent = _this.options.sentences[sentenceCount].ch[wordCount];
									wordCount++;
									nextWord();
								}, _this.options.typeSpeed);
							}
						}

						if (typeof word === "object") {
							nextPart();
						} else {
							nextChar();
						}
					} else {
						setTimeout(function() {
							if (sentenceCount < _this.options.sentences.length - 1 || _this.options.loop) {
								del.call(typingArea, typingArea.textContent.length, nextSentence);
								sentenceCount++;
							} else {
								if (typeof _this.finished === "function") {
									_this.finished();
								};
								return;
							}
						}, _this.options.pause);
					}
				}
				typingArea.innerHTML = '';
				nextWord();
			} else if (_this.options.loop) {
				_this.init();
			}
		};

		var typingArea = document.createElement('span');
		typingArea.style = "white-space:pre;";
		var cursor = document.createElement('span');
		cursor.className = 'typing-cursor';
		cursor.textContent = _this.options.cursorChar;

		_this.element.innerHTML = '';
		_this.element.appendChild(typingArea);
		_this.element.appendChild(cursor);
		setTimeout(function() {
			nextSentence();
		}, _this.options.startDelay);
	};

	typinyin.prototype.attach = attach;
	typinyin.prototype.setOptions = setOptions;
	typinyin.prototype.finished = finished;
	typinyin.prototype.init = init;

	// Register to window
	window.Typinyin = typinyin;

}).call(this);