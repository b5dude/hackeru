import { useContext, useState, useEffect } from 'react'
import { userContext } from './GlobalVars'
import { useHistory } from 'react-router-dom';


import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/signInPage.css";
import "./styling_folder/addProductPage.css";


export default function AddProductPage() {

    function both(){
        addOrRemoveCarToList("Add");
        closeOpenAddCarModal("X");
    }
    
    function addImageToReview(){
        document.getElementById("addReviewImage").click();
     }
    
    const fitCars = [];
    let carsArrayIndex = -1;

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
        let selectedBrand = document.getElementById("selectedBrand").value;
        let selectedModel = document.getElementById("selectedModel").value;
        let selectedFromYear = document.getElementById("selectedFromYear").value;
        let selectedToYear = document.getElementById("selectedToYear").value;
        let customersCars = document.getElementById("customersCars");
        let deleteCar = document.getElementById(carsArrayIndex);
        // console.log(deleteCar);

        if(addOrRemove === "Add"){
            carsArrayIndex ++;
            customersCars.innerHTML += `<div class='customersCarsDiv'> <input class='nonInteractionInputs' value='${selectedFromYear} - ${selectedToYear} ${selectedBrand} ${selectedModel}'></input> <img src=`+require('./styling_folder/images/trashIcon.png')+` alt='Delete' class='trashIcon' id=${carsArrayIndex} /> </div>`;
            fitCars.push({
                carsArrayIndex: carsArrayIndex,
                selectedFromYear: Number(selectedFromYear),
                selectedToYear: Number(selectedToYear),
                selectedBrand: selectedBrand,
                selectedModel: selectedModel
            })
            console.log(fitCars);
        }

        if(addOrRemove === "Remove"){
            fitCars.splice()
        }
    };





    const {user, setUser} = useContext(userContext);
    let history = useHistory();

    function addProduct(){

        let productName = document.getElementById("productName").value;
        let productDescription = document.getElementById("productDescription").value;
        let productPartNumber = document.getElementById("productPartNumber").value;
        let productFiles = document.getElementById("productFiles").files;
        let productPictures = document.getElementById("productPictures").files;
        let productPicturesBase64 = document.getElementById("productPictures").value;
        let productCategory = document.getElementById("productCategory").value;
        let filamentDropDown = document.getElementById("filamentDropDown").value;
        let productNozzleTemp = document.getElementById("productNozzleTemp").value;
        let productBedTemp = document.getElementById("productBedTemp").value;    
                
            const h = {}; //headers
            let formData = new FormData();
            let file = [];
            formData.append('productOwner', user._id)
            formData.append('productDescription', productDescription)
            formData.append('productName', productName)
            formData.append('creationDate', new Date())
            formData.append('productPartNumber', productPartNumber)
            formData.append('productCategory', productCategory)
            formData.append('filamentDropDown', filamentDropDown)
            formData.append('productNozzleTemp', productNozzleTemp)
            formData.append('productBedTemp', productBedTemp)
            console.log(fitCars);
            for (let i = 0 ; i < fitCars.length ; i++) {
                formData.append("fitCars", JSON.stringify(fitCars[i]));
            }

            for (let i = 0 ; i < productPictures.length ; i++) {
                formData.append("productPictures", productPictures[i]);
            }

            for (let i = 0 ; i < productFiles.length ; i++) {
                formData.append("productFiles", productFiles[i]);
            }           

            fetch("/add_product", {
                method: 'Post',
                headers: {h},
                body: formData
              }).then( response => response.json() )
              .then( data => {
                if(data._id === '')
                {
                    console.log(data.msg)
                    return
                }
                history.push("product/" + data._id);
            }
            )
        };

        // Base64
        const [baseImage, setBaseImage] = useState([]);

        const uploadImage = async (e) => {
        //   const file = e.target.files[1];
          let base64Array = []
          for(let i=0; i<e.target.files.length; i++){
            const base64 = await convertBase64(e.target.files[i]);
            base64Array.push(base64)
          }

        //   const base64 = await convertBase64(file);
        //   const strippedBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, "");
          setBaseImage(base64Array);
        //   console.log(base64Array);
        };
      
        const convertBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
      
            fileReader.onload = () => {
              resolve(fileReader.result);
            };
      
            fileReader.onerror = (error) => {
              reject(error);
            };
          });
        };


        const [brandArrState, setBrandArrState] = useState([]);

        let brandArr = [];
        useEffect(() => {
          fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
          .then((response) => response.json())
          .then( data => {
            if(brandArr.length !== data.Results.length){
              data.Results.forEach((element, index, array) => {
                brandArr.push(element.MakeName)
                setBrandArrState(brandArr.sort())    
          })
          }
          })
        },[]);
        
        const [modelArrState, setModelArrState] = useState([]);
        
        let modelArr = [];
        function findModel() {
          let selectedFromYear = document.getElementById("selectedFromYear").value
          let selectedToYear = document.getElementById("selectedToYear").value
          let selectedBrand = document.getElementById("selectedBrand").value
          fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${selectedBrand}/modelyear/${selectedFromYear}/vehicleType/car?format=json`)
          .then((response) => response.json())
          .then( data => {
          data.Results.forEach((element, index, array) => {
                modelArr.push(element.Model_Name)
                setModelArrState(modelArr.sort())
              })
          })
          }

  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
                Add A Product
            </h1>
        </div>
        {user ? (
            <>
        <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>Product Name</label>
                <br></br>
                <input type={"text"} id='productName'></input>
                <br></br>
                <br></br>

                <label>Description</label>
                <br></br>
                <textarea type={"text"} id='productDescription'></textarea>
                <br></br>
                <br></br>

                <label>Part Number</label>
                <br></br>
                <input type={"text"} id='productPartNumber'></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Upload Your 3D Files</label>
                <br></br>
                <input type={"file"} id='productFiles' accept=".obj, .stl" multiple></input>
                <br></br>
                <br></br>

                <label>Pictures</label>
                <br></br>
                <input type={"file"} id='productPictures' accept="image/*" multiple onChange={(e) => {uploadImage(e)}}></input>
                <br></br>
                <br></br>
                <div id='selectedPicsContainer'>
                {(() => {
                    let base64ArrayDraw = [];
                    for (let i=0; i < baseImage.length; i++) {
                        base64ArrayDraw.push(<div key={i} className='selectedPics' style={{backgroundImage: `url(${baseImage[i]})`}}></div>);
                    }
                    return base64ArrayDraw;
                })()}
                </div>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Category</label>
                <br></br>
                <select id='productCategory'>
                    <option hidden></option>
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
                    <option hidden></option>
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
                <input type={"number"} id='productNozzleTemp'></input>
                <br></br>
                <br></br>

                <label>Bed Temp</label>
                <br></br>
                <input type={"number"} id='productBedTemp'></input>
                <br></br>
                <br></br>


            </div>

            <div id='carsInputsContainer' className='signInInputsContainer'>
                <div className='myCarsInput' id='myCarsInput' onClick={() => closeOpenAddCarModal("O")}>
                    <label>Fit Cars</label>
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
                <button id='createAccountBtn' className='allButtons' onClick={addProduct}>Upload</button>
            </div>
 
        </div>

        <div id='addCarModalBgc' className='closeModal'>
            <div id='addCarModal'>
                <img src={require('./styling_folder/images/xBtn.png')} alt='X' id='xBtnModal' className='closeModal' onClick={() => closeOpenAddCarModal("X")}/>
                <h2>Select Your Car</h2>
                <select id='selectedFromYear' onChange={findModel}>
                <option value="" hidden>From Year :</option>
                {(() => {
                    let fromYearArr = [];
                    for (let i=1920; i <= new Date().getFullYear(); i++) {
                        fromYearArr.push(<option value={i} key={i}>{i}</option>);
                    }
                    return fromYearArr.reverse();
                })()}
            </select>
            <select id='selectedToYear'>
                <option value="" hidden>To Year :</option>
                {(() => {
                    let toYearArr = [];
                    for (let i=1920; i <= new Date().getFullYear(); i++) {
                        toYearArr.push(<option value={i} key={i}>{i}</option>);
                    }
                    return toYearArr.reverse();
                })()}
            </select>
            <select id='selectedBrand' onChange={findModel}>
                <option value="" hidden>Brand :</option>
                {(() => {
                    let brandArr = [];
                    for (let i=0; i < brandArrState.length; i++) {
                      brandArr.push(<option value={brandArrState[i]} key={i}>{brandArrState[i]}</option>);
                    }
                    return brandArr;
                })()}
            </select>
            <select id='selectedModel'>
                <option value="" hidden>Model :</option>
                {(() => {
                    let modelArr = [];
                    for (let i=0; i < modelArrState.length; i++) {
                      modelArr.push(<option value={modelArrState[i]} key={i}>{modelArrState[i]}</option>);
                    }
                    return modelArr;
                })()}
            </select>
                <button className='allButtons' onClick={() => both()}>Add</button>
            </div>
        </div>
        </>


        ) : (
            <div>
            <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>Product Name</label>
                <br></br>
                <input type={"text"} id='productName'></input>
                <br></br>
                <br></br>

                <label>Description</label>
                <br></br>
                <textarea type={"text"} id='productDescription'></textarea>
                <br></br>
                <br></br>

                <label>Part Number</label>
                <br></br>
                <input type={"text"} id='productPartNumber'></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Upload Your 3D Files</label>
                <br></br>
                <input type={"file"} id='productFiles' accept=".obj, .stl" multiple></input>
                <br></br>
                <br></br>

                <label>Pictures</label>
                <br></br>
                <input type={"file"} id='productPictures' accept=".png, .jpeg, .jpg" multiple></input>
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
                    <option hidden></option>
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
                    <option hidden></option>
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
                <input type={"number"} id='productNozzleTemp'></input>
                <br></br>
                <br></br>

                <label>Bed Temp</label>
                <br></br>
                <input type={"number"} id='productBedTemp'></input>
                <br></br>
                <br></br>


            </div>

            <div id='carsInputsContainer' className='signInInputsContainer'>
                <div className='myCarsInput' id='myCarsInput'>
                    <label>Fit Cars</label>
                    <br></br>
                    <div className='usersCarsDiv'>Add A Car</div>
                    <img src={require('./styling_folder/images/carIcon.png')} alt='Car' className='carIcon' id='carIcon'/>
                </div>
                <div id='customersCars'>

                </div>
            </div>
            <div className='signInInputsContainer' id='createAnAccountCtn'>
                <button id='createAccountBtn' className='allButtons'>Upload</button>
            </div>
        </div>
        <div className='noCommentForYou'>
            <h2>
                Please login in-order to add a product
            </h2>
        </div>
        </div>
        )}

    </div>
  )
}
