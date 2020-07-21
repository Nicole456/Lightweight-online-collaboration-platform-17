<template>
   <div id="wrapper">   
       <div id="more">
        <p style="margin-left:35px;margin-top:30px;font-size:25px" >任务：软件工程实践</p>
        <div id="contextleft">
        <p>
    <a-icon type="file-done" style="fontSize:22px;color:gray;margin-top:10px;vertical-align:bottom"/>
    <em class="em11" style="margin-left:1px">状态</em><br />

    <a-icon type="user" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
    <em class="em11" style="margin-left:2px">执行者</em><br />
    
    <a-icon type="calendar" style="fontSize:20px;color:gray;margin-top:30px;vertical-align:bottom;margin-bottom:2.3px"/>
    <em class="em11" style="margin-left:4.5px">执行时间</em><br />

    <a-icon type="pushpin" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
    <em class="em11" style="margin-left:2px">备注</em><br />

    <a-icon type="fire" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
    <em class="em11" style="margin-left:2.3px">优先级</em><br />

    <a-icon type="tag" style="fontSize:22px;color:gray;margin-top:30px;vertical-align:bottom"/>
    <em class="em11" style="margin-left:2.3px">标签</em><br />    
  </p>   
  </div>   
  <div id="contextright">
    
    <!--   数据需要部分 以下为模拟  ---->
    <em class="em11" style="margin-right:25px;font-size:18px;padding-left:0">完成情况</em>
    <a-switch defaultunChecked @change="onChange" /><br />

    <!---拉取头像  --->
    <a-avatar icon="user" style="margin-top:20px" :size="40"/>
    <br />
    <a-range-picker
      :defaultValue="[moment('2020-04-26', dateFormat), moment('2020-05-07', dateFormat)]"
      disabled
      style="margin-top:16px"
      
    />
    <br /><br />
    <div>
    <p>
    <a-textarea placeholder="填写备注" autoSize  allowClear style="width:360px;" />
    <br /><br />
    <a-tag color="gray" style="font-size:18px;text-align:center;width:60px;height:25px">较低</a-tag>
    <br /><br /></p>
    <div style="margin-top:-10px">
    <template v-for="(tag) in tags">
          <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
        <a-tag :key="tag" @close="() => handleClose(tag)">
          {{ `${tag.slice(0, 20)}...` }}
        </a-tag>
      </a-tooltip>
      <a-tag v-else :key="tag" color="#003366" style="font-size:16px;text-align:center;height:25px" @close="() => handleClose(tag)">
        {{ tag }}
      </a-tag>
    </template>
  </div>
  <br />
</div>

<a-button style="font-size:16px;float:right;" @click="$router.push('/taskPanel')">返回</a-button>
<a-button style="font-size:16px;margin-left:210px" @click="$router.push('/taskPanel')">保存</a-button>

     </div>

       </div>
   </div>
</template>
<script>
import moment from 'moment';
import { input } from 'ant-design-vue';
export default {
   name: "Details",
   components: {},
   data() {
      return {
        tags: ['Unremovable', 'Tag 2','hinknolhoo'],
        inputVisible: false,
        inputValue: '',
      };
      this.dateFormat = 'YYYY-MM-DD';
   },   
   methods: {
    moment,
    },
    add(e) {
      console.log(e);
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    onSearch(value) {
      //怎么不管用？？？？？
      document.getElementById("flag").disabled=true;
      console.log(value);
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
  
};
</script>
<style scoped>
#more{   
    margin: 25px 40px;
    background-color:	white;
    height: 600px;
}
#contextleft{
    margin: 30px 35px;
    width:130px;
    float: left;
    margin-top:20px;
}
#contextright{
    margin: 38px 35px;
    margin-top:26px;
    width:363px;
    float: left;
}
.em11{
    font-style: normal;
    font-size: 18px;
    padding-left: 11px; 
    color:gray;
}
</style>