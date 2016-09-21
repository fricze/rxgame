const game = window.game;
const ctx = game.getContext('2d');

const render = string => {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.font = "48px sans-serif";
  ctx.fillText(string, 10, 50);
}

const renderer = (viewTree) => {
  viewTree.subscribe(render, () => null, function onCompleted() {
    alert('complete!');
  });
}

export default renderer;
