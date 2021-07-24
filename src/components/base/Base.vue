<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>

      <my-title></my-title>

      <div class="md-toolbar-section-end">
        <md-button @click="sair()">Sair</md-button>
      </div>
    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <md-avatar>
          <img class="imagem" src="../../assets/LogoIFPI.png">
        </md-avatar>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            {{pessoa.nome}}
          </div>
          <div class="md-layout-item md-size-100">
            {{perfil}}
          </div>
        </div>
      </md-toolbar>

      <my-menu-aluno v-if="perfil == 'Aluno'"></my-menu-aluno>
      <my-menu-funcionario v-else></my-menu-funcionario>
    </md-drawer>

    <md-content>
      <slot name="my-content">
      </slot>
    </md-content>
  </div>
</template>

<script>
import MenuAluno from '../base/MenuAluno.vue'
import MenuFuncionario from '../base/MenuFuncionario.vue'
import Title from '../base/Title.vue'

import firebase from 'firebase';

  export default {
    data: () => ({
      showNavigation: false,
      pessoa: {},
      perfil: '',
      title: '',
    }),
    mounted() {
      console.log(localStorage.getItem('title'));
      this.title = localStorage.getItem('title')

      const currentUser = firebase.auth().currentUser;
      const db = firebase.firestore();
      const usuario = {}
      db.collection("usuario").where("auth_uid", "==", currentUser.uid)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              if(doc.data().tipo_usuario == 'admin'){
                this.perfil = 'Administrador'
              }else if(doc.data().tipo_usuario == 'aluno'){
                this.perfil = 'Aluno'
              }else if(doc.data().tipo_usuario == 'coordenador'){
                this.perfil = 'Coordenador'
              }else if(doc.data().tipo_usuario == 'professor'){
                this.perfil = 'Professor'
              }

              localStorage.setItem('perfil_usuario', doc.data().tipo_usuario)
              localStorage.setItem('pessoa_logada_uid', doc.data().pessoa_uid)

              this.recuperarPessoa(doc.data());
          });
      })
      .catch((error) => {
          console.log("Erro ao recuperar usuario: ", error);
      });
    },
    methods: {
      sair: function(){
        firebase.auth().signOut().then(() => {
          window.location.replace('/');
        })
      },
      home_page: function() {
        window.location.replace('/home')
        this.title =  'home';

      },
      recuperarPessoa : function(user){
        const db = firebase.firestore();
        db.collection("pessoa").doc(user.pessoa_uid)
        .get()
        .then((response) => {
                this.pessoa = response.data();
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });

      }
    },
    components: {
    'my-menu-aluno': MenuAluno,
    'my-menu-funcionario': MenuFuncionario,
    'my-title': Title,
    }
  }
</script>

<style lang="scss" scoped>

  .md-toolbar{
    justify-content: center;
    background-color: #1c5d1c !important;
  }
  .page-container {
    min-height: 300px;
    overflow: hidden;
    position: relative;
    // border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    // padding: 16px;
    background-color: #c4e9c4 !important;
    // width: 200px;
    // height: 200px;
    // display: inline-flex;
    // justify-content: center;
    // align-items: center;
  }

  .md-avatar{
    border-radius:0px;
  }

  .md-layout-item{
    color: white;
  }
</style>
