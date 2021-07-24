<template>
    <!-- <md-avatar class="md-avatar-icon md-large">
      <img src="../../assets/icon.png">
    </md-avatar> -->
    <div>
      <span class="md-title" v-if="title == 'home'">Página Inicial</span>
      <span class="md-title" v-else-if="title == 'alunos'">Alunos</span>
      <span class="md-title" v-else-if="title == 'cursos'">Cursos</span>
      <span class="md-title" v-else-if="title == 'relatorios'">Relatórios</span>
      <span class="md-title" v-else-if="title == 'configuracoes'">Configurações</span>
    </div>
</template>

<script>
export default{
  data () {
    return {
      title: '',
    }
  },
  mounted () {
    console.log(localStorage.getItem('title'));
    this.title = localStorage.getItem('title')
  },
}
</script>

<style scoped>

</style>
