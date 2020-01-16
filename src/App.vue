<template>
   <div id="app">
      <div><p>Bienvenue sur votre Mock.</p></div>
      <button @click="showDocument">Acceder au premier document</button>
      <div v-if="doc">
            <document></document>
      </div>
   </div>
</template>

<script>
 import Document from './Document.vue'

 export default {
   name: 'app',
   components: {
     'document': Document,
   },
   data: 
     function () {
       return {
          doc: false
       }
   },
   methods: {
     showDocument: function () { 
      this.doc = true
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
