<template>

<div>
   <router-link class="ui button" tag="button" :to="{name:'DocumentList'}">Retour à la liste des documents</router-link>
   <div v-if="!renameState"  @mouseover="hover = true" @mouseleave="hover = false"><h2> {{title}} <button class="ui button" v-if="hover" @click="renameState = true">Modifier</button></h2></div>
   <div v-else><input v-model="titleRename" @keypress.enter="rename" /><button class="ui button" @click="noRemane">Annuler</button></div>
   <div v-if="!edition">
     <tinymce :InitalContent="content" :uuid="uuid"></tinymce>
    <button class="ui button" @click="endEdit">Terminer la modification</button>
   </div>
   <div v-else >
     <div v-html="content"></div>
     <button class="ui button" @click="edition = false">Modifier le document</button>
   </div>
</div>

</template>
<script>
 import tinymce from './TinyMCE.vue'

 export default {
   name: 'document',
   componants:{
     tinymce
   },
  data: function () {
    return {
      title: "",
      titlerename: "",
      content: "",
      uuid: "",
      edition: true,
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
              console.log("title bien modifié")
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
    },
          endEdit: function () {
        this.loadDocument();
        this.edition = true;
    }

   }
 }
</script>

<style>

</style>