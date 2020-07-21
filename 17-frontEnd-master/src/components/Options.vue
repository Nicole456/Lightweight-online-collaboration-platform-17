<template>
  <div style="width: 170px">
    <a-menu
      :defaultSelectedKeys="keys"
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed"
    >
      <a-menu-item key="1" @click="$router.push('/taskPanel')">
        <a-icon type="clock-circle" />
        <span>任务面板</span>
      </a-menu-item>

      <a-menu-item key="8"  @click="$router.push('/member')">
        <a-icon type="team" />
        <span>成员管理</span>
      </a-menu-item>

      <a-menu-item key="2"  @click="$router.push('/post')">
        <a-icon type="bars" />
        <span>动态查看</span>
      </a-menu-item>

      <a-menu-item key="4" @click="$router.push('/disk')">
        <a-icon type="table" />
        <span>文件管理</span>
      </a-menu-item>

      <a-menu-item key="5" @click="$router.push('/schedule')">
        <a-icon type="schedule" />
        <span>日程安排</span>
      </a-menu-item>

      <a-menu-item key="6" @click="$router.push('/chat')">
        <a-icon type="message" />
        <span>群组聊天</span>
      </a-menu-item>

      <a-menu-item key="7" @click="$router.push('/remind')">
        <a-icon type="bell" />
        <span>消息通知</span>
      </a-menu-item>

    </a-menu>
  </div>
</template>

<script>
export default {
   name: "Options",
   components: {},
   data() {
     return {
		collapsed: false,
		keys:['1'],
    };
   },
   methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
   },
};
</script>

<style scoped>

</style>