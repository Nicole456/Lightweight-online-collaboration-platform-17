<template>
<transition name="public-slide">
	
   <div id="disk-wrapper">
		<a-modal title="创建文件夹" :visible="visible" :confirm-loading="confirmLoading" @ok="foldConfirm"
      	@cancel="foldCancel">
      <a-input :addon-before="'根目录/'+pos" v-model="folderName"/>
    </a-modal>
		<!-- <a-input placeholder="Basic usage" /> -->
      <div class="header">
            <span class="header-addr">
               <span class="delete-icon">当前位置：</span>
               <span v-for="(item,index) in pos.split('/')" :key="item" @click="explore(index);
               previewMode=0;buttonRad = '0.4rem';">{{index==0?'根目录':' / '+item}}</span>
            </span>
            <span class="delete-icon">文件数：{{files.length}}</span>
            <span class="header-text">双击文件下载 拖动文件上传</span><!--  -->
            <div class="upload-wrapper" style=" margin:0 1.6rem 0 0.2rem" >
                <input type="file" @change="getFiles" name="avatar" ref="upload" width="2.5"/>
                <!-- <input class="upload-text" disabled :placeholder="fileName"> -->
                <div class="upload" title="拖动也可以上传噢" >
                    <a-button @click="$refs.upload.click()">上传</a-button>
                </div>
            </div>
            <div class="upload-wrapper" style=" margin:0 1.6rem 0 0.2rem" >
                <!-- <input class="upload-text" disabled :placeholder="fileName"> -->

                <a-button @click="showModal">创建目录</a-button>

          </div>
<!--				<a-button-group v-if="previewMode==1">-->
<!--					<a-button type="primary" @click="addColNum(-1)" >-</a-button>-->
<!--					<a-button type="primary" id="prev" :style="{'border-radius':buttonRad}"-->
<!--               @click="previewChange($event)">{{previewText[previewMode]}}</a-button>-->
<!--            	<a-button type="primary" v-if="previewMode==1" @click="addColNum(1)">+</a-button>-->
<!--				</a-button-group>-->
<!--				<a-button type="primary" id="prev" :style="{'border-radius':buttonRad}" v-else-->
<!--            @click="previewChange($event)">{{previewText[previewMode]}}</a-button>-->
            
            <!--<button class="simp-green" id="proto" style="margin-left:1.6rem" :style="{color:buttonColor}"
               @click="protoChange($event)">{{protoText[proto]}}</button>-->
         </div>
      <transition-group name="msg3">
      <div class="files-wrapper" v-if="previewMode==0" key="1"> 
         <table>
            <col style="width:46%"/>  
            <col style="width:16%"/>  
            <col style="width:24%"/>  
            <col style="width:auto"/>   
            <tr><th>
               <span v-if="choose.filter(val=>val>0).length==0">文件名</span>
               <span v-else>
               已选中 {{choose.filter(val=>val>0).length}} 个文件&nbsp;
<!--                <img @click="download([],$event)" class="oper-img" src="../assets/Disk/下移.svg" draggable='false'>&nbsp;-->
                <img @click="delet([])" class="oper-img" src="../assets/Disk/删除.svg" draggable='false'>&nbsp;
<!--                <img @click="share($event,[])" class="oper-img" src="../assets/Disk/分享.svg" draggable='false'>&nbsp;-->
            </span>
            </th>
            <th>大小</th><th>上传者</th><th>操作</th></tr>
         <tbody is="transition-group" :name="transName"  mode="out-in">
            <tr class="files" v-for="(item,index) in files" :key="item.name+item.time" @dblclick="explore(item,index)">
               <td class="format">
                  <!--代码 文本 图片 办公三件套 压缩 音乐 视频 -->
                  <img v-if="choose[index]==0" src="../assets/Disk/c.svg" class="checkbox" 
                     @mouseover="select(index)" @mousedown="select(index,true)" draggable='false'>
                     <img v-else src="../assets/Disk/c1.svg" class="checkbox" 
                     @mouseover="select(index)" @mousedown="select(index,true)" draggable='false'>
                  <img v-if="['ppt','pptx'].includes(item.format)" src="../assets/Disk/n-ppt.svg" draggable='false'>
                  <img v-else-if="['xls','xlsx'].includes(item.format)" src="../assets/Disk/n-excel.svg" draggable='false'>
                  <img v-else-if="['doc','docx'].includes(item.format)" src="../assets/Disk/n-word.svg" draggable='false'>
                  <img v-else-if="['zip','rar'].includes(item.format)" src="../assets/Disk/n-zip.svg" draggable='false'>
                  <img v-else-if="['mp3','flac'].includes(item.format)" src="../assets/Disk/audio.svg" draggable='false'>
                  <img v-else-if="['mp4','avi','mov','MOV'].includes(item.format)" src="../assets/Disk/video.svg" draggable='false'>
                  <img v-else-if="['txt'].includes(item.format)" src="../assets/Disk/n-txt.svg" draggable='false'>
                  <img v-else-if="['cpp','html','js','c','css'].includes(item.format)" src="../assets/Disk/n-txt.svg" draggable='false'>
                  <img v-else-if="['png','jpg','jpeg','svg','webp'].includes(item.format)" src="../assets/Disk/image.svg" draggable='false'>
                  <img v-else-if="!item.isFile" src="../assets/Disk/fold.svg" draggable='false'>
                  <img v-else src="../assets/Disk/unknown.svg" draggable='false'>   
                  <span class="name" v-if="renameId==index">
                     <a-input v-model="renameData" id="rename-input" style="width:calc(100% - 14rem)" />
                  </span>
                  <span class="name" v-else>{{item.name}}</span>
<!--                  <span class="attach">-->
<!--                     <img @click="showModal" class="oper-img" src="../assets/Disk/加话题.svg" draggable='false'>-->
<!--                     <img @click="sort()" class="oper-img" src="../assets/Disk/排序.svg" draggable='false'>-->
<!--                     <img @click="rename(index)" class="oper-img" src="../assets/Disk/修改.svg" draggable='false'>-->
<!--                  </span>-->
               </td> 
               <td><span v-if="item.isFile">{{item.size}}</span><span v-else>--</span></td> 
               <td>
						<img :src="item.avatar" style="width:24px;height:24px;margin:-3px 6px 0 -6px;border-radius:7px;"
						v-if="item.avatar"/>
						{{item.user||'--'}}
					</td>
               <td class="oper">
                  <img v-if="item.isFile" @click="explore(item,index)" src="../assets/Disk/下移.svg" draggable='false'>
                  <img @click="delet(index,item.name,item.isFile)" class="delete-icon" src="../assets/Disk/删除.svg" draggable='false'>
<!--                  <img v-if="item.isFile" src="../assets/Disk/分享.svg" draggable='false'>-->
						<!-- share($event,index)  download(index,$event)-->
               </td>
               
            </tr>
         </tbody>
         </table>
         <transition name="msg">
         <div v-if="files.length==0 && pos!=''" :key="'nothing'" v-cloak>
            <div id="no-reviews-body">
                  <img src="../assets/common/nodata.svg" />
                  <span>这里空空如也...</span>
               </div>
            </div>
         </transition>
      </div>
      <div class="files-wrapper" v-if="previewMode==1" key="2" >
         <water :imgs="getWaterFiles" :path="getPath" :col=waterColNum ></water>
      </div>
      </transition-group>
   </div>
</transition>
</template>

<script>
	const water  = () => import('./attach/water')
   export default {
      name: "disk",
      components: {
         water
      },
      data(){
         return {
				folderName:"",
				visible: false,
      		confirmLoading: false,
            buttonRad:'0.4rem',
            files:[],
            pos:"",
            choose:[],
            mouseChoose:false,
            renameId:-1,
            renameData:"",
            transName:'msg',
            previewMode:0,
            previewText:['详细信息','预览图'],
            waterColNum:4,
            protoText:['http','https'],
            proto:0,
            buttonColor:'',
            Link:['http://funx.pro/resource/junk','https://ncov.funx.pro']
         }
      },
      computed: {
         getWaterFullWidth(){
            return document.getElementById('disk-wrapper').offsetWidth
         },
         getWaterFiles(){
            return this.files.filter(val => ['png','jpg','jpeg','svg','webp'].includes(val.format))
         },
         getPath(){
            return this.Link[this.proto]+this.pos+'/'
         }
      },
      methods:{
			showModal() {
      		this.visible = true;
    		},
    		foldConfirm(e) {
				this.getFiles({},true)
   			this.confirmLoading = true;
   			setTimeout(() => {
   				this.visible = false;
   				this.confirmLoading = false;
   			}, 500);
   		},
   		foldCancel(e) {
   		  this.visible = false;
   		},
         protoChange(event, val){
            this.pos = ""
            var t = this.previewMode
            this.previewMode = -1
            setTimeout(()=>{
               this.previewMode = t
            })
            if(val)
               this.proto = val
            else
               this.proto = (++this.proto)%(this.protoText.length)
            if(this.proto ==1 ){
               this.buttonColor = '#2e9f20'
            }
            if(this.proto ==0 ) this.buttonColor = 'white'
            if(!val)
               this.$alert('进入'+this.protoText[this.proto]+'协议资源','tiny',{x:event.pageX + 140, y:event.pageY+10})
         },
         addColNum(n){
            this.waterColNum += n
            if(this.waterColNum ==0 ) this.waterColNum = 1
            if(this.waterColNum ==10 ) this.waterColNum = 9
         },
         previewChange(event, val){
            if(val)
               this.previewMode = val
            else
               this.previewMode = (++this.previewMode)%(this.previewText.length)
            if(this.previewMode ==1 ) this.buttonRad = '0'
            if(this.previewMode ==0 ) this.buttonRad = '0.4rem'
            if(!val)
               this.$alert('切换至'+this.previewText[this.previewMode]+'','tiny',{x:event.pageX + 140, y:event.pageY+10})
         },
         select(index,always){
            if(!this.mouseChoose && !always) return;
            var stat = !this.choose[index]
            this.choose.splice(index,1,stat)
         },
         cancalRename(){
            this.renameId = -1;
         },
         share(event, index){
            if(Array.isArray(index)){
               index = this.choose
               var text = ''
               for(let i=0;i<index.length;i++){
                  if(!index[i]) continue;
                  if(this.files[i].isFile==false) continue;
                  text += this.Link[this.proto] +this.pos+'/'+this.files[i].name+'\n';
               }
               if(text=='')
                  text='文件夹无链接'
               this.$alert('右键复制：'+text,'tiny-clipboard',{x:event.pageX, y:event.pageY})
               return;
            }else{
            var text= this.Link[this.proto] +this.pos+'/'+this.files[index].name;
            this.$alert('右键复制：'+text,'tiny-clipboard',{x:event.pageX, y:event.pageY})
            }
         },
         rename(index){
				/*
            this.renameData = this.files[index].name
            this.renameId = index
            this.$nextTick(()=>{
               var input = document.getElementById('rename-input')
               var obj = input
               input.focus()
               obj.type = 'text';
               obj.selectionStart = 0; // 选中开始位置
               obj.selectionEnd = obj.value.indexOf('.');// 获取输入框里的长度。
               obj.type = 'input_type';// 获得焦点后，改回number类型
               input.onblur = ()=>{
						//test
						return;
                  if(this.renameId==-1) return;
                  this.renameId = -1;
                  if(this.files[index].name==this.renameData) return;
                  this.$http
                  .post("/disk/rename",{
                     pos:this.pos, name:this.files[index].name, isFile:this.files[index].isFile ,rename:this.renameData
                  }).then(res => {
                     if(res.data.success==1)
                        this.refresh()
                     else
                        this.$alert(res.data.msg,'false')
                  })
               }
            })*/
			},
         createFold(){
				
         },
         delet(index, name, isFile){
				var path = this.pos + '/'+ `${name}`
				if(!isFile) path += '/'
				console.log(path)
            this.$http
            .post(`/api/project/${this.$store.state.project.id}/file/delete`,{path}).then(doc => {
					var code = doc.data.status;
					var msg = doc.data.msg;
					console.log(msg)	
					if (code == 0){
						this.$alert("删除成功！","true-overload");
						this.files.splice(index,1)
                  this.choose.splice(index,1)
						this.refresh()
					}else{
						this.$alert(msg,"false");
					}
            })
         },
         download(index,e){
				/*
            var hasFile = false;
            if(Array.isArray(index)){
               index = this.choose
               for(let i=0;i<index.length;i++){
                  console.log('111')
                  if(index[i]==0) continue;
                  if(this.files[i].isFile==false) continue;
                  var x=new XMLHttpRequest();
                  x.open("GET", this.Link[this.proto] +this.pos+'/'+this.files[i].name, true);
                  x.responseType = 'blob';
               x.onload=(e)=>{
                  hasFile = true
                  var url = window.URL.createObjectURL(x.response)
                  var a = document.createElement('a');
                  a.href = url
                  a.download = this.files[i].name
                  a.click()
               }
               x.send();
               }
               this.$alert(`开始下载文件（未完成，后端压缩包）`,'tiny-overload',{x:e.pageX, y:e.pageY})
               if(hasFile){
                  //this.$alert(`开始下载文件`,'tiny-overload',{x:e.pageX, y:e.pageY})
               }else{
                  //this.$alert(`无文件可下载，也许你选择了文件夹`,'tiny-overload',{x:e.pageX, y:e.pageY})
               }
               return;
            }else{
                var x=new XMLHttpRequest();
            x.open("GET", this.Link[this.proto] +this.pos+'/'+this.files[index].name, true);
            x.responseType = 'blob';
            x.onload=(e)=>{
                var url = window.URL.createObjectURL(x.response)
                var a = document.createElement('a');
                a.href = url
                a.download = this.files[index].name
                a.click()
            }
            x.send();
            this.$alert(`开始下载文件`,'tiny-overload',{x:e.pageX, y:e.pageY})
            }*/
           
         },
         explore(item,index){
            if(typeof item == 'number'){
               this.transName = 'msg2'
               var arr = this.pos.split('/')
               var tpos = ''
               for(let i=1;i<=item;i++){
                  console.log(i+":"+arr[i])
                  tpos += '/'+arr[i]
               }
					this.pos = tpos;
					
               this.refresh(true)
            }
            else if(!item.isFile){
               this.transName = 'msg'
					this.pos += '/' + item.name
					// console.log('tpos：'+this.pos)
               this.refresh(true)
            }else{
					var path = this.pos+'/'+item.name
					console.log(path)
               this.$http.get(`/api/project/${this.$store.state.project.id}/file/download?path=${path}`)
            	.then(res => {
						var a = res.data.data
						console.log(res.data)
						if(a)
               		window.open(a);
					})
				}
         },
         refresh(first){
            // console.log('传递的pos：'+this.pos)
            this.$http.get(`/api/project/${this.$store.state.project.id}/file?path=${this.pos}`)
            .then(res => {
					var a = res.data.data
					// console.log(a)
					this.files = []
					/*this.files = [{
						name:"人家是默认的噢",
							isFile:false,
							size:"",time:"",changeTime:"",user:'',avatar:'',
					}];*/
					a.directory.forEach(v=>{
						if(v.name.split('/')[0]!='')
						this.files.push({
							name:v.name.split('/')[0],
							size:"",time:"",changeTime:"",user:'',
							user:"",
							avatar:""
						})
					})
					a.file.forEach(v=>{
						this.files.push({
							name:v.filename,
							isFile:true,
							size:formatSize(v.size),time:"",changeTime:"",user:'bb',
							user:v.upload.username,
							avatar:v.upload.photo,
							format:v.filename.split('.')[1]
						})
					})
               if(first){
                  this.choose = [];
                  this.files.forEach(()=>{
                     this.choose.push(0)
                  })
               }else{
                  this.choose.unshift(0)
               }
				})
				function formatSize(a){
					var realSize = Math.ceil(a/1024)
               if(realSize >= 1024){
                  realSize /= 1024
                  realSize = realSize.toFixed(2)
                  realSize += ' MB'
               }else{
                  realSize += ' KB'
					}
					return realSize
				}
         },
         getFiles(e, isDirectory) {
				console.log('上传文件的path：'+this.pos)
				// console.log('上传文件的file：'+e.target.files[0])
				// if(!this.folderName) return
				var formData = new FormData()
				if(!isDirectory){
					formData.append('path', this.pos)
					e.preventDefault();
            	if(e.target.files[0].size >= 1024 * 1024 * 50){
               	this.$alert("大于50M啦","false");
               	return;
					}
					this.fileName = e.target.files[0].name
					formData.append('file', e.target.files[0])
					formData.append('name', e.target.files[0].name)
					this.$alert(`开始上传文件`,'tiny-overload',{x:e.pageX, y:e.pageY})
				}else
					formData.append('path', this.pos + '/' + this.folderName)
            var config = {
               headers: { 'Content-Type': 'multipart/form-data' }
				}
            this.$http.post(`/api/project/${this.$store.state.project.id}/file`,formData, config ).then(doc=>{
               var code = doc.data.status;
					var msg = doc.data.msg;
					console.log(msg)	
					if (code == 0){
						if(!isDirectory) this.$alert("上传成功！","true-overload");
						else this.$alert("创建成功！","true-overload");
						this.refresh()
					}
            })
         },
      },
      mounted(){
         var box = document.getElementById("disk-wrapper")
         var table = document.getElementsByTagName("table")[0]
         this.refresh(true)
         box.addEventListener("drop",(e)=>{  //拖离 
            table.style.backgroundColor = ''  
            e.preventDefault();
            var fileList = e.dataTransfer.files;
            console.log(fileList)
            this.$alert(`开始上传文件`,'tiny-overload',{x:e.pageX, y:e.pageY})
            var msg = '';
            var count = 0;
            var success_count = 0;
            for(let i=0;i<fileList.length;i++){
               if(fileList[i].size >= 1024 * 1024 *100){
                  this.$alert("不能大于100MB噢！","false-overload");
                  return;
               }
               var formData = new FormData()
               formData.append('file', fileList[i])
               formData.append('name', fileList[i].name)
               formData.append('pos', this.pos)
               var config = {
                  headers: { 'Content-Type': 'multipart/form-data' }
               }
               /*this.$http.post('/disk/uploadPublic', formData, config ).then(res=>{
                  count++;
                  if(res.data.success==1){
                     success_count++;
                     this.refresh()
                     console.log('成功')
                    // this.$alert("上传成功！","true-overload");
                  }else{
                     msg+=res.data.msg+'\n'
                    // this.$alert(res.data.msg,"false-overload");
                  }
                  if(count == fileList.length){
                     if(success_count==0)
                        this.$alert(`上传失败${count-success_count}个\n`+msg,"false-overload");
                     else if(success_count==count && count!=0)
                        this.$alert(`成功上传${success_count}个文件`,"success-overload");
                     else
                        this.$alert(`成功上传${success_count}个文件，失败${count-success_count}个\n`+msg,"tips-overload");
                  }
               })*/
            }
  
         })
         box.addEventListener('click',(e)=>{

         })
         box.addEventListener("dragleave",function(e){  //拖后放  
            table.style.backgroundColor = '' 
             e.preventDefault();
             
         })  
         box.addEventListener("dragenter",function(e){  //拖进
            //  box.style.filter = 'brightness(2)'
             e.preventDefault();      
         })  
         box.addEventListener("dragover",function(e){  //拖来拖去    
            table.style.backgroundColor = 'rgb(227, 245, 229)'
             e.preventDefault();      
         })
         box.addEventListener("mousedown",(e)=>{  //拖来拖去    
            this.mouseChoose = true;   
            // console.log(this.mouseChoose)
         })
         box.addEventListener("mouseup",(e)=>{  //拖来拖去    
            this.mouseChoose = false;      
            // console.log(this.mouseChoose)
         })
         if(this.$route.query.p){
            setTimeout(()=>{
               document.getElementById('prev').click()
            },400)
         }  
            
      },
      created(){
         var obj = this.$route.query
         if(obj.l){
            obj.l.split('/').forEach((v)=>{
               if(v=='..') window.close()
               if(v!='..') this.explore({name:v})
            })
         }
         if(obj.p){
            obj.p.split('/').forEach((v)=>{
               if(v=='..') window.close()
               if(v!='..') this.explore({name:v})
            })
         }
      }
   };

</script>

<style lang="scss" scoped>
   input{
      padding: 0.4rem 0.6rem;
   }
   /*button{
      // color:rgb(227, 245, 229)
      padding:0.5rem 1rem;
      margin:-0.4rem 0;
   }*/
   #disk-wrapper{
		font-size: 10px;
      min-height:calc(100vh - 100px);
   }
   .colnum1{
      
      padding: 0.5rem 0.8rem;
      border-radius:0 0.5rem 0.5rem 0;
   }
   .colnum2{
      
      padding: 0.5rem 0.9rem;
      border-radius:0.5rem 0  0 0.5rem;
   }
   table{
      border: none !important;
      border-top: 1px solid #f3f3f3 !important;
      table-layout:fixed;
      user-select: none;
      width:100%;
      & > span{
         width:100%;
      }
      th{
         font-size: 1.5rem;
         text-align: left;
			padding: 0.65rem!important;
         padding-left: 2%!important;
			
      }
      td{
         font-size: 1.35rem!important;
         padding: 0.45rem!important;
         padding-left: 2%!important;
         text-align: left!important;
         border-left: none!important;
         border-top: 1px dashed #dfe1e381!important;
      }
      tr:nth-child(2n){
         background-color:rgba(255, 255, 255, 0.9);
      }
      tr:nth-child(2n-1){
         background-color:rgba(245, 253, 255, 0.9);
      }
      
      tr{
         transition:0.2s all;
         &:hover{
            background-color:rgb(232, 245, 255);
            .attach img{
               opacity: 1;
            }
         }
         &:active{
            background-color:rgb(213, 239, 246);
         }
         // td:nth-child(1){
         //    width:400rem;
         // }
         
      }
      .format{
         img{
            width:2.2rem;
            height:2.1rem;
            vertical-align: -0.2rem;
         }
         img:first-child{
            width:1.6rem;
            vertical-align: -0.2rem;
				padding-right: 2px;
            // padding:0 1.2rem 0 0.4rem;
            margin-right: 6px;
         }
         .attach{
            text-align: right;
         }
         .attach img{
            transition: 0.2s all;
            opacity: 0;
            float:right;
            width:2.2rem;
            vertical-align: 0rem;
            margin-left: 0rem;
            padding:0 0.4rem;
         }
      }
      .oper{
         img{
            margin-right: 1rem;
            width:1.6rem;
            vertical-align:-0.5rem;
            &:hover{
               cursor: pointer;
               filter:brightness(0.65);
            }
         }  
      }
      .oper-img{
         width:1.6rem;
         vertical-align:-0.3rem;
         &:hover{
               cursor: pointer;
               filter:brightness(0.65);
         }
      }
      .name{
         vertical-align: 0.25rem;
         margin-left: 0.9rem;
         margin-right: 0.9rem;
//  overflow: hidden;
//  text-overflow: ellipsis;
//  white-space: nowrap;
         img{
            vertical-align: -0.6rem;
            margin-left: 0.2rem;
            transition: 0.2s all;
            &:hover{
               cursor: pointer;
               filter:brightness(0.9);
            }
         }
      }
   }
   .header-addr{
      width: auto;
      transition: 0.2s all;
   }
   .header{
      margin:0rem 0 1rem 2.4rem;
      font-size: 1.4rem;
      color:rgb(195, 195, 195);
      & > span{
         margin-right:1.5rem;
         & >span{
            user-select: none;
            color:rgb(121, 169, 203);
            &:hover{
               color:rgb(85, 147, 192);
               text-decoration: underline;
               cursor: pointer;
            }
         }
      }
   }
   #no-reviews-body {
      margin-top: 1rem;
      text-align: center;
      width:100%;
   }
   #no-reviews-body img{
      width: 15rem;
      height: 15rem;
      opacity: 0.35;
   }
   #no-reviews-body span{
      // vertical-align:6rem;
      margin-left: 1.5rem;
      font-size: 1.5rem;
      color:#ccc;
   }
   .files{
      font-size: 1.5rem;
      transition: transform 1.5s;
   }
   
   .msg-leave-active,.msg2-leave-active,.msg3-leave-active{
      transition: all 0.08s ease-out;
   }
   .msg-enter-active,.msg2-enter-active,.msg3-enter-active{
      transition: all 0.3s 0.08s ease-out;
   }
   .msg-leave-to,
   .msg2-enter{
      transform: translateX(20px);
      opacity: 0;
   }
   .msg-enter,
   .msg2-leave-to{
      transform: translateX(-20px);
      opacity: 0;
   }
   .msg3-leave-to{
      transform: translateY(20px);
      opacity: 0;
   }
   .msg3-enter{
      transform: translateY(-20px);
      opacity: 0;
   }
   .msg-move,.msg2-move,.msg3-move{
      transition: all 0.25s
   }
   .upload-wrapper{
      height:3rem;
      margin-left: -1rem;
      display: inline-block;
      position: relative;
   }
   .upload{
      margin: 0 !important;
      position: relative;
      color:rgb(255, 214, 175);
      transition: 0.2s all;
   }
   input.upload-text{
      position: absolute;
      width: 2.5rem;
      border: 0.1rem solid rgb(253, 221, 190);
   }
   /*.upload button{
      margin-top: -0.10rem;
      margin-right: 0;
      margin-left:0.1rem;
      padding: 0.45rem 1rem;
      background-color: rgb(253, 214, 178);
   }
   .upload button:hover{
      background-color: rgb(255, 199, 147);
   }*/
   input[type="file"]{
      width:2.5rem;
      opacity: 0;
      position: absolute;
   }
   .water{
      position:absolute;
   }
   .water-wrapper{
      position:relative;
   }
   @media screen and (max-width: 768px) {
      .header-text{
         display: none;
      }
      .header{
         margin-top: 1rem;
      }
      .attach{
         img:nth-child(2),img:nth-child(1){
            display: none;
         }
      }
      .delete-icon{
         display: none;
      }
   }
   
</style>
