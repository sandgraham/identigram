const middlePatchTypes = new Array(0, 4, 8, 15);
const patch0 = new Array(0, 4, 24, 20);
const patch1 = new Array(0, 4, 20);
const patch2 = new Array(2, 24, 20);
const patch3 = new Array(0, 2, 20, 22);
const patch4 = new Array(2, 14, 22, 10);
const patch5 = new Array(0, 14, 24, 22);
const patch6 = new Array(2, 24, 22, 13, 11, 22, 20);
const patch7 = new Array(0, 14, 22);
const patch8 = new Array(6, 8, 18, 16);
const patch9 = new Array(4, 20, 10, 12, 2);
const patch10 = new Array(0, 2, 12, 10);
const patch11 = new Array(10, 14, 22);
const patch12 = new Array(20, 12, 24);
const patch13 = new Array(10, 2, 12);
const patch14 = new Array(0, 2, 10);
const patchTypes = new Array(
  patch0,
  patch1,
  patch2,
  patch3,
  patch4,
  patch5,
  patch6,
  patch7,
  patch8,
  patch9,
  patch10,
  patch11,
  patch12,
  patch13,
  patch14,
  patch0
);

const a = createIdentigram();
const b = createIdentigram();
const c = createIdentigram();
const d = createIdentigram();


function identigramToDataURL(canvas) {
  console.log(canvas.toDataURL());
}

function createIdentigram() {
  const canvas = document.createElement("canvas");
  const seed = Math.floor(Math.random() * 10000000000);
  const size = 124;
  canvas.width = canvas.height = size;
  renderIdentigramToCanvas(canvas, seed);
  document.body.appendChild(canvas);
  return canvas
}

function renderIdentigramsToCanvases() {
  const canvases = [...document.getElementsByTagName("canvas")];
  canvases.forEach(canvas => {
    const seed = canvas.dataset.pgUserId;
    const size = canvas.width;
    renderIdentigramToCanvas(canvas, seed, size);
  });
}

function renderIdentigramToCanvas(canvas, seed, size=123) {
  const ctx = canvas.getContext("2d");

  const patchSize = size / 3;
  const middleType = middlePatchTypes[seed & 3];
  const middleInvert = ((seed >> 2) & 1) != 0;
  const cornerType = (seed >> 3) & 15;
  const cornerInvert = ((seed >> 7) & 1) != 0;
  const sideType = (seed >> 10) & 15;
  const sideInvert = ((seed >> 14) & 1) != 0;
  const blue = (seed >> 16) & 31;
  const green = (seed >> 21) & 31;
  const red = (seed >> 27) & 31;
  const foreColor = `rgb(${red << 3}, ${green << 3}, ${blue << 3})`;
  const backColor = `rgb(255,255,255)`;

  let cornerTurn = (seed >> 8) & 3;
  let sideTurn = (seed >> 15) & 3;

  // middle patch
  renderIdentigramPatch(ctx, patchSize, patchSize, patchSize, middleType, 0, middleInvert, foreColor, backColor);
  // side patchs, starting from top and moving clock-wise
  renderIdentigramPatch(ctx, patchSize, 0, patchSize, sideType, sideTurn++, sideInvert, foreColor, backColor);
  renderIdentigramPatch(ctx, patchSize * 2, patchSize, patchSize, sideType, sideTurn++, sideInvert, foreColor, backColor);
  renderIdentigramPatch(ctx, patchSize, patchSize * 2, patchSize, sideType, sideTurn++, sideInvert, foreColor, backColor);
  renderIdentigramPatch(ctx, 0, patchSize, patchSize, sideType, sideTurn++, sideInvert, foreColor, backColor);
  // corner patchs, starting from top left and moving clock-wise
  renderIdentigramPatch(ctx, 0, 0, patchSize, cornerType, cornerTurn++, cornerInvert, foreColor, backColor);
  renderIdentigramPatch(ctx, patchSize * 2, 0, patchSize, cornerType, cornerTurn++, cornerInvert, foreColor, backColor);
  renderIdentigramPatch(ctx, patchSize * 2, patchSize * 2, patchSize, cornerType, cornerTurn++, cornerInvert, foreColor, backColor);
  renderIdentigramPatch(ctx, 0, patchSize * 2, patchSize, cornerType, cornerTurn++, cornerInvert, foreColor, backColor);
}

function renderIdentigramPatch(ctx, x, y, size, patch, turn, invert, foreColor, backColor) {
  patch %= patchTypes.length;
  turn %= 4;
  if (patch == 15)
    invert = !invert;

  const vertices = patchTypes[patch];
  const offset = size / 2;
  const scale = size / 4;

  ctx.save();

  // paint background
  ctx.fillStyle = invert ? foreColor : backColor;
  ctx.fillRect(x, y, size, size);

  // build patch path
  ctx.translate(x + offset, y + offset);
  ctx.rotate(turn * Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo((vertices[0] % 5 * scale - offset), (Math.floor(vertices[0] / 5) * scale - offset));
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo((vertices[i] % 5 * scale - offset), (Math.floor(vertices[i] / 5) * scale - offset));
  }
  ctx.closePath();

  // offset and rotate coordinate space by patch position (x, y) and
  // 'turn' before rendering patch shape

  // render rotated patch using fore color (back color if inverted)
  ctx.fillStyle = invert ? backColor : foreColor;
  ctx.fill();

  // restore rotation
  ctx.restore();
}
