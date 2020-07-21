
var baseURL = 'http://47.99.132.18'

import Vue from 'vue'
import App from './App.vue'
import Alert from './components/attach/alert'
import 'ant-design-vue/dist/antd.css'
import {Button, Divider, Radio, Switch, Tooltip, Modal} from 'ant-design-vue'
import {Input, Form, Upload} from 'ant-design-vue'
import {Collapse} from 'ant-design-vue'
import {Checkbox} from 'ant-design-vue'
import {Menu} from 'ant-design-vue'
import {Avatar} from 'ant-design-vue'
import {Icon} from 'ant-design-vue'
import {Popover} from 'ant-design-vue'
import {Popconfirm} from 'ant-design-vue'
import {List,Card} from 'ant-design-vue'
import {DatePicker,PageHeader} from 'ant-design-vue'
import {Dropdown,Select,Drawer,Tag,Tabs,Cascader} from 'ant-design-vue'
import {Transfer} from 'ant-design-vue'
import {LocaleProvider} from 'ant-design-vue'
import router from './js/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import store from './js/store'
import china from './js/china'
Vue.config.productionTip = false
// axios.defaults.withCredentials=true
axios.defaults.withCredentials = true
// ant-design
Vue.component(Button.name, Button)
Vue.component(Popconfirm.name, Popconfirm)
Vue.component(Icon.name, Icon)
Vue.component(Input.name, Input)
Vue.component(Collapse.name, Collapse)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Menu.name, Menu)
Vue.component(Avatar.name, Avatar)
Vue.component(List.name, List)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Dropdown.name,Dropdown)
Vue.component(Divider.name,Divider)
Vue.component(Select.name,Select)
Vue.component(Drawer.name,Drawer)
Vue.component(Radio.name,Radio)
Vue.component(Tag.name,Radio)
Vue.component(Tabs.name, Tabs)
Vue.component(PageHeader.name,PageHeader)
Vue.component(Switch.name,Switch)
Vue.component(Tooltip.name,Tooltip)
Vue.component(Card.name,Card)
Vue.component(Modal.name,Modal)
Vue.component(Popover.name, Popover)
Vue.component(Transfer.name, Transfer)
Vue.component(LocaleProvider.name, LocaleProvider)
Vue.component(Cascader.name, Cascader)
Vue.component(Form.name, Form)
Vue.component(Upload.name, Upload)
Vue.use(Button)
Vue.use(Popconfirm)
Vue.use(Input)
Vue.use(Collapse)
Vue.use(Avatar)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(List)
Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(Divider)
Vue.use(Select)
Vue.use(Drawer)
Vue.use(Radio)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(PageHeader)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Card)
Vue.use(Modal)
Vue.use(Popover)
Vue.use(Transfer)
Vue.use(LocaleProvider)
Vue.use(Cascader)
Vue.use(Form)
Vue.use(Upload)
Vue.use(Checkbox)
//Vue.prototype.$confirm = Modal.confirm
// plugins mounted
Vue.prototype.$cookies = Cookies;
Vue.prototype.$http = axios.create({baseURL,"Access-Control-Allow-Origin":"*"})
baseURL = 'http://funx.pro:3001/api'
Vue.prototype.$http2 = axios.create({baseURL})
//Vue.prototype.$httpTest = axios.create({'baseURL'})
// init
new Vue({
	render: h => h(App),
	router,
	store,
	china
}).$mount('#app')
// tips
//Vue.prototype.$alertNum = 0;
const alertBox = Vue.extend(Alert)
Vue.prototype.$alert = function(msg, type, Obj) {
	if (document.getElementsByClassName('alert').length >= 2 && !type.match('overload')) return
	if (type == '') type = 'true'
	var a = new alertBox({
		data: {
			msg: msg,
			type: type,
			visible: false,
			mouse: Obj ? Obj : {x: 0, y: 0}
		}
	}).$mount()
	document.body.appendChild(a.$el)
	setTimeout(() => {
		document.body.removeChild(a.$el)
	}, 1700)
}
