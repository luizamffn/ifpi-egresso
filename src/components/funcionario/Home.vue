<template>
  <my-base>
    <div slot="my-content">
      <!-- <my-conteudo></my-conteudo> -->
      Bem vido ao Sistema de Egresso do IFPI, {{pessoa.nome}}
    </div>
  </my-base>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/BaseFuncionario.vue'
// import Conteudo from '../home/Conteudo.vue'

export default{
  data() {
    return {
      pessoa: {}
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
        });
    })
    .catch((error) => {
        console.log("Erro ao recuperar usuario: ", error);
    });

    // const pessoa = db.collection('pessoa').doc(usuario.pessoa_uid);
    // const db = firebase.firestore();
    // this.currentUser = firebase.auth().currentUser;
    // db.collection('usuario')
    //   .get()
    //   .then(snap => {
    //     const testCollection = [];
    //     snap.forEach(doc => {
    //       testCollection.push({ [doc.id]: doc.data() });
    //     });
    //     this.testCollection = testCollection;
    //   });
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
    // 'my-conteudo': Conteudo
  },
}
</script>
