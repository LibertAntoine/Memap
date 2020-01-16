<template>
   <div id="app">
     <h1>{{ title }}</h1>
    <form method="post">
     <editor id="document"
       api-key="no-api-key"
       :initialValue="content"
       v-model="content"
       :init="{
         height: 500,
         menubar: true,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor',
           'searchreplace visualblocks code fullscreen',
           'insertdatetime media table paste code help wordcount'
         ],
         toolbar:
           'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
       }"
       ></editor>
       <button type="submit" @click.prevent="submit">Valider</button>
       </form>
   </div>
</template>

<script>
 import Editor from '@tinymce/tinymce-vue'


 export default {
   name: 'document',
   components: {
     'editor': Editor
   },
  data: function () {
    return {
      content: "",
      title: ""
    }
  },
   mounted () {
        this.$http.get('http://localhost:3000/documents/1?test=1',{
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        (response) => {
             console.log("sucess", response)
          response.json().then((data) => {
            this.content = data['content']
            this.title = data['titre']
          })
        }, 
        (response) => {
          console.log("error", response)
        })
    },
   methods: {
     submit: function () { 
       this.$http.post('http://localhost:3000/documents/1?test=1', { 'content' : this.content },{
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        (response) => {
          console.log("sucess", response)
        }, 
        (response) => {
          console.log("error", response)
        })
    }
   }

 }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

    
    
    
