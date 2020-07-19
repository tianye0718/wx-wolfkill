// 引入微信插件
const wxSI = requirePlugin('WechatSI')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    seatNumber: '',
    canIGetAnCard: false,
    canIBeJustice: false,
    roleImageUrl: '/images/backgroud.jpg',
    game: {}
  },

  /**
   * 自定义函数
   */
  //播放语音
  playAudio: function (src) {
    if (!src) {
      console.log('语音文件为空')
      return
    }
    this.innerAudioContext.src = src
    this.innerAudioContext.play()
  },
  onConfirmRole: function () {
    this.setData({
      showModal: false,
      roleImageUrl: '/images/backgroud.jpg'
    })
  },
  seatNumberInputted: function (e) {
    this.data.seatNumber = e.detail.value ? e.detail.value : ''
    this.setButtonStatus()
  },
  setButtonStatus: function () {
    // no searNumber, set both buttons disabled
    if (!this.data.seatNumber) {
      this.setData({
        canIBeJustice: false,
        canIGetAnCard: false
      })
    } else {
      // if seatNumber already used, set canIGetAnCard to false
      console.log(this.data.game.players)
      if (this.data.game.players.find(element => element.seat == this.data.seatNumber) || 
          this.data.seatNumber == this.data.game.justice) {
        this.setData({
          canIGetAnCard: false,
          canIBeJustice: false
        })
        return
      } else {
        this.setData({
          canIGetAnCard: true
        })
      }
      if (this.data.game.justice) {
        this.setData({
          canIBeJustice: false
        })
      } else {
        this.setData({
          canIBeJustice: true
        })
      }
    }
  },
  justiceButtonPressed: function () {
    const that = this
    wx.showModal({
      title: '确认吗？',
        content: '放心，我会帮助你做好法官的，让我们来欣赏他们浮夸的演技吧！',
        success(res) {
          if (res.confirm) {
            const updateKey = 'game.justice'
            that.setData({
              [updateKey]: that.data.seatNumber
            })
            // tts
            wxSI.textToSpeech({
              lang: "zh_CN",
              tts: true,
              content: `${that.data.seatNumber}号玩家选择了法官`,
              success: function (res) {
                console.log(res);
                that.playAudio(res.filename);
              },
              fail: function (res) {
                console.log("TTS failed", res)
              }
            })
            that.clearSeat()
          }
        }
    })
  },
  cardButtonPressed: function () {
    var that = this
    if (that.data.game.players.length == that.data.game.cards.length) {
      wx.showToast({
        title: '所有卡牌已发放完毕',
        icon: 'none',
        duration: 2000
      })
    } else {
      const role = that.data.game.cards[that.data.game.players.length]
      const player = {
        seat: that.data.seatNumber,
        role: role,
        side: role.charAt(),
        status: 'live'
      }
      const updateKey = 'game.players'
      const roleImageUrl = '/images/' + role + '.jpg'
      that.data.game.players.push(player)
      that.setData({
        showModal: true,
        roleImageUrl: roleImageUrl,
        [updateKey]: that.data.game.players
      })
      // tts
      wxSI.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: `${that.data.seatNumber}号玩家抽取了一张卡牌`,
        success: function (res) {
          that.playAudio(res.filename);
        },
        fail: function (res) {
          console.log("TTS failed", res)
        }
      })
      that.clearSeat()
    }
  },
  clearSeat: function () {
    this.setData({
      seatNumber: ''
    })
    this.setButtonStatus()
  },
  startGame: function () {
    if (this.data.game.justice && this.data.game.players.length == this.data.game.cards.length) {
      const that = this
      that.data.game.status = 'gaming'
      wx.setStorageSync('game', that.data.game)
      wx.redirectTo({
        url: '/pages/game/game',
      })
    } else {
      wx.showToast({
        title: '卡牌还未发放完毕，不能开始游戏',
        icon: 'none',
        duration: 2000
      })
    }
  },
  shuffle: function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  },
  generateCards: function (game) {
    // gods: {g_yyj: true, g_nw: false, g_lr: false, g_sw: false, g_qs: false},
    //   wolves: {w_blw: false, w_lr: 0},
    //   villagers: {v_cm: 0},
    var cardList = []
    game.gods.g_yyj ? cardList.push('g_yyj') : null
    game.gods.g_nw ? cardList.push('g_nw') : null
    game.gods.g_lr ? cardList.push('g_lr') : null
    game.gods.g_sw ? cardList.push('g_sw') : null
    game.gods.g_qs ? cardList.push('g_qs') : null
    game.wolves.w_blw ? cardList.push('w_blw') : null
    for (var i = 0; i < game.wolves.w_lr; i++) {
      cardList.push('w_lr')
    }
    for (var i = 0; i < game.villagers.v_cm; i++) {
      cardList.push('v_cm')
    }
    return this.shuffle(cardList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.game = wx.getStorageSync('game')
    if (!this.data.game.cards) {
      console.log(this.data.game)
      const updateKey = 'game.cards'
      var cardList = this.generateCards(this.data.game)
      this.setData({
        [updateKey]: cardList
      })
    }
    if (!this.data.game.players) {
      const updateKey = 'game.players'
      this.setData({
        [updateKey]: []
      })
    }
    wx.setStorageSync('game', this.data.game)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      console.log(res);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      success: (res) => {},
    })
    this.setData({
      game: wx.getStorageSync('game')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('game', this.data.game)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorageSync('game', this.data.game)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})