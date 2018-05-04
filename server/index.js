const bodyParser = require('body-parser')

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('shopping.sql');

const ID_IDENTIFIER = 'id';
const PRODUCT_IDENTIFIER = 'produkt';
const COST_IDENTIFIER = 'kosten';
const DONE_IDENTIFIER = 'erledigt';

const URL = '/einkaufsliste';

String.prototype.format = function () {
  a = this;
  for (k in arguments) {
    a = a.replace('{' + k + '}', arguments[k]);
  }
  return a
}

function init() {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS shopping_list');
    db.run('CREATE TABLE shopping_list (' +
      ID_IDENTIFIER + ' INTEGER PRIMARY KEY AUTOINCREMENT,' +
      PRODUCT_IDENTIFIER + ' TEXT NOT NULL,' +
      COST_IDENTIFIER + ' REAL NOT NULL,' +
      DONE_IDENTIFIER + ' INTEGER CHECK (' + DONE_IDENTIFIER + ' in (0, 1))' +
      ')');

    db.run('DELETE FROM shopping_list');

    // let stmt = 
    //   db.prepare('INSERT INTO shopping_list (produkt, kosten, erledigt) VALUES (?, ?, ?)');

    // for (let i = 0; i < 10; i++) {
    //     stmt.run('Baguette' + i, '1' + i, i % 2);
    // }

    // stmt.finalize();
  });
};

function setup_routes() {
  app.get(URL, (req, res) => {
    try {
      db.all('SELECT * FROM shopping_list', (err, rows) => {
        if (err)
          throw err;

        res.send(rows);
      });
    } catch (err) {
      send_error_response(res, err);
    }
  });

  app.delete(URL + '/:product_id', (req, res) => {
    try {
      let productId = req.params['product_id'];
      db.each('SELECT * FROM shopping_list WHERE {0}=?'.format(ID_IDENTIFIER), productId,
        (err, row) => {
          if (err)
            throw err;

          db.run('DELETE FROM shopping_list WHERE {0}=?'
            .format(ID_IDENTIFIER), productId,
            (err) => {
              if (err)
                throw err;

              res.send(row);
            });
        }, (err, rowCount) => {
          if (rowCount < 1) // product not found
            res.status(404).send({
              error: 'Product with ID: {0} not found'.format(productId)
            });
        });
    } catch (err) {
      send_error_response(res, err);
    }
  });

  app.put(URL + '/:product_id', (req, res) => {
    try {
      if (req.body[DONE_IDENTIFIER] === undefined) {
        throw 'Body incorrect! Must be: {{0}: <0|1>}'
          .format(DONE_IDENTIFIER);
      }

      let productId = req.params['product_id'];
      let newDone = req.body[DONE_IDENTIFIER];

      if (newDone != '0' && newDone != '1') {
        throw 'Body incorrect! Must be: {{0}: <0|1>}'
          .format(DONE_IDENTIFIER);
      }

      db.each('SELECT * FROM shopping_list WHERE {0}=?'.format(ID_IDENTIFIER), productId,
        (err, row) => {
          if (err)
            throw err;

          db.run('UPDATE shopping_list SET {0}=? WHERE {1}=?'
            .format(DONE_IDENTIFIER, ID_IDENTIFIER), newDone, productId,
            (err) => {
              if (err)
                throw err;

              row[DONE_IDENTIFIER] = newDone;

              res.send(row);
            });
        }, (err, rowCount) => {
          if (rowCount < 1) // product not found
            res.status(404).send({
              error: 'Product with ID: {0} not found'.format(productId)
            });
        });
    } catch (err) {
      send_error_response(res, err);
    }
  });

  app.post(URL, (req, res) => {
    try {
      if (!body_correct(req.body)) {
        throw 'Body incorrect! Must be: {{0}: <productName>, {1}: <cost>, {2}: <0|1>}'
          .format(PRODUCT_IDENTIFIER, COST_IDENTIFIER, DONE_IDENTIFIER);
      }
      db.run('INSERT INTO shopping_list ({0}, {1}, {2}) VALUES (?, ?, ?)'
        .format(PRODUCT_IDENTIFIER, COST_IDENTIFIER, DONE_IDENTIFIER),
        req.body[PRODUCT_IDENTIFIER], req.body[COST_IDENTIFIER], req.body[DONE_IDENTIFIER],
        (err) => {
          if (err)
            throw err;

          get_id_for_inserted_data((id) => {
            req.body[ID_IDENTIFIER] = id;
            res.send(req.body);
          });
        });
    } catch (err) {
      send_error_response(res, err);
    }
  });
}

function body_correct(body) {
  return body[PRODUCT_IDENTIFIER] != null && body[COST_IDENTIFIER] != null && body[DONE_IDENTIFIER] != null &&
    body[PRODUCT_IDENTIFIER] !== "" && !isNaN(body[COST_IDENTIFIER]) && [0, 1].includes(Number(body[DONE_IDENTIFIER]) &&
      Number(body[COST_IDENTIFIER]) >= 0.01 && body[COST_IDENTIFIER] <= 1000000000000);
}

function send_error_response(res, err) {
  res.status(400).send({
    error: err
  });
}

function get_id_for_inserted_data(callback) {
  db.each('SELECT last_insert_rowid() as id',
    (err, row) => {
      if (err)
        throw err;

      callback(row['id']);
    });
}

function start_listening() {
  setup_routes();

  app.listen(3000, () => console.log('Listening on port 3000!'));
}

init(); // run to recreate table

start_listening();
