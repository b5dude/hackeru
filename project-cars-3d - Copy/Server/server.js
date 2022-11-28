// Express set up
const express = require('express');
const app = express();
app.use('/Uploads/', express.static('Uploads'))

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Mongoose set up
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project_cars_3d');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log('Connected to DB'));

app.use(express.json());

//CORS set up
// const cors = require('cors');
// app.use(cors({
//     origin: 'https://vpic.nhtsa.dot.gov/'
// }));

// Bcrypt set up
const bcrypt = require('bcrypt')

// Multer set up
const multer = require('multer');

const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.body.userFname !== undefined){
            cb(null, './Uploads/Users_avatars');
        }
        else{
            cb(null, './Uploads/Products_files');
        }
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ""))
    }
});
const upload = multer({storage: storage})


// Mongoose schemas
const userSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    userSiteName: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    userPassword: {
        type: String,
        required: true
    },
    userFname: {
        type: String,
        required: true
    },
    userLname: {
        type: String,
        required: true
    },
    userCountry: {
        type: String,
        required: true
    },
    userBirthday: {
        type: Date,
        required: true
    },
    carsOwn: {
        type: String
    },
    userAvatar:{
        type: String
    },
});

userSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.userPassword, salt)
        this.userPassword = hashedPassword
        next()
    }
    
    catch (error) {
        next(error)
    }
})

User = mongoose.model('User', userSchema)



const productSchema = new mongoose.Schema({
    productOwner: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    productDescription: {
        type: String,
        required: true
    },
    productPartNumber: {
        type: String,
    },
    productFiles: [{
        type: String,
        // required: true
    }],
    productPictures: [{
        type: String,
        required: true
    }],
    lastUpdateDate:{
        type: Date,
        default: null
    },
    productCategory: {
        type: String,
        required: true
    },
    filamentDropDown: {
        type: String,
    },
    productNozzleTemp: {
        type: Number,
    },
    productBedTemp: {
        type: Number,
    },
    productCommentsArr: {
        type: Array,
        default: []
    },
    productDownloads: {
        type: Number,
        default: 0
    },
    fitCars: [{ 
        type: Object,
        required: true
    }]
});

Product = mongoose.model('Product', productSchema)


app.post('/loginInfo', async (req, res) => {
    //find user exist or not
    User.findOne({ userEmail: req.body.userEmail })
        .then(user => {
            //if user not exist than return status 400
            if (!user){
                //msg: "User not exist"
                res.status(400).json()
                return
            }

            bcrypt.compare(req.body.userPassword, user.userPassword, (err, result) => {
                //if error than throw error
                if (err){
                    res.json(err)
                    return
                }

                //if both match than you can do anything
                if (result) {
                     res.status(200).json(user)
                     return
                } else {
                    //msg: "Unauthorised credentials"
                     res.status(401).json()
                     return
                }
            })
        })
})


app.post('/getProductOwner', function (req, res){
    User.findOne({_id: req.body.text}, (error, productOwner) => {
        if (error) {
            res.json(error)
            return
        }
        else {
            res.json(productOwner);
            return
        }
    }) 
})



app.post("/get_products",  (req, res) => {
    let productSearch = req.body

    switch(productSearch.type)
    {
        case "freeText":
            Product.find({productName: { "$regex": productSearch.text, "$options": "i" }}, (error, productData) => {
                if(error){
                    console.log(error);
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            })
        break;

        case "partNum":
            Product.find({productPartNumber: productSearch.text}, (error, productData) => {
                if(error){
                    // console.log(error);
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            }) 
        break;

        case "carModel":  
            Product.find(
                { "fitCars.selectedFromYear": Number(productSearch.fromYear), "fitCars.selectedModel": productSearch.model, "fitCars.selectedBrand": productSearch.brand },
                function(error, productData) {
                  if (error) {
                    res.send(error);
                  } else {
                    res.json(productData);
                  }
                }
              );

            break;

        case "myProducts":
            Product.find({productOwner: productSearch.text}, (error, productData) => {
                if(error){
                    // console.log(error);
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            })
        break;

        case "new":
            Product.find({}).sort({ creationDate: -1 }).limit(3).exec((error, productData) => {
                    // console.log(productData);
                    if(error){
                        // console.log(error);
                        res.json(error)
                    }
                    else{
                        res.json(productData);
                        // console.log(productData);
                    }
                })     
            break;

        case "productId":
            Product.findOne({_id: productSearch.text}, (error, productData) => {
                if(error){
                    // console.log(error);
                    res.json(error)
                }
                else{
                    res.json(productData);
                }
            })        
            break;

        default:
            res.json("Not a valid search type")
        break;
    }
   });
   


app.post("/product_comments", (req, res) => {
    // console.log(req.body);
    if (req.body.commentText !== ""){
        const newComment = req.body
        Product.findOneAndUpdate({_id: newComment.productId}, 
            {$push: {productCommentsArr: newComment}}, 
            (err, result) => {
            try{
                res.status(201).json(newComment)
            }
            catch (err){
                res.status(400).json({message: err.message})
            }
            })
}});


app.post("/add_product", upload.fields([{name: 'productPictures', maxCount:6}, {name: 'productFiles', maxCount:6}]),(req, res) => {
    let productPicturesArray = [];
    for (i=0; i < req.files.productPictures.length; i++){
        productPicturesArray.push(req.files.productPictures[i].path.replace("\\","/"))
    }

    let productFilessArray = [];
    for (i=0; i < req.files.productFiles.length; i++){
        productFilessArray.push(req.files.productFiles[i].path.replace("\\","/"))
    }

    if (req.body.productName !== "" || req.body.productOwner !== null){
        let fitCarsArr = [];
        for(let i=0; i<req.body.fitCars.length; i++){
            fitCarsArr.push(JSON.parse(req.body.fitCars[i]))
        }
        
        const newProductReq = new Product({
            productOwner: req.body.productOwner,
            productName: req.body.productName,
            creationDate: req.body.creationDate,
            productDescription: req.body.productDescription,
            productPartNumber: req.body.productPartNumber,
            productFiles: productFilessArray,
            productPictures: productPicturesArray,
            productCategory: req.body.productCategory,
            filamentDropDown: req.body.filamentDropDown,
            productNozzleTemp: req.body.productNozzleTemp,
            productBedTemp: req.body.productBedTemp,
            fitCars: fitCarsArr
            // productDownloads: req.body.productDownloads,
    })

    try{
        const newProduct =  newProductReq.save()
        res.status(201).json(newProductReq)
    }
    
    catch (err) {
        res.status(400).json({message: err.message})
    }
}
});



app.post("/add_user", upload.single('userAvatar'), (req, res) => {
    User.find({$or:[{userEmail: req.body.userEmail},{userSiteName: req.body.userSiteName}]}, function(err, user) {
    if(user.length > 0){
        if (user[0].userEmail === req.body.userEmail){
            console.log("Email already exists");
            res.status(403).json({message: "Email already exists"})
            return
        }
    
        if (user[0].userSiteName === req.body.userSiteName){
            console.log("User name already exists");
            res.status(403).json({message: "User name already exists"})
            return
        }
    }   

    else{
        let pathRegex = null;

        if (req.file === undefined || req.file === null){
            pathRegex = null;
        }
        else{
            pathRegex = req.file.path.replace("\\","/");
        }
        if (req.body.userEmail !== ""){
            const newUserReq = new User({
                userEmail: req.body.userEmail,
                userSiteName: req.body.userSiteName,
                userPassword: req.body.userPassword,
                userFname: req.body.userFname,
                userLname: req.body.userLname,
                userCountry: req.body.userCountry,
                userBirthday: req.body.userBirthday,
                userAvatar: pathRegex
                //carsOwn: req.body.carsOwn
        })
    
        try{
            const newUser =  newUserReq.save()
            res.status(201).json(newUserReq)
        }
        
        catch (err) {
            res.status(400).json({message: err.message})
        }
        }
    }
 });
});


app.post("/delete_products",  (req, res) => {
    Product.findOneAndDelete({_id: req.body.productIdToDelete}, function (err, deletedProduct) {
        console.log("Delete this " + req.body.productIdToDelete);
    if(err){
        res.status(400).json({message: err.message})
    }
    
    else {
        res.status(201).json("Product Deleted " + req.body.productIdToDelete)
    }
    }
)});


app.post("/edit_products", (req, res) => {
    console.log(req.body);
    let lastUpdateDate = Date.now
    let lastUpdateDateString = lastUpdateDate.toString()

    Product.findOneAndUpdate({_id: req.body._id}, {$set:{productDescription: req.body.productDescription, productName: req.body.productName, productPartNumber: req.body.productPartNumber, productCategory: req.body.productCategory, filamentDropDown: req.body.filamentDropDown, productNozzleTemp: req.body.productNozzleTemp, productBedTemp: req.body.productBedTemp}}, {new: true}, (err, doc) => {
        if (err){
            // res.sendStatus(500);
            console.log("Something wrong when updating data!");
        }

        res.send('Succesfully saved');
        console.log(doc);

    })
});


app.post("/product_was_downloaded", (req, res) => {
    let counter = req.body.productDownloads
    let incrementCounter = ++counter
    Product.findOneAndUpdate({_id: req.body._id}, {$set:{productDownloads: incrementCounter}}, {new: true}, (err, doc) => {
        if (err){
            // res.sendStatus(500);
            console.log("Something wrong when updating data!");
        }

        res.json(doc)
    })
});


app.listen(5000, () => {console.log("server started on port 5000");})