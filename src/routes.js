import Login from '@/components/Login.vue'
import CadastroAluno from '@/components/aluno/Cadastro.vue'
// import HomeAluno from '@/components/aluno/Home.vue'
// import HomeFuncionario from '@/components/funcionario/Home.vue'
import Home from '@/components/home/Home.vue'
import Alunos from '@/components/funcionario/Alunos.vue'
import DetalhesAluno from '@/components/funcionario/DetalhesAluno.vue'
import Cursos from '@/components/funcionario/Cursos.vue'
import DetalhesCurso from '@/components/funcionario/DetalhesCurso.vue'
import Relatorios from '@/components/relatorios/Relatorio.vue'
import Configuracoes from '@/components/configuracoes/Configuracoes.vue'


export const routes = [
  {path: '', component: Login, titulo: 'Login'},
  {path: '/cadastro', component: CadastroAluno, titulo: 'CadastroAluno'},
  {path: '/home', component: Home, titulo: 'Home', meta: { requiresAuth: true }},
  {path: '/alunos', component: Alunos, titulo: 'Alunos', meta: { requiresAuth: true }},
  {path: '/aluno/detalhes', component: DetalhesAluno, titulo: 'DetalhesAluno', meta: { requiresAuth: true }},
  {path: '/cursos', component: Cursos, titulo: 'Cursos', meta: { requiresAuth: true }},
  {path: '/curso/detalhes', component: DetalhesCurso, titulo: 'DetalhesCurso', meta: { requiresAuth: true }},
  {path: '/relatorios', component: Relatorios, titulo: 'Relatorios', meta: { requiresAuth: true }},
  {path: '/configuracoes', component: Configuracoes, titulo: 'Configuracoes', meta: { requiresAuth: true }},
  // {path: '/aluno/home', component: HomeAluno, titulo: 'HomeAluno', meta: { requiresAuth: true }},
  // {path: '/funcionario/home', component: HomeFuncionario, titulo: 'HomeFuncionario', meta: { requiresAuth: true }},

]
