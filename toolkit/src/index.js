import QRCode from "qrcode";

const codeInput = document.getElementById("code-input");
const createCodeButton = document.getElementById("create-code");
const eggvg = require("./eggvg.svg");
const img = new Image();
img.src = eggvg;
console.log(img.width);
console.log(img.height);
function component() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.height = 500;
  canvas.width = 500;

  createCodeButton.onclick = (e) => {
    e.preventDefault();
    QRCode.toCanvas(canvas, codeInput.value, { width: 500 }, (e) => {
      if (!e) {
        ctx.drawImage(
          img,
          250 - img.width / 2,
          250 - img.height / 2,
          img.width / 1,
          img.height / 1
        );
      }
    });
  };

  return canvas;
}

document.body.appendChild(component());
