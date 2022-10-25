# dev_web_tbl
 Repository to hold the source code for the project of Web Development (UAL - 2022).

# Notas ao professor
Infelizmente, devido à restrição de tempo e complexidade envolvida, não foi possível implementar uma sistema administração para o site.

Isso incorre em algumas consequências, sendo a mais imediata delas: novos usuários não são assinalados automaticamente para grupos, então a criação de novos grupos (tabela "course_group", onde um curso pode ter mais de grupo) e associação de alunos aos grupos dos cursos (tabela "student_group", onde um aluno só pode estar cadastrado em um grupo por curso) devem ser feitas diretamente na base de dados. Para além disso, ainda no âmbito da criação de uma nova conta, há de se ter em atenção que apenas endereços de e-mail válidos serão aceitos, e um e-mail de validação para a confirmação da conta será enviado para o mesmo endereço.

Caso as validações feitas pelo professor incluam criação de um novo aluno e execução de "testes" pelo mesmo aluno, vale lembrar que os passos de criação/associação de grupo listados acima precisam ser executados de maneira que o site responda adequadamente, do contrário poderá dar alguns erros inapropriados.

Por último, mas não menos importante: os dados inseridos servem apenas como prova de conceito, o que significa: há 4 cursos, mas apenas o de "Web Development" está propriamente preenchido com dados, e dentro desse apenas o módulo de "Front-end development" tem atividades e questões associadas, de maneira que apenas esse deve ser usado para as validações. Toda a lógica leva em consideração a possibilidade de criação de dados para os outros cursos/módulos/atividades/questões etc na base de dados, e o site responderá adequadamente caso o mesmo seja feito.

Para a realização de testes sem precisar mexer diretamente nos dados, o professor poderá utilizar 3 contas, sendo as duas primeiras associadas ao mesmo grupo do curso mencionado, e a terceira separada em um segundo grupo:
- Login: 30005194@students.ual.pt / Senha: 30005194
- Login: 19991626@students.ual.pt / Senha: 12345
- Login: 30005066@students.ual.pt / Senha: 30005066

PS: atividades em grupo só são liberadas depois que todos os alunos do grupo realizam a atividade individual do módulo, e os comentários são restritos ao módulo e ao grupo daquele curso.
