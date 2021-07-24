<template>
  <my-base>
    <div slot="my-content">
      <div>
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title">Alunos</h1>
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
              <md-input placeholder="Pesquisar por nome..." v-model="search" @input="searchOnTable" />
            </md-field>
          </md-table-toolbar>

          <md-table-empty-state
            md-label="Nenhum aluno encontrado"
            :md-description="`Nenhum usuário encontrado para esta consulta '${search}'. Tente um nome de aluno diferente.`">
            <!-- :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`"> -->
            <!-- <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button> -->
          </md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Sequencia" md-sort-by="id" md-numeric class="cursor" v-on:click.native="aluno_detail(item)">{{ item.id }}</md-table-cell>
            <md-table-cell md-label="Nome" md-sort-by="nome" class="cursor" v-on:click.native="aluno_detail(item)">{{ item.nome }}</md-table-cell>
            <md-table-cell md-label="CPF" md-sort-by="cpf" class="cursor" v-on:click.native="aluno_detail(item)">{{ item.cpf }}</md-table-cell>
            <md-table-cell md-label="Email" md-sort-by="email" class="cursor" v-on:click.native="aluno_detail(item)">{{ item.email }}</md-table-cell>
            <!-- <md-table-cell md-label="Ações">
              <a href="" v-on:click.prevent="exibir_alunos()">
                  <md-icon>edit</md-icon>
              </a>
              <a href="" v-on:click.prevent="exibir_alunos()">
                  <md-icon>delete</md-icon>
              </a>
            </md-table-cell> -->
            <!-- <md-table-cell md-label="Job Title" md-sort-by="title">{{ item.title }}</md-table-cell> -->
          </md-table-row>
        </md-table>
      </div>
    </div>
  </my-base>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/Base.vue'

const toLower = text => {
  return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.nome).includes(toLower(term)))
  }

  return items
}

export default {
  name: 'TableSearch',
  data: () => ({
    search: null,
    searched: [],
    alunos:[],
  }),
  mounted() {
    var that = this;
    // console.log("aki");
    if(localStorage.getItem('perfil_usuario') == 'admin'){
      that.recuperarAlunos();
    }else{
      that.recuperarFuncionario();
    }
  },
  methods: {
    recuperarFuncionario :function() {
      var that = this;

      const db = firebase.firestore();
      db.collection('funcionario').where('pessoa_uid', '==', localStorage.getItem('pessoa_logada_uid'))
        .get()
        .then(snap => {
          that.recuperarCursoFuncionario(snap.docs[0].id)
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });
    },
    recuperarCursoFuncionario :function(funcionario_uid) {
      var that = this;

      const db = firebase.firestore();
      db.collection('cursoFuncionario').where('funcionario_uid', '==', funcionario_uid)
        .get()
        .then(response => {
          response.forEach(doc => {
            that.recuperarMatriculaPorCurso(doc.data().curso_uid)
          });
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });
    },
    recuperarMatriculaPorCurso :function(curso_uid) {
      var that = this;

      const db = firebase.firestore();
      db.collection('matricula').where('curso_uid', '==', curso_uid)
        .get()
        .then(response => {
          response.forEach(doc => {
            that.recuperarAluno(doc.data().aluno_uid)
          });
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });
    },
    recuperarAluno :function(aluno_uid) {
      var that = this;

      const db = firebase.firestore();
      db.collection("aluno").doc(aluno_uid)
      .get()
      .then((response) => {
        var aluno = {id: '', email: '', aluno_uid: '', nome: ''}
        aluno.aluno_uid = response.id;
        console.log(response.data())
        that.recuperarPessoa(response.data().pessoa_uid, aluno)
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });
    },
    recuperarAlunos :function() {
      var that = this;

      const db = firebase.firestore();
      db.collection('aluno')
        .get()
        .then(snap => {
          snap.forEach(doc => {
            var aluno = {id: '', email: '', aluno_uid: '', nome: ''}
            aluno.aluno_uid = doc.id;
            that.recuperarPessoa(doc.data().pessoa_uid, aluno)
          })
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });
    },
    recuperarPessoa : function(pessoa_uid, aluno){
      var that = this;

      const db = firebase.firestore();
      db.collection("pessoa").doc(pessoa_uid)
      .get()
      .then((response) => {
              aluno.cpf = response.data().cpf;
              aluno.email = response.data().email;
              aluno.nome = response.data().nome;
              aluno.id = that.alunos.length + 1;
              that.alunos.push(aluno);
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });

    },
    aluno_detail : function(aluno){
      localStorage.setItem('title', 'aluno')
      localStorage.setItem('aluno_uid', aluno.aluno_uid)
      window.location.replace('/aluno/detalhes')
    },
    newUser () {
      window.alert('Noop')
    },
    searchOnTable () {
      this.searched = searchByName(this.alunos, this.search)
    }
  },
  created () {
    this.searched = this.alunos
  },
  components: {
    'my-base': Base,
  },
}
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
  .md-table, .md-table-row {
    background-color: #c4e9c4 !important;
    // margin: 20px;
  }

  table{
    text-align: left !important;
    // padding-left: 24px;

  }

</style>
