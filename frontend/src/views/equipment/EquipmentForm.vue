<script>
import Layout from "@/components/Layout";
export default {
  components: {
    Layout
  },
  data(){
    return {
       form:{
         eq_name:"",
         eq_detail:"",
         eq_image:""
       }
    }
  },
  mounted(){
    this.initialUpdateItem()
  },
  watch:{
    // เคลี่ยค่าที่ค้างออก
     '$route.query.id'(){
        this.form = {
          eq_name:"",
          eq_detail:"",
          eq_image:""
        };
        //เคลี่ยค่า validator ออก
        this.$validator.reset()
     }
  },
  methods: {
    // ส่งข้อมูลไปยัง Backend
    onSubmit(){
      // trim  เป็นฟังก์ชันที่ใช้เพื่อลบช่องว่าง (space
      this.$validator.validateAll().then((valid) => {
          if(!valid) return;
          if(this.jquery.trim(this.form.eq_image) == ""){
            return  this.$swal.fire({
                text:"กรุณาอัพโหลดภาพ !",
                icon:"error"
              });
          }
          //ตรวจสอบข้อมูลว่าเป็นการเพิ่ม หรือ การแก้
          const updateId = this.$router.currentRoute.query.id
          const request = isNaN(updateId)
          ?this.axios.post("/api/equipment", this.form)
          :this.axios.put(`/api/equipment/${updateId}`,this.form)
          
          
          
          request
          .then(res => {
              if(res.status ==200 || res.status ==201){
                return this.$swal.fire({
                    text:res.status == 200 ? "อัพเดทข้อมูลสำเร็จ":"เพิ่มข้อมูลสำเร็จ",
                    icon:'success'
                 }).then((res) =>{
                    setTimeout(() => {
                      this.$router.push({ name:'equipment-list' });
                    }, 200);
                 })
              }
          }).catch((err) => {
            if(err.response.statusText === 'Payload Too Large'){
              return  this.$swal.fire({
                text: 'ขนาดไฟล์รูปภาพใหญ่เกินไป',
                icon: 'error',
                confirmButtonText: 'ตกลง'
              });
            }
            return  this.$swal.fire({
                text: err.response.data.msg,
                icon: 'error',
                confirmButtonText: 'ตกลง'
              });
             
          });
      })
    },
    // เปลี่ยนไฟล์อัพโหลดเป็น Base64 String
    onChangeFile(input) {
      this.form.eq_image = ""
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.form.eq_image = reader.result
          });
          return;
        }
      }
      this.$swal.fire({
        text:"กรุณาเลือกภาพที่จะอัพโหลด !",
        icon:"error"
      });
    },
    //นำข้อมูลจาก server ไปใส่ใน from เพื่อนำไปแก้ไข
    initialUpdateItem(){
      // เป็นการเข้าถึงค่า 'id' จากตัวแปร 'query' ในเครื่องมือเชื่อมต่อกับการจัดการเส้นทาง (router) ของ Vue.js
      // const id = this.$router.currentRoute.query.id
      // อีกแบบจะสั่นกว่า
      const id = this.$route.query.id
      if(isNaN(id)) return;

      this.axios.get(`/api/equipment/${id}`).then((res) =>{
         if(res.status == 200){
            const form = res.data
            this.form.eq_name = form.eq_name
            this.form.eq_detail = form.eq_detail
            this.form.eq_image  = form.eq_image
         }
      }).catch(ex => {
          this.$router.push( { name:'equipment-list' } )
      })
    }
  }

};
</script>

<template>
    <Layout>
        <div slot="buttons" class="form-group">
            <router-link class="btn btn-menu" :to="{ name:'equipment-list' }">รายการข้อมูล</router-link>
            <router-link class="btn btn-menu" :to="{ name:'equipment-form' }">เพิ่มข้อมูลใหม่</router-link>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <header>
                    <h5><i class="fa fa-edit"></i> เพิ่ม/แก้ไข ข้อมูลอุปกรณ์ห้องประชุม</h5>
                </header>
                <hr>
                
                <form @submit.prevent="onSubmit()" enctype="multipart/form-data">
                    <div class="form-group">
                        <label >ชื่ออุปกรณ์</label>
                        <input type="text" class="form-control" v-model.trim="form.eq_name" name="eq_name" v-validate="{required:true}" :class="{'is-invalid':errors.has('eq_name')}">
                        <p class="invalid-feedback">{{ errors.first('eq_name') }}</p>
                    </div>

                    <div class="form-group">
                        <label >รายละเอียด</label>
                        <textarea class="form-control" rows="4" v-model.trim="form.eq_detail"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="btn btn-secondary btn-block">
                            <i class="fa fa-upload"></i> อัพโหลดภาพ
                            <input type="file" class="d-none"  @change="onChangeFile($event.target)">
                        </label>

                        <img :src="form.eq_image || '/img/no-image.png'" alt="image example" class="img-fluid">
                    </div>

                    <div class="form-group mt-4 mb-5">
                        <div class="row">
                            <div class="col-sm-6">
                                <button type="submit" class="btn btn-info btn-block mb-2">
                                    บันทึกข้อมูล
                                </button>
                            </div>
                            <div class="col-sm-6 ">
                                <router-link :to="{ name:'equipment-list' }" class="btn btn-danger btn-block mb-2">
                                  ยกเลิก
                                </router-link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Layout>
</template>

<style scoped>
.btn-menu {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 7px;
  min-width: 130px;
}
.btn.router-link-exact-active {
  background-color: #17a2b8;
}
form {
  max-width: 350px;
  margin: auto;
}
form img {
  border: solid 1px #6c757d;
}
</style>
