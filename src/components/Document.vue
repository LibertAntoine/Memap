<template>

<div>
    <div id="menu-option">
     <router-link id="btn-menu" class="ui button left labeled icon" tag="button" :to="{name:'DocumentList'}"><i class="left arrow icon"></i>Retour à la liste des documents</router-link>
    </div>
   <div class='btn-title' v-if="!renameState"  @mouseover="hover = true" @mouseleave="hover = false"><h2 class="doc-title"> {{title}} <button class="ui button title-button" v-if="hover" @click="renameState = true">Modifier</button> </h2></div>
   <div class='btn-title' v-else><input class="doc-title" v-model="titleRename" @keypress.enter="rename" /><button class="ui button title-button" @click="noRemane">Annuler</button></div>
   <div class='content'>
     <tinymce :InitalContent="content" :uuid="uuid"></tinymce>
   </div>
</div>

</template>
<script>
 import tinymce from './TinyMCE.vue'

 export default {
   name: 'document',
   components:{
     tinymce
   },
  data: function () {
    return {
      title: "",
      titlerename: "",
      content: "",
      uuid: "",

      hover: false,
      renameState: false
    }
  },
   mounted () {
     this.loadDocument();
     
    },
   methods: {
     loadDocument: function () {
      this.$http.get('http://localhost:3000/document/' + this.$route.params.id ,{
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        (response) => {
            response.json().then((data) => {
            this.title = data.document.title
            this.titleRename = data.document.title
            this.content = data.document.content
            this.uuid = data.document.uuid
          })
        }, 
        (response) => {
          console.log("error", response)
        })
     },
     rename: function () {
      if(this.title != this.titleRename) {
        this.title = this.titleRename;
        this.$http.put('http://localhost:3000/document/',
        {
          'title' : this.title,
          'uuid' : this.uuid
        },
        {
            headers: {
              'Authorization': 'Bearer test_TOKEN123'
            }
          }).then(
          () => {
              this.renameState = false;
          }, 
          (response) => {
            console.log("error", response)
          })
      }
    },
      noRemane: function () {
        this.titleRename = this.title;
        this.renameState = false;
    }
       

   }
 }
</script>

<style>
.content {
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 20px;
  margin-bottom: 200px;
  text-align: left;
}


#menu-option {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align:left;
  padding-left: 20px;
}

.btn-title {
  position:relative;
}

.doc-title {
text-align:center;
}

.title-button {
  position:absolute; 
  right: 10%;
}

</style>