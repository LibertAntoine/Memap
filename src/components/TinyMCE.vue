<template>
   <div>
    <iframe id="inlineFrameExample"
        title="Inline Frame Example"
        width="300"
        height="200"
        src="https://fr.wikipedia.org/wiki/Trait_italien#footer">
    </iframe>

     <editor id="document" ref="tm"
       api-key="fhq53ixwnobrri76unqbgc0g4846l3mi4s8aj4f30vemgrar"
       :initialValue="InitalContent"
        v-model="content"
        model-events="change keydown blur focus paste"
        @onKeyUp="submit"
        @onKeyDown="checkRef"
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
    checkRef: function (e) {
      if(e.keyCode === 13) {
        let urlRegex = /((https?):\/\/[a-z0-9A-Z/:%_+.,?!@&=-]+#[a-z0-9A-Z/:%_+.,?!@&=-]+)/;
        console.log('canrd')
       this.$http.get('https://fr.wikipedia.org/wiki/Trait_italien#footer').then(
        (response) => {
          console.log(response)
        }, 
        (response) => {
          console.log("error", response)
        })
        if(this.content.search(urlRegex) != -1) {
          //this.content = this.content.replace(urlRegex, "canard:$1");
        }
      }
    },



    initEventEditor: function () {
      this.$refs.tm.editor.once("newblock", this.identifyBlock)
      this.$refs.tm.editor.once("pastepostprocess", this.identifyPaste)
    },
    identifyBlock: function (e) {
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

    
    
    
