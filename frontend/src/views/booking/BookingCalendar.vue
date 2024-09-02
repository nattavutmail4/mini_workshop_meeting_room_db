<template>
    <Layout>
        <div class="card mb-3">
            <div class="card-body">
                <header class="mb-4">
                    <form @submit.prevent="onSearch()" class="search-form form-inline">
                        <select class="form-control" v-model="roomId">
                            <option value="">เลือกห้องประชุม</option>
                            <option :value="item.r_id" v-for="item in roomItem" :key="item.r_id">
                                {{ item.r_name }}
                            </option>
                        </select>

                        <button type="submit" class="btn btn-secondary">
                            <i class="fa fa-search"></i>
                        </button>
                    </form>
                    <h5><i class="fa fa-list-alt"></i> ปฏิทินรายการจองห้องประชุม</h5>
                </header>
                <br>
                <div class="fullcarlendar" id='calendar'></div>
            </div>
        </div>
    </Layout>
</template>
<script>
  import Layout from '../../components/Layout.vue';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import thLocale from '@fullcalendar/core/locales/th'; // Import locale ภาษาไทย
  const calendarId = "calendar";
  export default {
    name:"Calendar",
    components:{
        Layout
    },
    data(){
        return {
            roomId:"",
            roomItem:[]
        }
    },
    mounted(){
        this.InitialLoadRoomSelect()
        this.InitialLoadCalendar()
    },
    methods:{
        onSearch(){
            //ล้างข้อมูลใน calendar 
            this.InitialLoadCalendar([])
             //ใช้ jquery เช็คค่าว่าที่ส่งมาเป็นข้อมูลชนิด number ไหม
            if(!this.jquery.isNumeric(this.roomId)) {
                return  this.$swal.fire({
                    text:'กรุณาเลือกหัวข้อที่ต้องการค้นหา',
                    icon:'error'
                })
            }
            this.axios.get(`/api/booking/calendar/room/${this.roomId}`)
            .then((res)  => {
                if(res.status == 200) {
                    if(res.data.length != 0){
                        const events = res.data.map((item) => {
                            return {
                                title: item.bk_title,
                                start: new Date(item.bk_time_start),
                                end: new Date(item.bk_time_end),
                                className: item.bk_status
                            };
                        })
                        // ส่งข้อมูลไปใน function calendar เพื่อนำข้อมูลไปแสดง
                        this.InitialLoadCalendar(events)
                    } else {
                        return  this.$swal.fire({
                            text:'ไม่มีรายการจอง',
                            icon:'error'
                        })
                    }
                }
            })
            .catch((err) => {
                if(err.response.status == 404) {
                    return  this.$swal.fire({
                        text:err.response.data.msg,
                        icon:'error'
                    }) 
                }
                return  this.$swal.fire({
                        text:err.response.data.message,
                        icon:'error'
                })
            })
        },

        //โหลดข้อมูลห้องประชุมมาแสดงใน SELECT
        InitialLoadRoomSelect(){
            this.axios.get('/api/booking/rooms/select')
            .then((res)  => {
                
                this.roomItem = res.data
            })
            .catch((err) =>{
                console.log(err.response.data.message)
            })
        },
        //โหลดข้อมูล Calendar ของ UI
        InitialLoadCalendar(events){
            const calendarEl = document.getElementById(calendarId);
            const calendar = new Calendar(calendarEl, {
                plugins: [ dayGridPlugin ],
                timeZone: 'th',
                themeSystem: 'bootstrap4',
                locale: thLocale, // กำหนด locale เป็น ภาษาไทย
                height: 'auto',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                },
                dayMaxEvents: true, // allow "more" link when too many events
                events: events || []
            });
            
            calendar.render();
        }
    }
  }
</script>

<style scoped>
.search-form {
  float: right;
  margin-bottom: 15px;
}
.form-control {
  margin-right: 5px;
}
.form-control:first-child {
  width: 270px;
}
#calendar {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 60px;
  color: black;
}
.fc {
  font-size: 15px; /* ปรับขนาด font ตามที่ต้องการ */
}
@media (max-width:575.98px) {
    .form-control{
        margin-right: 2%;
    }
    .form-control:first-child {
        width: 80%;
    }
    .btn-secondary{
        width: 18%;
    }
    #calendar {
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 60px;
        color: black;
    }
}

</style>