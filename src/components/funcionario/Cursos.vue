<template>
  <my-base>
    <div slot="my-content">
      <div>
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title">Cursos</h1>
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
              <md-input placeholder="Pesquisar por nome..." v-model="search" @input="searchOnTable" />
            </md-field>
          </md-table-toolbar>

          <md-table-empty-state
            md-label="Nenhum curso encontrado"
            :md-description="`Nenhum curso encontrado para esta consulta '${search}'. Tente um nome de curso diferente.`">
            <!-- :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`"> -->
            <!-- <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button> -->
          </md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Sequencia" md-sort-by="id" md-numeric class="cursor" v-on:click.native="curso_detail(item)">{{ item.id }}</md-table-cell>
            <md-table-cell md-label="Nome" md-sort-by="descricao" class="cursor" v-on:click.native="curso_detail(item)">{{ item.descricao }}</md-table-cell>
            <md-table-cell md-label="Nível" md-sort-by="nivel" class="cursor" v-on:click.native="curso_detail(item)">{{ item.nivel }}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>

      <md-button class="md-fab md-primary" id="botao_adicionar" @click="showDialog=true">
        <md-icon>add</md-icon>
      </md-button>

      <md-dialog :md-active.sync="showDialog">
        <md-card>
          <md-card-header>
            <div class="md-title">Adicionar Curso</div>
          </md-card-header>

          <form @submit.prevent="validateCurso">
            <md-card-content>
                <md-card-content>
                  <div class="md-layout md-gutter" id="cadastro">
                    <div class="md-layout-item md-size-70">
                      <md-field :class="getValidationClass('descricao')">
                        <label>Descricao</label>
                        <md-input v-model="curso.descricao"></md-input>
                        <span class="md-error" v-if="!$v.curso.descricao.required">Campo obrigatório</span>
                        <span class="md-error" v-else="!$v.curso.descricao.descricaoValida">Descricao já existe</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-70">
                      <md-field :class="getValidationClass('nivel')">
                        <label>Nível</label>
                        <md-select v-model="curso.nivel" name="nivel">
                          <md-option value="tecnico">Técnico</md-option>
                          <md-option value="medio_integrado">Médio Integrado</md-option>
                          <md-option value="tecnologo">Técnologo</md-option>
                          <md-option value="bacharel">Bacharel</md-option>
                          <md-option value="licenciatura">licenciatura</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.curso.nivel.required">Campo obrigatório</span>
                      </md-field>
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions>
              <md-button class="md-raised md-primary" v-on:click="showDialog = false">Fechar</md-button>
              <md-button class="md-raised md-primary" type="submit">Salvar</md-button>
            </md-card-actions>
          </form>
        </md-card>
      </md-dialog>

    </div>
  </my-base>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/Base.vue'

import { validationMixin } from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

const toLower = text => {
  return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.descricao).includes(toLower(term)))
  }

  return items
}

export default {
  mixins: [validationMixin],
  data: () => ({
    search: null,
    searched: [],
    cursos:[],
    showDialog: false,
    curso:{descricao: "", nivel: ""},
    descricaoValida: false
  }),
  validations: {
    curso: {
      descricao: {
        required,
        descricaoValida(value) {
            this.validarDescricaoCurso(value)
            return this.descricaoValida
          }
      },
      nivel: {
        required
      },
    }
  },
  mounted() {
    console.log(localStorage.getItem('cursos'));

    if(localStorage.getItem('perfil_usuario') == 'admin'){
      this.recuperarCursos()
    }else{
      this.recuperarFuncionario();
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
            that.recuperarCurso(doc.data().curso_uid)
          });
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });
    },
    recuperarCurso :function(curso_uid) {
      var that = this;

      const db = firebase.firestore();
      db.collection("curso").doc(curso_uid)
      .get()
      .then((doc) => {
        var curso = {id: that.cursos.length +1, uid: doc.id, descricao: doc.data().descricao, nivel: doc.data().nivel}
        if(curso.nivel == 'tecnologo'){ curso.nivel = 'Tecnólogo'}
        else if(curso.nivel == 'medio_integrado'){ curso.nivel = 'Médio integrado'}
        else if(curso.nivel == 'tecnico'){ curso.nivel = 'Técnico'}
        else if(curso.nivel == 'bacharel'){ curso.nivel = 'Bacharel'}
        else if(curso.nivel == 'licenciatura'){ curso.nivel = 'Licenciatura'}

        that.cursos.push(curso);
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });
    },
    recuperarCursos (){
      var that = this;

      const db = firebase.firestore();
      db.collection('curso')
        .get()
        .then(snap => {
          snap.forEach(doc => {
            var curso = {id: that.cursos.length +1, uid: doc.id, descricao: doc.data().descricao, nivel: doc.data().nivel}
            if(curso.nivel == 'tecnologo'){ curso.nivel = 'Tecnólogo'}
            else if(curso.nivel == 'medio_integrado'){ curso.nivel = 'Médio integrado'}
            else if(curso.nivel == 'tecnico'){ curso.nivel = 'Técnico'}
            else if(curso.nivel == 'bacharel'){ curso.nivel = 'Bacharel'}
            else if(curso.nivel == 'licenciatura'){ curso.nivel = 'Licenciatura'}

            that.cursos.push(curso);
          });
        });
    },

    getValidationClass (fieldName) {
      const field = this.$v.curso[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateCurso () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
          this.salvar_curso()
      }
    },
    salvar_curso () {
      const db = firebase.firestore();

      db.collection('curso').add({
        descricao: this.curso.descricao,
        nivel: this.curso.nivel
      }).then(() => {
        window.alert('Curso Cadastrado Com sucesso!')
      })
      .catch((error) => {
        window.alert('O curso não foi Cadastrado!')
      });;

    },
    validarDescricaoCurso (descricao){
      var that = this
      const db = firebase.firestore();

      db.collection("curso").where("descricao", "==", descricao)
      .get()
      .then((querySnapshot) => {
        if(querySnapshot.docs.length == 0){
          that.descricaoValida = true
        }else{
          that.descricaoValida = false
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar usuario: ", error);
      });
    },
    searchOnTable () {
      this.searched = searchByName(this.cursos, this.search)
    },
    curso_detail : function(curso){
      localStorage.setItem('title', 'cursos')
      localStorage.setItem('curso_uid', curso.uid)
      // this.$bus.$emit('aluno', {name:'foo'})
      window.location.replace('/curso/detalhes')
    },
  },
  created () {
    this.searched = this.cursos
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
    margin: 20px;
  }
  button#botao_adicionar{
    // min-width: 56px;
    margin: 20px;
    position: absolute;
    right: 0;
    bottom: 0;
    // opacity: 0;
  }

  .md-gutter#cadastro{
    justify-content:center;
  }

</style>
