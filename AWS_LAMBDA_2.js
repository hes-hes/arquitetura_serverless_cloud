const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  var motd = "  ____  _     ___   _   _  ____            _______     ___    _     \n"+
             " / ___|| |   / _ \\ | | | ||  _ \\          | ____\\ \\   / / \\  | |    \n"+
             "| |    | |  | | | || | | || | | |  _____  |  _|  \\ \\ / / _ \\ | |    \n"+
             "| |___ | |__| |_| || |_| || |_| | |_____| | |___  \\ V / ___ \\| |___ \n"+
             " \\____||_____\\___/  \\___/ |____/          |_____|  \\_/_/   \\_\\_____|\n\n"+
             "By ULHT\n" + "\n";


  var menu = "MENU:\n\n"+
             "1 - Para inscrever um aluno utilize o seguinte caminho: /inserir/aluno/{dados_aluno}\n"+
             "    (OBS: {dados_aluno} = <alunoID>_<nome>_<turma>)\n\n"+
             "2 - Para inserir uma disciplina utilize o seguinte caminho: /inserir/disciplina/{dados_disciplina}\n"+
             "    (OBS: {dados_disciplina} = <diciplinaID>_<disciplinaNome>)\n\n"+
             "3 - Para inserir uma nota utilize o seguinte caminho: /inserir/nota/{dados_nota}\n"+
             "    (OBS: {dados_nota} = <alunoID>_<idDisciplina>_<nota>)\n\n"+
             "4 - Para ver a lista dos alunos utilize o seguinte caminho: /mostrar/todosalunos\n\n"+
             "5 - Para ver a lista das disciplinas utilize o seguinte caminho: /mostrar/todasdisciplinas\n\n"+
             "6 - Para ver a lista das notas utilize o seguinte caminho: /mostrar/todasnotas\n\n"+
             "7 - Para consultar um aluno utilize o seguinte caminho: /mostrar/aluno/{<alunoID>}\n\n"+
             "8 - Para consultar uma disciplina utilize o seguinte caminho: /mostrar/disciplina/{<disciplinaID>}\n\n"+
             "9 - Para consultar uma nota utilize o seguinte caminho: /mostrar/notas/{<alunoID>}\n\n"+
             "10 - Para consultar uma alunos por turma utilize o seguinte caminho: /mostrar/aluno/porturma/{<turma>}\n\n"+             
             "11 - Para remover um aluno utilize o seguinte caminho: /delete/aluno/{<alunoID>}\n\n"+
             "12 - Para remove uma disciplina utilize o seguinte caminho: /delete/disciplina/{<disciplinaID>}\n\n"+
             "13 - Para remove uma nota utilize o seguinte caminho: /delete/notas/{<alunoID>}\n\n";

  var mainMenuBack = "\n\nPara voltar ao menu principal, use o seguinte url: https://f7ftlsc06h.execute-api.eu-west-1.amazonaws.com "

  try {
    
    switch (event.routeKey) {

      case "ANY /":
        body = motd + menu;
        break;
      
      case "GET /inserir/aluno/{dados_aluno}":
        var dados_aluno = JSON.stringify(event.pathParameters).toString();
        var param = dados_aluno.substring(16,dados_aluno.length-2);
        var params = param.split("_");
       
        if(params.length == 3 && !isNaN(params[0])){

          await dynamo
          .put({
            TableName: "Alunos",
            Item: {
              alunoID: params[0],
              nome: params[1],
              turma: params[2]
            }
          })
          .promise();

          body = "Aluno adicionado!\n" + 
          "id = " + params[0] + '\n' + 
          "nome = " + params[1] + '\n' +
          "turma = "+ params[2] + '\n' +
          mainMenuBack;

        }
        else {
          body = "ERRO!!! Não foi possivel inserir aluno" + '\n' +
          mainMenuBack;
        }

        break;

      case "GET /inserir/disciplina/{dados_disciplina}":
        
        var dados_disciplina = JSON.stringify(event.pathParameters).toString();
        var param = dados_disciplina.substring(21,dados_disciplina.length-2);
        var params = param.split("_");
        
        if(params.length == 2 && !isNaN(params[0])){

          await dynamo
          .put({
            TableName: "Disciplinas",
            Item: {
              disciplinaID: params[0],
              nome: params[1],
            }
          })
          .promise();

          body = "Disciplina adicionada!\n" + 
          "id = " + params[0] + '\n' + 
          "nome = " + params[1]+ '\n' +
          mainMenuBack;

        }
        else {
          body = "ERRO!!! Não foi possivel inserir disciplina"+ '\n' +
          mainMenuBack;
        }
      
        break;
        
      case "GET /inserir/nota/{dados_nota}":
        
        var dados_disciplina = JSON.stringify(event.pathParameters).toString();
        var param = dados_disciplina.substring(15,dados_disciplina.length-2);
        var params = param.split("_");
        
        if(params.length == 3 && !isNaN(params[0]) &&
             !isNaN(params[1]) &&  !isNaN(params[2])){

          await dynamo
          .put({
            TableName: "Notas",
            Item: {
              notaID: params[0]+"_"+params[1],
              nota: params[2],
            }
          })
          .promise();

          body = "Nota adicionada!\n" + 
          "Aluno = " + params[0] + '\n' + 
          "Disciplina = " + params[1] + '\n' + 
          "Nota = " + params[2]+ '\n' +
          mainMenuBack;

        }
        else {
          body = "ERRO!!! Não foi possivel inserir a nota"+ '\n' +
          mainMenuBack;
        }

        break;

      case "GET /mostrar/todosalunos":

        var alunos_json = await dynamo.scan({ TableName: "Alunos" }).promise();
        var s = JSON.stringify(alunos_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "LISTA DOS ALUNOS:\n";

        while(pos < lista.length){
            var aluno = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = listaBody + aluno + '\n';
            //console.log(aluno);
            pos++;
        }

        body = listaBody+ '\n' +
        mainMenuBack;

        break;

      case "GET /mostrar/todasdisciplinas":
        
        var disciplinas_json = await dynamo.scan({ TableName: "Disciplinas" }).promise();
        var s = JSON.stringify(disciplinas_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "LISTA DAS DISCIPLINAS:\n";

        while(pos < lista.length){
            var disciplina = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = listaBody + disciplina + '\n';
            //console.log(disciplina);
            pos++;
        }

        body = listaBody+ '\n' +
        mainMenuBack;
        break;
        
      case "GET /mostrar/todasnotas":
        
        var notas_json = await dynamo.scan({ TableName: "Notas" }).promise();
        var s = JSON.stringify(notas_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "LISTA DAS NOTAS:\n";

        while(pos < lista.length){
            var nota = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = listaBody + nota + '\n';
            //console.log(nota);
            pos++;
        }

        body = listaBody+ '\n' +
        mainMenuBack;

        break;
    
      case "GET /mostrar/aluno/{id_aluno}":

        var dados_aluno = JSON.stringify(event.pathParameters).toString();
        var param_id = dados_aluno.substring(12,dados_aluno.length-1);

        var alunos_json = await dynamo.scan({ TableName: "Alunos" }).promise();
        var s = JSON.stringify(alunos_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "Aluno não encontrado\n";

        while(pos < lista.length){

          var splits_1 = lista[pos].split(",");
          var splits_2 = splits_1[0].split(":");
          var id = splits_2[1];

          if(id == param_id){
            var aluno = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = aluno + '\n';
            break;
          }
            pos++;
        }

        body = listaBody+ '\n' +
        mainMenuBack;

        break;

      case "GET /mostrar/aluno/porturma/{turma}":

        var dados = JSON.stringify(event.pathParameters).toString();
        var param_turma = dados.substring(9,dados.length-1);

        var alunos_json = await dynamo.scan({ TableName: "Alunos" }).promise();
        var s = JSON.stringify(alunos_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "";

        while(pos < lista.length){

          var splits_1 = lista[pos].split(",");
          var splits_2 = splits_1[1].split(":");
          var turma = splits_2[1];

          if(turma == param_turma){
            var aluno = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = listaBody + aluno + '\n';
            
          }
            pos++;
        }


        if(listaBody == ""){
          listaBody = "Alunos não encontrados\n";
        }

        body = listaBody+ '\n' +
        mainMenuBack;


        break;

      case "GET /mostrar/disciplina/{id_disciplina}":
        
        var dados_disciplina = JSON.stringify(event.pathParameters).toString();
        var param_id = dados_disciplina.substring(17,dados_disciplina.length-1);

        var disciplinas_json = await dynamo.scan({ TableName: "Disciplinas" }).promise();
        var s = JSON.stringify(disciplinas_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "Disciplina não encontrada\n";

        while(pos < lista.length){

          var splits_1 = lista[pos].split(",");
          var splits_2 = splits_1[0].split(":");
          var id = splits_2[1];

          if(id == param_id){
            var disciplina = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = disciplina + '\n';
            break;
          }
            pos++;
        }

        body = listaBody+ '\n' +
        mainMenuBack;

        break;
 
      case "GET /mostrar/notas/{id_aluno}":
        
        var dados_nota = JSON.stringify(event.pathParameters).toString();
        var param_id = dados_nota.substring(12,dados_nota.length-1);

        var nota_json = await dynamo.scan({ TableName: "Notas" }).promise();
        var s = JSON.stringify(nota_json);
        var l = s.substring(11,s.length - 30);
        var lista = l.split('},{');

        var pos = 0;
        listaBody = "Nota não encontrada\n";

        while(pos < lista.length){

          var splits_1 = lista[pos].split(",");
          var splits_2 = splits_1[1].split(":");
          var id = splits_2[1];

          if(id == param_id){
            var disciplina = "(" + (pos+1).toString() + ") - " + lista[pos];
            listaBody = disciplina + '\n';
            break;
          }
            pos++;
        }

        body = listaBody+ '\n' +
        mainMenuBack;
        

        break;
        
      case "GET /delete/aluno/{id_aluno}":

        var dados_aluno = JSON.stringify(event.pathParameters).toString();
        var param_id = dados_aluno.substring(13,dados_aluno.length-2);

        await dynamo
          .delete({
            TableName: "Alunos",
            Key: {
              alunoID: param_id
            }
          })
          .promise();

        body = "Foi removido o aluno com id = " + param_id+ '\n' +
        mainMenuBack;

        break;
        
      case "GET /delete/disciplina/{id_disciplina}":
        
        var dados_disciplina = JSON.stringify(event.pathParameters).toString();
        var param_id = dados_disciplina.substring(18,dados_disciplina.length-2);

        await dynamo
          .delete({
            TableName: "Disciplinas",
            Key: {
              disciplinaID: param_id
            }
          })
          .promise();

        body = "Foi removido a disciplina com id = " + param_id+ '\n' +
        mainMenuBack;

        break;
        
      case "GET /delete/notas/{id_aluno}":
        
        var dados_nota = JSON.stringify(event.pathParameters).toString();
        var param_id = dados_nota.substring(13,dados_nota.length-2);

        await dynamo
          .delete({
            TableName: "Notas",
            Key: {
              notaID: param_id
            }
          })
          .promise();

        body = "Foi removido a nota com id = " + param_id+ '\n' +
        mainMenuBack;
        

        break;
      
      default:
      throw new Error(`Unsupported route: "${event.routeKey}"`);
    }

  } 
  catch (err) {
    statusCode = 400;
    body = err.message+ '\n' +
    mainMenuBack;
  }
   finally {
    //body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };

};








