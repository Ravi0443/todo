var Model =require('./models/models.js');
var express =require('express');
var mongoose =require('mongoose');
var bodyParser=require('body-parser');
var morgan =require('morgan');

var app =express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

var db ="mongodb://localhost/todo";

mongoose.connect(db,function(err,response)
{
	if (err) 
	{
		console.log('Failed to connected to ' +db);
	}
	else
	{
		console.log('connected to ' +db );
	}
});

var router =express.Router();
// GET
router.get('/api/users',function(request,response ){
	Model.find({},function(err,users){
		if(err){
			response.status(400).send(err);
		}
		else
		{
			response.status(200).send(users)
		}
	});
});

	//Update User

router.put('/api/users',function(request,response )
{
	
	Model.findById(request.body._id,function(err,user)
	{
		if(err){
			response.status(404).send(err)
		}
		else
		{
			user.update(request.body, function(err,success){
				if(err)
				{
			response.send(err)
		}
		else
		{
			response.status(200).send({message: 'Success'})
		}
		})
		}
		});
	});


// Delete

router.delete('/api/users:id',function(request,response )
{
	var id =request.params.id;

	Model.remove({_id:id},function(err,res)
	{
		if(err){
			response.status(500).send(err)
		}
		else
		{
			response.status(200).send({message: 'Success On  deleting User'})
		}
	});
});

//POST

router.post('/api/users',function(request,response )
{
	var model =new Model(request.body);

	model.save(function(err,user)
	{
		if(err){
			response.status(500).send(err)
		}
		else
		{
			response.status(201).send(user)
		}
	});
});

app.use('/',router);


app.use(morgan('dev'));

app.use(express.static(__dirname+'/public'));

app.listen(3000,function(){
	console.log('listening on port 3000');
});