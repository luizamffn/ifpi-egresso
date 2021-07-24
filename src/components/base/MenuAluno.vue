<template>
  <md-list>
    <a href="" v-on:click.prevent="home_page()">
      <md-list-item v-bind:class="[title == 'home' ? 'active' : '']">
        <md-icon>home</md-icon>

        <span class="md-list-item-text">Página Inicial</span>
      </md-list-item>
    </a>

    <a href="" v-on:click.prevent="exibir_configuracoes()">
      <md-list-item>
        <md-icon>settings</md-icon>
        <span class="md-list-item-text">Configurações</span>
      </md-list-item>
    </a>
  </md-list>
</template>

<script>
export default{
  data () {
    return {
      title: '',
      // user : {username: "", email: ""}
    }
  },
  mounted () {
    console.log(localStorage.getItem('title'));
    this.title = localStorage.getItem('title')
    // this.user.username = localStorage.getItem('username')
  },
  methods: {
    home_page: function() {
      localStorage.setItem('title', 'home')
      window.location.replace('/home')
    },
    exibir_configuracoes: function() {
      localStorage.setItem('title', 'configuracoes')
      window.location.replace('/configuracoes')
    },
  }
}
</script>

<style scoped>

</style>
