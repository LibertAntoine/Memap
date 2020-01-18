<template>
   <div>
    <ul id="documentList">
      <DocumentItem v-for="(document, index) in documents" :key="index" :document="document"/>
    </ul>
   </div>
</template>

<script>
 import DocumentItem from './DocumentItem.vue'  
 export default {
   name: 'DocumentList',
   components: {
     DocumentItem
   },
  data: function () {
    return {
      documents: Object
    }
  },
   created() {
        this.$http.get('http://localhost:3000/document/All',{
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        (response) => {
            response.json().then((data) => {
            this.documents = data.documents;
          })
        }, 
        (response) => {
          console.log("error", response)
        })
    },
   methods: {
   }
 }
</script>

<style>

</style>