import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/signInPage.css";
import "./styling_folder/editUploadPage.css";


document.title = "Add A Product";

const productArr = [];
const fitCars = [];
let carsArrayIndex = -1;

function addProduct(){

    let productName = document.getElementById("productName").value;
    let productDescription = document.getElementById("productDescription").value;
    let productPartNumber = document.getElementById("productPartNumber").value;
    let productFiles = document.getElementById("productFiles").value;
    let productPictures = document.getElementById("productPictures").value;
    let productFitCars = document.getElementById("productFitCars").value;
    let productCategory = document.getElementById("productCategory").value;
    let filamentDropDown = document.getElementById("filamentDropDown").value;
    let productNozzleTemp = document.getElementById("productNozzleTemp").value;
    let productBedTemp = document.getElementById("productBedTemp").value;

        
        productArr.push(
            {
                productDescription: productDescription,
                productName: productName,
                creationDate: new Date(),
                productPartNumber: productPartNumber,
                productFiles: productFiles,
                productPictures: productPictures,
                productFitCars: productFitCars,
                productCategory: productCategory,
                filamentDropDown:filamentDropDown,
                productNozzleTemp:productNozzleTemp,
                productBedTemp:productBedTemp,
                fitCars: fitCars
            })
        console.log("Product's Details", productArr);
    };


// Function that opens or closes the modal (X = Close, O = Open)
function closeOpenAddCarModal(closeOrOpen){
    let closeModal = document.getElementsByClassName("closeModal");
    let openModal = document.getElementById("carIcon");

    let modalBg = document.getElementById("addCarModalBgc");

    if(closeOrOpen === 'X'){
        modalBg.style.display = "none";
    }

    if(closeOrOpen === 'O'){
        modalBg.style.display = "flex";
    }
};


function addOrRemoveCarToList(addOrRemove){
    let carBrand = document.getElementById("carBrand").value;
    let carModel = document.getElementById("carModel").value;
    let carYear = document.getElementById("carYear").value;
    let customersCars = document.getElementById("customersCars");
    let deleteCar = document.getElementById(carsArrayIndex);
    console.log(deleteCar);

    if(addOrRemove === "Add"){
        carsArrayIndex ++;
        customersCars.innerHTML += `<div class='customersCarsDiv'> <input class='nonInteractionInputs' value='${carYear} ${carBrand} ${carModel}'></input> <img src=`+require('./styling_folder/images/trashIcon.png')+` alt='Delete' class='trashIcon' id=${carsArrayIndex} /> </div>`;
        fitCars.push({
            carsArrayIndex: carsArrayIndex,
            carYear: carYear,
            carBrand: carBrand,
            carModel: carModel
        })
    }

    if(addOrRemove === "Remove"){
        fitCars.splice()
    }
};


function both(){
    addOrRemoveCarToList("Add");
    closeOpenAddCarModal("X");
}

function addImageToReview(){
    document.getElementById("addReviewImage").click();
 }



export default function EditUploadPage() {
    const params = useParams()
    const productIdUrl = params.productId

    let productSearch = {text: productIdUrl, type: "productId"}; 
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("/get_products", {
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(productSearch)
      }).then( response => response.json() )
      .then( data => {
        setProducts(data)
      })
    }, [])

const history = useHistory()

//  let productName = document.getElementById("productName").value;
//  let productDescription = document.getElementById("productDescription").value;
//  let productPartNumber = document.getElementById("productPartNumber").value;
//  let productCategory = document.getElementById("productCategory").value;
//  let filamentDropDown = document.getElementById("filamentDropDown").value;
//  let productNozzleTemp = document.getElementById("productNozzleTemp").value;
//  let productBedTemp = document.getElementById("productBedTemp").value;


    function editProduct(productIdToEdit){
        let productName = document.getElementById("productName").value;
        let productDescription = document.getElementById("productDescription").value;
        let productPartNumber = document.getElementById("productPartNumber").value;
        let productCategory = document.getElementById("productCategory").value;
        let filamentDropDown = document.getElementById("filamentDropDown").value;
        let productNozzleTemp = document.getElementById("productNozzleTemp").value;
        let productBedTemp = document.getElementById("productBedTemp").value;


        let productDetailsToEditReq = {
            _id: productIdToEdit,
            productDescription: productDescription,
            productName: productName,
            lastUpdateDate: new Date(),
            productPartNumber: productPartNumber,
            productCategory: productCategory,
            filamentDropDown: filamentDropDown,
            productNozzleTemp: productNozzleTemp,
            productBedTemp: productBedTemp,
        }

        console.log(productDetailsToEditReq);

          fetch("/edit_products", {
            method: 'Post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(productDetailsToEditReq)
          }).then(console.log(productDetailsToEditReq))
          history.push("/product/" + products._id)
      }


  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
                Edit An Upload
            </h1>
        </div>
        <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>Product Name</label>
                <br></br>
                <input type={"text"} id='productName' defaultValue={products.productName}></input>
                <br></br>
                <br></br>

                <label>Description</label>
                <br></br>
                <textarea type={"text"} id='productDescription' defaultValue={products.productDescription}></textarea>
                <br></br>
                <br></br>

                <label>Part Number</label>
                <br></br>
                <input type={"text"} id='productPartNumber' defaultValue={products.productPartNumber}></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Upload Your 3D Files</label>
                <br></br>
                <input type={"file"} id='productFiles' accept=".obj, .stl"></input>
                <br></br>
                <br></br>

                <label>Pictures</label>
                <br></br>
                <input type={"file"} id='productPictures' accept="image/*"></input>
                <br></br>
                <br></br>

                <label>Car</label>
                <br></br>
                <input type={"text"} id='productFitCars'></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Category</label>
                <br></br>
                <select id='productCategory'>
                    <option defaultValue={products.productCategory}>{products.productCategory}</option>
                    <option>Engine</option>
                    <option>Braking</option>
                    <option>A/C</option>
                    <option>Drivetrain</option>
                    <option>Exhaust</option>
                    <option>Interior</option>
                    <option>Exterior</option>
                    <option>Suspension</option>
                    <option>Steering</option>
                    <option>Accessories</option>
                    <option>Tools</option>
                </select>
                <br></br>
                <br></br>

                <label>Filament</label>
                <br></br>
                <select id='filamentDropDown'>
                    <option defaultValue={products.filamentDropDown}>{products.filamentDropDown}</option>
                    <option>ABS</option>
                    <option>ASA</option>
                    <option>Nylon</option>
                    <option>PETG</option>
                    <option>PLA</option>
                </select>
                <br></br>
                <br></br>

                <label>Nozzle Temp</label>
                <br></br>
                <input type={"number"} id='productNozzleTemp' defaultValue={products.productNozzleTemp}></input>
                <br></br>
                <br></br>

                <label>Bed Temp</label>
                <br></br>
                <input type={"number"} id='productBedTemp' defaultValue={products.productBedTemp}></input>
                <br></br>
                <br></br>


            </div>

            <div id='carsInputsContainer' className='signInInputsContainer'>
                <div className='myCarsInput' id='myCarsInput' onClick={() => closeOpenAddCarModal("O")}>
                    <label>My Cars (Optional)</label>
                    <br></br>
                    <div className='usersCarsDiv' onClick={() => closeOpenAddCarModal("O")}>Add A Car</div>
                    <img src={require('./styling_folder/images/carIcon.png')} alt='Car' className='carIcon' id='carIcon'/>
                </div>
                <div id='customersCars'>

                </div>


                {/* <div className='myCarsInput'>
                    <label>My Cars (Optional)</label>
                    <br></br>
                    <input placeholder="2001 Audi S4"></input>
                    <img src={require('./styling_folder/images/carIcon.png')} alt='Car' className='carIcon'/>
                    <img src={require('./styling_folder/images/trashIcon.png')} alt='Car' className='trashIcon'/>
                    <br></br>
                    <br></br>
                </div> */}
            </div>

            <div className='signInInputsContainer' id='createAnAccountCtn'>
                <button id='createAccountBtn' className='allButtons' onClick={() => editProduct(products._id)}>Update</button>
                <Link to={"/my_uploads"}>
                    <button className='allButtons exitButtons'>Exit Without Saving</button>
                </Link>
            </div>
        </div>

        <div id='addCarModalBgc' className='closeModal'>
            <div id='addCarModal'>
                <img src={require('./styling_folder/images/xBtn.png')} alt='X' id='xBtnModal' className='closeModal' onClick={() => closeOpenAddCarModal("X")}/>
                <h2>Select Your Car</h2>
                <select id='carBrand'>
                    <option value="" hidden>Brand :</option>
                    <option value="Audi">Audi</option>
                    <option value="Ford">Ford</option>
                    <option value="Opel">Opel</option>
                    <option value="Lotus">Lotus</option>
                </select>
                <select id='carModel'>
                    <option value="" hidden>Model :</option>
                    <option value="S4">S4</option>
                    <option value="Falcon">Falcon</option>
                    <option value="Manta">Manta</option>
                    <option value="Elise">Elise</option>
                </select>
                <select id='carYear'>
                    <option value="" hidden>Year :</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                </select>
                <button className='allButtons' onClick={() => both()}>Add</button>
            </div>
        </div>

    </div>
  )
}
