<template>
    <div id="wrapper">
        <div id="more">
            
    <a-button block @click="showModal" size="large">
      添加日程
    </a-button>

    <a-modal
      title="添加日程"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="保存"
      cancelText="取消"
    >
    <div id="fl">
        <div id="iconleft">
            <a-icon type="edit" style="fontSize:22px;color:gray;;margin:15px;"/>
            <a-icon type="calendar" style="fontSize:22px;color:gray;margin:15px;"/>
            <a-icon type="clock-circle" style="fontSize:22px;color:gray;margin:15px;"/>
            <a-icon type="pushpin" style="fontSize:22px;color:gray;margin:15px;"/>
            <a-icon type="tag" style="fontSize:22px;color:gray;margin:15px;"/>
        </div>

        <div id="contentright">
        <a-input placeholder="填写日程内容" autoSize allowClear style="width:400px;" v-model="content"/>
        <a-date-picker @change="onChange" style="margin-top:20px;width:400px" placeholder="请选择日期"/>
        <a-date-picker @change="onChange2" style="margin-top:20px;width:400px" placeholder="请选择提醒时间"/>
		  <!-- :defaultValue="getCurrentMoment -->
        <p></p>
        <!-- <a-date-picker
            :mode="mode1"
            showTime
            @openChange="handleOpenChange1"
            @panelChange="handlePanelChange1"
            placeholder="请选择提醒时间"
            style="margin-top:30px;width:400px"
            /> -->
            <p></p>
        <a-input placeholder="填写备注" v-model="remarks" autoSize allowClear style="margin-top:30px;width:400px"/>
        <p></p>
        <div class="tags1">
                <div>
                <template v-for="(tag, index) in tags">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :closable="index !== 0" color="#003366" style="font-size:15px;text-align:center;height:25px;margin-top:10px" @close="() => handleClose(tag)">
                {{ tag }}
            </a-tag>
            </template>
            <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="large"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
            />    
            <a-tag v-else @click="showInput" style="background:#fff; height:25px;borderStyle: dashed">
            <a-icon type="plus" /> <em style="font-size:14px;font-style:normal;color:gray;padding-left:0">添加标签</em>
            </a-tag>   
        </div>      
        </div>    
    </div>   

</div>
    </a-modal>

        <!--日程查看详情-->
        <a-modal v-model="showDetails" title="查看日程" @ok="save" @cancel="cancel" cancelText="取消" okText="保存" width="650px">
        <div id="f2">
        <div id="iconleft1">
            <a-icon type="edit" style="fontSize:22px;color:gray;vertical-align:middle;margin:15px;margin-bottom:20px"/>日程内容
            <a-icon type="user" style="fontSize:22px;color:gray;vertical-align:middle;margin:15px;margin-bottom:20px"/>发起人
            <a-icon type="calendar" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:20px"/>设置时间
            <a-icon type="clock-circle" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:16px"/>提醒时间
            <a-icon type="pushpin" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:16px"/>备注
            <a-icon type="tag" style="fontSize:22px;color:gray;margin:15px;vertical-align:middle;margin-bottom:20px;"/>标签
            <a-button type="danger" @click="scheDelete" style="margin-top:20px;margin-left:15px">
              删除日程
            </a-button>
        </div>

        <div id="contentright1">
        <a-input placeholder="日程内容" autoSize allowClear style="width:400px;" v-model="scheName"/>
        <a-input placeholder="发起人" style="margin-top:25px;width:400px;" v-model="scheCreator" disabled/>
        <a-date-picker style="margin-top:25px;width:400px" @change="tSetChange" :value="moment(t_set)"/>
        <a-date-picker style="margin-top:23px;width:400px" :value="moment(t_remind)" disabled/>
        <p></p>
            <p></p>
        <a-input placeholder="填写备注" v-model="scheRemarks" autoSize allowClear style="margin-top:30px;width:400px"/>
        <p></p>
        <div class="tags1">
                <div>
                <template v-for="(tag, index) in scheLabel">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag" :closable="index !== 0" @close="() => handleClose1(tag)">
                {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :closable="index !== 0" color="#003366" style="font-size:15px;text-align:center;height:25px;margin-top:15px" @close="() => handleClose1(tag)">
                {{ tag }}
            </a-tag>
            </template>
            <a-input
            v-if="inputVisible1"
            ref="input1"
            type="text"
            size="large"
            :style="{ width: '78px' }"
            :value="inputValue1"
            @change="handleInputChange1"
            @blur="handleInputConfirm1"
            @keyup.enter="handleInputConfirm1"
            />    
            <a-tag v-else @click="showInput1" style="background:#fff; height:25px;borderStyle: dashed;margin-top:12px">
            <a-icon type="plus" /> <em style="font-size:14px;font-style:normal;color:gray;padding-left:0">添加标签</em>
            </a-tag>   
        </div>      
        </div> 
           
    </div>   

</div>
    </a-modal>



            <!--a-button block size="large" @click="$router.push('/scheduleAdd')">添加日程</a-button-->
            <p><br /><br /></p>
            <a-divider>过去的日程</a-divider>
            <p><br /><br /></p>
            <a-collapse v-model="activeKey">
            <!--   数据需要部分 以下为模拟  ---->
            <!--   任务面板key=123         ---->
				
				<a-collapse-panel :header="time" v-for="(item,time) in docByTime" :key="time">
                <div class="content">
						 	<div v-for="(i,index) in item" style="margin:10px 0;" :key="index">
								 <a-divider v-if="index!=0"/>
                    		<p>{{i.time}}<em @click="scheDetails(i.id)">
									  {{i.content}}
								</em></p>
                    		
						 	</div>
                </div>
            </a-collapse-panel>
            <!-- <a-collapse-panel header="2020年4月" key="4">
                <div class="content">
                    <p>4月26日<em>团队alpha冲刺</em></p>
                    <a-divider/>
                    <p>4月18日<em>数据库设计</em></p>
                    <a-divider />
                    <p>4月2日<em>类图分析</em></p>
                </div>
            </a-collapse-panel> -->
            </a-collapse>
        </div>
    </div>
</template>
 
<script>
import {toDateTime,getFirstMsg} from '../js/code.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
export default {
   name: "Schedule",
	components: {},
	computed:{
		// getDetailSet(){
		// 	return 
		// }
		getCurrentMoment(){
			return moment(new Date().toLocaleDateString(),'YYYY-MM-DD')
		}
	},
   data() {
      return {
        moment,
        detailsId:0,
        scheName:"",
        scheLabel:['标签'],
        scheLabelStr:"",
        scheRemarks:"",
        t_remind:null,
        t_set:null,
        scheCreator:"",
        showDetails:false,
        visible: false,
        confirmLoading: false,
        customStyle:
        'background: gray;border-radius: 8px;margin-bottom: 50px;border:10;',
        mode1: 'time',
        tags: ['标签'],
        inputVisible: false,
        inputVisible1: false,
        inputValue: '',
        inputValue1:'',
        doc:[],
        activeKey:"",
        dateString1:"",
        dateString2:"",
        content:"",
        remarks:"",
        index1:0,
        setTime:"",
		  remindTime:"",
		  docByTime:[],
      };
	}, 
	mounted(){
		this.update()
		// var d = new Date()
		// var str = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
		// this.t_set = str
		// console.log(str)
	},
   methods: {
    tSetChange(value, dateString){
      console.log('Selected Time: ', dateString);
    },
    scheDelete(){
      var a=confirm("确认删除该日程吗？");
       if(a){
         this.delete(this.detailsId);
       }
       this.showDetails=false;
    },
    cancel(){//还原
      /*var i=this.index;
      this.scheName=this.doc[i].content;
      this.scheLabel=this.doc[i].label;
      this.scheRemarks=this.doc[i].remarks;
      this.t_remind=this.doc[i].t_remind;
      this.t_set=this.doc[i].t_set;
      this.scheCreator=this.doc[i].creator.username;*/
      this.update();
    },
    save(){
		//  console.log("1")
      this.scheLabelStr="";
      this.scheLabelStr=this.scheLabel.join(' ');
      // console.log(this.scheLabelStr);
      this.$http.post(`/api/project/${this.$store.state.project.id}/schedule/update`, {
        project_id:this.$store.state.project.id,id:this.detailsId,t_set:toDateTime(this.t_set),content:this.scheName,
        remarks:this.scheRemarks,label:this.scheLabelStr
			})
         .then(doc => {
            var code = doc.data.status;
				var msg = doc.data.msg;
				
				if (code == 0){
          alert("已保存！");
          this.showDetails=false;	
          this.update();
        }
        else if(code == 9001){         
          alert("标签长度过长，保存失败！");
        }
        else{
          alert("保存失败！");
        }
         })
    },
    scheDetails(id){
      for(var i=0;i<this.doc.length;i++){
        if(this.doc[i].id==id){  
          this.index1=i;       
          this.detailsId=id;
          this.scheName=this.doc[i].content;         
          this.scheLabelStr=this.doc[i].label;
          this.scheLabel=this.scheLabelStr.split(' ');  
          this.scheRemarks=this.doc[i].remarks;
          this.t_remind=this.doc[i].t_remind;
          this.t_set=this.doc[i].t_set;
          this.scheCreator=this.doc[i].creator.username;
          break;
        }      
      }
      //console.log(toDateTime(this.t_set));
      console.log('set'+this.t_set);
      console.log('remind'+this.t_remind);
      this.showDetails=true; 
    },
    delete(id){
      this.$http
         .post(`/api/project/${this.$store.state.project.id}/schedule/delete`, {
				project_id:this.$store.state.project.id,id:id
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0){
          alert("删除成功！");	
          this.update();
        }
        else
          alert("删除失败！");
         })
    },
		update(){
			this.docByTime = {}
			this.$http
         .get(`/api/project/${this.$store.state.project.id}/schedule`, {
				project_id:this.$store.state.project.id,
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0)
					this.doc = doc.data.data
				
				this.doc.forEach(i=>{
					var d = new Date(i.t_set)
					i.sortTime = getSortTime(i.t_set) 
          		if(d.getMonth()+1<10){
						i.time = '0'+(d.getMonth()+1)+'月'+d.getDate()+'日'
          		}
          		if(d.getDate()<10){
          		  i.time = '0'+(d.getMonth()+1)+'月'+'0'+d.getDate()+'日'  
          		}
          		else if(d.getMonth()+1>=10&&d.getDate()<=10)
          		  i.time = (d.getMonth()+1)+'月'+d.getDate()+'日'
					if(find(this.docByTime, i.sortTime)){
						this.docByTime[i.sortTime].push(i)
					}else{
						this.$set(this.docByTime,i.sortTime,[])
						this.docByTime[i.sortTime].push(i)
					}
					// console.log(this.docByTime)
				})
			})
			function find(obj, time){
				if(obj.length == 0) return 0;
				for(var i in obj){
					if(time == i)
						return 1
				}
				return 0
			}
			function getSortTime(time) {
         	var date = new Date(time);
         	var month = date.getMonth() + 1;
         	var strDate = date.getDate();
         	if (month >= 1 && month <= 9) {
         	   month = "0" + month;
         	}
         	var currentDate = date.getFullYear() + '年' + month + '月';
         	return currentDate;
    		}
		},
    onChange(date, dateString) {
		this.dateString1 = dateString
      console.log(date, dateString);
    },
    onChange2(date, dateString) {
		this.dateString2 = dateString
      console.log(date, dateString);
    },
    handleOpenChange1(open) {
      if (open) {
        this.mode1 = 'time';
      }
    },
    handlePanelChange1(value, mode) {
      this.mode1 = mode;
    },
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      //console.log(tags);
      this.tags = tags;
    },
    handleClose1(removedTag) {
      const tags = this.scheLabel.filter(tag => tag !== removedTag);    
      this.scheLabel = tags;
      this.scheLabelStr=this.scheLabel.join(' ');
      
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },
    showInput1() {
      this.inputVisible1 = true;
      this.$nextTick(function() {
        this.$refs.input1.focus();
      });
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
      });
    },

    handleInputChange1(e) {
      this.inputValue1 = e.target.value;
    },

    handleInputConfirm1() {
      const inputValue1 = this.inputValue1;
      //console.log(inputValue1);
      let scheLabel = this.scheLabel;
      if (inputValue1 && scheLabel.indexOf(inputValue1) === -1) {
        scheLabel = [...scheLabel, inputValue1];
      }
      Object.assign(this, {
        scheLabel,
        inputVisible1: false,
        inputValue1: '',
      });
    },


    showModal() {
      this.content="";
      this.remarks="";
      this.tags=["标签"];
      this.setTime='';
      this.remindTime='';
      this.visible = true;
    },

    handleOk(e) {
      var tagsStr="";
      tagsStr=this.tags.join(' ');
      // console.log(tagsStr);
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading = true;
      this.$http
         .post(`/api/project/${this.$store.state.project.id}/schedule`, {
				project_id:this.$store.state.project.id,
				t_set:toDateTime(this.dateString1),
        t_remind:toDateTime(this.dateString2),
        label:tagsStr,
				content:this.content,
				remarks:this.remarks,
				//label:this.$store.state.project.id,
			})
         .then(doc => {
            var code = doc.data.status;
				var msg = doc.data.msg;
				console.log(doc)
				if (code == 0)
					this.update()	
				// console.log(this.doc)		
         })
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 0);
    },

    handleCancel(e) {     
      console.log('Clicked cancel button');
      this.visible = false;
    },
  },  
};
</script>

<style scoped>
#more{   
    margin: 20px 40px;
    background-color:	white;
    /* height: 500px; */
} 
#fl{
    display: flex;
    margin-bottom: -50px;
}
#f2{
    display: flex;
    height:350px;
    width:600px;
    margin-bottom:25px;
}
#contentright1{
   width: 500px;
   height: 300px;
   margin-top:12px ;
   margin-left:20px;
}

em{
    padding-left:40px;
    font-style: normal;
}
.content{
    margin:0 auto;
    margin-left: 24px;
}
p{
    font-size: 15px;
    margin:-8px 0;
}
#iconleft{
   margin-left: 0px;
   width: 70px;
}
#iconleft1{
   margin-left: 26px;
   width: 150px;
  color:gray;
}
#contentright{
   width: 500px;
   height: 300px;
   margin-top:10px;
}

.tags1{
  margin-top:18px ;
}
</style>