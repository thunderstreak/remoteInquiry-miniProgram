Component({
  externalClasses: ['outer-class'],
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    style: {
      type: String
    },
    src: {
      value: '',
      type: String
    },
    imgDefault: {
      value: 'https://sdk-source.xylink.com/h5/webrtc/device/default.png',
      type: String
    }
  },
  data: {
    isShow: true
  },
  methods: {
    loadError() {
      this.setData({
        isShow: false
      });
    }
  }
});
