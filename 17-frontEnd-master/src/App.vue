<template>
   <div id="main-app">
		<transition name="public-slide">
      <div id="top" class="top" v-if="isTopShow">
         	<router-view name="top"></router-view>
      </div>
		</transition>
      <div id="main-wrapper">
			<transition name="public-slide" >
         <div id="left" class="left" v-if="isLeftShow">
            <router-view name="left"></router-view>
         </div>
			</transition>
         <div id="right">
				<transition name="public-slide" mode="out-in">
            <router-view name="right"></router-view>
				</transition>
         </div>
      </div>
   </div>
</template>


<script>
import top from './components/Banner'
import left from './components/Options'

export default {
   name: "App",
   components: { top, left },
   data() {
      return {
         isTopShow: true,
         isLeftShow: true,
         router: 0,
      };
   },
   mounted() {
		// console.log(this.$route.hash)
		this.TopAndLeftHide()
		// this.$cookies.set("session2","1111111111")
		// console.log(this.$cookies.get("session"))
		// console.log(this.$cookies.get("session2"))
		if(this.$cookies.get("session"))
			this.$router.push({ path: '/home' }).catch(()=>{})
		else{
			if(this.$route.hash=='#test')
				this.$router.push({ path: '/login',hash:'#test'}).catch(()=>{})
			else
				this.$router.push({ path: '/login'}).catch(()=>{})
		}
		
   },
   watch: {
      '$route.path'(to,from){
			// console.log('path modified')
         this.TopAndLeftHide()
      }
   },
	created(){
      //console.log(this.$store.state.banner.name)
		// var account= 'pixiaojiang@gov.cn'
		// var password = '123456'
		// this.$router.push({ path: '/login', query: {account,password} }).catch(()=>{})
		
      // console.log(this.$route.path)
   },
   methods: {
      TopAndLeftHide(){
         if (this.$route.path === '/login' || this.$route.path === '/register') {
            this.isTopShow = false
            this.isLeftShow = false
         }
         else if (this.$route.path === '/home') {
            this.isTopShow = true
            this.isLeftShow = false
         } 
         else {
            this.isTopShow = true
            this.isLeftShow = true
         }
      }
   },
};
</script>



<style>
html{
	font-size: 11px;
   height: 100%;
}
body{
	height: 100%;
}
#main-wrapper {
   display: flex;
}
#top {
   width: 100%;
   height: 50px;
   background-color: rgb(250, 248, 248);
   position: fixed;
   z-index: 10;
}
#left {
   width: 170px;
   height: calc(100vh - 50px);
   background-color: #001529;
   position: fixed;
   margin-top: 50px;
   z-index: 10;
}
#right {
   width: calc(100% - 170px);
   margin-left: 170px;
   margin-top: 50px;
}
   .public-slide-enter-active {
      transition: all 0.45s ease-in-out;
   }
   .public-slide-leave-active {
      transition: all 0.15s ease-in-out;
   }
   .public-slide-enter{
      transform: translateX(15px);
      opacity: 0;
   }
   .public-slide-leave-to{
      transform: translateX(-15px);
      opacity: 0;
   }
</style>
