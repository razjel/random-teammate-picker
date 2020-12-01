/*
 * a
 */

/*
 * a
 */

export class StringUtil {
	/**
	 * Trims string ( removes all spaces in front of and at the end of string
	 * @param string input string
	 * @return String trimmed string
	 */
	public static trim(string: string): string {
		if (string === null) return "";
		return string.replace(/^\s+|\s+$/g, "");
	}

	/**
	 *    Removes whitespace from the front of the specified string.
	 *
	 *    @param input The String whose beginning whitespace will will be removed.
	 *
	 *    @returns A String with whitespace removed from the begining
	 *
	 */
	public static trimStart(string: string): string {
		if (string === null) return "";
		return string.replace(/^\s+/, "");
	}

	/**
	 *    Removes whitespace from the end of the specified string.
	 *
	 *    @param input The String whose ending whitespace will will be removed.
	 *
	 *    @returns A String with whitespace removed from the end
	 *
	 */
	public static trimEnd(string: string): string {
		if (string === null) {
			return "";
		}
		return string.replace(/\s+$/, "");
	}

	public static toString(str: string, defaultString: string = ""): string {
		return str || defaultString;
	}

	/** Shortens strings in array to provided length
	 *
	 * @return new_diff array with strings. Null if arr was null.
	 *
	 */
	public static shortenStrings(arr: any[], length: number): any[] {
		if (!arr) return null;
		var out: any[] = [];
		var len: number = arr.length;
		for (var i: number = 0; i < len; i++) {
			out[i] = (arr[i] as string).substr(0, 3);
		}
		return out;
	}

	public static timeToDescTime(ms: number): string {
		if (ms < 1000) return Math.floor(ms) + "ms";
		ms /= 1000;
		var sec: number = Math.floor(ms % 60);
		ms /= 60;
		var min: number = Math.floor(ms % 60);
		ms /= 60;
		var hour: number = Math.floor(ms % 24);
		ms /= 24;
		var day: number = Math.floor(ms);
		var time: string = "";
		if (day >= 1) time += Math.floor(day) + "d ";
		if (hour >= 1) time += Math.floor(hour) + "h ";
		if (min >= 1) time += Math.floor(min) + "m ";
		if (sec >= 1) time += Math.floor(sec) + "s ";
		//removing last space
		if (time.length > 0) time = time.substr(0, time.length - 1);
		return time;
	}

	public static randomString(
		newLength: number = 1,
		userAlphabet: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	): string {
		var alphabet: any[] = userAlphabet.split("");
		var alphabetLength: number = alphabet.length;
		var randomLetters: string = "";
		for (var i: number = 0; i < newLength; i++) {
			randomLetters += alphabet[~~Math.floor(Math.random() * alphabetLength)];
		}
		return randomLetters;
	}

	private static lorem: string =
		"But I must explain to you how all this mistaken idea of denouncing pleasure and " +
		"praising pain was born and I will give you a complete account of the system, and " +
		"expound the actual teachings of the great explorer of the truth, the " +
		"master-builder of human happiness. No one rejects, dislikes, or avoids pleasure " +
		"itself, because it is pleasure, but because those who do not know how to pursue " +
		"pleasure rationally encounter consequences that are extremely painful. Nor again " +
		"is there anyone who loves or pursues or desires to obtain pain of itself, because " +
		"it is pain, but because occasionally circumstances occur in which toil and pain " +
		"can procure him some great pleasure. To take a trivial example, which of us ever " +
		"undertakes laborious physical exercise, except to obtain some advantage from it? " +
		"But who has any right to find fault with a man who chooses to enjoy a pleasure " +
		"that has no annoying consequences, or one who avoids a pain that produces no " +
		"resultant pleasure?";

	public static loremIpsumString(len: number = 10): string {
		if (len > StringUtil.lorem.length) return StringUtil.lorem;
		var start: number = Math.max(0, (StringUtil.lorem.length - len - 20) * Math.random());
		start = StringUtil.lorem.indexOf(" ", start);
		return StringUtil.lorem.substr(start, len);
	}

	public static isValidEmail(emailAddress: string): boolean {
		var reg: RegExp = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)+)@(([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)){2,}\.(([A-Za-z]){2,4})+$/g;
		return reg.test(emailAddress);
	}

	public static isValidURL(theURL: string): boolean {
		var regexp: RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		//var regexp:RegExp = /^[a-zA-Z]+[:\/\/]+[A-Za-z0-9\-_]+\\.+[A-Za-z0-9\.\/%&=\?\-_]+$/i;
		return regexp.test(theURL);
	}

	/**
	 * <p>Gets the leftmost <code>len</code> characters of a String.</p>
	 *
	 * <p>If <code>len</code> characters are not available, or the
	 * String is <code>null</code>, the String will be returned without
	 * an exception. An exception is thrown if len is negative.</p>
	 *
	 * <pre>
	 * StringUtils.left(null, *)    = null
	 * StringUtils.left(*, -ve)     = ""
	 * StringUtils.left("", *)      = ""
	 * StringUtils.left("abc", 0)   = ""
	 * StringUtils.left("abc", 2)   = "ab"
	 * StringUtils.left("abc", 4)   = "abc"
	 * </pre>
	 *
	 * @param str  the String to get the leftmost characters from, may be null
	 * @param len  the length of the required String, must be zero or positive
	 * @return the leftmost characters, <code>null</code> if null String input
	 */
	public static left(str: string, len: number): string {
		if (str === null) {
			return null;
		}

		if (len < 0) {
			return "";
		}

		if (str.length <= len) {
			return str;
		}
		return str.substring(0, len);
	}

	/**
	 * <p>Centers a String in a larger String of size <code>size</code>.
	 * Uses a supplied String as the value to pad the String with.</p>
	 *
	 * <p>If the size is less than the String length, the String is returned.
	 * A <code>null</code> String returns <code>null</code>.
	 * A negative size is treated as zero.</p>
	 *
	 * <pre>
	 * StringUtils.center(null, *, *)     = null
	 * StringUtils.center("", 4, " ")     = "    "
	 * StringUtils.center("ab", -1, " ")  = "ab"
	 * StringUtils.center("ab", 4, " ")   = " ab "
	 * StringUtils.center("abcd", 2, " ") = "abcd"
	 * StringUtils.center("a", 4, " ")    = " a  "
	 * StringUtils.center("a", 4, "yz")   = "yayz"
	 * StringUtils.center("abc", 7, null) = "  abc  "
	 * StringUtils.center("abc", 7, "")   = "  abc  "
	 * </pre>
	 *
	 * @param str  the String to center, may be null
	 * @param size  the int size of new String, negative treated as zero
	 * @param padStr  the String to pad the new String with, must not be null or empty
	 * @return centered String, <code>null</code> if null String input
	 */
	public static center(str: string, size: number, padStr: string): string {
		if (str === null || size <= 0) {
			return str;
		}

		if (StringUtil.isEmpty(padStr)) {
			padStr = " ";
		}
		var strLen: number = str.length;
		var pads: number = size - strLen;

		if (pads <= 0) {
			return str;
		}
		str = StringUtil.padStart(str, strLen + pads / 2, padStr);
		str = StringUtil.padEnd(str, size, padStr);

		return str;
	}

	public static padStart(str: string, maxLength: number, fillStr: string = " "): string {
		if (str === null) return null;
		return StringUtil.pad(maxLength - str.length, fillStr) + str;
	}

	public static padEnd(str: string, maxLength: number, fillStr: string = " "): string {
		if (str === null) return null;
		return str + StringUtil.pad(maxLength - str.length, fillStr);
	}

	public static pad(fillLength: number, fillStr: string = " "): string {
		if (!fillLength || !fillStr.length) return "";

		var fillStrLength: number = fillStr.length;
		var fillTxt = "";
		while (fillLength > 0) {
			if (fillLength < fillStrLength) fillTxt += fillStr.substring(0, fillLength);
			else fillTxt += fillStr;
			fillLength -= fillStrLength;
		}
		return fillTxt;
	}

	/**
	 * <p>Checks if a String is empty("") or null.</p>
	 *
	 * <pre>
	 * StringUtils.isEmpty(null)      = true
	 * StringUtils.isEmpty("")        = true
	 * StringUtils.isEmpty(" ")       = false
	 * StringUtils.isEmpty("bob")     = false
	 * StringUtils.isEmpty("  bob  ") = false
	 * </pre>
	 *
	 * <p>NOTE: This method changed in Lang version 2.0.
	 * It no longer trims the String.
	 * That functionality is available in isBlank().</p>
	 *
	 * @param str  the String to check, may be null
	 * @return <code>true</code> if the String is empty or null
	 */
	public static isEmpty(str: string): boolean {
		if (str === null) {
			return true;
		}
		return str.length === 0;
	}

	/**
	 * <p>Capitalizes a String changing the first letter to title case.
	 * No other letters are changed.</p>
	 *
	 * A <code>null</code> input String returns <code>null</code>.</p>
	 *
	 * <pre>
	 * StringUtils.capitalize(null)  = null
	 * StringUtils.capitalize("")    = ""
	 * StringUtils.capitalize("cat") = "Cat"
	 * StringUtils.capitalize("cAt") = "CAt"
	 * </pre>
	 *
	 * @param str  the String to capitalize, may be null
	 * @return the capitalized String, <code>null</code> if null String input
	 * @see titleize(String)
	 * @see #uncapitalize(String)
	 */
	public static capitalize(str: string): string {
		if (StringUtil.isEmpty(str)) {
			return str;
		}
		return str.charAt(0).toUpperCase() + str.substring(1);
	}

	/**
	 * <p>Uncapitalizes a String changing the first letter to title case.
	 * No other letters are changed.</p>
	 *
	 * <pre>
	 * StringUtils.uncapitalize(null)  = null
	 * StringUtils.uncapitalize("")    = ""
	 * StringUtils.uncapitalize("Cat") = "cat"
	 * StringUtils.uncapitalize("CAT") = "cAT"
	 * </pre>
	 *
	 * @param str  the String to uncapitalize, may be null
	 * @return the uncapitalized String, <code>null</code> if null String input
	 * @see #capitalize(String)
	 */
	public static uncapitalize(str: string): string {
		if (StringUtil.isEmpty(str)) {
			return str;
		}
		return str.charAt(0).toLowerCase() + str.substring(1);
	}

	/**
	 * <p>Abbreviates a String using ellipses. This will turn
	 * "Now is the time for all good men" into "...is the time for..."</p>
	 *
	 * <p>Works like <code>abbreviate(String, int)</code>, but allows you to specify
	 * a "left edge" offset.  Note that this left edge is not necessarily going to
	 * be the leftmost character in the result, or the first character following the
	 * ellipses, but it will appear somewhere in the result.
	 *
	 * <p>In no case will it return a String of length greater than
	 * <code>maxWidth</code>.</p>
	 *
	 * <pre>
	 * StringUtils.abbreviate(null, *, *)                = null
	 * StringUtils.abbreviate("", 0, 4)                  = ""
	 * StringUtils.abbreviate("abcdefghijklmno", -1, 10) = "abcdefg..."
	 * StringUtils.abbreviate("abcdefghijklmno", 0, 10)  = "abcdefg..."
	 * StringUtils.abbreviate("abcdefghijklmno", 1, 10)  = "abcdefg..."
	 * StringUtils.abbreviate("abcdefghijklmno", 4, 10)  = "abcdefg..."
	 * StringUtils.abbreviate("abcdefghijklmno", 5, 10)  = "...fghi..."
	 * StringUtils.abbreviate("abcdefghijklmno", 6, 10)  = "...ghij..."
	 * StringUtils.abbreviate("abcdefghijklmno", 8, 10)  = "...ijklmno"
	 * StringUtils.abbreviate("abcdefghijklmno", 10, 10) = "...ijklmno"
	 * StringUtils.abbreviate("abcdefghijklmno", 12, 10) = "...ijklmno"
	 * StringUtils.abbreviate("abcdefghij", 0, 3)        = Error
	 * StringUtils.abbreviate("abcdefghij", 5, 6)        = Error
	 * </pre>
	 *
	 * @param str  the String to check, may be null
	 * @param offset  left edge of source String
	 * @param maxWidth  maximum length of result String, must be at least 4
	 * @return abbreviated String, <code>null</code> if null String input
	 * @throws Error if the width is too small
	 */
	public static abbreviate(str: string, offset: number, maxWidth: number): string {
		if (str === null) {
			return str;
		}

		if (maxWidth < 4) {
			throw new Error("Minimum abbreviation width is 4");
		}

		if (str.length <= maxWidth) {
			return str;
		}

		if (offset > str.length) {
			offset = str.length;
		}

		if (str.length - offset < maxWidth - 3) {
			offset = str.length - (maxWidth - 3);
		}

		if (offset <= 4) {
			return str.substring(0, maxWidth - 3) + "...";
		}

		if (maxWidth < 7) {
			throw new Error("Minimum abbreviation width with offset is 7");
		}

		if (offset + (maxWidth - 3) < str.length) {
			return "..." + StringUtil.abbreviate(str.substring(offset), 0, maxWidth - 3);
		}
		return "..." + str.substring(str.length - (maxWidth - 3));
	}

	/**
	 * <p>Checks if the String contains only whitespace.</p>
	 *
	 * <p><code>null</code> will return <code>false</code>.
	 * An empty String("") will return <code>true</code>.</p>
	 *
	 * <pre>
	 * StringUtils.isWhitespace(null)   = false
	 * StringUtils.isWhitespace("")     = true
	 * StringUtils.isWhitespace("  ")   = true
	 * StringUtils.isWhitespace("abc")  = false
	 * StringUtils.isWhitespace("ab2c") = false
	 * StringUtils.isWhitespace("ab-c") = false
	 * </pre>
	 *
	 * @param str  the String to check, may be null
	 * @return <code>true</code> if only contains whitespace, and is non-null
	 */
	public static isWhitespace(str: string): boolean {
		return str !== null && /^[\s]*$/.test(str);
	}

	/**
	 * <p>Checks if the String end characters match the given end string.</p>
	 *
	 * <p><code>null</code> will return <code>false</code>.
	 *
	 * <pre>
	 * StringUtils.endsWith(null, *)                     = false
	 * StringUtils.endsWith(null, null)                 = false
	 * StringUtils.endsWith(*, null)                       = false
	 * StringUtils.endsWith("www.domain.com", "com") = true
	 * </pre>
	 *
	 * @param str  the String to check, may be null
	 * @param end the string to compare
	 * @return <code>true</code> if only contains whitespace, and is non-null
	 */
	public static endsWith(str: string, end: string): boolean {
		if (str !== null && end !== null && str.length >= end.length) {
			return str.substr(str.length - end.length, str.length) === end;
		} else {
			return false;
		}
	}

	/**
	 * <p>Checks if the String end characters match the given end string, ignoring case.</p>
	 *
	 * <p><code>null</code> will return <code>false</code>.
	 *
	 * <pre>
	 * StringUtils.endsWith(null, *)                     = false
	 * StringUtils.endsWith(null, null)                 = false
	 * StringUtils.endsWith(*, null)                       = false
	 * StringUtils.endsWith("www.domain.com", "Com") = true
	 * </pre>
	 *
	 * @param str  the String to check, may be null
	 * @param end the string to compare
	 * @return <code>true</code> if only contains whitespace, and is non-null
	 */
	public static endsWithIgnoreCase(str: string, end: string): boolean {
		if (str !== null && end !== null && str.length >= end.length) {
			return str.toUpperCase().substr(str.length - end.length, str.length) === end.toUpperCase();
		} else {
			return false;
		}
	}

	/**
	 * <p>Checks if the String start characters match the given start string.</p>
	 *
	 * <p><code>null</code> will return <code>false</code>.
	 *
	 * <pre>
	 * StringUtils.startsWith(null, *)                     = false
	 * StringUtils.startsWith(null, null)                 = false
	 * StringUtils.startsWith(*, null)                       = false
	 * StringUtils.startsWith("www.domain.com", "www.")    = true
	 * </pre>
	 *
	 * @param str  the String to check, may be null
	 * @param start the string to compare
	 * @return <code>true</code> if only contains whitespace, and is non-null
	 */
	public static startsWith(str: string, start: string): boolean {
		if (str !== null && start !== null && str.length >= start.length) {
			return str.substr(0, start.length) === start;
		} else {
			return false;
		}
	}

	/**
	 * <p>Checks if the String start characters match the given start string.</p>
	 *
	 * <p><code>null</code> will return <code>false</code>.
	 *
	 * <pre>
	 * StringUtils.startsWith(null, *)                     = false
	 * StringUtils.startsWith(null, null)                 = false
	 * StringUtils.startsWith(*, null)                       = false
	 * StringUtils.startsWith("www.domain.com", "wWw.")    = true
	 * </pre>
	 *
	 * @param str  the String to check, may be null
	 * @param start the string to compare
	 * @return <code>true</code> if only contains whitespace, and is non-null
	 */
	public static startsWithIgnoreCase(str: string, start: string): boolean {
		if (str !== null && start !== null && str.length >= start.length) {
			return str.toUpperCase().substr(0, start.length) === start.toUpperCase();
		} else {
			return false;
		}
	}

	/**
	 * Adds/inserts a new string at a certain position in the source string.
	 */
	public static addAt(string: string, value: any, position: number): string {
		if (position > string.length) {
			position = string.length;
		}
		var firstPart: string = string.substring(0, position);
		var secondPart: string = string.substring(position, string.length);
		return firstPart + value + secondPart;
	}

	/**
	 * Replaces a part of the text between 2 positions.
	 */
	public static replaceAt(string: string, value: any, beginIndex: number, endIndex: number): string {
		beginIndex = Math.max(beginIndex, 0);
		endIndex = Math.min(endIndex, string.length);
		var firstPart: string = string.substr(0, beginIndex);
		var secondPart: string = string.substr(endIndex, string.length);
		return firstPart + value + secondPart;
	}

	/**
	 * Removes a part of the text between 2 positions.
	 */
	public static removeAt(string: string, beginIndex: number, endIndex: number): string {
		return StringUtil.replaceAt(string, "", beginIndex, endIndex);
	}

	/**
	 * Returns if the given character is a white space or not.
	 */
	public static characterIsWhitespace(a: string): boolean {
		return a.charCodeAt(0) <= 32;
	}

	/**
	 * Returns if the given character is a digit or not.
	 */
	public static characterIsDigit(a: string): boolean {
		var charCode: number = a.charCodeAt(0);
		return charCode >= 48 && charCode <= 57;
	}

	/**
	 * Splits text and returns it with indexes where split text starts in original text.
	 * Example
	 * splitTextWithRegExp("Jack is big", / /g)
	 * returns:
	 * [
	 *    {text:"Jack", index:0},
	 *    {text:"is", index:5},
	 *    {text:"big", index:8}
	 * ]
	 *
	 * @param text text being split
	 * @param regExp regular expression which determines where text is split, must have global flag
	 *     set to work properly
	 * @return split text with its start indexes
	 */
	public static splitTextWithRegExp(text: string, regExp: RegExp): any[] {
		var splitTexts: any[] = [];
		var startIndex: number = 0;
		var match: RegExpExecArray = regExp.exec(text);
		while (match) {
			splitTexts.push({index: startIndex, text: text.substring(startIndex, match.index)});
			startIndex = match.index + match[0].length;
			match = regExp.exec(text);
		}
		if (startIndex <= text.length) splitTexts.push({index: startIndex, text: text.substring(startIndex)});
		return splitTexts;
	}

	/**
	 * Prepares text to be display in columns with equal width in each row. This can be used for
	 * creating easily readable tables.
	 *
	 * For this content:
	 * [
	 *  ["test:", "kitty"],
	 *  ["very_long_name:", "elephant"]
	 * ]
	 *
	 * Result will look like:
	 * test:           kitty
	 * very_long_name: elephant
	 *
	 * @param texts two-dimensional Array of Strings
	 * @param withBorder adds line borders between columns
	 * @return
	 */
	public static toStringWithEqualColumns(texts: any[][], withBorder: boolean = false): string {
		var lengths: any[] = [];
		texts.forEach((row: any[]) => {
			while (lengths.length < row.length) lengths.push(0);

			var len: number = row.length;
			for (var i: number = 0; i < len; i++) lengths[i] = Math.max(lengths[i], String(row[i]).length);
		});

		var rows: any[] = [];
		var rowTextLength: number;
		if (withBorder) {
			lengths.forEach((txtLen: number) => {
				rowTextLength += txtLen + 2;
				rowTextLength--;
				rows.push(StringUtil.padEnd("", rowTextLength + 2, "-"));
			});
		}

		var rowStr: string;
		texts.forEach((row: any[]) => {
			rowStr = "";
			var len: number = row.length;
			if (withBorder) rowStr += "|";
			for (var i: number = 0; i < len; i++) {
				rowStr += StringUtil.padEnd(row[i], lengths[i] + 1, " ");
				if (withBorder) rowStr += "|";
			}
			rows.push(rowStr);
			if (withBorder) rows.push(StringUtil.padEnd("", rowTextLength + 2, "-"));
		});
		return rows.join("\n");
	}

	/**
	 * Clears text of all html tags
	 * Example
	 * clearHtmlTags('<h1 style="display: none;">test</h1><br/>')
	 * returns "test"
	 * @param html code
	 * @return text without html tags
	 */
	public static clearHtmlTags(text: string): string {
		if (!text) return "";
		return text.replace(/<\/?[^>]+(>|$)/g, "");
	}

	/**
	 * Check is text has only the same chars
	 * Example
	 * hasOnlyTheSameChars("xxx", "x")
	 * returns true
	 * @param text
	 * @param char
	 * @return boolean
	 */
	public static hasOnlyTheSameChars(text: string, char: string): boolean {
		return new RegExp(`^[${char}]+$`).test(text);
	}
}
