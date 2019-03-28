getApp();
var waterMark = new(require('../../utils/waterMark.js'))(),
  defaultConfig = {
    colorMap: [
      ['0', '#808080'],
      ['1', '#000000'],
      ['2', '#ee0000'],
      ['3', '#ffffff'],
      ['4', '#87CEEB']
    ],
    sizeMap: [
      ['0', 20],
      ['1', 40],
      ['2', 60],
      ['3', 80],
      ['4', 100],
      ['5', 120],
      ['6', 140],
      ['7', 160]
    ],
    densityMap: [
      ['0', 20],
      ['1', 30],
      ['2', 40],
      ['3', 50],
      ['4', 60],
      ['5', 70],
      ['6', 80],
      ['7', 90]
    ],
    densityMapItem: [
      ['0', '0.4'],
      ['1', '0.5'],
      ['2', '0.6'],
      ['3', '1.0'],
      ['4', '1.2'],
      ['5', '1.4'],
      ['6', '1.6'],
      ['7', '1.8']
    ],
    waterMarkConfig: {
      color: '#808080',
      opacity: .5,
      size: 20,
      density: 50,
    },
    text: '此证件仅用作XX使用!',
    debounceDelay: 200
  };

Page({
  data: {
    app: '',
    bool: false,
    canvasW: 100,
    canvasH: 200,
    inputFocus: false,
    currentColorIndex: -1,
    currentSizeIndex: -1,
    currentDensityIndex: -1,
    isSave: false,
    text: '此证件仅用作XX使用!'
  },

  onReady: function() {
    this.getDefaultConfig();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '身份证水印',
      path: '/pages/index/index',
      imageUrl: '../../images/shareImage.png'
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (this.data.isSave) {
      this.setData({
        canvasW: wx.getSystemInfoSync().windowWidth,
        canvasH: (wx.getSystemInfoSync().windowHeight) / 2.5,
        app: '',
        bool: false,
        inputFocus: false,
        currentColorIndex: -1,
        currentSizeIndex: -1,
        currentDensityIndex: -1,
        text: this.data.defaultText,
        draw: false
      });
      defaultConfig.waterMarkConfig.size = 20;
      defaultConfig.waterMarkConfig.color = '#808080';
      defaultConfig.waterMarkConfig.density = 50;
      var indexImgUrl = {
        width: wx.getSystemInfoSync().windowWidth,
        height: (wx.getSystemInfoSync().windowHeight) / 2.5,
        text: '',
        scale: 2,
        imgUrl: '/images/index.jpg',
      };
      waterMark.mark(indexImgUrl)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isSave: false
    })
  },

  /**
   * 获取default配置
   */
  getDefaultConfig: function() {
    var that = this,
      colorMap = defaultConfig.colorMap,
      sizeMap = defaultConfig.sizeMap,
      waterMarkConfig = defaultConfig.waterMarkConfig,
      densityMap = defaultConfig.densityMap,
      densityMapItem = defaultConfig.densityMapItem,
      defaultColorMap = colorMap.filter(function(t) {
        return t[1] == waterMarkConfig.color;
      }),
      defaultSizeMap = sizeMap.filter(function(t) {
        return t[1] == waterMarkConfig.size;
      }),
      defaultDensityMap = densityMap.filter(function(t) {
        return t[1] == waterMarkConfig.density;
      });
    that.setData({
      ColorMap: colorMap,
      SizeMap: sizeMap,
      DensityMap: densityMap,
      DensityMapItem: densityMapItem,
      defaultColorIndex: defaultColorMap.length ? defaultColorMap[0][0] : -1,
      defaultSizeIndex: defaultSizeMap.length ? defaultSizeMap[0][0] : -1,
      defaultDensityIndex: defaultDensityMap.length ? defaultDensityMap[0][0] : -1,
      defaultText: defaultConfig.text,
      text: defaultConfig.text,
    });
  },

  /**
   * 选择照片
   */
  chooseImg: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(e) {
        var imgUrl = e.tempFilePaths[0];
        wx.getImageInfo({
          src: imgUrl,
          success: function(e) {
            var imgW = e.width,
              imgH = e.height,
              canvasW = wx.getSystemInfoSync().windowWidth,
              widthProp = canvasW / imgW,
              canvasH = canvasW * imgH / imgW;
            that.setData({
              canvasW: canvasW,
              canvasH: canvasH,
              imgW: imgW,
              imgH: imgH,
            });
            var canvasConfig = {
              text: that.data.text,
              id: 'myCanvas',
              color: '#ffffff',
              xStart: 0,
              yStart: -.71 * e.width,
              xSpace: defaultConfig.waterMarkConfig.density/2,
              ySpace: defaultConfig.waterMarkConfig.density,
              rotate: 45,
              opacity: .5,
              width: canvasW,
              height: canvasH,
              scale: canvasW / imgW,
              size: 20,
              imgUrl: imgUrl
            };
            canvasConfig = Object.assign(canvasConfig, defaultConfig.waterMarkConfig);
            waterMark.mark(canvasConfig).then(function() {
              that.setData({
                draw: true
              }), -1 === that.data.currentColorIndex && -1 !== that.data.defaultColorIndex && that.setData({
                currentColorIndex: that.data.defaultColorIndex
              }), -1 === that.data.currentSizeIndex && -1 !== that.data.defaultSizeIndex && that.setData({
                currentSizeIndex: that.data.defaultSizeIndex
              }), -1 === that.data.currentDensityIndex && -1 !== that.data.defaultDensityIndex && that.setData({
                currentDensityIndex: that.data.defaultDensityIndex
              })
            })
          }
        })
      }
    });
  },

  /**
   * text改变监听器
   */
  handleTextChange: function(e, debounceDelay) {
    var that, time, timeOut, n, s,
      r = function() {
        var timeDiff = new Date().getTime() - time;
        timeDiff < debounceDelay && timeDiff >= 0 ? timeOut = setTimeout(r, debounceDelay - timeDiff) : (timeOut = null, s = e.apply(that, n), timeOut || (that = n = null));
      };
    return function() {
      return that = this, n = arguments, time = new Date().getTime(), timeOut || (timeOut = setTimeout(r, debounceDelay)), s;
    };
  }(function(e) {
    this.data.draw && waterMark.reRendering({
      text: e.detail.value
    });
    this.setData({
      text: e.detail.value
    })
  }, defaultConfig.debounceDelay),

  /**
   * text获得焦点监听器
   */
  handleTextFocus: function() {
    this.setData({
      inputFocus: true
    });
  },

  /**
   * text失去焦点监听器
   */
  handleTextBlur: function(e) {
    this.setData({
      inputFocus: false,
    });
    console.log(this.data.text)
  },

  /**
   * 点击尺寸监听器
   */
  handelSizeClick: function(e) {
    var id = e.target.id;
    if (id) {
      var that = this;
      this.setData({
          currentSizeIndex: id
        },
        function() {
          if (defaultConfig.waterMarkConfig.size = that.data.SizeMap[that.data.currentSizeIndex][1], !that.data.draw) return false;
          waterMark.reRendering({
            size: defaultConfig.waterMarkConfig.size
          });
        }
      );
    }
  },

  /**
   * 点击密度监听器
   */
  handelDensityClick: function(e) {
    var id = e.target.id;
    if (id) {
      var that = this;
      this.setData({
          currentDensityIndex: id
        },
        function() {
          if (defaultConfig.waterMarkConfig.density = that.data.DensityMap[that.data.currentDensityIndex][1], !that.data.draw) return false;
          waterMark.reRendering({
            xSpace: defaultConfig.waterMarkConfig.density/2,
            ySpace: defaultConfig.waterMarkConfig.density
          });
        });
    };
  },

  /**
   * 点击颜色监听器
   */
  handleColorClick: function(e) {
    var id = e.target.id;
    if (id) {
      var that = this;
      this.setData({
          currentColorIndex: id
        },
        function() {
          if (defaultConfig.waterMarkConfig.color = that.data.ColorMap[that.data.currentColorIndex][1], !that.data.draw) return false;
          waterMark.reRendering({
            color: defaultConfig.waterMarkConfig.color
          });
        });
    }
  },

  /**
   * 保存图片
   */
  saveImg: function(e) {
    if (!this.data.draw) return false;
    wx.showLoading({
      title: '保存中'
    });
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      destWidth: this.data.imgW,
      destHeight: this.data.imgH,
      success: function(e) {
        wx.saveImageToPhotosAlbum({
          filePath: e.tempFilePath,
          success: function() {
            wx.hideLoading(),
              wx.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 2e3
              })
          }
        })
      }
    });
    this.setData({
      isSave: true
    })
  },

  clearText: function(){
    this.setData({
      inputFocus: false,
      text: '',
    });
    this.data.draw && waterMark.reRendering({
      text: ''
    });
    this.setData({
      inputFocus: true
    })
  }

});