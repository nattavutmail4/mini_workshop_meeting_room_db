<script>
import Layout from "@/components/Layout";
import Pagination from "../../components/Pagination.vue";
import Search from "../../components/Search.vue";
import { mapState } from "vuex";
export default {
  // การประกาศตัวแปรสำหรับเก็บข้อมูล
  name:"room-list",
  data(){
    return{
      search:{},
      page:1,
      search_types: [
        { name: "ชื่อห้องประชุม", value: "r_name" },
        { name: "ขนาด", value: "r_capacity" },
        { name: "รายละเอียด", value: "r_detail" },
        // { name: "วันที่", value: "r_updated" }
      ]
    }
  },
  computed:{
    ...mapState(['rooms'])
  },
  // การนำ components มาใช้
  components: {
    Layout,
    Search,
    Pagination
  },
  created(){
    this.$store.dispatch("set_rooms")
  },
   methods:{
    // การแบ่งหน้า
    onPage(page){
      //set_equipments มาจากไฟล์ store
      this.page = page
      this.$store.dispatch("set_rooms",{ page:this.page, ...this.search })

    },
    //ลบข้อมูล
    onDelete(item){
      if(item.r_id != undefined || item.r_id != null){
          this.$swal.fire({
            title: '<strong>ยืนยันการลบข้อมูล</u></strong>',
            icon: 'info',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> ตกลง!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
            '<i class="fa fa-thumbs-down"></i> ยกเลิก',
            cancelButtonAriaLabel: 'Thumbs down'
          }).then((cf) => {
            if(cf.isConfirmed == true){
              this.axios.delete("/api/rooms/"+item.r_id)
              .then((res) =>{
                this.$swal.fire({
                      text: 'ลบช้อมูลสำเร็จ',
                      icon: 'success',
                      confirmButtonText: 'ตกลง'
                  }).then(() => {
                      setTimeout(() => {
                        this.$store.dispatch("set_rooms")
                      }, 200);
                  });
              })
              .catch((err) => {
                  this.$swal.fire({
                      text: err.response.data.msg,
                      icon: 'error',
                      confirmButtonText: 'ตกลง'
                  })
              })
            }
          })
      }
    },

    //ไปยังหน้าฟอร์มสำหรับแก้
    onUpdate(item){
        //ส่ง query id ไปยัง componet equipment-form จะได้เป็น equipment-form/?id= idของข้อมูลนั้นๆ
        this.$router.push({ name:'room-form' ,  query: { id: item.r_id}})
    },
    //การค้นหาข้อมูล filter
    onSearch(search){
      this.page = 1
      this.search = search
      this.$store.dispatch('set_rooms',{page:this.page, ...this.search})
    },
    // format วันที่
    OnformattedDateTime(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    }
  }
  
};
</script>

<template>
    <Layout>
        <div slot="buttons" class="form-group">
            <router-link class="btn" :to="{ name:'room-list' }">รายการข้อมูล</router-link>
            <router-link class="btn" :to="{ name:'room-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        
        <div class="card">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)"/>
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลห้องประชุม</h5>
                </header>
                <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="d-none d-sm-table-cell">#</th>
                            <th>ชื่อห้องประชุม</th>
                            <th>ขนาด</th>
                            <th>รายละเอียด</th>
                            <th>วันที่แก้ไขล่าสุด</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item ,index) in rooms.result" :key="index">
                            <td class="d-none d-sm-table-cell">
                                <div class="img-container">
                                    <img :alt="item.r_name" :src="`/api/uploads/${item.r_image}`">
                                </div>
                            </td>
                            <td>{{ item.r_name }}</td>
                            <td>{{ item.r_capacity }}</td>
                            <td>{{ item.r_detail || 'ไม่มีข้อมูล' }}</td>
                            <td>{{ $formatDate(item.r_updated) }}</td>
                            <td class="text-right">
                              <i class="fa fa-edit text-info mr-3 pointer" @click="onUpdate(item)"></i>
                                <i class="fa fa-trash text-danger pointer" @click="onDelete(item)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
              </div>
              <Pagination :data="rooms" :page="page" @onPage="onPage($event)"/>
            </div>
        </div>
    </Layout>
</template>



<style scoped>
.btn {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-active {
  background-color: #17a2b8;
}
</style>

