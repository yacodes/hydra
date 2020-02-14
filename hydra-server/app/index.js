const PatchBay = require('./src/pb-live.js');
const HydraSynth = require('../../../hydra-synth');
const Editor = require('./src/editor.js');
const loop = require('raf-loop');
const P5 = require('./src/p5-wrapper.js');
const Gallery = require('./src/gallery.js');
const Menu = require('./src/menu.js');
const keymaps = require('./keymaps.js');
const log = require('./src/log.js');
const repl = require('./src/repl.js');

function init() {
  window.pb = pb;
  window.P5 = P5;

  var canvas = document.getElementById('hydra-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  var pb = new PatchBay();
  var hydra = new HydraSynth({pb: pb, canvas: canvas, autoLoop: false});
  var editor = new Editor();
  var menu = new Menu({editor: editor, hydra: hydra});
  log.init();

  // get initial code to fill gallery
  var sketches = new Gallery(function(code, sketchFromURL) {
    // osc(50, 0.1, 0.25).out(o0);
    // noise(1, 0).out(o1);

    // src(o0)
    //   .blend(src(o0).rotate(45))
    //   .diff(src(o1))
    //   .diff(src(o0).rotate(180))
    //   .mult(src(o1).rotate(() => Math.sin(time / 2)))
    //   .rotate(() => Math.sin(time / 4))
    //   .scale(() => Math.cos(time/2) + 2)
    //   .contrast(10)
    //   //.contrast(() => Math.sin(time/2) + 2)
    //   .out(o2);

    // render(o2);

    code = `
osc(16, 0.04, 1)
  .kaleid(128)
  .modulateScale(osc(32, -0.02), 2)
  .modulate(src(o0).modulate(noise(1)))
  .posterize().contrast(64).thresh()
  .out(o0);

render(o0);
    `;
    editor.setValue(code);
    repl.eval(code);

    // if a sketch was found based on the URL parameters, dont show intro window
    if (sketchFromURL) {
      menu.closeModal();
    } else {
      menu.openModal();
    }
  });
  menu.sketches = sketches;

  keymaps.init({
    editor: editor,
    gallery: sketches,
    menu: menu,
    repl: repl,
<<<<<<< HEAD
    log: log
  })
=======
  });
>>>>>>> Update

  // define extra functions (eventually should be added to hydra-synth?)

  // hush clears what you see on the screen
  window.hush = () => {
    solid().out();
    solid().out(o1);
    solid().out(o2);
    solid().out(o3);
    render(o0);
  };

  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: 'iclc',
  });

  var engine = loop(function(dt) {
    hydra.tick(dt);
  }).start();
}

window.onload = init;
