<template>
  <my-base>
    <div slot="my-content" >
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-100">
          <md-card>
            <md-card-header>


              <md-card-header-text>
                <div class="md-title">{{aluno.nome}}</div>
                <!-- <div class="md-subhead">Subtitle here</div> -->
              </md-card-header-text>

              <md-button  v-on:click="atualizar_aluno()" class="md-raised md-button-green">
                Atualizar
                <md-tooltip md-direction="left">Atualizar aluno</md-tooltip>
              </md-button>

            </md-card-header>

            <md-card-content class="md-scrollbar">
              <div class="md-layout">
                <div class="md-layout-item md-size-100">
                  <div class="md-layout md-alignment-center">
                    <div class="md-layout-item md-size-20">
                      <md-field>
                        <label for="matricula">CPF</label>
                        <md-input v-model="aluno.cpf" name="cpf"></md-input>
                      </md-field>
                    </div>

                    <div class="md-layout-item md-size-10">
                    </div>

                    <div class="md-layout-item md-size-20">
                      <md-field>
                        <label for="matricula">Email</label>
                        <md-input v-model="aluno.email" name="email"></md-input>
                      </md-field>
                    </div>
                  </div>
                </div>

                <div class="md-layout-item md-size-100">
                  <div class="md-layout md-alignment-center">
                    <div class="md-layout-item md-size-20">
                      <div class="block" style="text-align: left;">
                        <label for="dataNasc" style="position: absolute; color: #978e8e; font-size: 12px;">Data Nascimento</label>
                        <md-datepicker v-model="aluno.data_nascimento" />
                      </div>
                    </div>

                    <div class="md-layout-item md-size-10">
                    </div>

                    <div class="md-layout-item md-size-20">
                      <md-field>
                        <label for="matricula">Telefone</label>
                        <md-input v-model="aluno.telefone" name="telefone"></md-input>
                      </md-field>
                    </div>
                  </div>
                </div>


                <div class="md-layout-item md-size-100">
                  <md-divider></md-divider>
                  <h4 style="display:inline-block">Matrículas</h4>

                  <md-button @click="recuperar_cursos()" class="md-icon-button" style="float:right; background: #448aff !important; margin-top: 15px;">
                    <md-icon style="color:white !important">add</md-icon>
                    <md-tooltip md-direction="left">Adicionar Matrícula</md-tooltip>
                  </md-button>

                  <md-list :key="keyMatriculas">
                   <md-list-item md-expand :md-expanded.sync="m.expand" v-for="m in matriculas">
                     <!-- <md-icon>whatshot</md-icon> -->
                     <span class="md-list-item-text">{{m.curso_descricao}} - {{m.curso_nivel}}</span>

                     <md-list slot="md-expand">
                       <md-tabs md-alignment="centered">

                         <md-tab id="tab-home" md-label="Informações">
                           <div class="md-layout">
                             <div class="md-layout-item md-size-100">
                               <div class="md-layout md-alignment-center">
                                 <div class="md-layout-item md-size-20">
                                   <md-field>
                                     <label for="matricula">Nº Matrícula</label>
                                     <md-input v-model="m.numero_matricula" name="numero_matricula"></md-input>
                                   </md-field>
                                 </div>

                                 <div class="md-layout-item md-size-10">
                                 </div>

                                 <div class="md-layout-item md-size-20">
                                   <md-field>
                                    <md-select v-model="m.status_matricula" name="status_matricula" placeholder="Status Matrícula">
                                      <md-option value="em_andamento">Em Andamento</md-option>
                                      <md-option value="concluido">Concluído</md-option>
                                      <md-option value="cancelado">Cancelado</md-option>
                                      <md-option value="desistente">Desistente</md-option>
                                    </md-select>
                                  </md-field>
                                 </div>
                               </div>
                             </div>

                             <div class="md-layout-item md-size-100">
                               <div class="md-layout md-alignment-center">
                                 <div class="md-layout-item md-size-20">
                                   <div class="block" style="text-align: left;">
                                     <label for="dataNasc" style="position: absolute; color: #978e8e; font-size: 12px;">Data Início</label>
                                     <md-datepicker v-model="m.data_inicio" />
                                   </div>
                                 </div>

                                 <div class="md-layout-item md-size-10">
                                 </div>

                                 <div class="md-layout-item md-size-20">
                                   <div class="block" style="text-align: left;">
                                     <label for="dataNasc" style="position: absolute; color: #978e8e; font-size: 12px;">Data Conclusão</label>
                                     <md-datepicker v-model="m.data_fim" />
                                   </div>
                                 </div>
                               </div>
                             </div>

                             <div class="md-layout-item md-size-100" style="text-align:center" >
                               <md-button v-on:click="atualizar_matricula(m), showDialog=true" class="md-raised md-button-green">
                                 Atualizar
                               </md-button>
                             </div>

                           </div>
                         </md-tab>


                         <md-tab id="tab-pages" md-label="Ocupaçoes">
                           <div class="md-layout" :key="keyOcupacoes">
                             <div class="md-layout-item md-size-100" v-for="o in m.ocupacoes" >
                               <div class="md-layout md-alignment-center">
                                 <div class="md-layout-item md-size-50">
                                   <md-list-item>
                                     <md-card-header-text>
                                       <span class="md-list-item-text" v-if="o.data_fim == null">{{o.local}} iniciado em: {{o.data_inicio}}</span>
                                       <span class="md-list-item-text" v-if="o.data_fim != null">{{o.local}} ({{o.data_inicio}} até {{o.data_fim}})</span>
                                       <div class="md-subhead">Remunerado: {{o.eh_remunerado == true? "Sim": "Não"}}</div>
                                     </md-card-header-text>

                                     <md-button class="md-icon-button md-list-action">
                                       <md-icon class="md-primary">edit</md-icon>
                                     </md-button>
                                   </md-list-item>
                                 </div>
                               </div>
                             </div>

                             <div class="md-layout-item md-size-100">
                               <div class="md-layout md-alignment-center">
                                 <div class="md-layout-item md-size-50" style="text-align: center;">
                                   <md-button  v-on:click="$bus.$emit('cadastroOcupacao', {showDialogOcupacao: true, matricula_selecionada: m}), matricula_selecionada = m" class="md-raised md-button-green">
                                     Adicionar
                                     <md-tooltip md-direction="left">Adicionar Ocupação</md-tooltip>
                                   </md-button>
                                 </div>
                               </div>
                             </div>
                           </div>



                         </md-tab>
                       </md-tabs>



                     </md-list>
                   </md-list-item>
                  </md-list>

                </div>
              </div>
            </md-card-content>
          </md-card>

        </div>

      </div>

      <md-dialog :md-active.sync="showDialogMatricula" >
        <md-card style="width: -webkit-fill-available;display: grid;">
          <md-card-header>
            <div class="md-title">Adicionar Matrícula</div>
          </md-card-header>

          <form @submit.prevent="validateMatricula">
            <md-card-content>
                <md-card-content>
                  <div class="md-layout md-gutter" id="cadastroMatricula">
                    <div class="md-layout-item md-size-50">
                      <md-field :class="getValidationClass('curso_uid')">
                       <md-select v-model="matricula.curso_uid" name="curso" placeholder="Curso">
                         <md-option :value="c.uid" v-for="c in cursos">{{c.descricao}}</md-option>
                       </md-select>
                       <span class="md-error" v-if="!$v.matricula.curso_uid.required">Campo obrigatório</span>
                     </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <md-field :class="getValidationClass('numero_matricula')">
                        <label>Número Matrícula</label>
                        <md-input v-model="matricula.numero_matricula"></md-input>
                        <span class="md-error" v-if="!$v.matricula.numero_matricula.required">Campo obrigatório</span>
                        <span class="md-error" v-else="!$v.matricula.numero_matricula.numeroMatriculaValida">Descricao já existe</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <md-field :class="getValidationClass('status_matricula')">
                       <md-select v-model="matricula.status_matricula" name="status_matricula" placeholder="Status Matrícula">
                         <md-option value="em_andamento">Em Andamento</md-option>
                         <md-option value="concluido">Concluído</md-option>
                         <md-option value="cancelado">Cancelado</md-option>
                         <md-option value="desistente">Desistente</md-option>
                       </md-select>
                       <span class="md-error" v-if="!$v.matricula.status_matricula.required">Campo obrigatório</span>
                     </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <div class="block" style="text-align: left;" :class="getValidationClass('data_inicio')">
                        <label for="dataNasc" style="position: absolute; color: #978e8e; font-size: 12px;">Data Inicio</label>
                        <md-datepicker v-model="matricula.data_inicio" />
                      </div>
                      <span class="md-error" v-if="!$v.matricula.data_inicio.required">Campo obrigatório</span>
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions>
              <md-button class="md-raised md-primary" v-on:click="showDialogMatricula = false">Fechar</md-button>
              <md-button class="md-raised md-primary" type="submit">Salvar</md-button>
            </md-card-actions>
          </form>
        </md-card>
      </md-dialog>

      <my-cadastro-ocupacao></my-cadastro-ocupacao>
    </div>
  </my-base>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/Base.vue'
import cadastroOcupacao from '../funcionario/CadastroOcupacao.vue'

import { validationMixin } from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

export default{
  mixins: [validationMixin],
  data: () => ({
    aluno: {uid: '', nome: '', data_nascimento: '', email: '', cpf: '', telefone:'', pessoa_uid: ''},
    matriculas: [],
    showDialogMatricula: false,
    matricula: {aluno_uid: '', data_cadastro:'', data_fim:'' , curso_uid: '', data_inicio:'', numero_matricula:'', status_matricula:'',
                curso_descricao: '', curso_nivel: '', expand: false, ocupacoes:[]},
    numeroMatriculaValida:false,
    cursos: [],
    keyMatriculas: 0,
    keyOcupacoes: 0,
    // showDialogOcupacao: false,
    // ocupacao:{local:'', matricula_uid: '', eh_remunerado:'', data_inicio: '', data_fim: ''},
    matricula_selecionada: {},
  }),
  validations: {
    matricula: {
      numero_matricula: {
        required,
        numeroValido(value) {
            this.validarNumeroMatricula(value)
            return this.numeroMatriculaValida
          }
      },
      status_matricula: {
        required
      },
      data_inicio: {
        required
      },
      curso_uid: {
        required
      }
    },
  },
  created() {
      this.$bus.$on('adicionar_ocupacao', val =>this.adicionar_ocupacao(val))
  },
  mounted() {
    this.recuperarAluno(localStorage.getItem('aluno_uid'))
  },
  methods: {
    adicionar_ocupacao :function(ocupacao) {
      this.matricula_selecionada.ocupacoes.push(ocupacao);

      this.keyOcupacoes +=1
    },
    recuperarAluno :function(aluno_uid) {
      var that = this;

      that.aluno.uid = aluno_uid;

      const db = firebase.firestore();
      db.collection('aluno').doc(aluno_uid)
        .get()
        .then((response) => {
          that.aluno.pessoa_uid = response.data().pessoa_uid;
          that.recuperarPessoa(response.data().pessoa_uid)
        })
        .catch((error) => {
            console.log("Erro ao recuperar pessoa: ", error);
        });
    },
    recuperarPessoa : function(pessoa_uid){
      var that = this;

      const db = firebase.firestore();
      db.collection("pessoa").doc(pessoa_uid)
      .get()
      .then((response) => {
        // var date =
        that.aluno.data_nascimento = JSON.stringify(response.data().data_nascimento.toDate()).slice(1,11);
        that.aluno.nome = response.data().nome;
        that.aluno.email = response.data().email;
        that.aluno.cpf = response.data().cpf;
        that.aluno.telefone = response.data().telefone;

        that.recuperarMatriculas(that.aluno.uid)
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });

    },
    recuperarMatriculas : function(aluno_uid){
      var that = this;

      const db = firebase.firestore();
      db.collection("matricula").where('aluno_uid', '==', aluno_uid)
      .get()
      .then(response => {
        response.forEach(doc => {
          var matricula = {id: '',numero_matricula: '', curso_uid: '', data_inicio: '', data_fim: null,
                            status_matricula:'', curso_descricao: '', curso_nivel: '', ocupacoes:[], expand:false}
          matricula.id = doc.id;
          matricula.numero_matricula = doc.data().numero_matricula;
          matricula.curso_uid = doc.data().curso_uid;
          matricula.data_inicio = JSON.stringify(doc.data().data_inicio.toDate()).slice(1,11);
          if(doc.data().data_fim != null){
            matricula.data_fim = JSON.stringify(doc.data().data_fim.toDate()).slice(1,11);
          }
          matricula.status_matricula = doc.data().status_matricula;

          that.recuperarCurso(matricula)
        });
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });

    },
    recuperarCurso : function(matricula){
      var that = this;

      const db = firebase.firestore();
      db.collection("curso").doc(matricula.curso_uid)
      .get()
      .then(doc => {
          matricula.curso_descricao = doc.data().descricao;
          matricula.curso_nivel = doc.data().nivel;

          if(matricula.curso_nivel == 'tecnologo'){ matricula.curso_nivel = 'Tecnólogo'}
          else if(matricula.curso_nivel == 'medio_integrado'){ matricula.curso_nivel = 'Médio integrado'}
          else if(matricula.curso_nivel == 'tecnico'){ matricula.curso_nivel = 'Técnico'}
          else if(matricula.curso_nivel == 'bacharel'){ matricula.curso_nivel = 'Bacharel'}
          else if(matricula.curso_nivel == 'licenciatura'){ matricula.curso_nivel = 'Licenciatura'}

          that.recuperarOcupacoes(matricula);
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });

    },
    recuperarOcupacoes: function(matricula){
      var that = this;

      const db = firebase.firestore();
      db.collection("ocupacao").where('matricula_uid', '==', matricula.id)
      .get()
      .then(response => {
        response.forEach(doc => {
          var ocupacao = {uid: '', local: '', data_inicio: '', data_fim: null, eh_remunerado: ''}
          ocupacao.uid = doc.id;
          ocupacao.local = doc.data().local;
          ocupacao.data_inicio = JSON.stringify(doc.data().data_inicio.toDate()).slice(1,11);
          if(doc.data().data_fim != null){
            ocupacao.data_fim = JSON.stringify(doc.data().data_fim.toDate()).slice(1,11);
          }
          ocupacao.eh_remunerado = doc.data().eh_remunerado;

          matricula.ocupacoes.push(ocupacao);
        });
        that.matriculas.push(matricula);
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });

    },
    atualizar_aluno: function(){
      const db = firebase.firestore();

      db.collection("pessoa").doc(this.aluno.pessoa_uid).update({
          cpf: this.aluno.cpf,
          email: this.aluno.email,
          telefone: this.aluno.telefone,
          data_nascimento:firebase.firestore.Timestamp.fromDate(new Date(this.aluno.data_nascimento))
      }).then(() => {
        alert('Aluno atualizado!');
      })
      .catch((error) => {
        alert("Erro ao atualizar aluno: ", error);
      });
    },
    atualizar_matricula: function(matricula){
      const db = firebase.firestore();

      db.collection("matricula").doc(matricula.id).update({
          numero_matricula: matricula.numero_matricula,
          status_matricula: matricula.status_matricula,
          data_inicio: firebase.firestore.Timestamp.fromDate(new Date(matricula.data_inicio)),
          data_fim: matricula.data_fim != null ? firebase.firestore.Timestamp.fromDate(new Date(matricula.data_fim)):null
      }).then(() => {
        alert('Matrícula atualizada!');
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });
    },

    //Salvar Matricula
    recuperar_cursos () {
      var that = this;

      const db = firebase.firestore();
      db.collection("curso")
      .get()
      .then(response => {
        response.forEach(doc => {
          var curso = {uid: '', descricao: '', nivel: ''}
          curso.uid = doc.id;
          curso.descricao = doc.data().descricao;
          curso.nivel = doc.data().nivel;

          that.cursos.push(curso);
        });

        that.showDialogMatricula = true
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });
    },

    getValidationClass (fieldName) {
      var that = this;
      const field = that.$v.matricula[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateMatricula () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
          this.salvar_matricula()
      }
    },
    salvar_matricula () {
      var that = this
      const db = firebase.firestore();

      db.collection('matricula').add({
        aluno_uid: this.aluno.uid,
        curso_uid: this.matricula.curso_uid,
        data_cadastro: firebase.firestore.Timestamp.fromDate(new Date()),
        data_inicio: firebase.firestore.Timestamp.fromDate(new Date(this.matricula.data_inicio)),
        data_fim: null,
        numero_matricula: this.matricula.numero_matricula,
        status_matricula: this.matricula.status_matricula,
      }).then((response) => {
        // window.alert('Matricula Cadastrada Com sucesso!')

        var curso = this.cursos.filter(function (el) {
          return el.uid == that.matricula.curso_uid;
        });

        var matricula = {id: '',numero_matricula: '', curso_uid: '', data_inicio: '', data_fim: null,
                          status_matricula:'', curso_descricao: '', curso_nivel: '', ocupacoes:[], expand:false}
        matricula.id = response.id
        matricula.numero_matricula = that.matricula.numero_matricula
        matricula.curso_uid = that.matricula.curso_uid,
        matricula.data_inicio = that.matricula.data_inicio
        matricula.status_matricula = that.matricula.status_matricula,

        matricula.curso_descricao = curso[0].descricao

        if(curso[0].nivel == 'tecnologo'){ matricula.curso_nivel = 'Tecnólogo'}
        else if(curso[0].nivel == 'medio_integrado'){ matricula.curso_nivel = 'Médio integrado'}
        else if(curso[0].nivel == 'tecnico'){ matricula.curso_nivel = 'Técnico'}
        else if(curso[0].nivel == 'bacharel'){ matricula.curso_nivel = 'Bacharel'}
        else if(curso[0].nivel == 'licenciatura'){ matricula.curso_nivel = 'Licenciatura'}

        matricula.expand = false
        matricula.ocupacoes = []

        that.matriculas.push(matricula)

        that.keyMatriculas +=1;
        that.showDialogMatricula = false
      })
      .catch((error) => {
        window.alert('A matrícula não foi Cadastrado!')
      });;
    },
    validarNumeroMatricula (numero_matricula){
      var that = this
      const db = firebase.firestore();

      db.collection("matricula").where("numero_matricula", "==", numero_matricula)
      .get()
      .then((querySnapshot) => {
        if(querySnapshot.docs.length == 0){
          that.numeroMatriculaValida = true
        }else{
          that.numeroMatriculaValida = false
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar usuario: ", error);
      });
    },
  },
  components: {
    'my-base': Base,
    'my-cadastro-ocupacao': cadastroOcupacao
  },
}
</script>

<style lang="scss" scoped>
  .md-gutter{
    margin: 20px !important;
  }

  .md-card{
    margin: 20px !important;
    max-width: fit-content;
    max-height: 80vh;
    overflow: auto;
    // background-color: #c4e9c4 !important;
    // width: 320px;
    // margin: 4px;
    // display: inline-block;
    // vertical-align: top;
  }

</style>
