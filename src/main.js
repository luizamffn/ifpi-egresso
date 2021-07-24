import Vue from 'vue'
import App from './App.vue'
//import router from './router'
import firebase from 'firebase'
import VueRouter from 'vue-router'
import {routes} from './routes'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/vue-material.min.js'
import '../static/css/materialIcons.css'
import '../static/css/default.css'
import jsPDF from 'jspdf';

Vue.use(jsPDF)
Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(firebase)

var firebaseConfig = {
    apiKey: "AIzaSyDmf1tBqqYIRXQL9cdTrIrWiINPDYHz9y0",
    authDomain: "egresso-ifpi.firebaseapp.com",
    projectId: "egresso-ifpi",
    storageBucket: "egresso-ifpi.appspot.com",
    messagingSenderId: "534328877383",
    appId: "1:534328877383:web:f1c117d4efd33da066ac62",
    measurementId: "G-JX9EZDM7HY"
};

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue({});

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to,from,next) =>{
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && !currentUser) next('');
  else if (!requiresAuth && currentUser){
    next('home');
    // db.collection('usuario').where('auth_uid', '==', currentUser.uid).get()
    // .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       if(doc.data().tipo_usuario == 'aluno'){
    //         next('aluno/home');
    //       }else{
    //         next('funcionario/home');
    //       }
    //     });
    // })
    // .catch((error) => {
    //     console.log("Erro ao recuperar usuario: ", error);
    // });
  }
  else next();
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//   // if the user is not authenticated, `next` is called twice
//   next()
// })


/* eslint-disable no-new */
let app = '';
firebase.auth().onAuthStateChanged(() => {
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      render: h => h(App),
      firebase: firebase,
    })
  }
})
