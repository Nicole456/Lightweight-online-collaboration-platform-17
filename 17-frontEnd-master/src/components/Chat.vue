<template>


    <div class="main-content" v-if="group">
      <div id="chatName"  >
        <p>{{group.name}}</p>
      </div>
      <div id="chatContent" >

        <div id="chatShow" ref="chatList">
          <template
            v-for="message in currentMessageList"
          >
            <div v-if="message.from === $store.state.timLoginInfo.userID" class="chatOut">
              <a-avatar :size="50" slot="avatar" :src="userInfo.photo"></a-avatar>
              <div class="contentOut" style="float:right;color:white">
                <p>
                  {{message.payload.text}}
                </p>
              </div>
              <br>
              <br>
            </div>
            <div v-else class="chatIn" >
              <a-avatar :size="50" slot="avatar":src="getUserInfo(message.from).photo"></a-avatar>
              <div style="width: inherit;">
                <div style="margin-left: 15px; margin-bottom: 3px">{{getUserInfo(message.from).username}}</div>
                <div class="contentIn">
                  <p>
                    {{message.payload.text}}
                  </p>
                </div>
              </div>


            </div>
          </template>
        </div>




      </div>
      <div id="chatInput">
        <div id="chatInputText">
          <a-textarea v-model="chatText" style="height:93px" placeholder="" :rows="5" />
        </div>

        <div id="chatInputOther">
          <a-button style="float:right" size="large" @click="sendMessage">发送</a-button>
        </div>

      </div>

    </div>


</template>


<script>
  import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
  import TIM from 'tim-js-sdk';
  import COS from "cos-js-sdk-v5";
  import Vue from 'vue'
  /*const zhCN  = ()=>import('ant-design-vue/es/locale-provider/zh_CN')
  const TIM  = ()=>import('tim-js-sdk')
  const COS  = ()=>import("cos-js-sdk-v5")*/
  
  export default {
    name: "Chat",
    components: {},

    data() {
      return {
        zhCN,
        showCreate:0,
        createGroupVisible:false,
        mockData: [],
        targetKeys: [],
        project_id: 0,
        messageList: {},
        currentMessageList: [],
        conversationList: [],
        groupsList: [],
        conversationID: null,
        chatSelect: null,
        memberData: [],
        chatText: "",
        group: null,
        loginInfo:{
          userID: null,
          userSig: null,
        },
        messageBox: [],
        userInfo: { photo: "", email: "", website: "", location: "" },
      }
    },
    mounted() {
      this.getMock();
      this.getInfo();
      this.timLogin();
      this.getMember();
      // this.getGroupList();
    },
    watch:{
        currentMessageList: function(){
            this.$nextTick(function(){
                this.$refs.chatList.scrollTop = 99999999;
            })
        }
    },
    methods: {
      getInfo(){
        this.$http.get(`/api/user/info`).then(doc => {
          var code = doc.data.status;
          var msg = doc.data.msg;
          this.userInfo = doc.data.data;
        });
      },
      timLogin() {
        if (this.$store.state.timProjectId === null || this.$store.state.timProjectId !== this.$store.state.project.id) {
          this.$store.state.timProjectId = null;
          this.$http
                  .get(`/api/project/${this.$store.state.project.id}/chat/sig`, {})
                  .then(doc => {
                    var code = doc.data.status;
                    var msg = doc.data.msg;
                    if (code === 0) {
                      let data = doc.data.data;
                      if (this.tim == null) {
                        this.timInit(data.app_id);
                      }
                      this.login(data.user_id, data.user_sig, this.$store.state.project.id);
                    }
                  });
        }
      },
        timInit(app_id) {
            if(this.tim === undefined){
                let tim = TIM.create({
                    SDKAppID: app_id
                });
                tim.setLogLevel(1);
                tim.registerPlugin({'cos-js-sdk': COS});
                Vue.prototype.tim = tim;
                this.initListener();
            }
        },
      logout() {
        let promise = this.tim.logout();
        if (promise){
          promise.then(function (imResponse) {
            console.log("logout success：", imResponse.data); // 登出成功
          }).catch(function (imError) {
            console.warn('logout error:', imError);
          });
        }

      },
      login(user_id, user_sig, project_id) {
        this.logout();
        let promise = this.tim.login({userID: user_id, userSig: user_sig});
        promise.then((imResponse)=> {
          console.log("login success", imResponse.data); // 登录成功
          this.$store.commit("setIMProjectId", project_id);
          this.loginInfo.userID = user_id;
          this.$store.commit("setIMUserId", user_id);
          this.initListener();
        }).catch(function(imError) {
          console.warn('login error:', imError); // 登录失败的相关信息
        });
      },
      initListener() {
        this.tim.on(TIM.EVENT.SDK_READY, this.onReady);
        this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
      },
      onReady(event) {
        this.getGroupList()
      },
      onReceiveMessage({ data: messageList }) {
        this.updateMessageList(messageList)
      },
      updateMessageList(data) {
        if (Array.isArray(data)) {
          // 筛选出当前会话的消息
          const result = data.filter(item => item.conversationID === this.conversationID)
          this.currentMessageList = [...this.currentMessageList, ...result]
        } else if (data.conversationID === this.conversationID) {
          this.currentMessageList = [...this.currentMessageList, data]
        }
      },
      getGroupList () {
        let promise = this.tim.getGroupList();
        promise.then((imResponse) => {
          this.groupsList = imResponse.data.groupList;
          if(this.groupsList){
            this.group = this.groupsList[0];
            this.conversationID = "GROUP"+this.group.groupID;
          }
          this.getMessageList();
        }).catch(function(imError) {
          console.warn('getGroupList error:', imError); // 获取群组列表失败的相关信息
        });
      },
      getConversation() {
        let promise = this.tim.getConversationList();
        promise.then(imResponse => {
          const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
          this.conversationList = conversationList;
        }).catch(function(imError) {
          console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
        });
      },

      getMessageList() {
        let id = `GROUP${this.group.groupID}`;
        let promise = this.tim.getMessageList({conversationID: id, count: 15});
        promise.then((imResponse)=> {
          const messageList = imResponse.data.messageList; // 消息列表。
          const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
          // this.messageList[group.groupID]=messageList;
          this.currentMessageList = messageList;
        });
      },
      callback(key) {
      },
      showModal() {
        this.createGroupVisible = true;
      },
      handleOk(e) {
        this.createGroupVisible = false;
      },
      getMock() {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 5; i++) {
          const data = {
            key: i.toString(),
            title: `联系人${i + 1}`,
            //description: `description of content${i + 1}`,
            chosen: 0,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        this.mockData = mockData;
        this.targetKeys = targetKeys;
      },
      handleChange(targetKeys, direction, moveKeys) {
        this.targetKeys = targetKeys;
      },
      getMember(){
        this.$http.get(`/api/project/${this.$store.state.project.id}`,{params:{project_id:this.$store.state.project.id}})
                .then(doc=>{
                  var code = doc.data.status;
                  var msg = doc.data.msg;
                  if (code === 0){
                    if(doc.data.data.member){
                      let memberData={};
                      let data = doc.data.data.member
                      for(let i=0; i<data.length;i++){
                        memberData[data[i].id] = {
                          id: data[i].id,
                          username: data[i].username,
                          photo: data[i].photo
                        }
                      }
                      this.memberData=memberData;
                    }
                    else
                      this.memberData=[];
                  }
                }).catch(err=>{
          this.$alert("未知错误", "false");  //服务器还没搭起来
        })
      },
      getUserInfo(id) {
        id = id.split('-')[1];
        if(this.memberData[id] === undefined)
          return {
            username: "",
            photo: "",
          }
        let info = this.memberData[id]
        if (info.username === undefined) info.username = "";
        if (info.photo === undefined) info.photo = "";
        return info
      },
      sendMessage() {
        if (this.chatText){
          let message = this.tim.createTextMessage({
            to: this.group.groupID,
            conversationType: TIM.TYPES.CONV_GROUP,
            payload: {
              text: this.chatText
            }
          });
          this.updateMessageList(message);
          this.tim.sendMessage(message);
          this.chatText = "";
        }
      }
    },
  };
</script>



<style scoped>
  #wrapper{
    margin-left: 30px;
    margin-right: 30px;
  }

  #chatName{
    width: 100%;
    text-align: center;
    font-size: 20px;
    background-color: white;
    color: #001529;
  }

  .main-content{

  }
  #chatContent{
    width: 100%;
  }
  #chatShow{
    width: 100%;
    height: calc(100vh - 50px - 53px - 130px);
    overflow: scroll;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
  }
  .chatIn{
    width: 80%;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chatOut{
    width: 100%;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: row-reverse;
  }

  .contentIn{
    width: fit-content;
    max-width: 70%;
    margin-left: 10px;
    padding: 5px 10px;
    background-color: white;
    word-break: break-all;
    height: fit-content;
  }
  .contentIn > p{
    margin: 0;
  }
  .contentOut {
    max-width: 70%;
    margin: auto 10px;
    padding: 5px 10px;
    background-color: #1890FF;
    word-break: break-all;
    height: fit-content;
  }
  .contentOut >p{
    margin: 0;
  }


  #chatInput{
    width: 100%;
    bottom:0;
  }
  #chatInputOther{
    width: 100%;
    height: 40px;
    background-color:rgb(250, 248, 248);
  }
  #chatInputText{
    width: 100%;
    height: 90px;
  }

</style>
 