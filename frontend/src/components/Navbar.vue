<script>
export default {
  name:"navbar",
  mounted(){
    // console.log(  this.$store.state.user.u_id)
  },
  methods:{
    onLogout(){
      this.$swal.fire({
        title: '<strong>ยืนยันการออกจากระบบ</u></strong>',
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
            const response  = this.axios.post("/api/account/logout").then((res) =>{
              if(res.data.statusCode == 200){
                sessionStorage.removeItem("userLogin");
                  this.$swal.fire({
                      text: 'ออกจากระบบสำเร็จ',
                      icon: 'success',
                      confirmButtonText: 'ตกลง'
                  }).then(() => {
                      setTimeout(() => {
                        this.$router.push('/')
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
      
    
    },

    onRedireactToHome () {
       this.$router.push({name:"home"})
    },
  }
}
</script>
<template>
  <nav class="navbar  navbar-light ">
    <a href="" @click="onRedireactToHome()" class="navbar-brand">
        <h3><b>&nbsp;&nbsp;&nbsp;ระบบจองห้องประชุม</b></h3>
    </a>
    <a @click="onLogout()" href="#" class="btn-logout">
        <i class="fa fa-sign-out" aria-hidden="true"></i>
    </a>
  </nav>
</template>
<style scoped>
  
.navbar {
  background-color: #ffffff;
  height: 60px;
  border-bottom: solid 1px #17a2b8;
  padding: 0;
  padding-right: 0;
}
.navbar-brand img {
  width: 262px;
  height: 45px;
}
.btn-logout {
  width:80px;
  height:60px;
  background-color: #17a2b8;
  color:#FFFFFF;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
}

@media (max-width:575.98px) {
  .navbar-brand img {
    width: 200px;
  }
}

</style>