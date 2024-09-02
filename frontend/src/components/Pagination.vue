<script>
export default {
   
    props:{
        data:{
            required:true,
        },
        page:{
            type:Number,
            required:true,
            default:1
        }
    },
    computed:{
        getPageItems(){
           const pages = []
           if(this.data){
             if(this.data.limit && this.data.rows){
                const rows = this.data.rows
                const limit = this.data.limit
                for(let index = 1; index <= Math.ceil(rows/limit); index++){
                    pages.push(index)
                }
             }
             
             
           }
           return pages
        }
    },
    methods:{
        onPage(page){
            this.$emit('onPage',page)
        }
    }
}
</script>
<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
            <li class="page-item" :class="{ disabled: page <= 1 }">
                <a @click.prevent="onPage(page - 1)" class="page-link" href="#">«</a>
            </li>

            <li class="page-item" v-for="(item) in getPageItems" :key="item" :class=" {active : page === item} ">
                <a class="page-link" href="#" @click.prevent="onPage(item)">{{ item }}</a>
            </li>
            <li class="page-item" :class="{ disabled: page >= getPageItems.length }">
             <a @click.prevent="onPage(page + 1)" class="page-link" href="#">»</a>
            </li>
        </ul>
    </nav>
    
</template>
<style scoped>
.pagination {
  flex-wrap: wrap;
}
/* @media (max-width:575.98px) {
    .justify-content-end {
        -webkit-box-pack: start!important;
         justify-content: flex-start!important;
    }
} */
</style>