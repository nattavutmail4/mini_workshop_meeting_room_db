<template>
  <div class="login">
    <img src="/img/logo.svg" alt="logo" class="img-logo" />
    <div class="card">
        <h1 class="card-header">LOGIN</h1>
        <div class="card-body">
            <form @submit.prevent="onSubmit()">
                <div class="form-group">
                    <label >ชื่อผู้ใช้งาน</label>
                    <input type="text"  v-validate="{required:true, regex: /^[A-Za-z0-9]{3,15}$/  }" name="u_username"
                      :class="{'is-invalid':errors.has('u_username')}" v-model.trim="form.u_username"
                       id="u_username" class="form-control" placeholder="Enter Username">
                    <span class="invalid-feedback">{{ errors.first('u_username') }}</span>
                </div>
                <div class="form-group">
                    <label >รหัสผ่าน</label>
                    <input type="password"
                    name="u_password"
                    v-validate="{required:true, regex: /^[A-Za-z0-9]{3,15}$/  }"
                    :class="{'is-invalid':errors.has('u_password')}"
                    v-model.trim="form.u_password" id="u_password" class="form-control" placeholder="Enter Password">
                    <span class="invalid-feedback">{{ errors.first('u_password') }}</span>
                </div>
            
                <div class="form-group buttons">
                    <button type="submit" class="btn btn-info btn-block">
                      เข้าสู่ระบบ
                    </button>
                    <button type="submit" @click="onRedirectToRegister()" class="btn btn-secondary btn-block">
                      ลงทะเบียน
                    </button>
                </div>
              
            </form>
        </div>
    </div>
  </div>
</template>
<script scoped>
export default {
    data() {
      return {
       form:{
        u_username:"",
        u_password:""
       },
       sessionLogin :"",
        errorMessage: "",
      }
    },
    mounted() {
      // , mounted คือ lifecycle hook ที่ถูกเรียกหลังจาก Vue instance ถูกเชื่อมต่อ (mount) กับ DOM และหน้า view สำเร็จ.
      //เช็คการ login ว่าเคย login แล้วมี session ค้างอยู่ในระบบหรือไม่
       this.onCheckLogin()
      //  this.clearConsole()
    },
    methods: {
        // บันทึกข้อมูลลงทะเบียน
        onSubmit() {
          this.$validator.validateAll().then(async (valid) => {
            if (!valid) return;
            try {
              const response = await this.axios.post("/api/account/login", this.form);
              const sessionUserLogin = {
                u_id: response.data.msg.u_id,
                u_username: response.data.msg.u_username,
                u_lastname: response.data.msg.u_lastname,
                u_role: response.data.msg.u_role,
              };
              sessionStorage.setItem('userLogin', JSON.stringify(sessionUserLogin));

              if (response.data.statusCode == 200) {
                this.$swal.fire({
                  text: 'เข้าสู่ระบบสำเร็จ',
                  icon: 'success',
                  confirmButtonText: 'ตกลง'
                }).then(() => {
                  setTimeout(() => {
                    this.$router.push('/home')
                  }, 200);
                });
              }
            } catch (err) {
              this.$swal.fire({
                text: err.response.data.msg,
                icon: 'error',
                confirmButtonText: 'ตกลง'
              });
            }
          });
        },

      
        onReset() {
          this.errorMessage = null;
          this.$validator.reset();
          this.form = {
            u_username: "",
            u_password: ""
          };
        },

        //ไปที่หน้า Register
        onRedirectToRegister() {
          this.$router.push('/register')
        },
        onCheckLogin() {
          if(sessionStorage.getItem('userLogin')){
              this.axios.get('/api/account/userLogin').then((res) => {
                this.$router.push({ name: "home" });
              }).catch((err) => {
                sessionStorage.removeItem("userLogin");
              })
          }else{
            return [];
          }
        },

        clearConsole() {
          let div = document.createElement('div')
          let loop = setInterval(() => {
            console.log(div);
            console.clear();
          },1000)
        }
    },
};
</script>
<style scoped>
.login {
  max-width: 500px;
  margin: 3% auto;
}
.img-logo {
  width: 85%;
  display: block;
  margin: auto;
  margin-bottom: 30px;
}
h1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 5px;
}
.card-body {
  padding-left: 15%;
  padding-right: 15%;
}
.buttons .btn-secondary {
  margin-top: 20px;
}
.buttons {
  margin-top: 30px;
  margin-bottom: 50px;
}
@media (max-width:575.98px) {
  /* *{
    border: 1px solid red;
  } */
  .card-body{
    padding-left: 15px;
    padding-right: 15px;
  }
  .login{
    padding-left: 10px;
    padding-right:10px;
  }
  .img-logo {
    width: 100%;
    display: block;
    margin: auto;
    margin-bottom: 30px;
  }
}
</style>