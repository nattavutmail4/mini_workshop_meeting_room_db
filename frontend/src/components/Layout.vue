<template>
    <div class="layout">
        <Navbar/>
        <div class="container">
            <slot name="buttons"></slot>
            <div class="row">
                <div class="col-lg-9">
                   <slot></slot>
                </div>
                <div class="col-lg-3">
                    <Sidebar/>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .container{
        margin-top:30px
    }
   
</style>
<script>
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
export default {
    name:"Layout",
    components:{
        Navbar,
        Sidebar
    },
}
</script>