<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <Search :types="search_types" @onSearch="onSearch($event)" />
                    <h5><i class="fa fa-list-alt"></i> รายการข้อมูลจองห้องประชุม</h5>
                </header>
                 <div class="table-responsive">
                  <table class="table">
                      <thead>
                          <tr>
                              <th>#</th>
                              <th>หัวข้อประชุม</th>
                              <th>วัน-เวลาเริ่ม</th>
                              <th>วัน-เวลาสิ้นสุด</th>
                              <th></th>
                          </tr>
                      </thead>

                      <tbody>
                          <tr v-for="item in bookings.result" :key="item.bk_id" :class="getApplyStatusClass(item)">
                              <td>{{ item.bk_id }}</td>
                              <td>{{ item.bk_title }}</td>
                              <td>{{ $formatDate(item.bk_time_start)}}</td>
                              <td>{{ $formatDate(item.bk_time_end)}}</td>
                              <td class="btns">
                                  <div v-if="item.bk_status === 'pending'">
                                      <button @click="onUpdateStatus('allowed',item)" class="btn btn-sm btn-warning mr-2">
                                          <i class="fa fa-check-circle"></i> อนุมัติ
                                      </button>

                                      <button @click="onUpdateStatus('not allowed',item)" class="btn btn-sm btn-danger">
                                          <i class="fa fa-times-circle"></i> ไม่อนุมัติ
                                      </button>
                                  </div>

                                  <div v-if="item.bk_status === 'allowed'">
                                      <i class="fa fa-check-circle"></i> อนุมัติแล้ว
                                  </div>

                                  <div v-if="item.bk_status === 'not allowed'">
                                      <i class="fa fa-times-circle"></i> ไม่อนุมัติ

                                      <button @click="onDeleteBooking(item)" class="btn btn-sm btn-danger ml-2">
                                          <i class="fa fa-trash"></i> ลบทิ้ง
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                </div>
                <Pagination :data="bookings" :page="page" @onPage="onPage($event)" />

            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";

export default {
  components: {
    Layout,
    Search,
    Pagination
  },
  computed: {
    ...mapState(["bookings"])
  },
  data() {
    return {
      search_types: [
        { name: "หัวข้อประชุม", value: "bk_title" },
        { name: "วันที่เริ่ม", value: "bk_time_start", type: "date" },
        { name: "วันที่สิ้นสุด", value: "bk_time_end", type: "date" }
      ],
      page: 1,
      search: {}
    };
  },
  mounted() {
    this.initialLoadBooking();
  },
  methods: {
    // อัพเดทสถานะการจอง
    onUpdateStatus(bk_status , item){
        this.$swal.fire({
            title: '<strong>ยืนยันการทำรายการต่อไปนี้หรือไม่ !</u></strong>',
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
        }).then((Confirmed) => {
            if(Confirmed){
               this.axios.put(`/api/booking/manage/${item.bk_id}`,{ bk_status })
               .then((res)  => {
                   if(res.status == 200) {
                      console.log(res)
                      return this.$swal.fire({
                        text:res.data.message,
                        icon:'success'
                      }).then((res) => {
                        setTimeout(() => {
                            window.location.reload()
                        }, 500);
                      })
                   }
               })
               .catch((err) => {
                    return  this.$swal.fire({
                      text:err.response.data.msg || err.response.data.message,
                      icon:'error'
                    })
               })
            }
        })
    },

    // ลบข้อมูลการจอง 
    onDeleteBooking(item){
        this.$swal.fire({
            title: '<strong>ยืนยันการลบรายการต่อไปนี้หรือไม่ !</u></strong>',
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
        }).then((Confirmed) => {
            if(Confirmed){
               this.axios.delete(`/api/booking/manage/${item.bk_id}`)
               .then((res)  => {
                   if(res.status == 200) {
                      console.log(res)
                      return this.$swal.fire({
                        text:res.data.message,
                        icon:'success'
                      }).then((res) => {
                        setTimeout(() => {
                            window.location.reload()
                        }, 500);
                      })
                   }
               })
               .catch((err) => {
                    return  this.$swal.fire({
                        text:err.response.data.msg || err.response.data.message,
                        icon:'error'
                    })
               })
            }
        })
    },
    // เปลี่ยน สถานะการจองเป็น ชื่อ class
    getApplyStatusClass(item) {
      const statusClass = {};
      statusClass[item.bk_status] = true;
      return statusClass;
    },
    // ค้นหาข้อมูล
    onSearch(search) {
      this.search = search;
      this.$store.dispatch("set_bookings", { page: 1, ...this.search });
    },
    // แบ่งหน้าเพจ
    onPage(page) {
      this.page = page;
      this.$store.dispatch("set_bookings", {
        page: this.page,
        ...this.search
      });
    },
    initialLoadBooking() {
      this.$store.dispatch("set_bookings");
    },
     // format วันที่
    // formartDate(date) {
    //   const formart = this.$moment(date).format('YYYY-MM-DD , h:mm:ss A')
    //   return formart
    // }
  }
};
</script>


<style scoped>
.btns {
  width: 200px;
  text-align: right;
}
.btns .btn {
  width: 60px;
}

tr.allowed td {
  color: #28a745;
}

tr.not.allowed td {
  color: #dc3545;
}
</style>

