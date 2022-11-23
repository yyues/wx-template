import Dialog from "@vant/weapp/dialog/dialog";
const { globalData } = getApp();
//  处理 dialog 功能样式
Dialog.setDefaultOptions({
  messageAlign: "center",
  customStyle:
    "--dialog-border-radius: 8px;--dialog-message-line-height: 24px;--dialog-message-padding: 12px 16px;--dialog-header-padding-top:10px;",
  overlay: true,
  "custom-class": "my-dialog",
});

export default Dialog;
