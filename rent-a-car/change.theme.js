require('dotenv').config();
const path = require('path');
const fs = require('fs');
const themePath = path.join(__dirname, 'src', 'assets', 'primeng', 'mdc-light-indigo', 'theme.css');

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

const rgbAsString = ({ r, g, b }) => {
	return `${r},	${g}, ${b}`;
};

const primary_color = process.env.PRIMARY_COLOR;
const primary_color_text = process.env.PRIMARY_COLOR_TEXT;
const accent_color = process.env.ACCENT_COLOR;
const accent_color_text = process.env.ACCENT_COLOR_TEXT;

// console.log(primary_color);
// console.log(primary_color_text);
// console.log(accent_color);
// console.log(accent_color_text);

// const convertRegex = (color) => `var\\(\\-\\-${color}\\)`;
// const convertColor = (color) => `var(--${color})`;

const primary_color_regex = new RegExp(`\\-\\-primary\\-color: ${primary_color}`, 'gi');
const primary_color_text_regex = new RegExp(`\\-\\-primary\\-color\\-text: ${primary_color_text}`, 'gi');
const accent_color_regex = new RegExp(`\\-\\-accent\\-color: ${accent_color}`, 'gi');
const accent_color_text_regex = new RegExp(`\\-\\-accent\\-color\\-text: ${accent_color_text}`, 'gi');

const primary_color_regex_rgb = new RegExp(`\\-\\-primary\\-color-rgb: ${rgbAsString(hexToRgb(primary_color))}`, 'gi');
const primary_color_text_regex_rgb = new RegExp(`\\-\\-primary\\-color\\-text-rgb: ${rgbAsString(hexToRgb(primary_color_text))}`, 'gi');
const accent_color_regex_rgb = new RegExp(`\\-\\-accent\\-color-rgb: ${rgbAsString(hexToRgb(accent_color))}`, 'gi');
const accent_color_text_regex_rgb = new RegExp(`\\-\\-accent\\-color\\-text-rgb: ${rgbAsString(hexToRgb(accent_color_text))}`, 'gi');

// console.log(primary_color_regex);
// console.log(primary_color_text_regex);
// console.log(accent_color_regex);
// console.log(accent_color_text_regex);

const colors = process.argv.slice(2).map((i) => `#${i}`);
if (colors.length < 4) {
	console.log('missing colors! Required colors are:');

	console.log("primary_color -> as hex with no '#'");
	console.log("primary_color_text -> as hex with no '#'");
	console.log("accent_color -> as hex with no '#'");
	console.log("accent_color_text -> as hex with no '#'");
	process.exit(-1);
}

const [primary_color_replace, primary_color_text_replace, accent_color_replace, accent_color_text_replace] = colors;
const css_primary_color_replace = `--primary-color: ${primary_color_replace}`;
const css_primary_color_text_replace = `--primary-color-text: ${primary_color_text_replace}`;
const css_accent_color_replace = `--accent-color: ${accent_color_replace}`;
const css_accent_color_text_replace = `--accent-color-text: ${accent_color_text_replace}`;

const css_primary_color_replace_rgb = `--primary-color-rgb: ${rgbAsString(hexToRgb(primary_color_replace))}`;
const css_primary_color_text_replace_rgb = `--primary-color-text-rgb: ${rgbAsString(hexToRgb(primary_color_text_replace))}`;
const css_accent_color_replace_rgb = `--accent-color-rgb: ${rgbAsString(hexToRgb(accent_color_replace))}`;
const css_accent_color_text_replace_rgb = `--accent-color-text-rgb: ${rgbAsString(hexToRgb(accent_color_text_replace))}`;

console.log([primary_color_replace, primary_color_text_replace, accent_color_replace, accent_color_text_replace]);
console.log(css_primary_color_replace);
console.log(css_primary_color_text_replace);
console.log(css_accent_color_replace);
console.log(css_accent_color_text_replace);
// if (!nextCssColor) {
// 	console.warn(process.argv[1]);
// 	console.log('No new color picked!');
// 	console.warn('Enter something like blue-600');
// 	process.exit(-1);
// }

updateEnv = () => {
	try {
		const env = `PRIMARY_COLOR=${primary_color_replace}
PRIMARY_COLOR_TEXT=${primary_color_text_replace}
ACCENT_COLOR=${accent_color_replace}
ACCENT_COLOR_TEXT=${accent_color_text_replace}
    `;
		fs.writeFileSync(path.join(__dirname, '.env'), env, 'utf8');
	} catch (error) {
		console.log(error);
	}
};

const replace = (regex, next) => {
	try {
		const data = fs.readFileSync(themePath, 'utf8');
		const result = data.replace(regex, next);
		fs.writeFileSync(themePath, result, 'utf8');
	} catch (error) {
		console.log(error);
	}
};

replace(primary_color_regex, css_primary_color_replace);
replace(primary_color_text_regex, css_primary_color_text_replace);
replace(accent_color_regex, css_accent_color_replace);
replace(accent_color_text_regex, css_accent_color_text_replace);

replace(primary_color_regex_rgb, css_primary_color_replace_rgb);
replace(primary_color_text_regex_rgb, css_primary_color_text_replace_rgb);
replace(accent_color_regex_rgb, css_accent_color_replace_rgb);
replace(accent_color_text_regex_rgb, css_accent_color_text_replace_rgb);

updateEnv();
console.log('done.');

// #afc849
// #a94727
// #a5B7FF
// #a7446B
