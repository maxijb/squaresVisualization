//config
const ww = 344;
const wh = 344;
const minSquareSize = 10;
const sizeTimeRatio = 1;
const svg = d3.select('svg');

//'global' variables
let startRandom = 0;
let lastMaxRandom = 1;
let maxRandom = 1;


//Setting canvas
const canvas = document.getElementById("myCanvas");
canvas.width  = ww;
canvas.height = wh; 
const ctx=canvas.getContext("2d");
const imgLoaded = () => {
	ctx.drawImage(img, 0, 0);
	process();
}

//Loadin img and calling recursive process
let img = new Image();
img.src = "hqdefault.jpg";
//has the img been loaded
if (img.completed || img.readyState == 4) {
	imgLoaded();
} else {
	img.onload = imgLoaded;
}








//defualt data
const process = (data) => {

	let size;

	if (!data) {
	
		data = [{x: 0, y: 0, w: ww, h: wh, childs: [0, 1, 2, 3]}];
	
	} else {

		//pick element and store 
		let candidates = data.slice(startRandom, startRandom+maxRandom).filter(x => x.childs.length > 0);

		if (!candidates.length) {

			if (data[data.length-1].w < minSquareSize) {
				return;
			}

			startRandom += lastMaxRandom;
			maxRandom = lastMaxRandom * 4;
			lastMaxRandom = maxRandom;
			return process(data);
		}

		const sqIndex = (Math.random() * candidates.length) | 0;
		let parent = candidates[sqIndex];

		//pick child element
		const childIndex = (Math.random() * parent.childs.length) | 0;
		const childId = parent.childs[childIndex];

		size = parent.w / 2;

		//add the new block
		data.push({ 
			w: size,
			h: size,
			x: childId % 2 == 0 ? parent.x : parent.x + size,
			y: childId < 2 		? parent.y : parent.y + size,
			childs: size > minSquareSize ? [0, 1, 2, 3]  : []
		});

		//remove child index already used
		parent.childs.splice(childIndex, 1);

	}

	let rects = svg.selectAll('rect').data(data);

	let sizeTransition = 0,
		maxTransition = 0;

	rects.enter()
		.append('rect')
		.attr('x', d => Math.random() < 0.5 ? d.x : d.x + d.w)
		.attr('y', d => Math.random() < 0.5 ? d.y : d.y + d.h)
		.attr('width', 0)
		.attr('height', 0)
		.attr('fill', d => {
			sizeTransition = d.w * sizeTimeRatio;
			maxTransition = Math.max(sizeTransition, maxTransition);
			let gray = (d.w * 255 / ww) | 0;
			let [r,g,b] = ctx.getImageData(d.x + d.w / 2, d.y + d.h / 2, 1, 1).data;
			return `rgb(${r}, ${g}, ${b})`;
		})
		.transition()
		.duration(maxTransition*8)
		.attr('x', d => d.x)
		.attr('y', d => d.y)
		.attr('width', d => d.w )
		.attr('height', d => d.h);

	
	if (data.length) {
		setTimeout(() => {
			process(data);
		}, size * sizeTimeRatio);
	}

}
















