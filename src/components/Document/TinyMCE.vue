<template>
    <div>
      <div class="edit-option" v-if="edition">
        <button class="ui button primary btn-edit-top" @click="EV_endEdit">Terminer la modification</button>
      </div>
     <div class="edit-option" v-else>
        <button class="ui button primary btn-edit-top" @click="EV_startEdit">Modifier le document</button>
     </div>

     <editor id="document" ref="tm"
       api-key="fhq53ixwnobrri76unqbgc0g4846l3mi4s8aj4f30vemgrar"
       :initialValue="InitalContent"
        v-model="content"
        model-events="change keydown blur focus paste"
        @onChange="submit"
        @onKeyDown="keyDown"
        @onInit="initEventEditor"
        :init="{
         setup:setupMce,
         height:800,
         menubar: true,
         content_css : '/mce_style.css, https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css',
         extended_value_elements:'+@[data-options]',
         importcss_append: true,
         plugins: [
           'charmap casechange bbcode advlist emoticons autolink codesample lists link image charmap print preview anchor reference',
           'searchreplace visualblocks code fullscreen formatpainter noneditable checklist',
           'insertdatetime media table paste code template visualblocks help wordcount searchreplace importcss advtable'
         ],
         toolbar:
           'undo redo | formatselect | reference | bold italic backcolor | visualblocks | template | searchreplace | imagetools | formatpainter | emoticons | codesample | checklist |\
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help | charmap',
       }"
       ></editor>
      <div class="edit-option" v-if="edition">
        <button class="ui button primary btn-edit" @click="EV_endEdit">Terminer la modification</button>
      </div>
     <div class="edit-option" v-else>
        <button class="ui button primary btn-edit" @click="EV_startEdit">Modifier le document</button>
     </div>
     </div>
</template>

<script>
 import Editor from '@tinymce/tinymce-vue'
 import '../../../public/mce_style.css'
 import autoSave from '@/services/tinyMce/mce_autoSave.js'
 import EV from '@/services/tinyMce/mce_eventManager.js'
 import ref from '@/services/tinyMce/mce_referenceManager.js'

 export default {
   name: 'tinymce',
   mixins: [EV],
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
      update: true,
      edition: true,
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

       let refRegex = /<div [a-z0-9A-Z/:%_+.,?! @&"'=-]+ data-refurl="([a-z0-9A-Z/:%_+.,?!@&=-]+)" data-refid="([a-z0-9A-Z/:%_+.,?!@&=-]+)">[^*]+?<div class="refEnd">[^*]+?<\/div>[^*]+?<\/div>/g;
       let copyContent = this.content;
       copyContent = copyContent.replace(refRegex, '$1#$2');

       autoSave.save(this, copyContent);
    },
    keyDown: function (e) {
    if(e.keyCode === 13) {
       ref.checkRef(this)
      }
    },
    setupMce: async function () {
      ref.addRefPlugin(this);
    },
    initEventEditor: function () {
      this.EV_endEdit()
      this.$refs.tm.editor.once("newblock", this.identifyBlock)
      this.$refs.tm.editor.once("pastepostprocess", this.identifyPaste)
      this.content = this.InitalContent;
      setTimeout(() => { ref.checkRef();}, 100);
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
    },
    



   }
 }
</script>

<!-- See also public/mce_style.css for tinyMCE content style configuration -->
<style>
.document {
  margin: 30px;
  width: 80%;
}

.btn-edit {
  position:absolute;
  right: 7%;
  z-index:5;
}

.edit-option {
  margin-top : 15px;
}

.btn-edit-top {
  margin-bottom: 10px !important;
}
</style>
