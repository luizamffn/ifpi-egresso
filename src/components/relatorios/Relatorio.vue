<template>
  <my-base>
    <div slot="my-content">
      <div class="md-layout md-alignment-center">
        <div class="md-layout-item md-size-50 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
          <md-card>
            <md-card-header>
              <div class="md-title">Relatórios</div>
              <!-- <div class="md-subhead">Subtitle here</div> -->
            </md-card-header>

            <md-card-content>
              <md-list>
                <md-list-item>
                  <md-card-header-text>
                    <span class="md-list-item-text">Relação de alunos por curso</span>
                    <!-- <div class="md-subhead">teste</div> -->
                  </md-card-header-text>

                  <md-button @click="showDialogAlunosPorCurso=true" class="md-icon-button md-list-action">
                    <md-icon class="md-primary">arrow_downward</md-icon>
                    <md-tooltip md-direction="left">Gerar Relatório</md-tooltip>
                  </md-button>
                </md-list-item>

                <md-list-item>
                  <md-card-header-text>
                    <span class="md-list-item-text">Alunos que possuem/não possuem ocupação</span>
                    <!-- <div class="md-subhead">teste</div> -->
                  </md-card-header-text>

                  <md-button @click="showDialogAlunosPorOcupacao=true" class="md-icon-button md-list-action">
                    <md-icon class="md-primary">arrow_downward</md-icon>
                    <md-tooltip md-direction="left">Gerar Relatório</md-tooltip>
                  </md-button>
                </md-list-item>
              </md-list>
            </md-card-content>
                
          </md-card>
        </div>
      </div>


      <md-dialog :md-active.sync="showDialogAlunosPorCurso" >
        <md-card style="width: -webkit-fill-available;display: grid;">
          <md-card-header>
            <div class="md-title">Relação de alunos por curso</div>
            <div style="float:right">
              <span class="md-list-item-text">* campo obrigatório</span>
            </div>
          </md-card-header>

          <form>
            <md-card-content>
                <md-card-content>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50">
                      <md-field>
                       <md-select v-model="curso_uid" name="curso" placeholder="* Curso">
                         <md-option :value="c.uid" v-for="c in cursos">{{c.descricao}}</md-option>
                       </md-select>
                     </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <md-field>
                       <md-select v-model="matricula.status_matricula" name="status_matricula" placeholder="Status Matrícula">
                         <md-option value="em_andamento">Em Andamento</md-option>
                         <md-option value="concluido">Concluído</md-option>
                         <md-option value="cancelado">Cancelado</md-option>
                         <md-option value="desistente">Desistente</md-option>
                       </md-select>
                     </md-field>
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions>
              <md-button class="md-raised md-primary" v-on:click="showDialogAlunosPorCurso = false">Fechar</md-button>
              <md-button class="md-raised md-primary" v-on:click="recuperarAlunosPorCurso()" >Gerar</md-button>
            </md-card-actions>
          </form>
        </md-card>
      </md-dialog>

      <md-dialog :md-active.sync="showDialogAlunosPorOcupacao" >
        <md-card style="width: -webkit-fill-available;display: grid;">
          <md-card-header>
            <div class="md-title">Alunos que possuem/não possuem ocupação</div>
            <div style="float:right">
              <span class="md-list-item-text">* campo obrigatório</span>
            </div>
          </md-card-header>

          <form>
            <md-card-content>
                <md-card-content>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50">
                      <md-field>
                       <md-select v-model="curso_uid" name="curso" placeholder="* Curso">
                         <md-option :value="c.uid" v-for="c in cursos">{{c.descricao}}</md-option>
                       </md-select>
                     </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <md-field>
                       <md-select v-model="matricula.possuiOcupacao" placeholder="Aluno possui ocupação?">
                         <md-option value="sim">Sim</md-option>
                         <md-option value="nao">Não</md-option>
                        </md-select>
                     </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <!-- <md-field>
                       <md-select v-model="matricula.status_matricula" name="status_matricula" placeholder="Status Matrícula">
                         <md-option value="em_andamento">Em Andamento</md-option>
                         <md-option value="concluido">Concluído</md-option>
                         <md-option value="cancelado">Cancelado</md-option>
                         <md-option value="desistente">Desistente</md-option>
                       </md-select>
                     </md-field> -->
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions>
              <md-button class="md-raised md-primary" v-on:click="showDialogAlunosPorOcupacao = false">Fechar</md-button>
              <md-button class="md-raised md-primary" v-on:click="recuperarAlunosPorOcupacao()" >Gerar</md-button>
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
import jsPDF from 'jspdf';
import 'jspdf-autotable'

export default{
  data() {
    return {
      showDialogAlunosPorCurso: false,
      cursos: [],
      matricula: {status_matricula: '', possuiOcupacao:''},
      curso_uid: '',
      alunos:[],
      quant_matricula: 0,
      showDialogAlunosPorOcupacao: false,
      ocupacoes: [],
      quant_ocupacoes: 0,
      matriculas_com_ocupacao: [],
    };
  },
  mounted() {
    console.log('aquii');
    this.recuperar_cursos();
  },
  methods: {
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
      })
      .catch((error) => {
          console.log("Erro ao recuperar cursos: ", error);
      });
    },
    recuperarAlunosPorCurso (){
      if(this.curso_uid != ''){
        this.alunos = []
        var that = this;

        const db = firebase.firestore();
        var query = db.collection("matricula").where('curso_uid', '==', that.curso_uid)
        if(that.matricula.status_matricula != ''){
          query = query.where("status_matricula", "==", that.matricula.status_matricula)
        }

        query.get()
        .then(response => {
          that.quant_matricula = response.size;
          response.forEach(doc => {
            var aluno = {numero_matricula: '', nome: '', cpf: '', email: '', telefone:'', status_matricula:''}
            aluno.numero_matricula = doc.data().numero_matricula;

            if(that.matricula.status_matricula == ''){
              if(doc.data().status_matricula == 'em_andamento'){
                aluno.status_matricula = 'Em Andamento'
              }else if(doc.data().status_matricula == 'concluido'){
                aluno.status_matricula = 'Concluído'
              }else if(doc.data().status_matricula == 'cancelado'){
                aluno.status_matricula = 'Cancelado'
              }else if(doc.data().status_matricula == 'desistente'){
                aluno.status_matricula = 'Desistente'
              }
            }
            that.recuperarAluno(doc.data().aluno_uid, aluno)
          });
        })
        .catch((error) => {
            console.log("Erro ao recuperar Cursos: ", error);
        });
      }else{
        alert('O curso é obrigatório!');
      }
    },
    recuperarAluno (aluno_uid, aluno){
      var that = this;

      const db = firebase.firestore();
      db.collection("aluno").doc(aluno_uid)
      .get()
      .then(doc => {
          that.recuperarPessoa(doc.data().pessoa_uid, aluno);
      })
      .catch((error) => {
          console.log("Erro ao recuperar aluno: ", error);
      });
    },
    recuperarPessoa : function(pessoa_uid,aluno){
      var that = this;

      const db = firebase.firestore();
      db.collection("pessoa").doc(pessoa_uid)
      .get()
      .then((response) => {
        aluno.nome = response.data().nome;
        aluno.email = response.data().email;
        aluno.cpf = response.data().cpf;
        aluno.telefone = response.data().telefone;

        that.alunos.push(aluno)

        if(that.alunos.length == that.quant_matricula){
          that.gerarRelatorioAlunosPorCurso();
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });

    },
    gerarRelatorioAlunosPorCurso (){
      var that = this;
      var curso = this.cursos.filter(function (el) {
        return el.uid == that.curso_uid;
      });

      var doc = new jsPDF()
      doc.setFontSize(12);
      doc.text("Relatório de Alunos de " + curso[0].descricao, 105, 20, null, null, "center");

      var status_matricula = ''
      if(that.matricula.status_matricula != ''){
        if(that.matricula.status_matricula == 'em_andamento'){
          status_matricula = 'Em Andamento'
        }else if(that.matricula.status_matricula == 'concluido'){
          status_matricula = 'Concluído'
        }else if(that.matricula.status_matricula == 'cancelado'){
          status_matricula = 'Cancelado'
        }else if(that.matricula.status_matricula == 'desistente'){
          status_matricula = 'Desistente'
        }

        doc.setFontSize(11);
        doc.text("Status Matrícula: "+ status_matricula, 200, 30, null, null, "right");
      }

      let wantedTableWidth = 100;
      let pageWidth = doc.internal.pageSize.width;
      let margin = (pageWidth - wantedTableWidth) / 2;

      var formatacao_aluno = []
      var position = 0


      if(that.matricula.status_matricula != ''){
        for (position in this.alunos) {
          var temp = [this.alunos[position].nome, this.alunos[position].cpf,
                      this.alunos[position].numero_matricula, this.alunos[position].email, this.alunos[position].telefone];
          formatacao_aluno.push(temp);
        }


        doc.autoTable({
            head: [['Nome', 'CPF', 'Nº da Matricula', 'E-mail', 'Telefone']],
            body:formatacao_aluno,
            margin: {top:35}
        });
      }else{
        for (position in this.alunos) {
          var temp = [this.alunos[position].nome, this.alunos[position].cpf,
                      this.alunos[position].numero_matricula, this.alunos[position].status_matricula, this.alunos[position].email, this.alunos[position].telefone];
          formatacao_aluno.push(temp);
        }


        doc.autoTable({
            head: [['Nome', 'CPF', 'Nº da Matricula', 'Status Matrícula', 'E-mail', 'Telefone']],
            body:formatacao_aluno,
            margin: {top:35}
        });
      }

      doc.save('table.pdf');
    },

    recuperarAlunosPorOcupacao (){
      var that = this;
      that.matriculas_com_ocupacao = []
      that.ocupacoes = []

      const db = firebase.firestore();

      if(this.curso_uid != ''){
        db.collection("matricula").where('curso_uid', '==', that.curso_uid)
        .get()
        .then(response => {
          that.quant_matricula = response.size;
          response.forEach(doc => {
            that.recuperarOcupacaoPorMactricula(doc.id, doc.data());
          });
        })
        .catch((error) => {
            console.log("Erro ao recuperar Cursos: ", error);
        });
      }else{
        var query = db.collection("ocupacao")
        if(that.matricula.possuiOcupacao == 'sim' || that.matricula.possuiOcupacao == 'nao'){
          query = query.where("data_fim", "==", null)
        }

        query
          .get()
          .then(response => {
            that.quant_ocupacoes = response.size;
            response.forEach(doc => {
              var ocupacao = {data_inicio: '', data_fim:'', local: '', eh_remunerado:'', matricula_uid:'', status_matricula: '',
                              numero_matricula:'', aluno_nome: '', aluno_cpf:'', aluno_email:'', aluno_telefone:''}
              if(that.matricula.possuiOcupacao != 'nao'){
                var meses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

                var data_inicio = new Date(JSON.stringify(doc.data().data_inicio.toDate()).slice(1,11));
                ocupacao.data_inicio = String(data_inicio.getDate()).padStart(2, '0') + '-' + meses[data_inicio.getMonth()] + '-' + data_inicio.getFullYear()

                if(doc.data().data_fim != null){
                  var data_fim = new Date(JSON.stringify(doc.data().data_fim.toDate()).slice(1,11));

                  ocupacao.data_fim = String(data_fim.getDate()).padStart(2, '0') + '-' + meses[data_fim.getMonth()] + '-' + data_fim.getFullYear()
                }

                ocupacao.local = doc.data().local
                ocupacao.eh_remunerado = doc.data().eh_remunerado
                ocupacao.matricula_uid = doc.data().matricula_uid

                that.recuperarMatricula(doc.data().matricula_uid, ocupacao)
              }else{
                that.matriculas_com_ocupacao.push(doc.data().matricula_uid)
                if(that.matriculas_com_ocupacao.length == response.size){
                  that.recuperarMatricula(null, null)
                }
              }
            })
          })
          .catch((error) => {
              console.log("Erro ao recuperar ocupacoes! ", error);
          });
        // }else{
        //   //Não possui ocupacao
        // }
      }
    },
    recuperarOcupacaoPorMactricula(matricula_uid, matricula){
      var that = this;
      const db = firebase.firestore();
      db.collection("ocupacao").where('matricula_uid', '==', matricula_uid)
      .get()
      .then(response => {
        if(response.size == 0 && that.matricula.possuiOcupacao == 'nao'){
          that.quant_ocupacoes += 1;

          var ocupacao = {data_inicio: '', data_fim:'', local: '', eh_remunerado:'', matricula_uid:'', status_matricula: '',
                          numero_matricula:'', aluno_nome: '', aluno_cpf:'', aluno_email:'', aluno_telefone:'', matricula_uid: ''}

          ocupacao.status_matricula = matricula.status_matricula
          ocupacao.numero_matricula = matricula.numero_matricula
          ocupacao.matricula_uid = matricula_uid
          ocupacao.curso_uid = matricula.curso_uid

          that.recuperarAlunoOcupacao(matricula.aluno_uid, ocupacao, true)
        }if( response.size > 0 && that.matricula.possuiOcupacao != 'nao'){
          that.quant_ocupacoes += response.size;

          var meses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
          response.forEach(doc => {
            var ocupacao = {data_inicio: '', data_fim:'', local: '', eh_remunerado:'', matricula_uid:'', status_matricula: '',
                            numero_matricula:'', aluno_nome: '', aluno_cpf:'', aluno_email:'', aluno_telefone:'', matricula_uid: ''}

            ocupacao.status_matricula = matricula.status_matricula
            ocupacao.numero_matricula = matricula.numero_matricula
            ocupacao.matricula_uid = matricula_uid
            ocupacao.curso_uid = matricula.curso_uid
            ocupacao.local = doc.data().local

            var data_inicio = new Date(JSON.stringify(doc.data().data_inicio.toDate()).slice(1,11));
            ocupacao.data_inicio = String(data_inicio.getDate()).padStart(2, '0') + '-' + meses[data_inicio.getMonth()] + '-' + data_inicio.getFullYear()

            if(doc.data().data_fim != null){
              var data_fim = new Date(JSON.stringify(doc.data().data_fim.toDate()).slice(1,11));

              ocupacao.data_fim = String(data_fim.getDate()).padStart(2, '0') + '-' + meses[data_fim.getMonth()] + '-' + data_fim.getFullYear()
            }

            ocupacao.eh_remunerado = doc.data().eh_remunerado

            that.recuperarAlunoOcupacao(matricula.aluno_uid, ocupacao, true)

          });
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar Cursos: ", error);
      });
    },
    recuperarMatricula (matricula_uid, ocupacao){
      var that = this;

      const db = firebase.firestore();

      var query = db.collection("matricula")
      if(matricula_uid != null){
        query.doc(matricula_uid)
        .get()
        .then(doc => {
            ocupacao.status_matricula = doc.data().status_matricula
            ocupacao.numero_matricula = doc.data().numero_matricula
            ocupacao.curso_uid = doc.data().curso_uid
            that.recuperarAlunoOcupacao(doc.data().aluno_uid, ocupacao, false);
        })
        .catch((error) => {
            console.log("Erro ao recuperar aluno: ", error);
        });
      }else{
        query.get()
        .then(snap => {
          that.quant_ocupacoes = snap.size - that.matriculas_com_ocupacao.length;

          snap.forEach(doc => {
            var matricula_diferente = 'sim'
            var i = 0
            for(i in that.matriculas_com_ocupacao){
              if(doc.id == that.matriculas_com_ocupacao[i]){
                matricula_diferente = 'nao';
              }
            }

            if(matricula_diferente == 'sim'){
              var ocupacao = {data_inicio: '', data_fim:'', local: '', eh_remunerado:'', matricula_uid:'', status_matricula: '',
                              numero_matricula:'', aluno_nome: '', aluno_cpf:'', aluno_email:'', aluno_telefone:''}

              ocupacao.status_matricula = doc.data().status_matricula
              ocupacao.numero_matricula = doc.data().numero_matricula
              ocupacao.curso_uid = doc.data().curso_uid
              that.recuperarAlunoOcupacao(doc.data().aluno_uid, ocupacao,false);
            }
          })
        })
        .catch((error) => {
            console.log("Erro ao recuperar aluno: ", error);
        });
      }
    },
    recuperarAlunoOcupacao (aluno_uid, ocupacao, curso_selecionado){
      var that = this;

      const db = firebase.firestore();
      db.collection("aluno").doc(aluno_uid)
      .get()
      .then(doc => {
          that.recuperarPessoaOcupacao(doc.data().pessoa_uid, ocupacao, curso_selecionado);
      })
      .catch((error) => {
          console.log("Erro ao recuperar aluno: ", error);
      });
    },
    recuperarPessoaOcupacao (pessoa_uid, ocupacao, curso_selecionado){
      var that = this;

      const db = firebase.firestore();
      db.collection("pessoa").doc(pessoa_uid)
      .get()
      .then((response) => {
        ocupacao.aluno_nome = response.data().nome;
        ocupacao.aluno_email = response.data().email;
        ocupacao.aluno_cpf = response.data().cpf;
        ocupacao.aluno_telefone = response.data().telefone;

        // if(curso_selecionado == false){
          that.ocupacoes.push(ocupacao)
          if(that.ocupacoes.length == that.quant_ocupacoes){
            that.gerarRelatorioAlunosPorOcupacao();
          }
        // }else{
        //   that.recuperarOcupacaoPorMactricula(ocupacao)
        // }
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });
    },
    gerarRelatorioAlunosPorOcupacao (){
      var that = this;

      var doc = new jsPDF('landscape')
      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      doc.setFontSize(12);
      if(that.matricula.possuiOcupacao == 'não'){
        doc.text("Alunos sem Ocupação por curso", pageWidth / 2, 20, null, null, "center");
      }else{
        doc.text("Ocupações dos alunos por curso", pageWidth / 2, 20, null, null, "center");
      }

      var formatacao_aluno = []
      var position = 0

      for (position in this.ocupacoes) {
        var that = this;
        var curso = this.cursos.filter(function (el) {
          return el.uid == that.ocupacoes[position].curso_uid;
        });

        if(that.matricula.possuiOcupacao == 'nao'){
          var temp = [this.ocupacoes[position].aluno_nome, this.ocupacoes[position].aluno_cpf, this.ocupacoes[position].aluno_email,
                         curso[0].descricao, this.ocupacoes[position].numero_matricula];
        }else{
          var temp = [this.ocupacoes[position].aluno_nome, this.ocupacoes[position].aluno_cpf, this.ocupacoes[position].aluno_email,
                         curso[0].descricao, this.ocupacoes[position].numero_matricula,
                         this.ocupacoes[position].local, this.ocupacoes[position].data_inicio,
                        this.ocupacoes[position].data_fim, this.ocupacoes[position].eh_remunerado == true? "Sim": 'Não'];
        }
        formatacao_aluno.push(temp);
      }

      var colunas = ''
      if(that.matricula.possuiOcupacao == 'nao'){
        colunas = [['Nome', 'CPF', 'E-mail', 'Curso', 'Nº da Matricula']]
      }else{
        colunas = [['Nome', 'CPF', 'E-mail', 'Curso', 'Nº da Matricula', 'Local', 'Data Início', 'Data Fim', 'Remunerado']]
      }

      doc.autoTable({
          head: colunas,
          body:formatacao_aluno,
          margin: {top:35}
      });

      doc.save('table.pdf');
    }
  },
  components: {
    'my-base': Base,
    // 'my-conteudo': Conteudo
  },
}
</script>

<style lang="scss" scoped>
  // span {
  //   padding: 16px !important;
  //   background-color: #c4e9c4 !important;
  //   width: 200px !important;
  //   height: 200px !important;
  //   display: inline-flex !important;
  //   justify-content: center !important;
  //   align-items: center !important;
  // }

  .md-card{
    margin-top:30px;
  }
</style>
