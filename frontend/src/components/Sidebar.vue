

<template>
    <div class="sidebar">
      <SidebarNav v-if="userLogin.u_role === 'admin'" :item="admin" class="sidebar-nav" />
        <SidebarNav class="sidebar-nav" :item='user' />
        <SidebarNav v-if="userLogin.u_role === 'admin'" class="sidebar-nav" :item='setting' />
    </div>
</template>
<script>
import SidebarNav from './SidebarNav.vue';
import { mapState } from "vuex";
export default {
   name:"sidebar",
   computed: {
    ...mapState({
      userLogin: state => state.user
    })
  },
   data() {
    return {
      admin: {
        header: "<i class='fa fa-unlock'></i> ส่วนของผู้ดูแลระบบ",
        navs: [
          { name: "ปฏิทินรายการห้องประชุม" ,link:{name:"/booking/calendar"}},
          { name: "ข้อมูลการจองห้องประชุม" ,link:{name:"/booking/manage"}},
          { name: "ข้อมูลอุปกรณ์ห้องประชุม" ,link:{name:"/equipment"}},
          { name: "ข้อมูลห้องประชุม", link: { name: "/room" } }
        ]
      },
      user: {
        header: "<i class='fa fa-user'></i> ส่วนของผู้ใช้งาน",
        navs: [
          { name: "การจองห้องประชุม" ,link:{name:"/booking/room"}},
          { name: "แก้ไขข้อมูลส่วนตัว" ,link:{name:"/profile/"}},
          { name: "เปลี่ยนรหัสผ่าน" ,link:{name:"/profile/editpassword"}}
        ]
      },
      setting: {
        header: "<i class='fa fa-cog'></i> ตั้งค่าอื่่นๆ",
        navs: [
          { name: "ตั้งค่าการแจ้งเตือน" ,link:{name:"/setting/line"}},
        ]
      }
    };
   },
   components:{
    SidebarNav
   }
}
</script>
<style scoped>
.sidebar-nav{
 margin-bottom: 30px;
}
</style>
