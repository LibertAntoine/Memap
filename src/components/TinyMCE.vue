<template>
   <div>
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
         content_css : '/mce_style.css',
         extended_value_elements:'div[refUrl|refId]',
         importcss_append: true,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor',
           'searchreplace visualblocks code fullscreen noneditable',
           'insertdatetime media table paste code help wordcount importcss'
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
 import loader from '../assets/loader.gif'
 import '../../public/mce_style.css'


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
      update: true,
      loader: loader
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
        let urlRegex = /(https?:\/\/[a-z0-9A-Z/:%_+.,?!@&=-]+)#([a-z0-9A-Z/:%_+.,?!@&=-]+)/;
        let refRegex = /\/([a-z0-9A-Z:%_+.,?!@&=-]+)#/;
        var ref = this.content.match(urlRegex);
        if(ref != null) {
        var loader = this.$refs.tm.editor.dom.create('img', {'src' : this.loader, 'height' : '100'})
        let element = this.$refs.tm.editor.dom.$('p:contains("' + ref[0] + '")')
        element.replaceWith(loader)
        console.log(ref)
        if(ref[0].match(window.location.origin + '/Document/')) {
          console.log("intern")   
          var idPageRef = ref[0].match(refRegex);
          console.log(idPageRef)
          this.$http.post('http://localhost:3000/reference/intern',
          {
          'uuidPage' : this.uuid,
          'url' : ref[1],
          'idPageRef' : idPageRef[1],
          'idRef' : ref[2],
          }
        ,{
            headers: {
              'Authorization': 'Bearer test_TOKEN123'
            }
          }).then(
          (response) => {
            var reference;
            if(response.body.state == 'noUrl') {
              reference = this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noUrl mceNonEditable', 'contenteditable' : 'false'}, response.body.message)
            } else if (response.body.state == 'noIdRef') {
              reference = this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noIdRef mceNonEditable', 'contenteditable' : 'false'}, response.body.message) 
            } else {
              reference = this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce ref mceNonEditable', 'contenteditable' : 'false'}, response.body.content)
            }
            loader.replaceWith(reference);
            this.submit()
          }, 
          (response) => {
            console.log("error", response)
          })
        } else {
          this.$http.post('http://localhost:3000/reference',
          {
          'uuidPage' : this.uuid,
          'url' : ref[1],
          'idRef' : ref[2],
          }
        , {
            headers: {
              'Authorization': 'Bearer test_TOKEN123'
            }
          }).then(
          (response) => {
            var reference;
            if(response.body.state == 'noUrl') {
              reference = this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noUrl mceNonEditable', 'contenteditable' : 'false'}, response.body.message)
            } else if (response.body.state == 'noIdRef') {
              reference = this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noIdRef mceNonEditable', 'contenteditable' : 'false'}, response.body.message) 
            } else {
              reference = this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce ref mceNonEditable', 'contenteditable' : 'false'}, response.body.content)
            }
            loader.replaceWith(reference);
            this.submit()
          }, 
          (response) => {
            console.log("error", response)
          })
        }
        




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

<!-- See also public/mce_style.css for tinyMCE content style configuration -->
<style>
.document {
  margin: 30px;
  width: 80%;
}



</style>

    
    
    
