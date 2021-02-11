jQuery(window).ready(()=> {
          const appConfig = {
           accountSid: "AC91f89e5d5e04366152c8e62572134fd7",
           flexFlowSid: "FO69eef6e849903fa7cfed2005524615ae",
           context: {
            friendlyName: /* is logged in ? then = Jennifer Smith, else = anonymous */
           },
           startEngagementOnInit: true
          };
            console.log('Twilio Web Chat');
          Twilio.FlexWebChat.createWebChat(appConfig)
                .then(webchat => {
                    const { manager } = webchat;
                  Twilio.FlexWebChat.Actions.on("afterToggleChatVisibility", () => {
                    const {channelSid} = manager.store.getState().flex.session;
                    manager
                      .chatClient.getChannelBySid(channelSid)
                      .then(channel => {
                        console.log(channel.sid);
                        let visitor = new GLANCE.Presence.Visitor({
                          groupid: document.getElementById("glance-cobrowse").getAttribute("data-groupid"),
                          visitorid: channel.sid
                        });
                        visitor.onerror = function (e) {
                          console.log("presence error:", e);
                        };
                        visitor.presence({
                          data: {mydata: "abc", myotherdata: 99999},
                          onsuccess: function () {
                            console.log("presence success");
                          }
                          // errors will be reported through onerror event
                        });
                        visitor.onsignal = function (msg) {
                          console.log("received signal:", e);
                        };
                        visitor.connect(); // not sure this is needed now because .presence() connects
                      });
                  });
                  webchat.init();
                });
});
