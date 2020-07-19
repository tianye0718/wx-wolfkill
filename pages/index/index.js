//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    game: wx.getStorageSync('game') || {
      status: 'open',
      gods: {g_yyj: true, g_nw: false, g_lr: false, g_sw: false, g_qs: false},
      wolves: {w_blw: false, w_lr: 0},
      villagers: {v_cm: 0},
      configs: {
        jy: {
          selected: 0,
          options: ['不可自救', '首夜可自救']
        }, 
        dy: {
          selected: 0,
          options: ['不可与解药同一夜使用', '可与解药同一夜使用']
        }, 
        sw: {
          selected: 0,
          options: ['同时被守被救算死亡', '同时被守被救算存活']
        }}
    },
  },
  //事件处理函数
  gYYJPressed: function () {
    var updateKey = 'game.gods.g_yyj'
    this.setData({
      [updateKey]: !this.data.game.gods.g_yyj
    })
  },
  gNWPressed: function () {
    var updateKey = 'game.gods.g_nw'
    this.setData({
      [updateKey]: !this.data.game.gods.g_nw
    })
  },
  gLRPressed: function () {
    var updateKey = 'game.gods.g_lr'
    this.setData({
      [updateKey]: !this.data.game.gods.g_lr
    })
  },
  gSWPressed: function () {
    var updateKey = 'game.gods.g_sw'
    this.setData({
      [updateKey]: !this.data.game.gods.g_sw
    })
  },
  gQSPressed: function () {
    var updateKey = 'game.gods.g_qs'
    this.setData({
      [updateKey]: !this.data.game.gods.g_qs
    })
  },
  wBLWPressed: function () {
    var updateKey = 'game.wolves.w_blw'
    this.setData({
      [updateKey]: !this.data.game.wolves.w_blw
    })
  },
  lrSubPressed: function () {
    var num = this.data.game.wolves.w_lr
    if (num > 0) {
      num--
    }
    var udpateKey = 'game.wolves.w_lr'
    this.setData({
      [udpateKey]: num
    })
  },
  lrAddPressed: function () {
    var num = this.data.game.wolves.w_lr
    num++
    var updateKey = 'game.wolves.w_lr'
    this.setData({
      [updateKey]: num
    })
  },
  cmSubPressed: function () {
    var num = this.data.game.villagers.v_cm
    if (num > 0) {
      num--
    }
    var udpateKey = 'game.villagers.v_cm'
    this.setData({
      [udpateKey]: num
    })
  },
  cmAddPressed: function () {
    var num = this.data.game.villagers.v_cm
    num++
    var updateKey = 'game.villagers.v_cm'
    this.setData({
      [updateKey]: num
    })
  },
  configJYPressed: function () {
    this.configUpdate('jy')
  },
  configDYPressed: function () {
    this.configUpdate('dy')
  },
  configSWPressed: function () {
    this.configUpdate('sw')
  },
  configUpdate: function (config) {
    var that = this
    var itemList = []
    var updateKey = ''
    if (config == 'jy') {
      itemList = that.data.game.configs.jy.options
      updateKey = 'game.configs.jy.selected'
    } else if (config == 'dy') {
      itemList = that.data.game.configs.dy.options
      updateKey = 'game.configs.dy.selected'
    } else if (config == 'sw') {
      itemList = that.data.game.configs.sw.options
      updateKey = 'game.configs.sw.selected'
    }
    wx.showActionSheet({
      itemList: itemList,
      success (res) {
        that.setData({
          [updateKey]: res.tapIndex
        })
      }
    })
  },
  startGame: function () {
    // gods: {g_yyj: true, g_nw: false, g_lr: false, g_sw: false, g_qs: false},
    //   wolves: {w_blw: false, w_lr: 0},
    //   villagers: {v_cm: 0},
    var totalUserCount = this.data.game.gods.g_yyj + 
                         this.data.game.gods.g_nw + 
                         this.data.game.gods.g_lr + 
                         this.data.game.gods.g_sw + 
                         this.data.game.gods.g_qs + 
                         this.data.game.wolves.w_blw + 
                         this.data.game.wolves.w_lr + 
                         this.data.game.villagers.v_cm
    if (totalUserCount < 6) {
      wx.showToast({
        title: '当前人数少于六人，不能开始游戏',
        icon: 'none',
        duration: 2000
      })
    } else {
      const that = this
      wx.showModal({
        title: '确认开始游戏',
        content: `当前游戏总人数为 ${totalUserCount + 1} 人，包含 ${totalUserCount} 名玩家和 1 名法官`,
        success(res) {
          if (res.confirm) {
            that.data.game.status = 'checking'
            wx.setStorageSync('game', that.data.game)
            wx.redirectTo({
              url: '/pages/check/check',
            })
          }
        }
      })
    }
  },
  onLoad: function () {
    const game = wx.getStorageSync('game') || {}
    if (game.status == 'gaming') {
      wx.redirectTo({
        url: '/pages/game/game',
      })
    } else if (game.status == 'checking') {
      wx.redirectTo({
        url: '/pages/check/check',
      })
    } 
  }
})
