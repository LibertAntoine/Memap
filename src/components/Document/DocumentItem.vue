<template>
      <li @mouseover="hover = true" @mouseleave="hover = false" >
       <router-link v-if="!renameState" tag="a" :to="{name:'Document', params: { id: document.uuid }}">
       {{ document.title }}
       </router-link>
        <input v-else v-model="title" @keypress.enter="rename"  type="text"/>
        <button class="ui button" v-if="hover && !renameState" @click="renameState = true">Renommer</button>
        <button class="ui button" v-if="hover && !renameState" @click="del" >Supprimer</button>
        <button class="ui button" v-if="renameState" @click="noRename" >Annuler</button>
      </li>
</template>

<script>
 export default {
   name: 'DocumentItem',
   props: {
     document : {},
   },
  data: function () {
    return {
      hover: false,
      renameState: false,
      title: this.document.title
    }
  },
   mounted () {
   },
  methods: {
    del: function () {
      this.$http.delete('http://localhost:3000/document/' + this.document.uuid,
       {
          headers: {
            'Authorization': 'Bearer test_TOKEN123'
          }
        }).then(
        () => {
          this.$destroy();
          this.$el.parentNode.removeChild(this.$el);
        }, 
        (response) => {
          console.log("error", response)
        })
    },
    rename: function () {
      if(this.title != this.document.title) {
        this.document.title = this.title;
        this.$http.put('http://localhost:3000/document/',
        {
          'title' : this.document.title,
          'uuid' : this.document.uuid
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
      noRename: function () {
        this.title = this.document.title;
        this.renameState = false;
    }










  }

 }
</script>

<style>

</style>