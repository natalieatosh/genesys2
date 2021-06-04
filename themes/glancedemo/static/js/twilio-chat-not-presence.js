jQuery(window).ready(()=> {
          const appConfig = {
            accountSid: "ACb9151d8cf55541876ece4a5b06516d86",
    flexFlowSid: "FOe0451856979b50710238b302ac650187",
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
