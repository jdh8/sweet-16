// This file is part of Integration by me.
//
// Copyright (C) 2013-2015 Chen-Pang He <http://jdh8.org/>
//
// Integration by me is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Integration by me is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

"use strict";

/**
 * This primality test module is written in asm.js
 *
 * @returns {{test: function}} Exports of this module
 */
function Prime()
{
	"use asm";

	/**
	 * This function avoids overflows.
	 *
	 * The return type should have been unsigned, but asm.js does not allow
	 * this.  Cast back to unsigned to get the proper value.
	 *
	 * @param {int} a  Multiplicand, unsigned
	 * @param {int} b  Multiplier, unsigned
	 * @param {int} m  Module, unsigned
	 *
	 * @returns {signed} <code>a * b % m |0</code>
	 */
	function mulmod(a, b, m)
	{
		a = a|0;
		b = b|0;
		m = m|0;

		var result = 0.0;

		result = +(a >>> 0) * +(b & 0xffff);
		result = +(a >>> 0) * +(b >>> 16) % +(m >>> 0) * +0x10000 + result;

		return ~~(result % +(m >>> 0));
	}

	/**
	 * This function avoids overflows.
	 *
	 * The return type should have been unsigned, but asm.js does not allow
	 * this.  Cast back to unsigned to get the proper value.
	 *
	 * @param {int} base  Base, unsigned
	 * @param {int} exp   Exponent, unsigned
	 * @param {int} mod   Module, unsigned
	 *
	 * @returns {signed} <code>Math.pow(base, exp) % m |0</code>
	 */
	function powmod(base, exp, mod)
	{
		base = base|0;
		exp = exp|0;
		mod = mod|0;

		var result = 1;

		base = (base >>> 0) % (mod >>> 0) |0;

		while (exp) {
			if (exp & 1)
				result = mulmod(result, base, mod)|0;
			exp = exp >>> 1;
			base = mulmod(base, base, mod)|0;
		}

		return result|0;
	}

	/**
	 * This test is probabilistic.  The redundant arguments are optimization.
	 *
	 * @summary Subtest of {@link Prime~test}
	 *
	 * @param {int} tester   Tester prime, unsigned
	 * @param {int} n        Number to test, unsigned
	 * @param {int} Nminus1  <code>n - 1</code>
	 * @param {int} oddpart  Leading odd part of <code>n - 1</code>
	 * @param {int} lowest   Lowest bit of <code>n - 1</code>
	 *
	 * @returns {signed} Zero if <var>n</var> must be composite.
	 */
	function subtest(tester, n, Nminus1, oddpart, lowest)
	{
		tester = tester|0;
		n = n|0;
		Nminus1 = Nminus1|0;
		oddpart = oddpart|0;
		lowest = lowest|0;

		var remainder = 0;
		var bit = 1;

		remainder = powmod(tester, oddpart, n)|0;

		if ((remainder|0) == 1)
			return 1;

		for (; (bit|0) != (lowest|0); bit = bit << 1) {
			if ((remainder|0) == (Nminus1|0))
				return 1;
			remainder = mulmod(remainder, remainder, n)|0;
		}

		return 0;
	}

	/**
	 * @summary Deterministic Miller–Rabin primality test
	 *
	 * @param {int} n  Number to test, unsigned
	 *
	 * @returns {signed} 2 if prime, 0 if composite, 1 if neither
	 *
	 * @see https://en.wikipedia.org/wiki/Miller–Rabin_primality_test#Deterministic_variants_of_the_test
	 */
	function test(n)
	{
		n = n|0;

		var Nminus1 = 0;
		var oddpart = 0;
		var lowest = 0;

		switch (n|0) {
			case 0:
			case 1:
				return 1;
			case 2:
				return 2;
		}

		Nminus1 = n - 1 |0;
		lowest = Nminus1 & -Nminus1;
		oddpart = (Nminus1 >>> 0) / (lowest >>> 0) |0;

		if ((subtest(2, n, Nminus1, oddpart, lowest)|0) == 0)
			return 0;

		if ((subtest(7, n, Nminus1, oddpart, lowest)|0) == 0)
			return 0;

		if ((subtest(61, n, Nminus1, oddpart, lowest)|0) == 0)
			return 0;

		return 2;
	}

	return {
		/** @default Prime~test */
		test: test,
	};
}

// Primality test
(function()
{
	var prime = Prime();
	var output = document.getElementById("result").firstChild;

	var strings = document.documentElement.lang.substr(0, 2) == "zh" ? {
		error: "請輸入 32 位元正整數。",
		test: [" 是合數。", " 不是質數也不是合數。", " 是質數。"],
	} : {
		error: "Plese enter a 32-bit positive integer.",
		test: [" is composite.", " is neither prime nor composite.", " is prime."],
	};

	/**
	 * @summary Get text describing primality
	 *
	 * @param {number} value
	 *
	 * @returns {string}
	 */
	function getText(value)
	{
		value = +value;

		if (+(~~value >>> 0) != value)
			return strings.error;

		return value + strings.test[prime.test(value)];
	}

	document.getElementById("num").addEventListener("input", function()
	{
		output.nodeValue = getText(this.valueAsNumber);
	});
})();

// Whiteboard
(function()
{
	var display = document.getElementById("display");

	document.forms.board.addEventListener("submit", function(ev)
	{
		display.innerHTML = this.elements.html.value;

		ev.preventDefault();
		ev.stopPropagation();

		if (this.elements.jax.checked)
			MathJax.Hub.Typeset(display);
	});
})();

// Asm.js minifier
(function()
{
	/**
	 * The argument is modified in place to avoid deep copy.
	 *
	 * @summary Concatenate adjacent variable declarations
	 *
	 * @param {Object} ast - Abstract syntax tree
	 *
	 * @returns  Modified {@link ast}
	 */
	function concatAdjacentVars(ast)
	{
		var body = ast.body;
		var cache = [];

		for (var k = body.length - 1; k >= 0; --k)
		{
			var stmt = body[k];

			switch (stmt.type)
			{
				case "VariableDeclaration":
					if (cache.length)
						body.splice(k + 1, 1);
					cache = stmt.declarations = stmt.declarations.concat(cache);
					break;
				case "FunctionDeclaration":
					concatAdjacentVars(stmt.body);
					// no break
				default:
					cache = [];
			}
		}

		return ast;
	}

	var reader = new FileReader();
	var code = document.getElementById("minified-asm");

	reader.addEventListener("loadend", function()
	{
		var ast = esmangle.mangle(esprima.parse(this.result));

		code.textContent = escodegen.generate(concatAdjacentVars(ast), {
			format: {
				renumber: false,
				escapeless: true,
				compact: true,
				semicolons: false,
				quotes: "double",
			},
			parse: esprima.parse,
		});
	});

	document.getElementById("asm-file").addEventListener("change", function()
	{
		reader.readAsText(this.files[0]);
	});
})();
