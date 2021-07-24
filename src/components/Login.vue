<template>
  <div>
  <md-content>
    <div class="md-layout">
      <div class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
        <md-toolbar>
          <md-avatar>
            <img class="imagem" src="../assets/LogoIFPI.png">
          </md-avatar>
          <h1 class="md-title">Sistema de Egresso</h1>
        </md-toolbar>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
        <!-- <h4>Cadastro</h4> -->
        <md-card>

          <md-card-header>

            <!-- <div style="width: 100%">
            </div> -->

            <!-- <div class="md-title">Novo usuario</div> -->
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-70">
                <md-field md-clearable>
                  <label>Username</label>
                  <md-input v-model="user.email"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-size-70">
                <md-field md-clearable>
                  <label>Password</label>
                  <md-input v-model="user.password" type="password"></md-input>
                </md-field>
              </div>
              <!-- <div class="md-layout-item md-size-70" v-if="usuarioOuSenhaInvalidos == true">
                  <p style="color:red !important">Usuário ou senha inválidos</p>
              </div> -->
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-70" v-if="usuarioOuSenhaInvalidos == true">
                  <p style="color:red !important">Usuário ou senha inválidos</p>
              </div>
            </div>

          </md-card-content>

          <md-card-actions>
            <div class="color-button">
              <md-button  v-on:click="logar_user(), showDialog=true" class="md-raised md-primary">
                Logar
              </md-button>
            </div>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <p>Ainda não possui conta? <span v-on:click="tela_cadastro()">Cadastre-se</span></p>

    <md-dialog :md-active.sync="showDialog" style="opacity:100%">
      <md-dialog-title>
        Entrando...
      </md-dialog-title>
    </md-dialog>
  </md-content>
  </div>

</template>

<script>
import firebase from 'firebase';

export default{
  data () {
    return {
      user: {email: "", password: ""},
      usuarioOuSenhaInvalidos: false,
      showDialog:false
    }
  },
  methods: {
    tela_cadastro: function(){
      window.location.replace('/cadastro')
    },
    logar_user: function(){
      firebase
      .auth()
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(() => {
        const db = firebase.firestore();
        const currentUser = firebase.auth().currentUser;

        db.collection('usuario').where('auth_uid', '==', currentUser.uid).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if(doc.data().tipo_usuario == 'aluno'){
                  window.location.replace('aluno/home');
              }else{
                  window.location.replace('funcionario/home');
              }
            });
        })
        .catch((error) => {
            console.log("Erro ao recuperar usuario: ", error);
        });

      })
      .catch(error => {
        this.showDialog = false;
        this.usuarioOuSenhaInvalidos = true;
        // alert(error.message);
      });
    }
  }

}
</script>

<style scoped="">
  .md-layout, .md-layout-item{
    justify-content: center;
  }

  .md-card-actions {
    justify-content: center !important;
  }

  .color-button .md-button{
    background-color: #006064 !important;
  }

  .md-toolbar{
    justify-content: center;
    background-color: #1c5d1c !important;
  }

  h1{
    color: white !important;
  }

  p{
    color: #006064 !important;
  }

  p span{
    font-weight: bold;
    cursor: pointer;
  }

  .md-content{
    position:absolute;
    top:40%;
    left:50%;
    margin-top:-100px;
    margin-left:-250px;
    color:#FFF;
    font-weight:700;
  }


  .md-avatar{
    border-radius:0px;
    margin: 0px;
    margin-right: 30px;
  }
</style>
