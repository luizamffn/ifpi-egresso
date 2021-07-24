<template>
  <!-- <my-base> -->
    <div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-100">
          <md-card>
            <md-card-header>

              <md-card-header-text>
                <div class="md-title">{{aluno.nome}}</div>
                <!-- <div class="md-subhead">Subtitle here</div> -->
              </md-card-header-text>


            </md-card-header>

            <md-card-content class="md-scrollbar">
              <div class="md-layout">





                <div class="md-layout-item md-size-100">
                  <md-divider></md-divider>
                  <h4 style="display:inline-block">Matrículas</h4>

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
                                     <md-input v-model="m.numero_matricula" name="numero_matricula" readonly="true"></md-input>
                                   </md-field>
                                 </div>

                                 <div class="md-layout-item md-size-10">
                                 </div>

                                 <div class="md-layout-item md-size-20">
                                   <md-field>
                                     <label for="matricula">Status Matrícula</label>
                                     <md-input v-model="m.status_matricula" name="numero_matricula" readonly="true"></md-input>
                                   </md-field>

                                 </div>
                               </div>
                             </div>

                             <div class="md-layout-item md-size-100">
                               <div class="md-layout md-alignment-center">
                                 <div class="md-layout-item md-size-20">
                                   <md-field>
                                     <label for="matricula">Data Início</label>
                                     <md-input v-model="m.data_inicio" name="numero_matricula" readonly="true"></md-input>
                                   </md-field>
                                 </div>

                                 <div class="md-layout-item md-size-10">
                                 </div>

                                 <div class="md-layout-item md-size-20">
                                   <md-field>
                                     <label for="matricula">Data Conclusão</label>
                                     <md-input v-model="m.data_fim" name="numero_matricula" readonly="true"></md-input>
                                   </md-field>
                                   
                                 </div>
                               </div>
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
                                   </md-list-item>
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

    </div>
  <!-- </my-base> -->
</template>


<script>
import firebase from 'firebase';

export default{
  data: () => ({
    aluno: {uid: '', nome: '', data_nascimento: '', email: '', cpf: '', telefone:'', pessoa_uid: ''},
    matriculas: [],
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

  created() {
      this.$bus.$on('adicionar_ocupacao', val =>this.adicionar_ocupacao(val))
  },
  mounted() {
    this.recuperarAluno(localStorage.getItem('pessoa_logada_uid'))
  },
  methods: {
    adicionar_ocupacao :function(ocupacao) {
      this.matricula_selecionada.ocupacoes.push(ocupacao);

      this.keyOcupacoes +=1
    },
    recuperarAluno :function(pessoa_logada_uid) {
      var that = this;

      const db = firebase.firestore();
      db.collection('aluno').where('pessoa_uid', '==', pessoa_logada_uid)
        .get()
        .then(response => {
          response.forEach(doc => {
            that.aluno.uid = doc.id;
            that.aluno.pessoa_uid = doc.data().pessoa_uid;
            that.recuperarPessoa(doc.data().pessoa_uid)
          });
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
