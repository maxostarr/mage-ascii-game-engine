import Color from "./Color";
import Layer from "./Layer";
import Renderer from "./Renderer";
import Tile from "./Tile";
import Vector from "./Vector";

const WIDTH = 80;
const HEIGHT = 24;

const layers: Record<string, Layer> = {
  background: new Layer({ size: new Vector(WIDTH, HEIGHT) }),
  actor: new Layer({ size: new Vector(WIDTH, HEIGHT) }),
};

const player = new Tile({
  background: new Color(0, 0, 0, 0),
  char: "@",
  color: new Color(255, 0, 0),
  isVisible: true,
  pos: Vector.Zero(),
});

const backgroundTiles = Array.from({ length: WIDTH * HEIGHT }, (_, i) => {
  const x = i % WIDTH;
  const y = Math.floor(i / WIDTH);

  return new Tile({
    char: ".",
    pos: new Vector(x, y),
  });
});

const renderer = new Renderer();
renderer.setSize(35);
renderer.addLayer("background", layers.background);
renderer.addLayer("actor", layers.actor);

renderer.onBeforeDraw(() => {
  layers.background.operations.forEach((op) => {
    const newAlpha = (Math.sin(op.pos.x / op.pos.y + 5) + 1) / 2;
    op.color.a = newAlpha;
  });
});

let time = Date.now();
const frameTimes = [];

const drawText = (text: string, layer: Layer, startingPoint: Vector) => {
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];
    const letterTile = new Tile({
      char: letter,
      pos: Vector.add(startingPoint, new Vector(i, 0)),
    });
    layer.draw(letterTile);
  }
};

const draw = () => {
  backgroundTiles.forEach((tile) => layers.background.draw(tile));
  layers.actor.draw(player);
  renderer.commit();
  const frameTime = Date.now() - time;
  frameTimes.push(frameTime);
  drawText(
    frameTime.toString().slice(0, 4),
    layers.background,
    new Vector(10, 0),
  );
  // console.log("Frame time", frameTimes[frameTimes.length - 1]);
  time = Date.now();
  requestAnimationFrame(draw);
};

setInterval(() => {
  let sum = 0;
  const frames = frameTimes.length;
  while (frameTimes.length > 0) sum += frameTimes.pop();
  console.log("Average frame time", sum / frames);
}, 1000);
// average frame time with JS caled size 150 - 210
draw();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": {
      player.pos.add(new Vector(0, -1));
      break;
    }
    case "ArrowDown": {
      player.pos.add(new Vector(0, 1));
      break;
    }
    case "ArrowLeft": {
      player.pos.add(new Vector(-1, 0));
      break;
    }
    case "ArrowRight": {
      player.pos.add(new Vector(1, 0));
      break;
    }
  }
});
