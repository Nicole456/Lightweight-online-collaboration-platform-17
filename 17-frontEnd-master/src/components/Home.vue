<template>
   <div>
        <div id="add-button">
            <a-button @click="showCreateModal">新建项目</a-button>
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
        </div>
        
        <div id="join-text">已加入项目</div>

        <br/><br/>

        <div id="group-content">
            <a-card 
                style="width:24%; 
                    display:inline-block; 
                    margin:5px;
                    background-color:rgb(250, 248, 248)"
                :key="i.id"
                :hoverable="true"
                @click="enterProject(i.id)"
                v-for="i in Project">{{i.name}}
            </a-card>
        </div>

   </div>
</template>

<script>
export default {
   name: "Home",
   components: {},
   data() {
      return {
        createVisible: false,
        createLoading: false,
        newName: "",
        Project:[],
      };
    },
    mounted(){
        this.getName();
    },
    computed:{
    },
    methods: {
        //新建项目部分
        showCreateModal() {
            this.createVisible = true;
        },
        createHandleOk(e) {
            this.createLoading = true;
            this.$http.post(`/api/project`, { name: this.newName }).then(doc => {
                var code = doc.data.status;
					 var msg = doc.data.msg;
					 this.getName();
                if (code != 0) {
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
        
        //显示加入的项目
        getName(){
            this.$http.get(`/api/user/project`).then(doc => {
                console.log(doc);
                var code = doc.data.status;
                var msg = doc.data.msg;
                this.Project = doc.data.data;
            });
        },

        //进入项目
        enterProject(id){
            //console.log("checked", id);
            var store = window.localStorage;
            this.$store.commit("enterProject", { id });
			console.log("任务ID："+this.$store.state.project.id)
            store.setItem(this.$cookies.get("session"), id);
            this.$router.push({path: '/taskPanel',params:{ id }});
        },
    },
};
</script>



<style scoped>
#join-text{
    font-size: 20px;
    margin-top: 5%;
}
#add-button{
    margin-right: 170px;
    float: right;
}
#group-content{
    text-align: center;
    margin-right: 170px;

    display: flex;
    flex-wrap: wrap;
}
</style>