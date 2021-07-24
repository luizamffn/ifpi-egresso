<template>
  <my-base>
    <div slot="my-content" >
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-100">
          <md-card>
            <md-card-header>


              <md-card-header-text>
                <div class="md-title">{{pessoa.nome}}</div>
                <!-- <div class="md-subhead">Subtitle here</div> -->
              </md-card-header-text>

              <md-button  v-on:click="atualizar_pessoa()" class="md-raised md-button-green">
                Atualizar
                <md-tooltip md-direction="left">Atualizar Dados</md-tooltip>
              </md-button>

            </md-card-header>

            <md-card-content class="md-scrollbar">
              <div class="md-layout">
                <div class="md-layout-item md-size-100">
                  <div class="md-layout md-alignment-center">
                    <div class="md-layout-item md-size-20">
                      <md-field>
                        <label for="matricula">CPF</label>
                        <md-input v-model="pessoa.cpf" name="cpf"></md-input>
                      </md-field>
                    </div>

                    <div class="md-layout-item md-size-10">
                    </div>

                    <div class="md-layout-item md-size-20">
                      <md-field>
                        <label for="matricula">Email</label>
                        <md-input v-model="pessoa.email" name="email"></md-input>
                      </md-field>
                    </div>
                  </div>
                </div>

                <div class="md-layout-item md-size-100">
                  <div class="md-layout md-alignment-center">
                    <div class="md-layout-item md-size-20">
                      <div class="block" style="text-align: left;">
                        <label for="dataNasc" style="position: absolute; color: #978e8e; font-size: 12px;">Data Nascimento</label>
                        <md-datepicker v-model="pessoa.data_nascimento" />
                      </div>
                    </div>

                    <div class="md-layout-item md-size-10">
                    </div>

                    <div class="md-layout-item md-size-20">
                      <md-field>
                        <label for="matricula">Telefone</label>
                        <md-input v-model="pessoa.telefone" name="telefone"></md-input>
                      </md-field>
                    </div>
                  </div>
                </div>

                <div class="md-layout-item md-size-100">
                  <md-divider></md-divider>
                  <h4 style="display:inline-block">Atualizar Senha</h4>

                  <div class="md-layout">
                    <div class="md-layout-item md-size-100">
                      <div class="md-layout md-alignment-center">
                        <div class="md-layout-item md-size-20">
                          <md-field md-clearable>
                            <label>Nova Senha</label>
                            <md-input v-model="user.nova_senha" type="password"></md-input>
                          </md-field>
                        </div>

                        <div class="md-layout-item md-size-10">
                        </div>

                        <div class="md-layout-item md-size-20">
                          <md-field md-clearable>
                            <label>Confirmar Senha</label>
                            <md-input v-model="user.confirmar_senha" type="password"></md-input>
                          </md-field>
                        </div>
                      </div>
                    </div>

                    <div class="md-layout-item md-size-100">
                      <div class="md-layout md-alignment-center">
                        <div class="md-layout-item md-size-50" style="text-align: center;">
                          <md-button  v-on:click="validar_nova_senha()" class="md-raised md-button-green">
                            Atualizar
                            <md-tooltip md-direction="left">atualizar_senha</md-tooltip>
                          </md-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </md-card-content>
          </md-card>

        </div>

      </div>

      <md-dialog :md-active.sync="showDialogAutenticacao" >
        <md-card style="width: -webkit-fill-available;display: grid;">
          <md-card-header>
            <div class="md-title">Credenciais para atualizar senha</div>
          </md-card-header>

          <form >
            <md-card-content>
                <md-card-content>
                  <div class="md-layout md-gutter" id="cadastroMatricula">
                    <div class="md-layout-item md-size-50">
                      <md-field>
                        <label>Email</label>
                        <md-input v-model="user.email"></md-input>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <md-field md-clearable>
                        <label>Senha</label>
                        <md-input v-model="user.senha" type="password"></md-input>
                      </md-field>
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions>
              <md-button class="md-raised md-primary" v-on:click="showDialogAutenticacao = false">Fechar</md-button>
              <md-button class="md-raised md-primary" v-on:click="reautenticar_usuario()">Atualizar Senha</md-button>
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


export default{
  data() {
    return {
      pessoa: {},
      currentUser: {},
      user:{nova_senha:'', confirmar_senha:'', email: '', senha:''},
      showDialogAutenticacao: false,
    };
  },
  mounted() {
    console.log(localStorage.getItem('title'));

    this.currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("usuario").where("auth_uid", "==", this.currentUser.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            this.recuperarPessoa(doc.data());
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
              var data_nascimento = JSON.stringify(response.data().data_nascimento.toDate()).slice(1,11);

              this.pessoa = response.data();
              this.pessoa.uid = response.id
              this.pessoa.data_nascimento = data_nascimento
      })
      .catch((error) => {
          console.log("Erro ao recuperar pessoa: ", error);
      });
    },
    atualizar_pessoa: function(){
      const db = firebase.firestore();

      db.collection("pessoa").doc(this.pessoa.uid).update({
          cpf: this.pessoa.cpf,
          email: this.pessoa.email,
          telefone: this.pessoa.telefone,
          data_nascimento:firebase.firestore.Timestamp.fromDate(new Date(this.pessoa.data_nascimento))
      }).then(() => {
        alert('Pessoa atualizada!');
      })
      .catch((error) => {
        alert("Erro ao atualizar pessoa! ", error);
      });
    },
    validar_nova_senha: function(){
      if(this.user.nova_senha != '' && this.user.confirmar_senha != '' && this.user.nova_senha == this.user.confirmar_senha){
        this.showDialogAutenticacao = true;
      }else{
        alert("A nova senha tem que ser igual a confirmação");
      }
    },
    reautenticar_usuario: function(){
      var that = this
      var credential = firebase.auth.EmailAuthProvider.credential(this.user.email, this.user.senha);

      that.currentUser.reauthenticateWithCredential(credential).then(function() {
        that.atualizar_senha()
      }).catch(function(error) {
        alert("Email e/o senha inválidos!");
      });
    },
    atualizar_senha: function(){
      var that = this
      that.currentUser.updatePassword(this.user.nova_senha).then(function() {
          that.showDialogAutenticacao = false;
          alert("Senha atualizada com sucesso!");
        }).catch(function(error) {
          alert("Erro ao atualizar senha!");
      });
    }
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
