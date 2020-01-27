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
         content_css : '/mce_style.css, https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css',
         extended_value_elements:'div[data-options], ref',
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
       let refRegex = /<div ref/g;
       //[a-z0-9A-Z/:%_+.,?!<> @&=-]+<div class="reEnd"><\/div><\/div>
       //let copyContent = this.content;
        var refs = this.content.match(refRegex);
       console.log(refs)
       console.log(this.content)
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
       this.checkRef2()
      }
    },

     checkRef2 : function () {
        let urlRegex = /(https?:\/\/[a-z0-9A-Z/:%_+.,?!@&=-]+)#([a-z0-9A-Z/:%_+.,?!@&=-]+)/g;
        var refs = [...this.content.matchAll(urlRegex)];
        for (const ref of refs) {
          var loader = this.$refs.tm.editor.dom.create('img', {'src' : this.loader, 'height' : '100'})
          let element = this.$refs.tm.editor.dom.$('p:contains("' + ref[0] + '")')
          element.replaceWith(loader);
          if(ref[0].match(window.location.origin + '/Document/')) { 
            this.searchIntern(loader, ref)
          } else {
            this.searchExtern(loader, ref)
          }
        }
    },

    createNoUrlRef: function (ref, response) {
      return this.$refs.tm.editor.dom.create('div', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noUrl mceNonEditable', 'contenteditable' : 'false'}, response.body.message)
    },
    createNoIdRef: function (ref, response) {
      return this.$refs.tm.editor.dom.create('ref', {'refUrl' : ref[1], 'refId' : ref[2], 'class': 'mce noIdRef mceNonEditable', 'contenteditable' : 'false'}, response.body.message) 
    },
    createRef: function (ref, response) {
      var urlDisplay = this.$refs.tm.editor.dom.create('div', {'class' : 'urldisplay no-hover'}, '<p class="urlButton"></p>');
              var urlLink = this.$refs.tm.editor.dom.create('button', {'class' : 'ui button refSource refButton'}, '#' + ref[1]);
              var suppButton = this.$refs.tm.editor.dom.create('button', {'class' : 'ui button refSupButton refButton'}, '<i class="x icon"></i>');
              
              this.$refs.tm.editor.dom.bind(suppButton, 'click', (e) => {
                e.toElement.parentNode.parentNode.parentNode.remove();
              });
              this.$refs.tm.editor.dom.bind(urlLink, 'click', () => {window.open(ref[0])
              });
              urlDisplay.firstChild.appendChild(urlLink);
              urlDisplay.firstChild.appendChild(suppButton);
              
              var visionDisplay = this.$refs.tm.editor.dom.create('div', {'class' : ' versionDisplay no-hover'});
        
              if(!response.body.updated) {
                  visionDisplay.classList.add('blue');
              } else {
                  visionDisplay.classList.add('orange');
                  this.$refs.tm.editor.dom.bind(visionDisplay, 'click', () => {
                      console.log('hello');
                  });
              }
              
              var referencetext = this.$refs.tm.editor.dom.create('div', {'class' : 'referenceText'}, response.body.content);
              var referenceContent = this.$refs.tm.editor.dom.create('div', {'data-refurl' : ref[1], 'data-refid' : ref[2], 'class': 'mce ref mceNonEditable', 'contenteditable' : 'false'})
              var referenceEnd = this.$refs.tm.editor.dom.create('div', {'class' : 'refEnd'})
              this.$refs.tm.editor.dom.bind(referenceContent, 'mouseenter', (e) => {
                e.toElement.childNodes[0].classList.toggle('no-hover');
                e.toElement.childNodes[1].classList.toggle('no-hover');
              });
              this.$refs.tm.editor.dom.bind(referenceContent, 'mouseleave', (e) => {
                e.fromElement.childNodes[0].classList.toggle('no-hover');
                e.fromElement.childNodes[1].classList.toggle('no-hover');
              });
              referenceContent.appendChild(urlDisplay);
              referenceContent.appendChild(visionDisplay);
              referenceContent.appendChild(referencetext);
              referenceContent.appendChild(referenceEnd);
              return referenceContent;
       },

    searchIntern: function(loader, ref) {
          let refRegex = /\/([a-z0-9A-Z:%_+.,?!@&=-]+)#/;
          var idPageRef = ref[0].match(refRegex);
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
            this.addReference(loader, ref, response)
          }, 
          (response) => {
            console.log("error", response)
          })
    },

    searchExtern: function(loader, ref) {
          this.$http.post('http://localhost:3000/reference',
          {
          'uuidPage' : this.uuid,
          'url' : ref[1],
          'idRef' : ref[2],
          }
         ,{
            headers: {
              'Authorization': 'Bearer test_TOKEN123'
            }
          }).then(
          (response) => {
            this.addReference(loader, ref, response)
          }, 
          (response) => {
            console.log("error", response)
          })
    },

    addReference(loader, ref, response) {
            var reference;
            if(response.body.state == 'noUrl') {
              reference = this.createNoUrlRef(ref, response)
            } else if (response.body.state == 'noIdRef') {
              reference = this.createNoIdRef(ref, response)
            } else {
              reference = this.createRef(ref, response)
            }
            loader.replaceWith(reference);
            this.submit()
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

    
    
    
