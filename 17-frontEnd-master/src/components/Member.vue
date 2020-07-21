<template>
    <div id="wrapper">
       <router-view v-if="isRouterAlive"></router-view>
        <p style="margin-left:35px;margin-top:25px;font-size:25px" >项目成员</p>
        <a-divider style="margin-top:10px"/>
    
    <div id="post">
      <!--邀请新成员弹窗-->
      <a-modal v-model="addMemberVisible" title="邀请新成员" ok-text="确认" cancel-text="取消" @ok="addMemberHandleOk">
        <h3>账号邀请</h3>
        <a-input placeholder="输入邮箱或电话或用户ID直接邀请" style="width: 400px" v-model="addText1" />
        <a-radio-group v-model="value2" @change="onMemberChange" style="margin-top:9px">
          <a-radio value="1">
            邮箱
          </a-radio>
          <a-radio value="2" disabled>手机号</a-radio>
          <a-radio value="3" disabled>
            用户ID
          </a-radio>
        </a-radio-group>

        <p style="margin-top:50px">项目成员数量·{{this.memberNum}}</p>
      </a-modal>
       <!--修改管理员弹窗-->
      <a-modal v-model="amendVisible" title="修改成员信息" ok-text="确认" cancel-text="取消" @ok="okMessage()">
        <h3>权限设置</h3>
        <a-radio-group v-model="identityType" @change="identityChange" style="margin-top:9px">
          <a-radio :value="'admin'">
            管理员
          </a-radio>
          <a-radio :value="'member'">
            成员
          </a-radio>
        </a-radio-group>
        <br /><br />
        <a-button @click="showConfirm" type="danger">
          移除成员
        </a-button>
      </a-modal>

      <!--查看成员信息-->
      <!--a-modal
                  v-model="infoVisible"
                  title="个人信息"
                  ok-text="确认"
                  cancel-text="关闭"
                  @ok="infoHandleOk"
                  @cancel="infoHandleOk"
               >
                  <p style="padding-left:calc((100% - 60px)/2)">
                     <a-upload
                        name="avatar"
                        :multiple="true"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="http://47.99.132.18:9999/api/user/info/photo"
                        :headers="headers"
                        @change="photoHandleChange"
                     >
                     <img v-if="image" :src="image" alt="avatar" style="width:60px;height:60px;border-radius:50%"/>
                     <div v-else>
                        <a-avatar :size="60" slot="avatar" :src="userInfo.photo"></a-avatar>
                     </div>
                     </a-upload>
                  </p>
                  
                  <p style="padding-left:10px">
                     用户名：
                     <span v-if="changingName==0">{{name}}</span>
                     <a-input v-if="changingName==1" style="width:385px" default-value="" v-model="mName" @blur="blurName"/>
                     <a-button v-if="changingName==0" style="float:right;width:100px;height:25px" @click="changeName">更改用户名</a-button>
                  </p>

                  <p style="padding-left:10px">
                     邮箱：
                     <span>{{userInfo.email}}</span>
                  </p>

                  <p style="padding-left:10px">
                     所在地：
                     <span v-if="changingAddress==0">{{userInfo.location}}</span>
                     <a-cascader v-if="changingAddress==1" 
								style="width:385px" :options="options" placeholder="请选择地址" 
								@change="blurLocation" v-model="mLocation"
								:fieldNames="{ 'label': 'label', 'value': 'label','children': 'children'}"
							/>
                     <a-button v-if="changingAddress==0" style="float:right;width:100px;height:25px" @click="changeAddress">更改地址</a-button>
                  </p>

                  <p style="padding-left:10px">
                     个人主页：
                     <span v-if="changingWebsite==0">{{userInfo.website}}</span>
                     <a-input @blur="blurHome" v-if="changingWebsite==1" style="width:370px" v-model="mHome" addon-before="http://" default-value="" />
                     <a-button v-if="changingWebsite==0" style="float:right;width:100px;height:25px" @click="changeWebsite">更改网站</a-button>
                  </p>

               </a-modal-->

        <p><a-icon @click="showAddMemberModal" type="plus-circle"  style="fontSize:35px;color:#003366;margin-top:25px;margin-bottom:-5px;vertical-align:bottom" theme="filled"/>
        <em style="font-size:18px;font-style:normal;padding-left:10px;">邀请新成员</em></p>
        <a-list item-layout="horizontal" :data-source="memberData"><!---->
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta
      >                            <!--//item.title-->
        <p v-if="item.identity=='originator'||item.identity=='admin'" slot="title" @click="showInfoModal(item.id)" style="font-size:18px;color:gray;margin-top:-5px">{{item.username}}
        
          <a-icon v-if="item.identity=='originator'" type="crown" style="color:gold;fontSize:22px;margin-left:25px;vertical-align:bottom;margin-top:16px;"/>
        <a-icon v-if="item.identity=='admin'" type="sketch" style="color:#003366;fontSize:22px;margin-left:25px;vertical-align:bottom;margin-top:16px;"/>
          <!--a-icon @click="getMessage" type="eye" style="color:gray;fontSize:22px;margin-left:10px;vertical-align:bottom;margin-bottom:9px;"/-->
          <em v-if="item.location!=null&&item.location!=''" style="font-size:17px;color:gray;font-style:normal;margin-left:20px">           
            地址：{{item.location}}
          </em>
          <em v-if="item.tel!=null&&item.tel!=''" style="font-size:17px;color:gray;font-style:normal;margin-left:20px">  
            电话：{{item.tel}}
          </em>
          <em v-if="item.website!=null&&item.website!=''" style="font-size:17px;color:gray;font-style:normal;margin-left:20px">
            个人网页：{{item.website}}
          </em>
          </p>
          <p v-if="item.identity=='member'" slot="title" @click="showInfoModal(item.id)" style="font-size:18px;color:gray;margin-top:6.5px">{{item.username}}   
            <em v-if="item.location!=null&&item.location!=''" style="font-size:17px;color:gray;font-style:normal;margin-left:20px">           
            地址：{{item.location}}
          </em>
          <em v-if="item.tel!=null&&item.tel!=''" style="font-size:17px;color:gray;font-style:normal;margin-left:20px">  
            电话：{{item.tel}}
          </em>
          <em v-if="item.website!=null&&item.website!=''" style="font-size:17px;color:gray;font-style:normal;margin-left:20px">
            个人网页：{{item.website}}
          </em>
          </p>       
        <a-avatar
          slot="avatar"
          :src="item.photo"
          size="large"
          style="padding-bottom:-10px"
        />
      </a-list-item-meta>
      
      <div style="margin-top:-7px;margin-right:30px;font-size:10px">
        
        
      <a><a-icon @click="amendModal(item.identity,item.id)" v-if="item.identity!='originator'&&(identity=='admin'||identity=='originator')" type="setting" style="fontSize:25px;color:gray;margin-right:50px"/>
      </a>
      </div>
    </a-list-item>
  </a-list>
    </div>    
    </div>
</template>


<script>

export default {
  name: "Member",
  //inject:['reload'],
  components: {},
  data() {
    return {
      addMemberVisible: false,
      addText1:"",
      value2: 1,
      inviteVisible:false,
      amendVisible:false,
      allData:[],
      nowId:0,//现在设置的成员id
      showInfoId:0,//显示成员信息的id
      identity:"originator",//登录者的身份
      searchWay:'phone',
      identityType:'admin',
      memberNum:0,
      isRouterAlive: true,
      infoVisible:false,
      memberData:[/*{
          id:1,
          username:'张三',
          identity:'originator',
          photo:null,
      },
      {
          id:2,
          username:'李四',
          identity:'admin',
          photo:null,
      },
      {
          id:3,
          username:'王五',
          identity:'member',
          photo:"",
      },*/],
    };
  },
  
  provide(){
      return{
        reload:this.reload
      }
  },

  mounted(){
    this.getMember()
    this.update();
  },

  methods:{
    showInfoModal(id) {
         this.infoVisible = true;
         this.showInfoId=id;
      },

    reload(){
      this.update();
          this.isRouterAlive = false,
          this.$nextTick(function(){
            this.isRouterAlive = true;
          })
    },

    showConfirm(){//确认是否删除
      var a=confirm("确认移除该成员吗？");
       if(a){
        
      this.$http.post(`/api/project/${this.$store.state.project.id}/user/remove`, { 
				account_type: 'id',
				account:this.nowId,
			}).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
              this.$alert(msg, "true");        
              this.amendVisible=false;
            }
            else {
              this.$alert(msg, "false");
            }
         })
         this.amendVisible=false;
         this.update();
         
         
      }
      this.update();
    },
    okMessage(){//设置成员信息
    if(this.identityType=='member'){//身份为member
      this.$http.post(`/api/project/${this.$store.state.project.id}/admin/remove`, { //删除管理员
        project_id: this.$store.state.project.id,
        id:this.nowId,
      }).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
					this.amendVisible=false;
    				this.reload();//第一种刷新
    				this.update();
          this.$alert(msg, "true");
            } else {
              this.$alert(msg, "false");
            }
        })
    }
    else if(this.identityType=='admin'){//身份为管理员
      this.$http.post(`/api/project/${this.$store.state.project.id}/admin/add`, { //添加管理员
        project_id: this.$store.state.project.id,
        id:this.nowId,
      }).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
					this.amendVisible=false;
    				this.reload();//第一种刷新
    				this.update();
          this.$alert(msg, "true");
            } else {
              this.$alert(msg, "false");
            }
        })
    }    

    },
    update(){
      this.$http
          .get(`/api/project/${this.$store.state.project.id}`, {
          project_id:this.$store.state.project.id,
        })
          .then(doc => {
              var code = doc.data.status;
              var msg = doc.data.msg;
          if (code == 0){
            this.memberData = doc.data.data.member
            this.$store.commit("memberUpdate", this.memberData);	
          }			
          })
    },
    identityChange(e){//单选设置身份按钮
      this.identityType=e.target.value;
      console.log('radio checked', e.target.value);
    },
    inviteModal() {
      this.inviteVisible = true;
    },
    amendModal(identity,id) {
      this.amendVisible = true;
      this.nowId=id;
      this.identityType=identity;
      console.log(id);
    },
    searchWayChange(e) {
      console.log('radio checked', e.target.value);
    },
    getMember(){
       this.$http.get(`/api/project/${this.$store.state.project.id}`,{params:{project_id:this.$store.state.project.id}})
       .then(doc=>{
        var code = doc.data.status;
        var msg = doc.data.msg;
				if (code == 0){
			    if(doc.data.data)
            this.allData=doc.data.data;
          else
            this.allData=[];
          if(doc.data.data.member){
            this.memberNum=doc.data.data.member.length;
            this.memberData=doc.data.data.member; 
          }
          else
            this.memberData=[];
        }
       }).catch(err=>{
				this.$alert("未知错误", "false");  //服务器还没搭起来
      })
    },
    getMessage(){

    },

    ////添加成员
    showAddMemberModal() {
			this.value2 = '1'
      this.addMemberVisible = true;
    },
    addMemberHandleOk(e) {
		  var val = this.value2
			if(val == '1')
				val = 'email'
			if(val == '3')
				val = 'id'
			console.log(val);
			this.$http.post(`/api/project/${this.$store.state.project.id}/user/add`,{
				project_id:this.$store.state.project.id,
				account:this.addText1,
				account_type:val,
			}).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
          this.$alert(msg,'true')
          
          this.addMemberVisible = false;
          this.update();
            } else 
					this.$alert(msg,'false')
         });
         this.addMemberVisible=false;
      },
      onMemberChange(e) {
			
      },
      //添加/移除管理员部分
      showAddAdminModal() {
			this.value3 = '3'
        this.addAdminVisible = true;
      },
      addAdminHandleOk(e) {
		  var val = this.value3
			if(val == '1')
				val = 'email'
			if(val == '3')
				val = 'id'
			console.log(val);
			this.$http.post(`/api/project/${this.$store.state.project.id}/admin/add`,{
				project_id:this.$store.state.project.id,
				account:this.addText2,
				account_type:val,
			}).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
					this.$alert(msg,'true')
          this.addAdminVisible = false;
          this.addMemberVisible=false;
          this.update();
            } else 
					this.$alert(msg,'false')
         });
      },
      onAdminChange(e) {
         console.log("radio3 checked", e.target.value);
      },
  },
     
    
   
};
</script>

<style scoped>
.ant-list-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 15px 0px 5px 0;
}
.ant-list-item-meta-title {
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 25px;
}
#post{
    margin-left:40px;
    
    
    margin-top:-25px;
}
</style>