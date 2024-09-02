<template>
    
</template>
<script>
export default {
    name:"home",
    created(){
        const userLogin = this.$store.state.user
        // console.log(userLogin)
        if(userLogin && userLogin.u_role ==='admin'){
           this.$router.push({name:"booking-calendar"})
        } else {
           this.$router.push({name:"booking-room"})
        }
    }
}
</script>
