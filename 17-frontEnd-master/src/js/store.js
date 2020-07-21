import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const mutations = {
    bannerReload(state, obj){
		state.banner.name = obj.name
	},
    loginReload(state, bool){
		state.login = bool
	},
    projectReload(state, obj){
		state.project.id = obj.id
		state.project.name = obj.name
	},
	enterProject(state, obj){
		state.project.id = obj.id
	},
    memberUpdate(state, obj){
		state.member = obj
	},
	// taskMemberUpdate(state, obj){
	// 	state.project.task.participants = obj
	// },
	userUpdate(state){
		state.userUpdate++
	},
	taskUpdate(state){
		state.taskUpdate++
	},
	setIMProjectId(state, id){
    	state.timProjectId = id;
	},
	setIMUserId(state, id){
    	state.timLoginInfo.userID = id;
	}
}
const state = {
		banner:{
			name:"未登录",
			avatar:""
		},
		login:false,
		userUpdate:0,
		taskUpdate:0,
		member:[],
		project:{
			id:"",
			name:"",
			// task:{
			// 	id:"",
			// 	name:"",
			// 	participants:[],
			// }
		},
		timProjectId: null,
		timLoginInfo: {
			userID: ""
		}
   }
const vuex = new Vuex.Store({
   state,
	mutations,
	
});
export default vuex;
