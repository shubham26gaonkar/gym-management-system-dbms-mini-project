const express = require('express')

const app = express()

const connection = require('./db')

app.use(express.static('public'))

app.set('views', './view')
app.set("view engine", "ejs");


app.get('/team',(req,res) => {
    connection.query('select Team_name,city,Logo from team',
    function(err, results, fields) {
        console.log(results)
        const teams = results.map((results)=> {
          const logoData = results.Logo;
          const logoBase = Buffer.from(logoData).toString('base64');

          return {
            Team_name:results.Team_name,
            city:results.city,
            logoBase,
          };
        });

        res.render("team", {teams})
      }
    )
})

var stadiumQuery = 'SELECT t.Team_name, COUNT(*) as wins, COUNT(*)*3 as points  from `match` as m inner join team as t on m.Result = t.Team_id GROUP BY m.Result ORDER by wins DESC;'
app.get('/standings',(req,res) => {
  connection.query(stadiumQuery,
  function(err, results, fields) {
      console.log(results)
      res.render("standings", {results})
    }
  )
})

var playQuery ='SELECT p.PLicence_no,p.Jersey_no,p.Position,p.Nationality,p.P_name,t.Team_name, TIMESTAMPDIFF(YEAR,p.DateOfBirth,CURRENT_DATE) as age from player as p join player_contract as pc on pc.PLicence_no = p.PLicence_no join  team as t on pc.Team_id = t.Team_id;'
app.get('/player',(req,res) => {
  connection.query(playQuery,
  function(err, results, fields) {
      console.log(results)
      res.render("player", {results})
    }
  )
})

app.get('/home',(req,res) => {
  connection.query('',
  function(err, results, fields) {
      console.log(results)
      res.render("home", {results})
    }
  )
})

/*
var query1='SELECT t1.Team_name as T1 , t2.Team_name as T2 , Goal,s.Stadium_name as sname from `match` m JOIN team t1 on m.Team1 = t1.Team_id JOIN team t2 on m.Team2 = t2.Team_id JOIN stadium s on s.Stadium_id = m.Stadium_id;'

app.get('/result',(req,res) => {
  connection.query(query1,function(err, values , fields) {
      console.log(values)
      res.render("result", {values})
    }
  )
})
*/

app.get('/result', (req, res) => {
  const query = `
    SELECT 
      t1.Team_name AS T1, 
      t1.Logo AS T1_Logo,
      t2.Team_name AS T2, 
      t2.Logo AS T2_Logo,
      Goal, 
      s.Stadium_name AS sname 
    FROM 
      \`match\` m 
      JOIN team t1 ON m.Team1 = t1.Team_id 
      JOIN team t2 ON m.Team2 = t2.Team_id 
      JOIN stadium s ON s.Stadium_id = m.Stadium_id;
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;

    const teams = results.map(result => ({
      T1: result.T1,
      T1_Logo: result.T1_Logo.toString('base64'),
      T2: result.T2,
      T2_Logo: result.T2_Logo.toString('base64'),
      Goal: result.Goal,
      sname: result.sname
    }));

    res.render('result', { teams });
  });
});


app.post('/insert',(req,res) => {
    
    connection.query(
        'insert into',
        ['Page', 45],
        function(err, results) {
          console.log(results);
        }
      );
})

app.listen(3001,()=>{
    console.log("hello")
})