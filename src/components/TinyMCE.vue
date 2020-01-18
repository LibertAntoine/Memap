<template>
   <div>
     <editor id="document"
       api-key="fhq53ixwnobrri76unqbgc0g4846l3mi4s8aj4f30vemgrar"
       :initialValue="InitalContent"
       v-model="content"
        model-events="change keydown blur focus paste"
        @onKeyUp="submit"
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
   </div>
</template>

<script>
 import Editor from '@tinymce/tinymce-vue'

 export default {
   name: 'tinymce',
   components: {
     'editor': Editor
   },
   props:{
      InitalContent: {type: String, default: ""},
      uuid: {type: String}
   },
  data: function () {
    return {
      content: "",
      update: true
    }
  },
   mounted () {
     this.content = this.InitalContent;
    },
   methods: {
     submit: function () { 
       this.update = false;
       this.$http.put('http://localhost:3000/document/', 
       {
         'content' : this.content,
         'uuid' : this.uuid
       }
       ,{
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        () => {
          this.update = true;
        }, 
        (response) => {
          console.log("error", response)
        })
    }
   }

 }
</script>

<style>
</style>

    
    
    
