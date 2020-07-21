<template>
   <div id="wrapper">
      <img src="http://funx.pro/resource/junk/17logo.svg" />

      <div id="dropdown1" v-if="$route.path !== '/home'">
         <a-dropdown :trigger="['hover']" style="color:black">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()" :disabled="!login">
               项目：{{login?projectName:'无'}}
               <a-icon type="down" />
            </a>
            <a-menu slot="overlay" style="margin-top:7px;">
               <a-menu-item key="-1" @click="showCreateModal">
                  创建项目
                  <a-modal v-model="createVisible" title="创建新项目" on-ok="handleOk">
                     <template slot="footer">
                        <a-button key="back" @click="createHandleCancel">取消</a-button>
                        <a-button
                           key="submit"
                           type="primary"
                           :loading="createLoading"
                           @click="createHandleOk"
                        >创建</a-button>
                     </template>
                     请输入项目名：
                     <a-input style="width: 300px" placeholder v-model="newName" />
                  </a-modal>
               </a-menu-item>

               <a-menu-divider />
               <a-menu-item key="-2" @click="showExchangeModal">
                  切换项目
                  <a-modal v-model="exchangeVisible" title="切换项目" on-ok="handleOk">
                     <template slot="footer">
                        <a-button key="back" @click="exchangeHandleCancel">取消</a-button>
                        <a-button
                           key="submit"
                           type="primary"
                           :loading="exchangeLoading"
                           @click="exchangeHandleOk(value)"
                        >切换</a-button>
                     </template>
                     请选择要切至的项目：
                     <br/>
                     <a-radio-group v-model="value" @change="onGroupChange" style="margin-left:30%">
                        <a-radio 
                           :key="i.id" 
                           :value="i.id" 
                           :style='radioStyleGroupChange'
                           v-for="i in changeProject">{{i.name}}</a-radio>
                     </a-radio-group>
                  </a-modal>
               </a-menu-item>

               <a-menu-divider />
               <a-menu-item key="-3" @click="showDeleteConfirm">删除项目</a-menu-item>
            </a-menu>
         </a-dropdown>
      </div>

      <div id="dropdown2">
         <a-dropdown :trigger="['hover']" style="color:black">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()" :disabled="!login">
               管理 <a-icon type="down" />
            </a>
            <a-menu slot="overlay" style="margin-top:7px;">
               <a-menu-item key="3" @click="showMemberModal">
                  查看项目成员
                  <a-modal v-model="memberVisible" title="项目成员信息" ok-text="确认" cancel-text="关闭" @ok="memberHandleOk">
                     <p style="padding-left:30px" v-for="i in projectMember" :key="i.id">
								<a-avatar :size="30" slot="avatar" :src="i.photo"></a-avatar>
								{{i.username}}
                        <a-button style="width:65px;height:25px;margin-right:30px;color:red;float:right" @click="deleteMember(i.id)">移除</a-button>
							</p>
                  </a-modal>
               </a-menu-item>

               <a-menu-divider />
               <a-menu-item key="4" @click="showAddMemberModal">
                  添加项目成员
                  <a-modal v-model="addMemberVisible" title="添加项目成员" ok-text="确认" cancel-text="取消" @ok="addMemberHandleOk">
                  <p>请输入要操作的成员：<a-input style="width:300px" v-model="addText1" /></p>
                     <a-radio-group v-model="value2" @change="onMemberChange">
                        <a-radio value="1">按邮箱</a-radio>
                        <a-radio value="2" disabled>按手机号</a-radio>
                        <a-radio value="3" disabled>按用户ID</a-radio>
                     </a-radio-group>
                  </a-modal>
               </a-menu-item>

               <a-menu-divider />
               <a-menu-item key="5" @click="showAddAdminModal">
                  添加项目管理员
                  <a-modal v-model="addAdminVisible" title="添加项目管理员" ok-text="确认" cancel-text="取消" @ok="addAdminHandleOk">
                  <p>请输入要操作的成员：<a-input v-model="addText2" style="width:300px" /></p>
                     <a-radio-group v-model="value3" @change="onAdminChange">
                        <a-radio value="1" >按邮箱</a-radio>
                        <a-radio value="2" disabled>按手机号</a-radio>
                        <a-radio value="3" disabled>按用户ID</a-radio>
                     </a-radio-group>
                  </a-modal>
               </a-menu-item>
            </a-menu>
         </a-dropdown>
      </div>

      <a-dropdown :trigger="['hover']" style="color:black" id="user">
         <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-icon type="user" style="margin-right:4px;" />
            {{!name?'未命名':name}}
         </a>
         <a-menu slot="overlay" style="margin-top:-10px;">
            <a-menu-item key="6" @click="showInfoModal" v-if="login">
               查看信息
               <a-modal
                  v-model="infoVisible"
                  title="个人信息"
                  ok-text="确认"
                  cancel-text="关闭"
                  @ok="infoHandleOk"
                  @cancel="infoHandleOk"
               >
                  <p style="padding-left:calc((100% - 60px)/2)">
                     <a-upload
								:withCredentials="true"
                        name="image"
                        :multiple="true"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="http://47.99.132.18/api/user/info/photo"
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

               </a-modal>
            </a-menu-item>
            <a-menu-divider v-if="login" v-show="$route.path !== '/home'" />
            <a-menu-item key="5" @click="$router.push('/home')" v-if="$route.path !== '/home'">返回主界面</a-menu-item>
            <a-menu-divider v-if="login" />
            <a-menu-item key="1" style="color:red" @click="toExit" v-if="login">退出登录</a-menu-item>
            <a-menu-item key="3" style @click="toLogin" v-if="!login">登录</a-menu-item>
            <a-menu-item key="4" style @click="toRegister" v-if="!login">注册</a-menu-item>
         </a-menu>
      </a-dropdown>
   </div>
</template>

<script>
/*import { Modal } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
import china from '../js/china'*/
const Modal = ()=>import('ant-design-vue')
const zhCN = ()=>import('ant-design-vue/es/locale-provider/zh_CN')
const china = ()=>import('../js/china')
// import { resolve } from 'dns';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
   name: "Banner",
   computed: {
      name() {
         return this.$store.state.banner.name;
      },
      login() {
         return this.$store.state.login;
      },
      projectName() {
         return this.$store.state.project.name;
      }
   },
   data() {
      return {
			projectMember:[],
         options: china,
         infoVisible: false,
         createVisible: false,
         createLoading: false,
         zhCN,
			curName:"",
         createLoading: false,
         exchangeVisible: false,
         exchangeLoading: false,
         value: 1,
         value2: 1,
         value3: 1,
         newName: "",
         changeProject: [],
         radioStyleGroupChange: {display: 'block',height: '30px',lineHeight: '30px',},
         userInfo: { photo: "", email: "", website: "", location: "" },
         memberVisible: false,
         addMemberVisible: false,
         mockData1: [],
         targetKeys1: [],
         addAdminVisible: false,
         mockData2: [],
         targetKeys2: [],
         infoVisible: false,
         newName:"",
			changeProject:[],
         headers: {
            authorization: 'authorization-text',
         },
         changingName: 0,
         changingAddress: 0,
			changingWebsite: 0,
			addText1:"",
			addText2:"",
			mName:"",
			mLocation:[],
         mHome:"",
         
         loading: false,
         image: "",
		};
   },
	methods: {
		deleteMember(id){
			this.$http.post(`/api/project/${this.$store.state.project.id}/user/remove`, { 
				account_type: 'id',
				account:id,
			}).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
					this.$alert(msg, "true");
					this.showMemberModal()
            } else {
               this.$alert(msg, "false");
            }
         })
		},
		blurName(){
			this.$http.post(`/api/user/info`, { 
				username: this.mName,
			}).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
               this.$alert(msg, "true");
            } else {
               this.$alert(msg, "false");
            }
         })
		},
		blurHome(){
			this.$http.post(`/api/user/info`, { 
				username: this.name,
				website:this.mHome,
			}).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
               this.$alert(msg, "true");
            } else {
               this.$alert(msg, "false");
            }
         });
		},
      //这个jump似乎就用不到了
      jump() {
         if (this.name == "未登录") this.$router.push("/login").catch(() => {});
         else {
            //弹框
            //  name:"未登录",
            // createLoading: false,
            // createVisible: false,
            // infoVisible: false,
            this.infoVisible = true;
         }
      },

      //创建项目部分
      showCreateModal() {
         this.createVisible = true;
      },
      createHandleOk(e) {
         this.createLoading = true;
         this.$http.post(`/api/project`, { name: this.newName }).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code !== 0) {
               this.$alert(msg, "false");
               this.createLoading = false;
            } else {
               this.createVisible = false;
               this.createLoading = false;
            }
         });
      },
      createHandleCancel(e) {
         this.createVisible = false;
      },

      //切换项目部分
      showExchangeModal() {
         this.exchangeVisible = true;
         this.$http.get(`/api/user/project`).then(doc => {
            console.log(doc);
            var code = doc.data.status;
            var msg = doc.data.msg;
            this.changeProject = doc.data.data;
            if (code != 0) {
            } else {
            }
         });
      },
      exchangeHandleOk(id, name) {
			this.$store.commit("taskUpdate", { id, name });
         var store = window.localStorage;
         this.exchangeLoading = true;
         this.changeProject.forEach(i => {
            if (i.id == id) name = i.name;
         });
         //proj
			this.$store.commit("projectReload", { id, name });
			// console.log("任务ID："+this.$store.state.project.id)
         store.setItem(this.$cookies.get("session"), id);
         setTimeout(() => {
            this.exchangeVisible = false;
            this.exchangeLoading = false;
         }, 100);
      },
      exchangeHandleCancel(e) {
         this.exchangeVisible = false;
      },
      onGroupChange(e) {
         console.log("radio checked", e.target.value);
      },
 
		//删除项目部分
      showDeleteConfirm() {
			var self = this
         Modal.confirm({
            title: "确定要删除项目吗？",
            content: "",
            okText: "是",
            okType: "danger",
            cancelText: "否",
            onOk() {
               self.$http
         		.post(`/api/project/${self.$store.state.project.id}/delete`, {
						project_id:self.$store.state.project.id,
					})
         		.then(doc => {
         		   var code = doc.data.status;
                  var msg = doc.data.msg;
						if (code == 0)
							self.$alert(msg,'true')
						else
							self.$alert(msg,'false')
						self.$store.commit("taskUpdate");
               })
               self.$router.push('/home');
            },
            onCancel() {
               console.log("Cancel");
            }
         });
      },

      //显示项目成员信息部分
      showMemberModal(){
			this.$http
         .get(`/api/project/${this.$store.state.project.id}`, {
				project_id:this.$store.state.project.id,
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0){
					this.projectMember = doc.data.data.member
					this.$store.commit("memberUpdate", this.projectMember);	
				}			
         })
         this.memberVisible = true;
      },
      memberHandleOk(e) {
         console.log(e);
         this.memberVisible = false;
      },

      //添加/移除成员部分
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
            } else 
					this.$alert(msg,'false')
         });
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
            } else 
					this.$alert(msg,'false')
         });
      },
      onAdminChange(e) {
         console.log("radio3 checked", e.target.value);
      },

      //显示个人信息部分
      showInfoModal() {
         this.infoVisible = true;
         
      },
      infoHandleOk(e) {
         console.log(e);
         this.infoVisible = false;
			this.update()
         this.changingName = 0;
         this.changingAddress = 0;
         this.changingWebsite = 0;
      },
      infoHandleCancel() {
         // this.infoVisible = false;

         // this.changingName = 0;
         // this.changingAddress = 0;
         // this.changingWebsite = 0;
      },

      //修改个人信息部分
      photoHandleChange(info) {
         if (info.file.status === 'uploading') {
            this.loading = true;
            return;
         }
         if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, image => {
            this.image = image;
            this.userInfo.photo = image;
            this.loading = false;
         });
         }
         var image = this.image
         console.log(info.file)
         /*this.$http.post(`/api/user/info/photo`,image).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
               this.$alert(msg, "true");
            } else {
               this.$alert(msg, "false");
            }
            console.log(doc);
         });*/
      },
      beforeUpload(file) {
         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
         if (!isJpgOrPng) {
         this.$message.error('只能上传JPG或PNG格式的图片');
         }
         const isLt5M = file.size / 1024 / 1024 < 5;
         if (!isLt5M) {
         this.$message.error('图片不能超过5MB');
         }
         return isJpgOrPng && isLt5M;
      },

      changeName() {
			this.mName = this.name;
         this.changingName = 1;
      },
      changeAddress() {
			this.mLocation = [];
         this.changingAddress = 1;
      },
      blurLocation(value) {
			var obj = { 
				username: this.name,
				location:this.mLocation.join('-'),
			}
			console.log(obj);
			this.mLocation = value
			this.$http.post(`/api/user/info`,obj).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            if (code == 0) {
               this.$alert(msg, "true");
            } else {
               this.$alert(msg, "false");
            }
         });
      },
      changeWebsite() {
			this.mHome = this.userInfo.website;
         this.changingWebsite = 1;
      },
      showOutLoginConfirm() {
         Modal.confirm({
            title: "确定要退出登录吗？",
            content: "",
            okText: "是",
            okType: "danger",
            cancelText: "否",
            onOk() {
					
            },
            onCancel() {
               console.log("Cancel");
            }
         });
      },
      toLogin() {
         this.$router.push("/login").catch(() => {});
      },
      toRegister() {
         this.$router.push("/register").catch(() => {});
      },
      toExit() {
         this.$http.get(`/api/user/logout`).then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            this.update();
            if (code == 0) {
               this.$alert(msg, "true");
               this.$router.push('/login');
            } else {
               this.$alert(msg, "false");
            }
         });
      },
      update() {
			var fetchProjectId = new Promise((resolve,reject)=>{
				this.$http.get(`/api/user/info`).then(doc => {
            var code = doc.data.status;
            if (code == 0) {
               this.$store.commit("bannerReload", {
                  name: doc.data.data.username,
                  avatar: doc.data.data.avatar
               });
               this.$store.commit("loginReload", true);
               this.$http.get(`/api/user/project`).then(doc => {
                  if (code == 0) {
							this.changeProject = doc.data.data;
							var id = window.localStorage[this.$cookies.get("session")];
							this.exchangeHandleOk(id)
							resolve()
                  }
               });
            } else {
               this.$store.commit("bannerReload", {
                  name: "未登录"
               });
					this.$store.commit("loginReload", false);
					reject();
            }
			});
			})
			fetchProjectId.then(()=>{
				this.$http.get(`/api/user/info`).then(doc => {
            	var code = doc.data.status;
            	var msg = doc.data.msg;
            	if (code == 0) {
               	this.userInfo = doc.data.data;
            	}
				});
				this.$http.get(`/api/project/${this.$store.state.project.id}`, {
					project_id:this.$store.state.project.id,
				}).then(doc => {
         	   var code = doc.data.status;
					var msg = doc.data.msg;
					// console.log("任务ID："+this.$store.state.project.id)
					if (code == 0){
						this.projectMember = doc.data.data.member
						this.$store.commit("memberUpdate", this.projectMember);	
					}			
         	})
			},()=>{})
      }
   },
   mounted() {
      this.update();
	},
	watch: {
		'$store.state.userUpdate': function () {
			this.update();
   	},
		'$store.state.project.id': function () {
			this.update();
   	}
   },
};
</script>

<style scoped>
#wrapper img:nth-child(1) {
   width: 46px;
   float: left;
   margin-left: calc(85px - 23px);
}
#wrapper {
   /* display: flex; */
   color: #aaa;
}
#dropdown1 {
   float: left;
   margin-left: 75px;
   padding: 15px;
}
#dropdown2 {
   display: none;
   float: left;
   padding: 15px;
}
#user {
   padding: 15px;
   float: right;
}

.avatar-uploader{
  width: 50px;
  height: 50px;
}




</style>
