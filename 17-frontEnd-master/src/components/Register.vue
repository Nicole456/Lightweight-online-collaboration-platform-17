<template>
   <div class="logincontent">
      <img src="http://funx.pro/resource/junk/17logo.svg" >
      <br /><br />
      <a-input placeholder="注册用的邮箱" v-model="account" ref="userNameInput" />
      <br /><br />
      <a-input placeholder="2-20位用户名（中文/数字/字母/下划线）" v-model="userName" ref="userNameInput" />
      <br /><br />
      <a-input-password v-model="password" placeholder="6-20位密码（区分大小写）" />
      <br /><br />
      <a-input-password v-model="password2" placeholder="确认密码" />
      <br /><br />
      <a-input placeholder="11位手机号码" v-model="account2" ref="teleNumberInput" disabled/>
      <br /><br />
      <a-input disabled placeholder="输入验证码" v-model="verificationCode" ref="verificationCodeInput" style="width: 65%;float: left"/>
      <a-button style="float: right" disabled>获取验证码</a-button>
      <br /><br /><br />
      <a-button type="primary" style="width: 50%;float: left" @click="enter">注册</a-button>
      <a-button type="link" @click="$router.push('/login')" style="float: right;float: right">使用现有账号登录</a-button>
   </div>
</template>

<script>
export default {
   name: "Register",
   components: {},
   data() {
      return {
			userName: '',
			account:'',
			account2:'',
			account_type:"",
			password:"",
			password2:"",
			verificationCode:"",
      };
   },
   methods: {
      emitEmpty() {
         this.$refs.userNameInput.focus();
         this.userName = '';
		},
		enter(){
			if(this.password != this.password2){
				this.$alert('两次密码不一致噢','false')
				return;
			}
			var account_type = 'email'
			var account = this.account
			var username = this.userName
			var password = this.password
			this.$http.post(`/api/user/register`,{
				account_type,account,username,password
			}).then(doc=>{
				var code = doc.data.status
				var msg = doc.data.msg
				if(code==0){
					this.$alert(msg,'true')
					this.$router.push({ path: '/login', query: {account,password} })
					.catch(()=>{})
				}else{
						msg = getFirstMsg(msg)
					this.$alert(msg,'false')
				}
				console.log(doc)
			})
			/*const CODE = {
				'-100':'参数错误',
				1001:"邮箱格式错误",
				1002:"手机号格式错误",
				1003:"密码格式错误",
				1007:"邮箱已存在",
				1008:"手机号已存在",
				1009:"用户名格式错误",
			}*/
			function getFirstMsg(obj){
				if(typeof msg != 'object')
					return obj
				for(var i in obj){
					return i+' '+obj[i]
				}
			}
		}
   },
};
</script>



<style scoped>
.logincontent{
	min-width: 300px;
    width: 30%;
    height: 100%;
    margin-left: calc((70% - 170px)/2);
    margin-top: 2%;
    overflow: hidden;
    text-align: center;
}

.logincontent img:nth-child(1){
    width: 15%;
    margin: auto;
}
</style>

