<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

body{
  /* background-color: #c4e9c4; */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #c4e9c4 !important;
  border: 0px;
}

.md-button-green{
  background-color: #1c5d1c !important;
  color:white !important;
}

.page-container{
  height: 100vh;
    /* padding: 0; */
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.active{
  background-color: #8e9690 !important;
}

.cursor{
  cursor: pointer
}

</style>
