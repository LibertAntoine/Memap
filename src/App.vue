<template>
   <div id="app">
      <div><p>Bienvenue sur votre Mock.</p></div>
      <router-view />
   </div>
</template>

<script>

 export default {
   name: 'app',
    data: function () {
    return {
        v4: this.$uuid.v4()
    };
  }
 };
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
	background-color: white;
}
</style>
