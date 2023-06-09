const express=require('express')
require('dotenv').config()
const {MongoClient}= require('mongodb')
const bodyParser=require('body-parser')
const cors=require('cors')

const app=express()

app.use(bodyParser.json())
app.use(cors())


const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqxh9tp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const client= new MongoClient(uri,{
	useNewUrlParser:true,
	useUnifiedTopology:true
})

async function run(){
	await client.connect()
	const productsCollection=client.db("emajhonStore").collection("products")
	const orderCollection=client.db("emajhonStore").collection("order")
	app.post('/addProduct',(req,res)=>{
		const product=req.body
		// console.log(product)
		try{
			productsCollection.insertOne(product).then(result=>{
				console.log(result)
				console.log(result.insertedCount)
			})
		}catch(error){
			console.log(error)
		}

	})
	app.get('/product',async (req,res)=>{
		try{
			const data= await productsCollection.find().toArray()
			res.send(data)
		}catch (error){
			console.log(error)
		}

	})
	app.get('/product/:key',async (req,res)=>{
		try{
			const data= await productsCollection.find({key:req.params.key}).toArray()
			// console.log(data[0])
			res.send(data[0])
		}catch (error){
			console.log(error)
		}

	})
	app.post('/productKeys',async (req,res)=>{
		try{
			const product=req.body
			const data= await productsCollection.find({key:{$in:product}}).toArray()
			// console.log(data[0])
			res.send(data)
		}catch (error){
			console.log(error)
		}

	})

	app.post('/addOrder', async (req, res) => {
		try{
		  const order = req.body;
		  const result = await orderCollection.insertOne(order);
		  console.log(result.insertedId);
		  res.send(result.insertedId);
		}
		catch(error){
			console.log(error)
		}
	});

	console.log("connected")
}



// console.log(process.env.DB_USER)
// app.get('/',(req,res)=>{
// 	res.send('hello')
// })
run()

app.listen(process.env.PORT || 4200)
