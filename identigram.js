// imports
const fs = require("fs");
const Chance = require("chance");
const { createCanvas } = require("canvas");

// constants
const SIZE = 300;
const LIGHTNESS = 60;

const generateDirection = chance => {
  const angle = Math.ceil(chance.random() * 360);
  const length = (x0 = y0 = SIZE / 2);
  const x1 = x0 - Math.cos(angle) * length;
  const x2 = x0 + Math.cos(angle) * length;
  const y1 = y0 - Math.sin(angle) * length;
  const y2 = y0 + Math.sin(angle) * length;
  return { x1, y1, x2, y2 };
};

const generateHues = chance => {
  const hue1 = Math.ceil(chance.random() * 360);
  const hue2 = Math.ceil(chance.random() * 360);
  return { hue1, hue2 };
};

const generateSaturations = chance => {
  const saturation1 = Math.ceil(chance.random() * 100);
  const saturation2 = Math.ceil(chance.random() * 100);
  return { saturation1, saturation2 };
};

const seedIdentigram = oid => {
  const chance = new Chance(oid);

  const { x1, y1, x2, y2 } = generateDirection(chance);
  const { hue1, hue2 } = generateHues(chance);
  const { saturation1, saturation2 } = generateSaturations(chance);

  return {
    x1,
    y1,
    x2,
    y2,
    hue1,
    hue2,
    saturation1,
    saturation2,
  };
};

const drawIdentigramToCanvas = (oid, showAngle = false) => {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");

  const {
    x1,
    y1,
    x2,
    y2,
    hue1,
    hue2,
    saturation1,
    saturation2,
  } = seedIdentigram(oid);

  // Create gradient
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

  // Add colors
  gradient.addColorStop(
    0.0,
    `hsla(${hue1}, ${saturation1}%, ${LIGHTNESS}%, 1.000)`
  );
  gradient.addColorStop(
    1.0,
    `hsla(${hue2}, ${saturation2}%, ${LIGHTNESS}%, 1.000)`
  );

  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Show definition line
  if (showAngle) {
    ctx.beginPath();
    ctx.moveTo(rd[0], rd[1]);
    ctx.lineTo(rd[2], rd[3]);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  return canvas;
};

const saveIdentigramToPNG = oid => {
  const canvas = drawIdentigramToCanvas(oid);
  const date = new Date();
  const filename = `${oid}.${date.getTime()}.png`;
  const out = fs.createWriteStream(__dirname + `/grams/${filename}`);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => {
    console.log(`created PNG: ${filename}`);
  });
};

const test = () => {
  // test hash output on oids
  saveIdentigramToPNG("59b6bc3a25ce4b00524dab95"); // me
  saveIdentigramToPNG("544ee41d84f725e1da48e8ad");
  saveIdentigramToPNG("52582704cc5af7000d21c46d");
  saveIdentigramToPNG("57eead730f1d9d00fa1bc768");
  saveIdentigramToPNG("58b9d525dc4afc0051f80952");
  saveIdentigramToPNG("58701593d0007f003fc4353c");
  saveIdentigramToPNG("587f94e4d53289015734319e");
  saveIdentigramToPNG("530d049846d2de000c5717ed");
  saveIdentigramToPNG("54a39c26cfa427489dd386e6");
};

module.exports = { drawIdentigramToCanvas };
