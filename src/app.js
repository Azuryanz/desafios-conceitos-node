const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


const repositories = [];

// Listagem dos itens
app.get("/repositories", (request, response) => {
  const params = request.query;
  
  return response.json(repositories);
});

// Criação dos itens de repositório
app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;
  
  const repository = { id: uuid(), title, url, techs };
  repository.likes = 0;

  repositories.push(repository);

  return response.json(repository);
});

// Alteração de valores baseado no id
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
  };
  repository.likes = repositories[repIndex].likes;

  repositories[repIndex] = repository;

  return response.json(repository);
});

// Deleta o repositório baseado no id
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }

  repositories.splice(repIndex, 1);

  return response.status(204).send();
});

// Adiciona 1 like ao repositório baseado no id, por chamada
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }
  repositories[repIndex].likes++;

  return response.json(repositories[repIndex]);
});

module.exports = app;
