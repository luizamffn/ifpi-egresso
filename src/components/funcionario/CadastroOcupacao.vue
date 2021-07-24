<template>
  <div>
      <md-dialog :md-active.sync="showDialogOcupacao" >
        <md-card style="width: -webkit-fill-available;display: grid;">
          <md-card-header>
            <div class="md-title">Adicionar Ocupação</div>
          </md-card-header>

          <form @submit.prevent="validateOcupacao">
            <md-card-content>
                <md-card-content>
                  <div class="md-layout md-gutter" id="cadastroOcupacao">
                    <div class="md-layout-item md-size-50">
                      <md-field :class="getValidationOcupacaoClass('local')">
                        <label for="matricula">Local</label>
                        <md-input v-model="ocupacao.local" name="local"></md-input>
                        <span class="md-error" v-if="!$v.ocupacao.local.required">Campo obrigatório</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-50" :class="getValidationOcupacaoClass('eh_remunerado')">
                      <div for="snackbar-center" class="md-body-2">É Remunerado</div>
                      <md-radio v-model="ocupacao.eh_remunerado" value="true">Sim</md-radio>
                      <md-radio v-model="ocupacao.eh_remunerado" value="false">Não</md-radio>
                      <span class="md-error" style="display: block; color: red; font-size: 12px"
                            v-if="!$v.ocupacao.eh_remunerado.required">Campo obrigatório</span>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <div class="block" style="text-align: left;" :class="getValidationOcupacaoClass('data_inicio')">
                        <label for="DataInicio" style="position: absolute; color: #978e8e; font-size: 12px;">Data Inicio</label>
                        <md-datepicker v-model="ocupacao.data_inicio" />
                      </div>
                      <span class="md-error" style="color: red; font-size: 12px;" v-if="!$v.ocupacao.data_inicio.required">Campo obrigatório</span>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <div class="block" style="text-align: left;">
                        <label for="dataFim" style="position: absolute; color: #978e8e; font-size: 12px;">Data Fim</label>
                        <md-datepicker v-model="ocupacao.data_fim" />
                      </div>
                    </div>
                  </div>
                </md-card-content>
            </md-card-content>

            <md-card-actions>
              <md-button class="md-raised md-primary" v-on:click="showDialogOcupacao = false">Fechar</md-button>
              <md-button class="md-raised md-primary" type="submit">Salvar</md-button>
            </md-card-actions>
          </form>
        </md-card>
      </md-dialog>
  </div>
</template>


<script>
import firebase from 'firebase';
import Base from '../base/Base.vue'

import { validationMixin } from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

export default{
  mixins: [validationMixin],
  data: () => ({
    showDialogOcupacao: false,
    ocupacao:{local:'', matricula_uid: '', eh_remunerado:'', data_inicio: '', data_fim: null},
    matricula_selecionada: '',
  }),
  validations: {
    ocupacao: {
      local: {
        required
      },
      data_inicio: {
        required
      },
      eh_remunerado: {
        required
      }
    }
  },
  created() {
      console.log('aquii');
      this.$bus.$on('cadastroOcupacao', val =>(this.showDialogOcupacao = val['showDialogOcupacao'],
                                                this.matricula_selecionada=val['matricula_selecionada']))
  },
  methods: {
    getValidationOcupacaoClass(fieldName) {
      var that = this;
      const field = that.$v.ocupacao[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateOcupacao () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
          this.salvar_ocupacao()
      }
    },
    salvar_ocupacao () {
      var that = this
      const db = firebase.firestore();

      db.collection('ocupacao').add({
        matricula_uid: that.matricula_selecionada.id,
        local: that.ocupacao.local,
        eh_renumerado: that.ocupacao.eh_remunerado,
        data_inicio: firebase.firestore.Timestamp.fromDate(new Date(that.ocupacao.data_inicio)),
        data_fim: that.ocupacao.data_fim != null ? firebase.firestore.Timestamp.fromDate(new Date(that.ocupacao.data_fim)):null,
      }).then((response) => {
        alert('Ocupação adicionada!');

        var ocupacao = {uid: '', local: '', data_inicio: '', data_fim: null, eh_remunerado: ''}
        ocupacao.uid = response.id;
        ocupacao.local =that.ocupacao.local;
        ocupacao.data_inicio = that.ocupacao.data_inicio
        if(that.ocupacao.data_fim != null){
          var meses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
          ocupacao.data_fim =  that.ocupacao.data_fim.getFullYear() + '-'
                                + meses[that.ocupacao.data_fim.getMonth()] + '-' + String(that.ocupacao.data_fim.getDate()).padStart(2, '0')
        }
        ocupacao.eh_remunerado = that.ocupacao.eh_remunerado

        that.showDialogOcupacao = false
        that.$bus.$emit('adicionar_ocupacao', ocupacao);
      })
      .catch((error) => {
        window.alert('A Ocupação não foi Cadastrada!')
      });;
    },
  },
  // components: {
  //   // 'my-base': Base,
  //   // 'my-conteudo': Conteudo
  // },
}
</script>

<style lang="scss" scoped>
  // .md-gutter{
  //   margin: 20px !important;
  // }

  .md-card{
    margin: 20px !important;
    max-width: fit-content;
    max-height: 80vh;
    overflow: auto;
  }

</style>
