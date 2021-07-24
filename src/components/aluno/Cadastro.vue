<template>
  <div>
  <md-content>
    <div class="md-layout">
      <div class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
        <md-toolbar>
          <h1 class="md-title">Sistema de Egresso - IFPI</h1>
        </md-toolbar>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
        <!-- <h4>Cadastro</h4> -->
        <md-card>

          <md-card-header>
            <div style="width: 100%">
              <!-- <img class="imagem" src="../../assets/icon.png"> -->
            </div>

            <div class="md-title">Novo usuario</div>
          </md-card-header>

          <form @submit.prevent="validateCadastro">
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-50 md-xsmall-size-100">
                <md-field :class="getValidationClass('email')">
                  <label>Email</label>
                  <md-input v-model="user.email"></md-input>
                  <span class="md-error" v-if="!$v.user.email.required">Campo obrigatório</span>
                  <span class="md-error" v-else="!$v.user.email.email">Formato de email inválido</span>
                </md-field>
              </div>
              <div class="md-layout-item md-size-50 md-xsmall-size-100">
                <md-field :class="getValidationClass('password')">
                  <label>Senha</label>
                  <md-input v-model="user.password" type="password"></md-input>
                  <span class="md-error" v-if="!$v.user.password.required">Campo obrigatório</span>
                </md-field>
              </div>

              <div class="md-layout-item md-size-50 md-xsmall-size-100">
                <md-field :class="getValidationClass('perfil')">
                 <md-select v-model="user.perfil" name="perfil" placeholder="Perfil">
                   <md-option value="aluno">Aluno</md-option>
                   <md-option value="coordenador">Coordenador</md-option>
                   <md-option value="professor">Professor</md-option>
                 </md-select>
                 <span class="md-error" v-if="!$v.user.perfil.equired">Campo obrigatório</span>
               </md-field>
             </div>
            </div>
          </md-card-content>

          <md-card-actions>
            <div class="color-button">
              <!-- <md-button v-if="botaoCadastro" type="submit" class="md-raised md-primary">
                Cadastrar
              </md-button> -->
              <md-button  type="submit" class="md-raised md-primary">
                Cadastrar
              </md-button>
              <md-button  v-on:click="home()" class="md-raised md-primary">
                Voltar
              </md-button>
            </div>
          </md-card-actions>
        </form>
        </md-card>
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Cadastro Realizado com sucesso!</md-dialog-title>

      <md-dialog-actions>
        <md-button class="md-primary" @click="home()">Voltar</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
  </div>

</template>

<script ype="text/javascript">
import { validationMixin } from 'vuelidate'
import {required, email} from 'vuelidate/lib/validators'
import firebase from 'firebase';

export default{
  mixins: [validationMixin],
  data () {
    return {
      user: {email: "", password: "", perfil: ''},
      usuarioOuSenhaInvalidos: false,
      showDialog:false,
      botaoCadastro: true,
    }
  },
  validations: {
    user: {
      email: {
        required,
        email
      },
      password: {
        required
      },
      perfil: {
        required
      }
    }
  },
  methods: {
    home: function(){
      window.location.replace('/')
    },
    getValidationClass (fieldName) {
      const field = this.$v.user[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateCadastro () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
          this.recuperarPessoaPorEmail()
      }
    },
    recuperarPessoaPorEmail () {
      var that = this;

      const db = firebase.firestore();
      db.collection("pessoa").where('email', '==', this.user.email)
      .get()
      .then(response => {
        if(response.size > 0){
          that.recuperarUsuarioPorPessoa(response.docs[0].id)
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar Pessoa. ", error);
      });
    },
    verificarAluno (pessoa_uid) {
      var that = this
      const db = firebase.firestore();
      db.collection("aluno").where('pessoa_uid', '==', pessoa_uid)
      .get()
      .then(response => {
        if(response.size > 0){
          that.cadastrar(pessoa_uid)
        }else{
          alert('Solicite ao Coordenador seu cadastro de aluno!');
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar usuario! ", error);
      });
    },
    verificarFuncionario (pessoa_uid) {
      var that = this
      const db = firebase.firestore();
      db.collection("funcionario").where('pessoa_uid', '==', pessoa_uid)
      .get()
      .then(response => {
        if(response.size > 0){
          that.recuperarCursoFuncionario(response.docs[0].id, pessoa_uid)
        }else{
          alert('Solicite seu cadastro de ' + that.user.perfil + 'no sistema!');
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar funcionario! ", error);
      });
    },
    recuperarCursoFuncionario (funcionario_uid, pessoa_uid) {
      var that = this
      const db = firebase.firestore();
      db.collection("cursoFuncionario").where('funcionario_uid', '==', funcionario_uid)
      .get()
      .then(response => {
        if(response.size > 0){
          if(response.docs[0].data().cargo == that.user.perfil){
            that.cadastrar(pessoa_uid)
          }else{
            alert('Solicite seu cadastro de ' + that.user.perfil + ' no sistema!');
          }
        }else{
          alert('Solicite seu cadastro de ' + that.user.perfil + ' no sistema!');
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar cursoFuncionario! ", error);
      });
    },
    recuperarUsuarioPorPessoa (pessoa_uid) {
      var that = this;

      const db = firebase.firestore();
      db.collection("usuario").where('pessoa_uid', '==', pessoa_uid)
      .get()
      .then(response => {
        if(response.size == 0){
            if(that.user.perfil == 'aluno'){
              that.verificarAluno(pessoa_uid)
            }else{
              that.verificarFuncionario(pessoa_uid)
            }
          // that.cadastrar(pessoa_uid)
        }else{
          alert('Email já cadastrado!');
        }
      })
      .catch((error) => {
          console.log("Erro ao recuperar usuario! ", error);
      });
    },
    cadastrar(pessoa_uid) {
      var that = this

      firebase
      .auth()
      .createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((response) => {
        that.cadastrarUsuario(response.user.uid, pessoa_uid)
      })
      .catch(error => {
        alert(error.message);
      });
    },
    cadastrarUsuario (auth_uid, pessoa_uid) {
      var that = this
      const db = firebase.firestore();

      db.collection('usuario').add({
        auth_uid: auth_uid,
        pessoa_uid: pessoa_uid,
        tipo_usuario: that.user.perfil,
      }).then((response) => {
        alert('Cadastro realizado com sucesso!');
        window.location.replace('/');
      })
      .catch((error) => {
        indow.alert('O usuario não foi Cadastrado!')
      });
    },
  }
}
</script>

<style scoped>
  .md-layout, .md-layout-item{
    justify-content: center;
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

  .md-card{
    padding: 0px !important;
    width: 100% !important;
    margin-top: 15px;
  }

  .md-layout.md-gutter{
    /* margin: 0px !important */
  }

  .md-card-actions {
    justify-content: center !important;
  }

  .md-field{
    margin-bottom: 10px !important;
  }

  .md-card-header .md-title{
    color: #006064 !important;
  }

  .md-focused label, .md-input, label{
    color: var(--md-theme-default-primary-on-background, rgb(103, 103, 103)) !important;
  }

  .md-field:before {
    height: 0px;
  }

  .md-dialog{
    width: min-content !important;
    height: fit-content !important;
  }

  .md-content{
    position:absolute;
    top:40%;
    left:50%;
    margin-top:-100px;
    margin-left:-350px;
    color:#FFF;
    font-weight:700;
  }
</style>
