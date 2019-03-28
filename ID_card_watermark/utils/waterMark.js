function mark(t) {
  return t = t || {}, canvasConfig = alterConfig(canvasConfig, t), createContext(), setCanvas();
}

function alterConfig(canvasConfig, t) {
  for (var i in t) t.hasOwnProperty(i) && (canvasConfig[i] = t[i]);
  return canvasConfig;
}

function createContext() {
  canvasContext = wx.createCanvasContext(canvasConfig.id);
}

function setCanvas() {
  return new Promise(function(t, e) {
    canvasContext.setGlobalAlpha(1),
    canvasContext.scale(1, 1),
    canvasContext.drawImage(canvasConfig.imgUrl, 0, 0, canvasConfig.width, canvasConfig.height),
    canvasContext.setFillStyle(canvasConfig.color),
    canvasContext.setFontSize(canvasConfig.size),
    canvasContext.rotate(Math.PI / 180 * canvasConfig.rotate),
    canvasContext.setGlobalAlpha(canvasConfig.opacity),
    canvasConfig.scale < 1 && canvasContext.scale(canvasConfig.scale, canvasConfig.scale),
    writeText(),
    canvasContext.draw(),
    t();
  });
}

function writeText() {
  var canvasxSpace = canvasConfig.xSpace,
    canvasySpace = canvasConfig.ySpace,
    textLength = canvasConfig.text.length,
    sizeWidth = canvasConfig.size + canvasySpace,
    sizeHeight = canvasConfig.size * textLength + canvasxSpace,
    allSize = .72 * (canvasConfig.width + canvasConfig.height);
  canvasConfig.scale < 1 && (allSize /= canvasConfig.scale);
  var cnt = 0;
  for (var y = canvasConfig.yStart; y < allSize + sizeWidth; y += sizeWidth) {
    for (var x = canvasConfig.xStart; x < allSize + sizeHeight; x += sizeHeight) {
      canvasContext.fillText(canvasConfig.text, x, y);
    }
  }
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, canvasConfig.width, canvasConfig.height);
}

function reRendering(newConfig) {
  return clearCanvas(), newConfig = newConfig || {}, canvasConfig = alterConfig(canvasConfig, newConfig), setCanvas();
}

var canvasConfig = {
    text: "watermark",
    rotate: 15,
    xSpace: 20,
    ySpace: 20,
    size: 20,
    xStart: -50,
    yStart: 20,
    opacity: .2,
    color: "#808080",
    width: 500,
    height: 500,
    imgUrl: "",
    id: "",
    parent: null
  },
  canvasContext = null;

module.exports = function() {
  return {
    mark: mark,
    reRendering: reRendering
  };
};