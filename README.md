Typinyin.js
========

[Demo演示](https://classicoldsong.github.io/typinyin.js)

Typinyin.js 是受 [Typed.js](https://github.com/mattboldt/typed.js) 启发而开发的一款js插件，无需jQuery即可使用。输入中文并输入相对应的拼音，即可呈现出自动用拼音输入文本的效果，并且会自动删除前一句话然后开始新的句子。

---

安装
------------

	$ git clone https://github.com/classicoldsong/typinyin.js.git

###配置

~~~ javascript
<script src="typinyin.js"></script>
<script>
	window.onload = function(){
		var demo = new Typinyin;
		demo.attach('#typinyin_demo'); // 绑定元素
		demo.setOptions({
			sentences: [
				{
					ch: ["这",{pause: 1500}/* 暂停1500毫秒 */,"是","一个","实例",{del: 2}/* 删除两个字符 */,"示例"],
					py: ["zhe","","shi","yige","shili","","shili"],
				}, {
					ch: ["This is an example."],
					py: ["This is an exaaaaaaaa\b\b\b\b\b\b\bmple."], // 用"\b" 来删除一个字符
				}, {
					ch: ["完全","无需","jQuery"],
					py: ["wanquan","wuxu","jQuery"],
				}, {
					ch: ["让","输入","打动","你的","心","\b","❤"], // 用"\b" 来删除一个字符
					py: [["ranfff",{pause: 281},{del: 3}/* 暂停281毫秒后删除三个字符 */,"g"],"shuru","dadong","nide","xin","","xin"],
				}, {
					ch: ["赶紧","尝试一下","吧","！"],
					py: ["ganjin","changshiyixia","ba","！"]
				}
			], // 需要输入的句子
			startDelay: 1000, // 启动延时，以毫秒记
			typeSpeed: 100, // 打字速度，以毫秒记
			pause: 1000, // 每一句话打完后的停顿时间，以毫秒记
			backSpeed: 60, // 删除文字的速度，以毫秒记
			cursorChar: "|", // 光标字符
			loop: false, // 是否循环播放
		});
		demo.finished = function() {
			console.log("Typinyin.js Demo 演示完毕！");
		}; // 输入完毕时执行，loop 为 true 的时无效
		demo.init(); // 初始化并开始打字
	}
</script>
...

<span id="typinyin_demo"></span>
~~~

如果希望增加光标闪烁动画的话，增加`typinyin.css`即可

	<link rel="stylesheet" href="typinyin.css">

当然你也可以随意使用JavaScript转义字符，比如用`\n`来换行

###自定义输入完毕事件

~~~ javascript
demo.finished = function() {
	// 自定义内容
}
~~~

许可证：MIT
-------

感谢 [Matt Boldt](http://www.mattboldt.com/) 的光标CSS动画以及Demo页面模板

如有疑问或者建议欢迎提Issue或者PullRequest或者联系我的邮箱 syqlds@126.com

当然也欢迎访问我的博客 [C次元](http://classicoldsong.me)