<template>
   <div id="wrapper">
      <div id="pending">
         <h2>未完成</h2>
         <div>
            <div>
               <a-button block @click="showModal(i)" v-for="(i,index) in getCol1" :key="index" 
					style="margin:6px 0;">
                  {{i.name}}
               </a-button>
               <a-modal 
                     :title="'任务：'+this.taskDetails.name"
                     v-model="visible"
                     style="top: 30px;"
                     @ok="save"
                     cancelText="取消"
                     okText="保存"
                     width="700px"
                  >
                  <div id="more">
                     <div id="contextleft">
                  <p>
						
                  <a-icon type="file-done" style="fontSize:22px;color:gray;margin-top:10px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:1px">状态</em><br />

                  <a-icon type="user" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:2px">创建者</em><br />

                  <a-icon type="team" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:2px">参与者</em><br />
                  
                  <a-icon type="calendar" style="fontSize:20px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:4.5px">执行时间</em><br />

                  <a-icon type="pushpin" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
                  <em class="em11" style="margin-left:2px">备注</em><br />

                  <a-icon type="fire" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom;margin-bottom:-2px"/>
                  <em class="em11" style="margin-left:2.3px">优先级</em><br />

                  <a-icon type="tag" style="fontSize:22px;color:gray;margin-top:28px;vertical-align:bottom;margin-bottom:-1px"/>
                  <em class="em11" style="margin-left:2.3px">标签</em><br />    
               </p>   
               </div>   
               <div id="contextright">
                  
                  <!--   数据需要部分 以下为模拟  ---->
                  <em class="em11" style="margin-right:10px;font-size:15px;padding-left:0">完成情况</em>
                  <a-switch v-model="taskDetails.finish" @change="onChange" /><br /><br />
                  <!---拉取头像  --->
               <a-avatar icon="user" style="margin-top:-6.5px" :size="37" :src="taskDetails.creator"/>
               <br />
               <a-avatar icon="user" style="margin-top:-13px" :size="37" :src="taskDetails.creator"/>
               <a-tooltip>
                     <template slot="title">添加/移除参与者</template>
                     <a>
                        <a-popover title="添加/移除参与者" trigger="click" placement="right">
                           <template slot="content">
                           <a-checkbox-group 
                              name="checkboxgroup" 
                              @change="onTaskMemberChange"
                           >
                              <div style="max-height:100px;width:150px;overflow:auto">
                                 <a-checkbox style="margin:5px" :value="i.id" v-for="i in this.projectMember">
                                    <a-avatar :size="16" :src="i.photo"/>
												{{i.username}}
											</a-checkbox>
											
										</div>
                           </a-checkbox-group>
                           <br /><a-button type="primary" @click="addTaskMember" block>确认</a-button>
                           </template>
                           <a-icon
                              type="plus-circle"
                              theme="filled"
                              style="fontSize:30px;color:#003366;margin-left:10px;margin-top:22px"
                           />
                        </a-popover>
                        <br />
                     </a>
                  </a-tooltip>
               <br />
               <a-range-picker v-if="taskDetails.t_begin!=null&&taskDetails.t_end!=null"
                  :value="[moment(taskDetails.t_begin), moment(taskDetails.t_end)]"
                  style="margin-top:-4px;width:397px"
                  @change="timeChange"
               />
               <br /><br />
               <div>
               <p><!--@blur="flowMarksOn"-->
               <a-textarea v-model="flowMarks" placeholder="填写备注" autoSize  allowClear style="width:397px;" />
               <br /><br />

               <a-radio-group v-model="value" @change="onChange0" style="width:700px">
                  <a-radio :value="1">
                  <a-tag color="gray" style="font-size:15px;text-align:center;width:50px;height:23px;margin-top:3px">较低</a-tag>
                  </a-radio>
                  <a-radio :value="2">
                  <a-tag color="green" style="font-size:15px;text-align:center;width:50px;height:23px;margin-top:3px">普通</a-tag>
                  </a-radio>
                  <a-radio :value="3">
                  <a-tag color="orange" style="font-size:15px;text-align:center;width:50px;height:23px;margin-top:3px">紧急</a-tag>
                  </a-radio>
                  <a-radio :value="4">
                  <a-tag color="red" style="font-size:15px;text-align:center;width:80px;height:23px;margin-top:3px">非常紧急</a-tag>
                  </a-radio>
               </a-radio-group>                                 
              
               <br /><br />
               <div style="margin-top:-18px">
                  <div id="tags">
                     <div style="margin-left:4px;margin-top:3px">
                        <template v-for="(tag, index) in tags">
                           <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                              <a-tag
                                 :key="tag"
                                 :closable="index !== 0"
                                 @close="() => handleClose(tag)"
                              >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                           </a-tooltip>
                           <a-tag
                              v-else
                              :key="tag"
                              :closable="index !== 0"
                              color="#003366"
                              style="font-size:14px;text-align:center;height:22px"
                              @close="() => handleClose(tag)"
                           >{{ tag }}</a-tag>
                        </template>
                        <a-input
                           v-if="inputVisible"
                           ref="input"
                           type="text"
                           size="default"
                           :style="{ width: '78px' }"
                           :value="inputValue"
                           @change="handleInputChange"
                           @blur="handleInputConfirm"
                           @keyup.enter="handleInputConfirm"
                        />
                        <a-tag
                           v-else
                           @click="showInput"
                           style="background:#fff;height:22px; borderStyle: dashed;margin-top:8px"
                        >
                           <a-icon type="plus" />
                           <em
                              style="font-size:14px;font-style:normal;font-family:'Microsoft YaHei'"
                           >添加标签</em>
                        </a-tag>
                     </div>
                  </div>
            </div>
         </div>
      </div>
   </div>
   <a-button type="danger" @click="handleOk" style="margin-top:20px">
      删除任务
    </a-button>
</a-modal>

            </div>
            <br />
         </div>
         <div>
            <a-collapse accordion id="panel1" @change="setclock=0">
               <a-collapse-panel header="✚" key="1" :showArrow="false">
                  <a-input placeholder="输入任务标题" v-model="name" />
                  <a-input placeholder="输入任务备注" v-model="remarks" 
						style="margin-top:12px;"/>
                  <!-- 菜单  -->
                  <p/>
                  <!-- 起止日期 -->
                  <a-icon
                     type="calendar"
                     style="fontSize:20px;color:gray;margin-left:4px;margin-top:4px;vertical-align:bottom"
                  />
                  <a-date-picker
                     style="color:gray;font-size:15px;margin-left:20px"
                     placeholder="设置开始时间"
                     @change="onChange1"
                     @ok="onOk"
                  >
                     <span>{{ dateString1 ? dateString1 : '设置开始时间' }}</span>
                  </a-date-picker>
                  <br />
                  <p style="margin-top:-20px;display:inline">
                     <a-icon
                        type="calendar"
                        style="fontSize:20px;color:gray;margin-left:4px;margin-top:20px;vertical-align:bottom;margin-bottom:-0.1px"
                     />

                     <a-date-picker
                        style="color:gray;font-size:15px;margin-left:20px"
                        placeholder="设置截止时间"
                        @change="onChange2"
                        @ok="onOk"
                     >
                        <span>{{ dateString2 ? dateString2 : '设置截止时间' }}</span>
                     </a-date-picker>

                     <!-- 提醒   -->
                     <br />

                     <a-icon
                        type="clock-circle"
                        style="fontSize:20px;color:gray;margin-left:4px;margin-top:22px;vertical-align:bottom;margin-bottom:0.2px"
                     />
                  </p>
                  <p
                     style="padding-left:20.5px;display:inline;color:gray;font-family:'Microsoft YaHei';font-size:15px"
                     v-if="clocktype==0"
                     @click="showModalclock"
                  >不提醒</p>
                  <p
                     style="padding-left:20.5px;display:inline;color:gray;font-family:'Microsoft YaHei';font-size:15px"
                     v-if="clocktype==1"
                     @click="showModalclock"
                  >任务开始时</p>
                  <p
                     style="padding-left:20.5px;display:inline;color:gray;font-family:'Microsoft YaHei';font-size:15px"
                     v-if="clocktype==2"
                     @click="showModalclock"
                  >任务截止时</p>

                  <a-modal
                     title="任务提醒设置"
                     :visible="visibleclock"
                     :confirm-loading="confirmLoading"
                     @ok="handleOkclock"
                     @cancel="handleCancelclock"
                     cancelText="取消"
                     okText="保存"
                     width="600px"
                  >
                     <p style="font-size:16px">
                        提醒时间
                        <a @click="showclock=1">
                           <a-icon
                              type="plus-circle"
                              theme="filled"
                              style="fontSize:18px;color:#003366;margin-left:370px;"
                           />添加新提醒
                        </a>
                     </p>
                     <a-select
                        v-if="showclock==1"
                        style="width:160px;margin-top:-5px"
                        @change="handleChange"
                     >
                        <a-select-option value="begin" @click="clocktype=1">任务开始时</a-select-option>
                        <a-select-option value="end" @click="clocktype=2">任务截止时</a-select-option>
                        <a-select-option value="no" @click="clocktype=0">不提醒</a-select-option>
                     </a-select>
                     <p>
                        <br />
                     </p>
                     <p style="font-size:16px;margin-top:-15px">提醒对象</p>
                     <a-tooltip>
                        <template slot="title">添加提醒对象</template>
                        <a>
                           <a-popover title="添加提醒对象" trigger="click">
                           <template slot="content">
                           <a-checkbox-group 
                              name="checkboxgroup" 
                              @change="onTaskMemberChange"
                           >
                              <div style="max-height:100px;width:150px;overflow:auto">
                                 <a-checkbox style="margin:5px" :value="i.id" v-for="i in this.projectMember">
                                    <a-avatar :size="16" :src="i.photo"/>
												{{i.username}}
											</a-checkbox>
											
										</div>
                           </a-checkbox-group>
                           <br /><a-button type="primary" block>确认</a-button>
                           </template>
                           <a-icon
                              type="plus-circle"
                              theme="filled"
                              style="margin-top:-8px;fontSize:30px;color:#003366;margin-left:10px;"
                           />
                           </a-popover>
                           <br />
                        </a>
                     </a-tooltip>
                  </a-modal>
                  <!-- 优先级   -->
                  <a-menu style="width: 340px;margin-left:10x;margin-right:-20px">
                     <a-sub-menu key="priority" style="margin-top:8px">
                        <span slot="title">
                           <a-icon
                              type="fire"
                              style="fontSize:20px;color:gray;margin-left:-12px;vertical-align:middle;margin-bottom:4px"
                           />
                           <a-tag
                              v-if="taskpriority=='1'"
                              color="gray"
                              :visible="true"
                              style="font-size:15px;height:22px;margin-left:10px;margin-top:14px"
                           >较低</a-tag>
                           <a-tag
                              v-if="taskpriority=='2'"
                              color="green"
                              :visible="true"
                              style="font-size:15px;height:22px;margin-left:10px;margin-top:14px"
                           >普通</a-tag>
                           <a-tag
                              v-if="taskpriority=='3'"
                              color="orange"
                              :visible="true"
                              style="font-size:15px;height:22px;margin-left:10px;margin-top:14px"
                           >紧急</a-tag>
                           <a-tag
                              v-if="taskpriority=='4'"
                              color="red"
                              :visible="true"
                              style="font-size:15px;height:22px;margin-left:10px;margin-top:14px"
                           >非常紧急</a-tag>
                        </span>
                        <a-menu-item key="24" @click="onFlowPri(1)">
                           <a-tag color="gray" style="font-size:15px;height:22px;margin-left:0px">较低</a-tag>
                        </a-menu-item>
                        <a-menu-item key="22" @click="onFlowPri(2)">
                           <a-tag
                              color="green"
                              style="font-size:15px;height:22px;margin-left:0px"
                           >普通</a-tag>
                        </a-menu-item>
                        <a-menu-item key="23" @click="onFlowPri(3)">
                           <a-tag
                              color="orange"
                              style="font-size:15px;height:22px;margin-left:0px"
                           >紧急</a-tag>
                        </a-menu-item>
                        <a-menu-item key="26" @click="onFlowPri(4)">
                           <a-tag
                              color="red"
                              style="font-size:14px;height:22px;margin-left:0px"
                           >非常紧急</a-tag>
                        </a-menu-item>
                     </a-sub-menu>
                  </a-menu>
                  <!--  标签   -->
                  <a-icon
                     type="tag"
                     style="fontSize:20px;color:gray;margin-left:4px;margin-top:14px;vertical-align:bottom;margin-bottom:0.3px"
                  />
                  <em class="em11" style="margin-left:11.5px;font-size:15px" @click="showlabel=1">标签</em>
                  <div id="tags" v-if="showlabel==1">
                     <div style="margin-left:4px;margin-top:3px">
                        <template v-for="(tag, index) in tagspanel">
                           <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                              <a-tag
                                 :key="tag"
                                 :closable="index !== 0"
                                 @close="() => handleClosepanel(tag)"
                              >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                           </a-tooltip>
                           <a-tag
                              v-else
                              :key="tag"
                              :closable="index !== 0"
                              color="#003366"
                              style="font-size:14px;text-align:center;height:22px"
                              @close="() => handleClosepanel(tag)"
                           >{{ tag }}</a-tag>
                        </template>
                        <a-input
                           v-if="inputVisiblepanel"
                           ref="input"
                           type="text"
                           size="default"
                           :style="{ width: '78px' }"
                           :value="inputValuepanel"
                           @change="handleInputChangepanel"
                           @blur="handleInputConfirmpanel"
                           @keyup.enter="handleInputConfirmpanel"
                        />
                        <a-tag
                           v-else
                           @click="showInputpanel"
                           style="background:#fff;height:22px; borderStyle: dashed;margin-top:8px"
                        >
                           <a-icon type="plus" />
                           <em
                              style="font-size:14px;font-style:normal;font-family:'Microsoft YaHei'"
                           >添加标签</em>
                        </a-tag>
                     </div>
                  </div>
                  <a-divider style="margin-top:15px" />
                  <p style="margin-top:-15px;font-size:16px;margin-left:5px">参与者 · {{this.taskDetails.memberNum}}</p>
                  <a-avatar :size="35" :src="userInfo.photo" style="margin-top:-18px" />
                  <a-tooltip>
                     <template slot="title">添加/移除参与者</template>
                     <a>
                        <a-popover title="添加/移除参与者" trigger="click">
                           <template slot="content">
                           <a-checkbox-group 
                              name="checkboxgroup" 
                              @change="onTaskMemberChange"
                           >
                              <div style="max-height:100px;width:150px;overflow:auto">
                                 <a-checkbox style="margin:5px" :value="i.id" v-for="i in this.projectMember">
                                    <a-avatar :size="16" :src="i.photo"/>
												{{i.username}}
											</a-checkbox>
											
										</div>
                           </a-checkbox-group>
                           <br /><a-button type="primary" @click="addTaskMember" block>确认</a-button>
                           </template>
                           <a-icon
                              type="plus-circle"
                              theme="filled"
                              style="fontSize:30px;color:#003366;margin-left:10px;"
                           />
                        </a-popover>
                        <br />
                     </a>
                  </a-tooltip>
                  <a-button style="font-size:16px;float:right" @click="make">创建</a-button>

                  <br />
                  <br />
               </a-collapse-panel>
            </a-collapse>
         </div>
      </div>
      <div id="finish">
         <h2>已完成</h2>
            <div>
               <a-button block @click="showModal(i)" v-for="(i,index) in getCol2" :key="index" style="margin:6px 0;">
                  {{i.name}}
               </a-button>
</div>
<!---------修改部分--------->
                  <!--br />
               </a-collapse-panel>
            </a-collapse>
         </div-->
<!---------修改部分--------->  
      </div>
   </div>
</template>

<script>
import {toDateTime,getFirstMsg} from '../js/code.js'
import moment from 'moment';
import { input } from 'ant-design-vue';

const taskMemberOptions = ['A', 'P', 'O'];

export default {
   name: "TaskPanel",
	computed:{
		getCol1(){
			return this.projectData.filter(val=>{
				return !val.finish
			})
		},
		getCol2(){
			return this.projectData.filter(val=>{
				return val.finish
			})
		}
	},
   mounted() {
      this.update();
      this.getInfo();
   },
   data() {
      return {
			projectMember:[],
         value: 1,
         projectData: [],
         taskMemberOptions,
         startValue: null,
         endValue: null,
         endOpen: false,
         visible: false,
         visibleclock: false,
         taskdone:0,
         inputVisible: false,
         inputValue: "",
         //面板变量
         inputVisiblepanel: false,
         inputValuepanel: '',
         tagspanel: ['任务'],
         //面板变量
         text:"test",
         taskpriority:2,
         clocktype:0,
         showclock:0,
         showlabel:0,
         confirmLoading: false,
         dateString1:"",
         dateString2:"",
         tags: ['任务'],
         name: "",
			remarks: "",
			dateFormat:"",
			id:0,
			flowMarks:"",
			flowName:"",
         finish:false,
         taskDetails:{
            id:0,
            finish:false,
            name:"",
            creator:"",
            t_begin:null,
            t_end:null,
            remarks:"",
            priority:0,
            labels:["任务"],
            member:[],
            memberNum:1,
         },
         userInfo: { photo: "", email: "", website: "", location: "" },
      };
      this.dateFormat = 'YYYY-MM-DD';
   },
   watch: {
      startValue(val) {
         console.log("startValue", val);
      },
      endValue(val) {
         console.log("endValue", val);
      },
   },

   methods: {
      getInfo(){
        this.$http.get(`/api/user/info`).then(doc => {
          var code = doc.data.status;
          var msg = doc.data.msg;
          this.userInfo = doc.data.data;
        });
      },
      timeChange(date, dateString){
         this.taskDetails.t_begin=dateString[0];
         this.taskDetails.t_end=dateString[1];

         console.log(dateString[0]);
      },
      save(){        
         var tagsStr=this.tags.join(' ');
         console.log(tagsStr);
         this.$http
         .post(`/api/project/${this.$store.state.project.id}/task/update`, {
				project_id:this.$store.state.project.id,
				id:this.id,
				remarks:this.flowMarks,
				name:this.flowName,
            finish:this.taskDetails.finish,
            t_begin:toDateTime(this.taskDetails.t_begin),
            t_end:toDateTime(this.taskDetails.t_end),
            priority:this.taskDetails.priority,
            label:tagsStr,
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0){
               this.update()
               alert("保存成功!");
				}else{
					this.$alert(msg,'false')
				}
         });
         this.visible=false;
      },
      onTaskMemberChange(checkedValues) {
         console.log('checked = ', checkedValues);
      },
      addTaskMember() {
         
      },
      /*onChange1(e) {
         console.log('radio checked', e.target.value);
      },*/
      moment,
      update(){
			this.$http
         .get(`/api/project/${this.$store.state.project.id}/task`, {})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0) 
					this.projectData = doc.data.data;
            // console.log(this.projectData)
			});
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
         });
         // this.$http
         //    .get(`/api/project/${this.$store.state.project.id}/task/info?id=${this.$store.state.project.task.id}`, {
         //       project_id:this.$store.state.project.id,
         //       task_id:this.$store.state.project.task.id,
         // })
         //    .then(doc => {
         //       var code = doc.data.status;
         //       var msg = doc.data.msg;
         //    if (code == 0){
         //       this.taskDetails.member = doc.data.participants;
         //       this.$store.commit("taskMemberUpdate", this.taskDetails.member);
         //    }			
         // });
      },
      onChange0(e) {
         this.taskDetails.priority=e.target.value;
         console.log('radio checked', e.target.value);
      },
      ////后缀带clock的是提醒时间的弹窗
      ////任务详情弹框
      showModal(obj) {
			this.id = obj.id
			//this.flowName = obj.name
			//this.flowMarks = obj.remarks
			//this.finish = obj.finish
			//this.taskpriority = obj.priority
			//this.label = obj.priority  */
         this.getTaskDetails(this.id);
         this.visible = true;
         //console.log(this.id);
      },
      getTaskDetails(id){
         this.$http
         .get(`/api/project/${this.$store.state.project.id}/task/info?id=${id}`, {
            project_id:this.$store.state.project.id,
            task_id:id
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
            
				if (code == 0){
               //this.update()
               console.log(this.id);
               this.flowName = doc.data.data.name
               this.taskDetails.id=doc.data.data.id;
               this.taskDetails.finish=doc.data.data.finish;
               this.taskDetails.name=doc.data.data.name;
               var labelStr=doc.data.data.label;
               if(labelStr!="")
                  this.taskDetails.labels=labelStr.split(' ');
               else
                  this.taskDetails.labels=["任务"];
               this.taskDetails.t_begin=doc.data.data.t_begin;
               this.taskDetails.t_end=doc.data.data.t_end;
               this.taskDetails.priority=doc.data.data.priority;
               this.taskDetails.remarks=doc.data.data.remarks;
               this.taskDetails.creator=doc.data.data.originator.photo;
               this.tags=this.taskDetails.labels;
               this.flowMarks=doc.data.data.remarks;
               this.value=doc.data.data.priority;
               //this.taskpriority=doc.data.data.priority;
               console.log(doc.data.data.t_begin);
				}else{
					this.$alert(msg,'false')
				}
         });
      },
		onFlowPri(pri){
			this.taskpriority = pri
			this.$http
         .post(`/api/project/${this.$store.state.project.id}/task/update`, {
				project_id:this.$store.state.project.id,
				id:this.id,
				remarks:this.flowMarks,
				name:this.flowName,
				finish:this.finish,
				priority:pri,
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0){
					this.update()
				}else{
					this.$alert(msg,'false')
				}
         });
		},
		flowMarksOn(){
         console.log(this.flowName);
			this.$http
         .post(`/api/project/${this.$store.state.project.id}/task/update`, {
				project_id:this.$store.state.project.id,
				id:this.id,
				remarks:this.flowMarks,
				name:this.flowName,
				finish:this.finish,
			})
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0){
               this.update()
               
				}else{
					this.$alert(msg,'false')
				}
         });
		},
      handleOk(e) {
         console.log(e);
         var a=confirm("确定删除该任务吗？");
         if(a){
            this.visible = false;
            this.$http
            .post(`/api/project/${this.$store.state.project.id}/task/delete`, {
               project_id:this.$store.state.project.id,
               id:this.id
            })
            .then(doc => {
               var code = doc.data.status;
               var msg = doc.data.msg;
               if (code == 0){
                  this.$alert(msg,'true')
                  this.update()
               }
               else
                  this.$alert(msg,'false')
            });
         }
      },
      add(e) {
      console.log(e);
      },
      onChange(checked) {
         this.taskDetails.finish=checked;
			console.log(`a-switch to ${checked}`);
			var obj = {
				project_id:this.$store.state.project.id,
				id:this.id,
				finish:checked,
				name:this.flowName
			}
			this.$http
         .post(`/api/project/${this.$store.state.project.id}/task/update`, obj)
         .then(doc => {
            var code = doc.data.status;
            var msg = doc.data.msg;
				if (code == 0){
					this.update()
				}else{
					this.$alert(msg,'false')
				}
         });
      },
      handleClose(removedTag) {
         const tags = this.tags.filter(tag => tag !== removedTag);
         console.log(tags);
         this.tags = tags;
      },
      showInput() {
         this.inputVisible = true;
         this.$nextTick(function() {
         this.$refs.input.focus();
         });
      }, 

      make() {			
         /*在这先存储好数据再初始化 防止两次创建的时候数据联动
         this.clocktype=0;
         this.showclock=0;
         this.showlabel=0;
         this.dateString1="";
         this.dateString2="";
         this.taskpriority="较低";
         this.tags=["任务"];*/
         var obj = {
            project_id: Number(this.$store.state.project.id),
            name: this.name,
            remarks: this.remarks,
            t_begin: toDateTime(this.dateString1),
            t_end: toDateTime(this.dateString2),
            priority: this.taskpriority,
            label: this.tagspanel.join(" ")
         }

         console.log(obj)
         this.$http
            .post(`/api/project/${this.$store.state.project.id}/task`, obj)
            .then(doc => {
               var code = doc.data.status;
               var msg = doc.data.msg;
               if (code == 0){
                  this.$alert(getFirstMsg(msg),'true')
               }else{
                  this.$alert(getFirstMsg(msg),'false')
					}
					this.update()
            console.log(doc)
            });
      },

      onChange1(value, dateString) {
         console.log("Selected Time: ", value);
         console.log("Formatted Selected Time: ", dateString);
         this.dateString1 = dateString;
      },
      onChange2(value, dateString) {
         console.log("Selected Time: ", value);
         console.log("Formatted Selected Time: ", dateString);
         this.dateString2 = dateString;
      },
      onOk(value) {
         console.log("onOk: ", value);
      },
      clearTime() {
         this.time1 = undefined;
      },

      close() {
         var p = document.getElementById("panel1");
         p.setAttribute("activeKey", " ");
      },

      handleClose(removedTag) {
         const tags1 = this.tags.filter(tag => tag !== removedTag);
         console.log(tags);
         this.tags = tags1;
      },

      showInput() {
         this.inputVisible = true;
         this.$nextTick(function() {
            this.$refs.input.focus();
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
            inputValue: ""
         });
      },

      //任务面板标签编辑
      handleClosepanel(removedTag) {
         const tagspanel = this.tagspanel.filter(tag => tag !== removedTag);
         console.log(tagspanel);
         this.tagspanel = tagspanel;
      },

      showInputpanel() {
         this.inputVisiblepanel = true;
         this.$nextTick(function() {
            this.$refs.input.focus();
         });
      },

      handleInputChangepanel(e) {
         this.inputValuepanel = e.target.value;
      },

      handleInputConfirmpanel() {
         const inputValuepanel = this.inputValuepanel;
         let tagspanel = this.tagspanel;
         if (inputValuepanel && tagspanel.indexOf(inputValuepanel) === -1) {
            tagspanel = [...tagspanel, inputValuepanel];
         }
         console.log(tagspanel);
         Object.assign(this, {
            tagspanel,
            inputVisiblepanel: false,
            inputValuepanel: ""
         });
      },
      ///任务面板标签编辑

      log(e) {
         console.log(e);
      },
      preventDefault(e) {
         e.preventDefault();
         console.log("Clicked! But prevent default.");
      },
      disabledStartDate(startValue) {
         const endValue = this.endValue;
         if (!startValue || !endValue) {
            return false;
         }
         return startValue.valueOf() > endValue.valueOf();
      },
      disabledEndDate(endValue) {
         const startValue = this.startValue;
         if (!endValue || !startValue) {
            return false;
         }
         return startValue.valueOf() >= endValue.valueOf();
      },
      handleStartOpenChange(open) {
         if (!open) {
            this.endOpen = true;
         }
      },
      handleEndOpenChange(open) {
         this.endOpen = open;
      },
      afterVisibleChange(val) {
         console.log("visible", val);
      },
      showDrawer() {
         this.visible = true;
      },
      onClose() {
         this.visible = false;
      },
      handleChange(value) {
         console.log(`selected ${value}`);
      },
      showModalclock() {
         this.visibleclock = true;
      },
      handleOkclock(e) {
         this.ModalText = "The modal will be closed after two seconds";
         this.confirmLoading = true;
         setTimeout(() => {
            this.visibleclock = false;
            this.confirmLoading = false;
         }, 0);
         this.showclock = 0;
      },
      handleCancelclock(e) {
         console.log("Clicked cancel button");
         this.visibleclock = false;
         this.showclock = 0;
         this.clocktype = 0;
      },
	},
	watch: {
    	'$store.state.taskUpdate': function () {
			this.update();
   	}
   },
};
</script>

<style scoped>
#pending {
   width: 350px;
   margin-left: 50px;
}
#wrapper {
   display: flex;
   margin: 0 auto;
   margin-top: 20px;
}
#process {
   width: 350px;
   margin-left: 50px;
}
#finish {
   width: 350px;
   margin-left: 50px;
}
#setclock {
   width: 300px;
   height: 100px;
   margin-left: 5px;
   margin-top: 340px;
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
#components-button-demo-button-group > h4 {
   margin: 16px 0;
   font-size: 14px;
   line-height: 1;
   font-weight: normal;
}
#components-button-demo-button-group > h4:first-child {
   margin-top: 0;
}
#components-button-demo-button-group .ant-btn-group {
   margin-right: 8px;
}
#more{      
   display: flex;
}
#contextleft{
    width:130px;
}
#contextright{
    width:363px;
    margin-top:9.5px;
}
</style>