<template>
   <div id="wrapper">
      <p style="margin-left:35px;margin-top:25px;font-size:25px" >任务动态</p>
      <a-divider style="margin-top:10px"/>

      <div id="post">
        <a-list item-layout="horizontal" :data-source="newPost"><!---->
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta
            :description="item.content"
          >                            <!--//item.title-->
            <a slot="title" :href="item.link">{{item.user.username}}{{item.action}}</a>
            
            <a-avatar
              slot="avatar"
              :src="item.user.photo"
            />
          </a-list-item-meta>
          <div style="margin-right:30px;font-size:12px">{{item.time}}</div>
        </a-list-item>
        </a-list>
      </div>

      <a-divider style="margin-top:0px"/>
  <!--消息框-->
  <!--div id="send">
      <a-textarea v-model="postValue" placeholder="@提及他人" id="postContent" :rows="5" style="font-size:15px;margin-top:-25px;width:1700px"/>
    <a style="color:gray"><a-icon type="link" style="font-size:23px;margin-left:25px;margin-top:10px"/></a>
    <a style="color:gray"><a-icon type="smile" style="font-size:23px;margin-left:20px;margin-bottom:-6px"/></a>
    <a-button type="link" @click="postSomething" style="font-size:18px;float:right;margin-top:0px;margin-right:10px">
      发布
    </a-button>
  </div-->
</div>
  
</template>

<script>
export default {
   name: "Post",

   components: {},
   data() {
      return {
        postValue:"",
        newPost:[],
        postData:[],
      };
   },

   mounted(){
    this.getData()
   },

   methods:{
     getData:function(){
       this.$http.get(`/api/project/${this.$store.state.project.id}/action`,{params:{project_id:this.$store.state.project.id}})
       .then(doc=>{
			 if(doc.data.data){
         this.postData=doc.data.data;
         this.newPost=this.postData.reverse();
       }
			else{
        this.postData=[];
        this.newPost=[];
      }
       }).catch(err=>{
				this.$alert("未知错误", "false");  //服务器还没搭起来
      })
     },
     dateFormat:function() {
        var date=new Date();
        var year=date.getFullYear();
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
     },
     /*postSomething(){
       //var value=document.getElementById("postcontent").value;
       //this.postvalue=value;
       //this.postdata=[];
       var postData1={
         action:"发布了动态",
         content:'',
         link:null,
         time:null,
         user:{
           username:'',
           id:'',
           photo:null,
         },
       };
       //postdata.action="发布了动态";
       postData1.content=this.postValue;
       postData1.link=null;
       postData1.time=this.dateFormat();
       postData1.user.username=this.$store.state.banner.name;
       postData1.user.id="";
       postData1.user.photo=this.$store.state.banner.avatar;
       this.postValue="";
       this.postData.push(postData1);      
       //console.log(postdata.content);
     },*/
     
   }
    
   
};
</script>

<style scoped>
#post{
    margin-left:40px;
    height:calc(100vh - 50px - 120px);
    overflow-y: scroll;
    margin-top:-25px;
}
</style>


