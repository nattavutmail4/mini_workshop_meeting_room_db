<script>
export default {
    props:['item'],

    methods:{
      // isLinkActive(linkName){
      //   console.log(this.$route)
      //   if(this.$route.path === linkName){
      //     return this.$route.path === linkName
      //   }else{
      //     return;
      //   }
      // }
    }
}
</script>
<template>
  <section class="card">
    <header class="card-header text-center">
      <h5 class="m-0" v-html="item.header"></h5>
    </header>
    <div class="card-body">
      <router-link v-for="(item, index) in item.navs" :key="index" class="sidebar-link" :to="item.link.name || '#'" >
        <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
         {{ item.name }} 
      </router-link>
    </div>
  </section>
</template>

<style scoped>
h5 {
  font-size: 1rem;
}
.card {
  background: none;
  border: none;
}
.card-body {
  padding: 0.8rem 0;
}
.sidebar-link {
  display: block;
  padding: 0.55rem 0.55rem;
  margin-bottom: 2px;
  color: #525b62;
  font-weight: 400;
  text-decoration: none;
}
.fa-chevron-circle-right {
  color: #17a2b8;
  margin-right: 4px;
}
.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: #dee2e6;
}
.sidebar-link.active,
.sidebar-link.active .fa-chevron-circle-right,
.sidebar-link:hover,
.sidebar-link:hover .fa-chevron-circle-right {
  color: #212529;
}
</style>
