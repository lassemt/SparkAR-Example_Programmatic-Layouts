// Dependencies
const D = require('Diagnostics');
const Scene = require('Scene');
const Patches = require('Patches');
const R = require('Reactive');
const TG = require('TouchGestures');

//
// Helper funtions
//
// Get duplicated elements as array
// For example if you create a rectangle it
// gets the name rectangle0 and you
// duplicate it, the number will increase.
// This function gets all the elements based on
// the prefix and returns them in a array you 
// can loop later without having to set the 
// specific number of elements to get.
//
// Prefix is the name without number, e.g. rectangle.
//
function getObjects(prefix) {
	let output = [];
	let i = 0;
	let hasMatch = true;

	do {
	  try {
	  	output.push(Scene.root.find(prefix + i));
	  	i++;
	  } catch(err) {
	    hasMatch = false;
	  }
	}
	while (hasMatch);

	return output;
}

//
// Constants
//
// Standard stuff
// const FOCAL_DISTANCE = -0.5361266732215881;
const SCREEN_SCALE = Patches.getScalarValue('screenScale');
const SCREEN_SIZE = R.pack2(Patches.getPoint2DValue('screenSize').x, Patches.getPoint2DValue('screenSize').y);
const SCREEN_SIZE_SCALED = R.div(SCREEN_SIZE, SCREEN_SCALE);
const ASPECT_RATIO = R.div(SCREEN_SIZE.y, SCREEN_SIZE.x);

// Get all the color rectangles (array)
const COLOR_RECTS = getObjects('color');

//
// Example time
//
//
// So under you will see three examples. These should 
// be good examples on how to do stuff, you can go 
// a lot more crazy with it.
//
// The reason why I have split them into functions is so
// so you can call the different functions on e.g. tap 
// to swap between the layouts.
//
//
// Example 1: Align rectangles at bottom with spacing
function alignHorizontalBottom() {
	// Space between colors
	const gutter = 10;
	// Space on sides of group
	const margin = 30;

	// Calculate how wide squares should be
	const squareWidth = SCREEN_SIZE_SCALED.x.sub((margin * 2) + ((COLOR_RECTS.length - 1) * gutter)).div(COLOR_RECTS.length);
	// Make them square (you can multiply here with a ratio to have height smaller/higher to create a rectangle*).
	// *Some might say a square is already a rectangle, which is true, but a rectangle is not a square.
	const sqaureHeight = squareWidth;

	// Loop all squares and set size and position.
	COLOR_RECTS.map((el, i) => {
		// Set size
		el.width = squareWidth;
		el.height = sqaureHeight;

		// Move into position X-axis
		el.transform.x = SCREEN_SIZE_SCALED.x.sub(squareWidth).div(2).neg().add(margin).add(gutter * i).add(squareWidth.mul(i));
		// Move into position Y-axis
		el.transform.y = SCREEN_SIZE_SCALED.y.sub(sqaureHeight).div(2).neg().add(margin);
	});
}

// Example 2: Align rectangles on the right and stretch to fit
function alignVerticalRight() {
	// Scale ratio used to scale width proportionally.
	const ratio = 0.5;

	// Calculate how tall rectangles should be
	const rectHeight = SCREEN_SIZE_SCALED.y.div(COLOR_RECTS.length);
	const rectWidth = rectHeight.mul(0.5);

	// Loop all rectangles and set size and position.
	COLOR_RECTS.map((el, i) => {
		// Set size
		el.width = rectWidth;
		el.height = rectHeight;

		// Position all the way to the right
		el.transform.x = SCREEN_SIZE_SCALED.x.sub(rectWidth).div(2);
		// Move into position Y-axis
		el.transform.y = SCREEN_SIZE_SCALED.y.sub(rectHeight).div(2).sub(rectHeight.mul(i));
	});
}

// Example 3: Align rectangles diagonally accross the screen
function alignDiagonally() {
	// Calculate the size of the rectangles
	const rectWidth = SCREEN_SIZE_SCALED.x.div(COLOR_RECTS.length);
	const rectHeight = SCREEN_SIZE_SCALED.y.div(COLOR_RECTS.length);

	// Loop all rectangles and set size and position.
	COLOR_RECTS.map((el, i) => {
		// Set size
		el.width = rectWidth;
		el.height = rectHeight;

		// Position all the way to the right
		el.transform.x = SCREEN_SIZE_SCALED.x.sub(rectWidth).div(2).neg().add(rectWidth.mul(i));
		// Move into position Y-axis
		el.transform.y = SCREEN_SIZE_SCALED.y.sub(rectHeight).div(2).sub(rectHeight.mul(i));
	});
}

//
// Bonus: How to swap between layouts
// on tap
//
// Note how we use the function names in here:
const LAYOUTS = [
	alignHorizontalBottom,
	alignVerticalRight,
	alignDiagonally
];
// Number of taps
let taps = 0;
// Set initial current layout
LAYOUTS[taps % LAYOUTS.length]();
// The above is about the same as doing
// let current_layout = LAYOUTS[0 % LAYOUTS.length];
// current_layout();

// Subscribe to tap gestures
TG.onTap().subscribe( () => {
	// Increase number of taps
	taps++;
	// update current layout
	LAYOUTS[taps % LAYOUTS.length]();
});

//
// Thank you for reading. Feel free to 
// follow @lassemt (https://www.instagram.com/lassemt/)
// on Instagram if you feel this helped you.
//
// If you're working at Facebook and liked my code
// please tell Mark. Also, please give
// us access to buffers and GLSL shaders.
//
// XOXO Lasse 😏