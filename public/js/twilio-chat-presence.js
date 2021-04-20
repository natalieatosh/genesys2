jQuery(window).ready(()=> {
  const appConfig = {
    accountSid: "ACed09bac96930c7f93887faa7d1be9136",
    flexFlowSid: "FW6df8d491707ec52a12386b3e626e892e",
    startEngagementOnInit: true
  };

  let sessionid = undefined;

  Twilio.FlexWebChat.createWebChat(appConfig)
    .then(webchat => {
      const { manager } = webchat;

      Twilio.FlexWebChat.Actions.on("afterSendMessage", () => {
        const {channelSid} = manager.store.getState().flex.session;
        if (!sessionid || sessionid !== channelSid) {
          manager
            .chatClient.getChannelBySid(channelSid)
            .then(channel => {
              let visitor = new GLANCE.Presence.Visitor({
                groupid: document.getElementById("glance-cobrowse").getAttribute("data-groupid"),
                visitorid: channel.sid
              });
              visitor.onerror = function (e) {
                console.log("presence error:", e);
              };
              visitor.presence({
                onsuccess: function () {
                  console.log("presence success");
                }
              });
              visitor.onsignal = function (msg) {
                console.log("received signal:", msg);
              };
              visitor.connect();

            });
          sessionid = channelSid;
        }
      });

      webchat.init();

    });
});
