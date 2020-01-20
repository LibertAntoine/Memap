<template>
   <div>
     <editor id="document" ref="tm"
       api-key="fhq53ixwnobrri76unqbgc0g4846l3mi4s8aj4f30vemgrar"
       :initialValue="InitalContent"
        v-model="content"
        model-events="change keydown blur focus paste"
        @onKeyUp="submit"
        @onInit="initEventEditor"
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
     'editor': Editor,
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
   created() {
     this.content = this.InitalContent;
    },
    mounted() {
    },
   methods: {
     submit: function () { 
       this.update = false;
        if(this.content == "") {
          this.content = '<p id="' + this.$uuid.v4() + '" class="mce"></p>'
        }

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
    },



    initEventEditor: function () {
      this.$refs.tm.editor.once("newblock", this.identifyBlock)
      this.$refs.tm.editor.once("pastepostprocess", this.identifyPaste)
    },
    identifyBLock: function (e) {
      e.target.dom.setAttribs(e.newBlock, {'id' : this.$uuid.v4(), 'class' : 'mce'} );
      this.$refs.tm.editor.once("newblock", this.identifyBlock)
    },
    identifyPaste: function (e) {
      let elements = e.node.getElementsByTagName("*")
      for(var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('id', this.$uuid.v4())
      elements[i].setAttribute('class', 'mce')
      this.$refs.tm.editor.once("pastepostprocess", this.identifyPaste)
      }
    }

   }

 }
</script>

<style>
</style>

    
    
    
