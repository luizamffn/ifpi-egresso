<template>
  <my-base>
    <div slot="my-content" >
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-100">
          <md-card>
            <md-card-header>


              <md-card-header-text>
                <div class="md-title">{{curso.descricao}} - {{curso.nivel}}</div>
                <!-- <div class="md-subhead">Subtitle here</div> -->
              </md-card-header-text>

              <!-- <md-button  v-on:click="atualizar_pessoa()" class="md-raised md-button-green">
                Atualizar
                <md-tooltip md-direction="left">Atualizar Dados</md-tooltip>
              </md-button> -->

            </md-card-header>

            <md-card-content class="md-scrollbar">
              <md-tabs class="" md-alignment="centered">
                <md-tab id="tab-professores" md-label="Professores">
                  <md-table v-model="professores" md-sort="nome" md-sort-order="asc" md-card :key="keyProfessores">
                    <!-- <md-table-toolbar>
                      <h1 class="md-title">Professores</h1>
                    </md-table-toolbar> -->

                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <!-- <md-table-cell md-label="ID" md-numeric>{{ item.id }}</md-table-cell> -->
                      <md-table-cell md-label="Name" md-sort-by="name">{{ item.nome }}</md-table-cell>
                      <md-table-cell md-label="CPF" md-sort-by="cpf">{{ item.cpf }}</md-table-cell>
                      <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                      <md-table-cell md-label="Telefone" md-sort-by="telefone">{{ item.telefone }}</md-table-cell>
                    </md-table-row>
                  </md-table>

                  <md-button  v-on:click="showDialog = true, cargo = 'professor'" class="md-raised md-button-green">
                    Adiconar
                    <md-tooltip md-direction="left">Adicionar Professor</md-tooltip>
                  </md-button>
                </md-tab>
                <md-tab id="tab-coordenador" md-label="Coordenador">
                  <md-table v-model="coordenadores" md-sort="nome" md-sort-order="asc" md-card :key="keyCoordenador">
                    <!-- <md-table-toolbar>
                      <h1 class="md-title">Professores</h1>
                    </md-table-toolbar> -->

                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <!-- <md-table-cell md-label="ID" md-numeric>{{ item.id }}</md-table-cell> -->
                      <md-table-cell md-label="Name" md-sort-by="name">{{ item.nome }}</md-table-cell>
                      <md-table-cell md-label="CPF" md-sort-by="cpf">{{ item.cpf }}</md-table-cell>
                      <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                      <md-table-cell md-label="Telefone" md-sort-by="telefone">{{ item.telefone }}</md-table-cell>
                    </md-table-row>
                  </md-table>

                  <md-button  v-on:click="showDialog = true, cargo = 'coordenador'" class="md-raised md-button-green">
                    Adiconar
                    <md-tooltip md-direction="left">Adicionar Coordenador</md-tooltip>
                  </md-button>
                </md-tab>
                <md-tab id="tab-alunos" md-label="Alunos">
                  <md-table v-model="alunos" md-sort="nome" md-sort-order="asc" md-card>
                    <!-- <md-table-toolbar>
                      <h1 class="md-title">Professores</h1>
                    </md-table-toolbar> -->

                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <!-- <md-table-cell md-label="ID" md-numeric>{{ item.id }}</md-table-cell> -->
                      <md-table-cell md-label="Name" md-sort-by="name">{{ item.nome }}</md-table-cell>
                      <md-table-cell md-label="CPF" md-sort-by="cpf">{{ item.cpf }}</md-table-cell>
                      <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                      <md-table-cell md-label="Telefone" md-sort-by="telefone">{{ item.telefone }}</md-table-cell>
                    </md-table-row>
                  </md-table>
                </md-tab>
              </md-tabs>
            </md-card-content>
          </md-card>

        </div>

      </div>

      <md-dialog :md-active.sync="showDialog" >
        <md-card style="width: -webkit-fill-available;display: grid;">
          <md-card-header>
            <div class="md-title" v-if="cargo == 'professor'">Adicionar Professor</div>
            <div class="md-title" v-if="cargo == 'coordenador'">Adicionar Coordenador</div>

          </md-card-header>

            <md-card-content>
                <md-card-content>
                  <div class="md-layout">

                    <div class="md-layout-item md-size-100">
                      <div class="md-layout md-alignment-center">
                        <div class="md-layout-item md-size-70">
                          <md-field>
                            <label for="matricula">Nome</label>
                            <md-input v-model="funcionario.nome" name="cpf"></md-input>
                          </md-field>
                        </div>
                      </div>
                    </div>

                    <div class="md-layout-item md-size-100">
                      <div class="md-layout md-alignment-center">
                        <div class="md-layout-item md-size-30">
                          <md-field>
                            <label for="matricula">CPF</label>
                            <md-input v-model="funcionario.cpf" name="cpf"></md-input>
                          </md-field>
                        </div>

                        <div class="md-layout-item md-size-10">
                        </div>

                        <div class="md-layout-item md-size-30">
                          <md-field>
                            <label for="matricula">Email</label>
                            <md-input v-model="funcionario.email" name="email"></md-input>
                          </md-field>
                        </div>
                      </div>
                    </div>

                    <div class="md-layout-item md-size-100">
                      <div class="md-layout md-alignment-center">
                        <div class="md-layout-item md-size-30">
                          <div class="block" style="text-align: left;">
                            <label for="dataNasc" style="position: absolute; color: #978e8e; font-size: 12px;">Data Nascimento</label>
                            <md-datepicker v-model="funcionario.data_nascimento" />
                          </div>
                        </div>

                        <div class="md-layout-item md-size-10">
                        </div>

                        <div class="md-layout-item md-size-30">
                          <md-field>
                            <label for="matricula">Telefone</label>
                            <md-input v-model="funcionario.telefone" name="telefone"></md-input>
                          </md-field>
                        </div>
                      </div>
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions style="justify-content:center">
              <md-button class="md-raised md-primary" v-on:click="showDialog = false">Fechar</md-button>
              <md-button class="md-raised md-primary" v-on:click="adicionar_profissional()">Adicionar</md-button>
            </md-card-actions>
        </md-card>
      </md-dialog>

    </div>
  </my-base>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/Base.vue'


export default{
  data() {
    return {
      curso: {},
      quantFuncionario: 0,
      keyProfessores: 0,
      professores: [],
      keyCoordenador: 0,
      coordenadores: [],
      cargo: '',
      alunos: [],
      showDialog: false,
      funcionario: {nome:'', email: '', cpf:'', telefone: '', data_nascimento:''}
    };
  },
  mounted() {
    console.log(localStorage.getItem('title'));

    this.recuperarCurso(localStorage.getItem('curso_uid'))
  },
  methods: {
    recuperarCurso :function(curso_uid) {
      var that = this;

      that.curso.uid = curso_uid;

      const db = firebase.firestore();
      db.collection('curso').doc(curso_uid)
        .get()
        .then((response) => {
          that.curso = response.data();
          that.curso.uid = response.id;

          that.cargo = 'professor';
          that.recuperarCursoFuncionario()
        })
        .catch((error) => {
            console.log("Erro ao recuperar Curso.", error);
        });
    },
    recuperarCursoFuncionario : function(){
      var that = this;

      const db = firebase.firestore();
      db.collection("cursoFuncionario").where('curso_uid', '==', that.curso.uid).where('cargo', '==', that.cargo)
      .get()
      .then(response => {
        that.quantFuncionario = response.size
        response.forEach(doc => {
          that.recuperarFuncionario(doc.data().funcionario_uid)
        });
      })
      .catch((error) => {
          console.log("Erro ao recuperar Professor: ", error);
      });
    },
    recuperarFuncionario : function(funcionario_uid){
      var that = this;

      const db = firebase.firestore();
      db.collection("funcionario").doc(funcionario_uid)
      .get()
      .then(response => {
          that.recuperarPessoa(response.data().pessoa_uid)
      })
      .catch((error) => {
          console.log("Erro ao recuperar Professor: ", error);
      });
    },
    recuperarPessoa : function(pessoa_uid){
      var that = this;

      const db = firebase.firestore();
      db.collection("pessoa").doc(pessoa_uid)
      .get()
      .then(response => {
          var pessoa = response.data()
          pessoa.uid = response.id


          if(that.cargo == 'professor'){
            that.professores.push(pessoa)
            if(that.quantFuncionario == that.professores.length){
              that.cargo = 'coordenador'
              that.recuperarCursoFuncionario()
            }
          }else if(that.cargo == 'coordenador'){
            that.coordenadores.push(pessoa)
            if(that.quantFuncionario == that.coordenadores.length){
              that.cargo = 'aluno'
              that.recuperarAlunos()
            }
          }else{
            that.alunos.push(pessoa)
          }
      })
      .catch((error) => {
          console.log("Erro ao recuperar Professor: ", error);
      });
    },
    recuperarAlunos : function(){
      var that = this;

      const db = firebase.firestore();
      db.collection("matricula").where('curso_uid', '==', that.curso.uid)
      .get()
      .then(response => {
        that.quantFuncionario = response.size
        response.forEach(doc => {
          that.recuperarAluno(doc.data().aluno_uid)
        });
      })
      .catch((error) => {
          console.log("Erro ao recuperar Alunos: ", error);
      });
    },
    recuperarAluno : function(aluno_uid){
      var that = this;

      const db = firebase.firestore();
      db.collection("aluno").doc(aluno_uid)
      .get()
      .then(response => {
          that.recuperarPessoa(response.data().pessoa_uid)
      })
      .catch((error) => {
          console.log("Erro ao recuperar Aluno: ", error);
      });
    },
    adicionar_profissional: function (){
      var that = this
      const db = firebase.firestore();

      db.collection('pessoa').add({
        nome: this.funcionario.nome,
        cpf: this.funcionario.cpf,
        email: this.funcionario.email,
        telefone: this.funcionario.telefone,
        data_nascimento: firebase.firestore.Timestamp.fromDate(new Date(this.funcionario.data_nascimento)),
        data_cadastro: firebase.firestore.Timestamp.fromDate(new Date())
      }).then((response) => {
        that.savar_funcionario(response.id)
      })
      .catch((error) => {
        // window.alert('O curso não foi Cadastrado!')
      });;
    },
    savar_funcionario: function (pessoa_uid){
      var that = this
      const db = firebase.firestore();

      db.collection('funcionario').add({
        pessoa_uid: pessoa_uid,
        data_cadastro: firebase.firestore.Timestamp.fromDate(new Date())
      }).then((response) => {
        that.savar_cursoFuncionario(response.id);
      })
      .catch((error) => {
        // window.alert('O curso não foi Cadastrado!')
      });;
    },
    savar_cursoFuncionario: function (funcionario_uid){
      var that = this
      const db = firebase.firestore();

      db.collection('cursoFuncionario').add({
        funcionario_uid: funcionario_uid,
        curso_uid: that.curso.uid,
        cargo: that.cargo,
      }).then(() => {
        if(that.cargo == 'professor'){
          that.professores.push(that.funcionario)
          that.keyProfessores += 1
        }else{
          that.coordenadores.push(that.funcionario)
          that.keyCoordenador += 1
        }

        that.funcionario = {nome:'', email: '', cpf:'', telefone: '', data_nascimento:''}
        that.showDialog = false
      })
      .catch((error) => {
        // window.alert('O curso não foi Cadastrado!')
      });;
    },
  },
  components: {
    'my-base': Base,
    // 'my-conteudo': Conteudo
  },
}
</script>

<style lang="scss" scoped>
  .md-gutter{
    margin: 20px !important;
  }

  .md-card{
    margin: 20px !important;
    // max-width: fit-content;
    max-height: 80vh;
    overflow: auto;
    // background-color: #c4e9c4 !important;
    // width: 320px;
    // margin: 4px;
    // display: inline-block;
    // vertical-align: top;
  }

</style>
