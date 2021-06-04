jQuery(window).ready(()=> {
  const appConfig = {
    accountSid: "ACb9151d8cf55541876ece4a5b06516d86",
    flexFlowSid: "FOe0451856979b50710238b302ac650187",
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
