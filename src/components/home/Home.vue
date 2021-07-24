<template>
  <my-base>
    <div slot="my-content">
      <my-conteudo v-if="perfil == 'aluno'"></my-conteudo>
      <span v-if="perfil != 'aluno'">Bem vido ao Sistema de Egresso do IFPI, {{pessoa.nome}}</span>

    </div>
  </my-base>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/Base.vue'
import Conteudo from '../home/Conteudo.vue'

export default{
  data() {
    return {
      pessoa: {},
      perfil:''
    };
  },
  mounted() {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("usuario").where("auth_uid", "==", currentUser.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            this.recuperarPessoa(doc.data());
            this.perfil = doc.data().perfil;
        });
    })
    .catch((error) => {
        console.log("Erro ao recuperar usuario: ", error);
    });

  },
  methods: {
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
    'my-base': Base,
    'my-conteudo': Conteudo
  },
}
</script>

<style lang="scss" scoped>
  span {
    padding: 16px !important;
    background-color: #c4e9c4 !important;
    width: 200px !important;
    height: 200px !important;
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
</style>
