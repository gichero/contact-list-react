const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const cors = require ('cors');
const pgp = require ('pg-promise')();
const db = pgp({
    database: 'Contacts'
});

app.use(bodyParser.json());

app.use(cors());

app.use(express.static("public"));

app.get('/api/contacts',(request, response, next)=> {
    db.any('SELECT * FROM contact')
    .then(contact => response.json(contact))
    .catch(next);
});

app.post('/api/contacts', (request, response, next)=> {
    let data = request.body;
    db.one(`INSERT INTO contact VALUES (default, $1, $2, $3, $4, $5)`,
    [data.name, data.phone, data.email, data.type, data.favorite])
    .then(row => response.json(row[0]))
    .catch(next);
});

app.delete('/api/contacts', (request, response, next)=> {
    let id = request.params.id;
    db.none(`DELETE FROM contact WHERE id = $1`, id)
    .then(row => response.json(row))
    .catch(next);
});

app.put('/api/contacts', (request, response, next)=> {
    let data = request.body;
    console.log(data);
    db.none(`update contact set
      name = $[name],
      phone = $[phone],
      email = $[email],
      type = $[type],
      favorite = $[favorite]
    where
      id = $[id]
    returning *`
    , data)
    .then(row => response.json(row))
    .catch(next);
})

app.use((error, request, response, next) =>{
    response.status(500);
    response.jsonresp.json({
      error: error.message,
      stack: error.stack
    });
  });





app.listen(5000, () => {
    console.log("listening on 5000");
});
