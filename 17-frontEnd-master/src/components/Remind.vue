<template>
    <div id="wrapper">
       <p style="margin-left:50px;margin-top:25px;font-size:25px" >全部通知</p>
       <a-divider style="margin-top:10px"/>
    <div id="all">
       <div id="left1">
           <a-list item-layout="horizontal" :data-source="remindData">
        <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta
        :description="item.name"
      >
        <a slot="title" @click="showDetails(item.type)">{{ item.t_remind }}</a>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
       </div>
       <div id="right1" v-if="rightShow">
           <div id="more1" v-if="this.messageType=='schedule'">
           <!--日程部分-->
           <div id="iconleft">
            <a-icon type="edit" style="fontSize:22px;color:gray;vertical-align:middle;margin:15px;margin-bottom:20px"/>日程内容
            <a-icon type="user" style="fontSize:22px;color:gray;vertical-align:middle;margin:15px;margin-bottom:20px"/>发起人
            <a-icon type="calendar" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:20px"/>设置时间
            <a-icon type="clock-circle" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:16px"/>提醒时间
            <a-icon type="pushpin" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:16px"/>备注
            <a-icon type="tag" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:20px;"/>标签
        </div>

        <div id="contentright1">
        <a-input placeholder="日程内容" style="width:100%;" v-model="scheName" disabled/><br>
        <a-input style="margin-top:25px;width:100%;" v-model="scheCreator" disabled/><br>
        <a-date-picker style="margin-top:25px;width:100%" :value="moment(t_set)" disabled/><br>
        <a-date-picker style="margin-top:23px;width:100%" :value="moment(t_remind)" disabled/><br>
            
        <a-input v-model="scheRemarks" disabled style="margin-top:23px;width:100%"/>
        <p></p>
        <div id="tags">
                <div>
                <template v-for="(tag) in scheLabel">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag">
                {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" color="#003366" style="font-size:15px;text-align:center;height:25px;margin-top:10px" @close="() => handleClose(tag)">
                {{ tag }}
            </a-tag>
            </template>   
        </div>      
        </div>    
    </div>   
    </div>
           <!--任务部分-->
           <div id="more" v-if="this.messageType=='task'">
                     <div id="contextleft">
                  <p>

                  <a-icon type="appstore" style="fontSize:22px;color:gray;margin-top:10px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:1px">任务名</em><br />  

                  <a-icon type="file-done" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:1px">状态</em><br />

                  <a-icon type="user" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:2px">创建者</em><br />
                  
                  <a-icon type="calendar" style="fontSize:20px;color:gray;margin-bottom:2px;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:4.5px;">执行时间</em><br />

                  <a-icon type="pushpin" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:2px">备注</em><br />

                  <a-icon type="fire" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom;margin-bottom:-2px"/>
                  <em class="em11" style="margin-left:2.3px">优先级</em><br />

                  <a-icon type="tag" style="fontSize:22px;color:gray;margin-top:28px;vertical-align:bottom;margin-bottom:-1px"/>
                  <em class="em11" style="margin-left:2.3px">标签</em><br />    
               </p>   
               </div>   
               <div id="contextright">
                  
                  <p class="em11" style="margin-bottom:8px;margin-right:10px;font-size:15px;padding-left:0;">{{this.taskName}}</p>
                  <br />
                  <em class="em11" style="margin-right:10px;font-size:15px;padding-left:0;">完成情况</em>
                  <a-switch :defaultChecked="defaultChecked" disabled/><br /><br />
                  <!---拉取头像  --->
               <a-avatar icon="user" style="margin-top:0px" :size="37" :src="this.taskPhoto"/>
               <br />
               <a-range-picker
                  :value="[moment(t_begin), moment(t_end)]"
                  style="margin-top:17px;width:397px"
                  disabled
               />
               <br /><br />
               <div>
               <p>
               <a-input v-model="taskRemarks" style="width:397px;" disabled/>
               <br /><br />

                <!--优先级-->                             
               <a-tag
                    v-if="taskPriority=='1'"
                    color="gray"
                    :visible="true"
                    style="font-size:16px;text-align:center;width:60px;height:23px"
                >较低</a-tag>
                <a-tag
                    v-if="taskPriority=='2'"
                    color="green"
                    :visible="true"
                    style="font-size:16px;text-align:center;width:60px;height:23px"
                >普通</a-tag>
                <a-tag
                    v-if="taskPriority=='3'"
                    color="orange"
                    :visible="true"
                    style="font-size:16px;text-align:center;width:60px;height:23px"
                >紧急</a-tag>
                <a-tag
                    v-if="taskPriority=='4'"
                    color="red"
                    :visible="true"
                    style="font-size:16px;text-align:center;width:80px;height:23px"
                >非常紧急</a-tag>
               <br /><br />
               <div style="margin-top:-10px">
                  <div id="tags">
                     <div style="margin-left:2px;margin-top:3px">
                        <template v-for="(tag) in taskLabel">
                           <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                              <a-tag
                                 :key="tag"
                                 
                                
                              >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                           </a-tooltip>
                           <a-tag
                              v-else
                              :key="tag"
                              
                              color="#003366"
                              style="font-size:14px;text-align:center;height:22px"
                             
                           >{{ tag }}</a-tag>
                        </template>
                     </div>
                  </div>
               </div>
           </div>
       </div>
           </div>
       </div>
    </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    name: "Remind",
    components: {},
    data() {
        return {
			rightShow:false,
            defaultChecked:false,
            remindData:[/*{
                name: "任务3",
                t_remind: "2020-05-30 21:00:00",
                type: "task:22"
            },
            {
                name: "日程4",
                t_remind: "2020-05-30 21:00:00",
                type: "schedule:22"
            }*/],
            messageType:"",
            messageId:1,
            taskData:null,
            taskLabel:[],
            taskLabelStr:"",
            taskPhoto:null,
            taskPriority:1,
            taskRemarks:"",
            t_begin:null,
            t_end:null,
            scheAllData:[],
            scheData:null,
            scheName:"",
            scheLabel:[],
            scheLabelStr:"",
            scheRemarks:"",
            t_remind:null,
            t_set:null,
            taskName:"dsasdfas",
            scheCreator:"",
        };
    },
    mounted() {
		this.getData();
		// var date = new Date()
		// this.t_set = date
    },
    methods: {
        moment,
        showDetails(type){
            var a=type.split(':');
            this.messageType=a[0];
				this.messageId=parseInt(a[1]);
                if(!this.rightShow) this.rightShow = true;
            if(this.messageType=='task')
                this.getTaskData();
            if(this.messageType=='schedule')
                this.getScheData();
            console.log(this.messageType);
        },
        getData:function(){
            this.$http.get(`/api/project/${this.$store.state.project.id}/remind`,{params:{project_id:this.$store.state.project.id}})
            .then(doc=>{
                    if(doc.data.data){
                        this.remindData=doc.data.data;                    
                    }
                    else
                        this.remindData=[];
            }).catch(err=>{
                        this.$alert("未知错误", "false");  //服务器还没搭起来
            })
        },
        getTaskData:function(){
            this.$http.get(`/api/project/${this.$store.state.project.id}/task/info?id=${this.messageId}`,
            {params:{project_id:this.$store.state.project.id,task_id:this.messageId}})
            .then(doc=>{
                    if(doc.data.data){
                        this.taskData=doc.data.data;
                        this.defaultChecked=this.taskData.finish;
                        this.taskRemarks=this.taskData.remarks;
                        this.taskPriority=this.taskData.priority;
                        this.t_begin=this.taskData.t_begin;
                        this.t_end=this.taskData.t_end;
                        this.taskLabelStr=this.taskData.label;
                        this.taskLabel=this.taskLabelStr.split(' ');
                        this.taskPhoto=this.taskData.originator.photo;     
                        this.taskName=this.taskData.name;     
                    }                  
                    else
                        this.taskData=null;
            }).catch(err=>{
                        this.$alert("未知错误", "false");  //服务器还没搭起来
            })                
        },
        getScheData:function(){
            this.$http.get(`/api/project/${this.$store.state.project.id}/schedule`,
            {params:{project_id:this.$store.state.project.id}})
            .then(doc=>{
                    if(doc.data.data){
                        this.scheAllData=doc.data.data;
                        for(var i=0;i<this.scheAllData.length;i++){
                            if(this.scheAllData[i].id==this.messageId){
                                this.scheData=this.scheAllData[i];
                                break;
                            }
                        }                              
                        this.scheName=this.scheData.content;
                        this.scheRemarks=this.scheData.remarks;
                        this.scheLabelStr=this.scheData.label;
                        this.scheLabel=this.scheLabelStr.split(' ');
                        this.t_remind=this.scheData.t_remind;
                        this.t_set=this.scheData.t_set;
                        this.scheCreator=this.scheData.creator.username; 
                        console.log(this.scheCreator);
                    }                       
                    else
                        this.scheAllData=[];
            }).catch(err=>{
                        this.$alert("未知错误", "false");  //服务器还没搭起来
            })                      
        },
    }
};
</script>



<style scoped>
#contentright1{
   width: calc(100% - 140px);
   height: 300px;
   margin-top:12px ;
}
#more{
    display: flex;
    margin-left:38px;
    margin-top:9px;
}
#more1{
	/* float:l */
    display: flex;
    margin-left:18px;
    margin-top:5px;
}
#iconleft{
   margin-left: 0px;
   width: 120px;
   color:gray;
}

.em1 {
   font-style: normal;
   font-size: 16px;
   padding-left: 0px;
}
.em11 {
   font-style: normal;
   font-size: 15px;
   padding-left: 11px;
   color: gray;
   font-family: "Microsoft YaHei";
}
#contextleft{
    width:130px;
}
#contextright{
    width:363px;
    margin-top:9.5px;
    
}
#all{
    margin-top:20px;
    display: flex;
}
#right1{
    margin-left:5%;
    width:calc(100vw - 600px - 50px);
    display: block;
    margin-top:0px;
	 
}
#left1{
    margin-top:10px;
    margin-left:50px;
    width:350px;
    border:1px solid LightGrey;
    overflow-y: auto;
    max-height:400px;
}
.ant-list-item-meta-title > a {
    color: rgba(0, 0, 0, 0.65);
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    font-size: 17px;
    margin-left:20px;
}
.ant-list-item-meta-description {
    color: rgba(80, 63, 63, 0.8);
    font-size: 17px;
    line-height: 20px;
    margin-left:20px;
}
</style>
 