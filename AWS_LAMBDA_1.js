const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      //Alunos CRUD Handler
      case "DELETE /todosalunos/{alunoID}":
        await dynamo
          .delete({
            TableName: "Alunos",
            Key: {
              alunoID: event.pathParameters.alunoID
            }
          })
          .promise();
        body = `Deleted aluno ${event.pathParameters.alunoID}`;
        break;
      case "GET /todosalunos/{alunoID}":
        body = await dynamo
          .get({
            TableName: "Alunos",
            Key: {
              alunoID: event.pathParameters.alunoID
            }
          })
          .promise();
        break;
      case "GET /todosalunos":
        body = await dynamo.scan({ TableName: "Alunos" }).promise();
        break;
      case "PUT /todosalunos":
        let requestJSONAlunos = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "Alunos",
            Item: {
              alunoID: requestJSONAlunos.alunoID,
              nome: requestJSONAlunos.nome,
              turma: requestJSONAlunos.turma
            }
          })
          .promise();
        body = `Put alunos ${requestJSONAlunos.alunoID}`;
        break;
      
      //Disciplinas CRUD Handler
      case "DELETE /todasdisciplinas/{disciplinaID}":
        await dynamo
          .delete({
            TableName: "Disciplinas",
            Key: {
              disciplinaID: event.pathParameters.disciplinaID
            }
          })
          .promise();
        body = `Deleted aluno ${event.pathParameters.disciplinaID}`;
        break;
      case "GET /todasdisciplinas/{disciplinaID}":
        body = await dynamo
          .get({
            TableName: "Disciplinas",
            Key: {
              disciplinaID: event.pathParameters.disciplinaID
            }
          })
          .promise();
        break;
      case "GET /todasdisciplinas":
        body = await dynamo.scan({ TableName: "Disciplinas" }).promise();
        break;
      case "PUT /todasdisciplinas":
        let requestJSONDisciplina = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "Disciplinas",
            Item: {
              disciplinaID: requestJSONDisciplina.disciplinaID,
              nome: requestJSONDisciplina.nome
            }
          })
          .promise();
        body = `Put disciplina ${requestJSONDisciplina.disciplinaID}`;
        break;
      
      //Notas CRUD Handler
      case "DELETE /todasnotas/{notaID}":
        await dynamo
          .delete({
            TableName: "Notas",
            Key: {
              notaID: event.pathParameters.notaID
            }
          })
          .promise();
        body = `Deleted nota ${event.pathParameters.notaID}`;
        break;
      case "GET /todasnotas/{notaID}":
        body = await dynamo
          .get({
            TableName: "Notas",
            Key: {
              notaID: event.pathParameters.notaID
            }
          })
          .promise();
        break;
      case "GET /todasnotas":
        body = await dynamo.scan({ TableName: "Notas" }).promise();
        break;
      case "PUT /todasnotas":
        let requestJSONNotas = JSON.parse(event.body);

        var notaID = requestJSONNotas.alunoID + "_" + requestJSONNotas.disciplinaID;

        await dynamo
          .put({
            TableName: "Notas",
            Item: {
              notaID: notaID,
              nota: requestJSONNotas.nota
            }
          })
          .promise();
        body = `Put notas ${requestJSONNotas.alunoID}`;
        break;
         
      default:
      throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
