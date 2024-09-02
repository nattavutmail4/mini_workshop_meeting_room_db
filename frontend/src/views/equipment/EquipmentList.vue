<script>
import Layout from "@/components/Layout";
import Pagination from "../../components/Pagination.vue";
import Search from "../../components/Search.vue";
import { mapState } from "vuex";
export default {
  // การประกาศตัวแปรสำหรับเก็บข้อมูล
  data(){
    return{
      search:{},
      page:1,
      search_types:[
         {name:'ชื่ออุปกรณ์ห้องประชุม',value:"eq_name"},
         {name:'รายละเอียด',value:"eq_detail"},
      ]
    }
  },
  computed:{
    ...mapState(['equipments'])
    
  },
  // การนำ components มาใช้
  components: {
    Layout,
    Search,
    Pagination
  },
  created(){
    this.$store.dispatch("set_equipments")
  },
  methods:{
    // การลบข้อมูล
    onDelete(id){
       if(id != undefined || id != null){
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
      }).then((res) => {
         if(res.isConfirmed == true){
            const response  = this.axios.delete("/api/equipment/"+id).then((res) =>{
              console.log(res);
              if(res.status == 200){
                  this.$swal.fire({
                      text: 'ลบช้อมูลสำเร็จ',
                      icon: 'success',
                      confirmButtonText: 'ตกลง'
                  }).then(() => {
                      setTimeout(() => {
                        window.location.reload()
                      }, 200);
                  });
              }
            }).catch((err) => {
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
    // การแบ่งหน้า
    onPage(page){
      //set_equipments มาจากไฟล์ store
      this.page = page
      this.$store.dispatch("set_equipments",{ page:this.page, ...this.search })

    },

    //การค้นหาข้อมูล filter
    onSearch(search){
      this.page = 1
      this.search = search
      this.$store.dispatch('set_equipments',{page:this.page, ...this.search})
    },

    // แก้ไขข้อมูลส่ง id ไปหน้า edit
    onUpdate(item){
        //ส่ง query id ไปยัง componet equipment-form จะได้เป็น equipment-form/?id= idของข้อมูลนั้นๆ
        this.$router.push({ name:'equipment-form' ,  query: { id: item.eq_id}})
    },

    OnformattedDateTime(date) {
      // const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      const options = {day:"2-digit",month:"2-digit",year:"numeric"}
      return new Date(date).toLocaleString("en-US", options);
    }
  },
  
};
</script>

<template>
    <Layout>
        <div slot="buttons" class="form-group">
            <router-link class="btn" :to="{ name:'equipment-list' }">รายการข้อมูล</router-link>
            <router-link class="btn" :to="{ name:'equipment-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        
        <div class="card">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)"/>
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลอุปกรณ์ห้องประชุม</h5>
                </header>
                <div class="table-responsive">
                      <table class="table">
                        <thead>
                            <tr>
                                <th class="d-none d-sm-table-cell">#</th>
                                <th>ชื่ออุปกรณ์ห้องประชุม</th>
                                <th>รายละเอียด</th>
                                <th>วันที่แก้ไขล่าสุด</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item ,index) in equipments.result" :key="index">
                                <td class="d-none d-sm-table-cell">
                                    <div class="img-container">
                                        <img :alt="item.eq_name" :src="`/api/uploads/${item.eq_image}`">
                                    </div>
                                </td>
                                <td>{{ item.eq_name }}</td>
                                <td>{{ item.eq_detail || 'ไม่มีข้อมูล' }}</td>
                                <td>{{ $formatDate(item.eq_updated) }}</td>
                                <td class="text-right">
                                    <i class="fa fa-edit text-info mr-3 pointer" @click="onUpdate(item)"></i>
                                    <i class="fa fa-trash text-danger pointer" @click="onDelete(item.eq_id)"></i>
                                </td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                    <Pagination :data="equipments" :page="page" @onPage="onPage($event)"/>
               
            </div>
        </div>
    </Layout>
</template>



<style  scoped>
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


