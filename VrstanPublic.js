/* This File is Property of BitOneIncorporated.
	Created: Sunday January 28 2018
	Author: Ian A. Moncrieffe
	Tel: 1876-778-6804
	email: dev.bitone@outlook.com
*/
// Requirements

const express = require('express'),
    path = require('path'),
    ejs_layout = require('ejs-layouts'),
    http = require('http'),
    upload = require('express-fileupload'),
    port  = 4800,
    bodyParser = require('body-parser'),
    db = require('./DB');
var genny = require('./lib/crypt/ugenny');


const app = express();

app.use(upload());
app.set('port', process.env.Port || port);

// Static Resource
var publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Views
app.set('views', path.resolve(__dirname, 'lib/testviews'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Cdca Home Page
app.get('/', function(req, res, next){
    // Get some data from projects

    res.render('cdcahome',{data: genny.genny()});
    });

app.get('/newmember', function(req, res){
    // Get some data from projects

      // Check if the Project is already registered
      db.READ.cdca.serialize(() => {
        db.READ.cdca.all(`SELECT member_id as id,
                        name as name, role as role,
                        lot as lot, mobile as mobile,
                        mobile2 as mobile2, telephone as tel,
                        email as email, joindate as date
                        FROM cdcamember`,(err, row) => {
              if (err) {console.error(err.message);}
              // If Yes Inform the User
              else{
                //console.log(row);
                res.render('cdca_member', {nid:genny.genny(), data:row});
              }


          });
        });



    });
app.post('/newmember', function(req, res){
    // Get some data from projects
    //let user = usersession.username;
    /* Input Validation
     * req.checkBody('projectname', 'Project name is required').notEmpty();
     * req.checkBody('projectlocation', 'Location is required').notEmpty();
     * req.checkBody('owner', 'Owner is required').notEmpty();
     * // Get Errors
     * let errors = req.validationErrors();
     * if(errors){
     *   req.flash('alert alert-danger', 'All Fields are required')
     *   res.redirect('/planning/newproject')
     *   } else { */
      var memberId = genny.genny(),
          name = req.body.member,
          role = req.body.role,
          lot = req.body.lot,
          mobile = req.body.mobile,
          mobile2 = req.body.mobile2,
          tel = req.body.tel,
          email = req.body.email,
          date = req.body.date;
      console.log(memberId);

      db.WRITE.cdca.run("INSERT INTO cdcamember (member_id, name, role, lot, mobile, mobile2, telephone, email, joindate) VALUES (?,?,?,?,?,?,?,?,?)", memberId, name, role, lot, mobile, mobile2, tel, email, date);

    res.redirect('/newmember');
    });



app.route('/book')
  .get(function (req, res) {
      var form = `<form class="form-horizontal" method="post" enctype="multipart/form-data" action="/book"><input id="filename" name="filename" type="file" placeholder="Project Posts" ><button id="submit" name="submit" class="btn btn-primary">Submit</button></form></br>
      <a href="/">home </a>`;
    res.send(form)
  })
  .post(function (req, res) {
      if(req.files){
          console.log(req.files);
          var file = req.files.filename,
            fn = file.name,
            fdata = file.data,
            fenc = file.encoding,
            fmyme = file.mimetype,
            fmd5 = file.md5;
        }
        // move the uploaded file to specified folder
        file.mv('./public/uploads/'+fn, function(err){
            if(err){
                console.log(err)
                res.send(`error occured, type:${err}`) ;
            }
            else{
                res.json(file);
            }
        });
  })
  .put(function (req, res) {
    res.send('Update the book')
  })




// Custom 404 page
app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Ooopps... Sorry File not found');
});

//Custom 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Ouch..!  My bad.. Server Error');
});



http.createServer(app).listen(app.get('port'),function(){
	console.log(`CentryPlan Testing Server started on http://localhost:` +
	 app.get('port') + '; Press Ctrl-C to terminate.');
});
