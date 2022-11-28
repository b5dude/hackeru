import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/signInPage.css";

document.title = "Sign In Page";

function countryAPI(){
  const countryDropDown = document.getElementById('countryDropDown');

  if(countryDropDown !== null){
    fetch('https://restcountries.com/v3.1/all').then(res => {
        return res.json();
      }).then(data => {
        let output = "";
        data.forEach(country => {
          //console.log(country);
          output += `<option value="${country.name.common}">${country.name.common}</option>`;
        })
        
        countryDropDown.innerHTML = output;

    
      }).catch(err => {
        console.log(err);
      })
  }
}

let newUser = {};
const carsOwn = [];
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
    let carBrand = document.getElementById("carBrand").value;
    let carModel = document.getElementById("carModel").value;
    let carYear = document.getElementById("carYear").value;
    let customersCars = document.getElementById("customersCars");
    let deleteCar = document.getElementById(carsArrayIndex);
    console.log(deleteCar);

    if(addOrRemove === "Add"){
        carsArrayIndex ++;
        customersCars.innerHTML += `<div class='customersCarsDiv'> <input class='nonInteractionInputs' value='${carYear} ${carBrand} ${carModel}'></input> <img src=`+require('./styling_folder/images/trashIcon.png')+` alt='Delete' class='trashIcon' id=${carsArrayIndex} /> </div>`;
        carsOwn.push({
            carsArrayIndex: carsArrayIndex,
            carYear: carYear,
            carBrand: carBrand,
            carModel: carModel
        })
    }

    if(addOrRemove === "Remove"){
        carsOwn.splice()
    }
};

function both(){
    addOrRemoveCarToList("Add");
    closeOpenAddCarModal("X");
}

function addImageToReview(){
    document.getElementById("addReviewImage").click();
 }


export default function SignInPage() {
    useEffect(() => {
        countryAPI();
     });


     const history = useHistory()

        async function addUser(){

            let userSiteName = document.getElementById("userSiteName").value;
            let userEmail = document.getElementById("userEmail").value;
            let userPassword = document.getElementById("userPassword").value;
            let userConfirmPassword = document.getElementById("userConfirmPassword").value;
            let userFname = document.getElementById("userFname").value;
            let userLname = document.getElementById("userLname").value;
            let userCountry = document.getElementById("countryDropDown").value;
            let userBirthday = document.getElementById("userBirthday").value;
            let userAvatar = document.getElementById("addReviewImage").files[0];
        
                if(userPassword === userConfirmPassword){
                    newUser =
                        {
                            userEmail: userEmail,
                            userSiteName: userSiteName,
                            creationDate: new Date(),
                            userPassword: userPassword,
                            userFname: userFname,
                            userLname: userLname,
                            userCountry: userCountry,
                            userBirthday: userBirthday,
                            userAvatar: userAvatar,
                            carsOwn: carsOwn
                        }
                    // console.log("Customer's Details", newUser);

                    const h = {}; //headers
                    let formData = new FormData();

                    formData.append('userEmail', userEmail)
                    formData.append('userSiteName', userSiteName)
                    formData.append('creationDate', new Date())
                    formData.append('userPassword', userPassword)
                    formData.append('userFname', userFname)
                    formData.append('userLname',  userLname)
                    formData.append('userCountry', userCountry)
                    formData.append('userBirthday', userBirthday)
                    formData.append('userAvatar', userAvatar)
                    // formData.append('carsOwn', [carsOwn])
        
                    await fetch("/add_user", {
                        method: 'Post',
                        headers: {h},
                        body: formData
                      }).then( response => response.json())
                        .then((data) => {
                            console.log(data.message);
                            if(data.message !== undefined){
                                alert(data.message);
                            }
                            else{
                                history.goBack()
                            }
                        }
                        ) 
                };
            };

  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
                Sign In
            </h1>
        </div>
        <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>User Name</label>
                <br></br>
                <input type={"text"} id='userSiteName'></input>
                <br></br>
                <br></br>

                <label>Email</label>
                <br></br>
                <input type={"email"} id='userEmail'></input>
                <br></br>
                <br></br>

                <label>Password</label>
                <br></br>
                <input type={"password"} id='userPassword'></input>
                <br></br>
                <br></br>

                <label>Confirm Password</label>
                <br></br>
                <input type={"password"} id='userConfirmPassword'></input>
            </div>

            <div className='signInInputsContainer'>
                <label>First Name</label>
                <br></br>
                <input type={"text"} id='userFname'></input>
                <br></br>
                <br></br>

                <label>Last Name</label>
                <br></br>
                <input type={"text"} id='userLname'></input>
                <br></br>
                <br></br>

                <label>Country</label>
                <br></br>
                <select id='countryDropDown'>
                    
                </select>
                <br></br>
                <br></br>

                <label>Birth Day</label>
                <br></br>
                <input type={"date"} id='userBirthday'></input>
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
                <label>Upload A Profile Picture</label>
                <br></br>
                <input id='addReviewImage' type={"file"} accept=".png, .jpeg, .jpg, .gif"></input>
                <img src={require('./styling_folder/images/emptyUserProfile.png')} alt="Add Profile" className='addImage' onClick={addImageToReview}/>

                <br></br>
                <button id='createAccountBtn' className='allButtons' onClick={addUser}>Create An Account</button>
            </div>
        </div>

        <div id='addCarModalBgc' className='closeModal'>
            <div id='addCarModal'>
                <img src={require('./styling_folder/images/xBtn.png')} alt='X' id='xBtnModal' className='closeModal' onClick={() => closeOpenAddCarModal("X")}/>
                <h2>Select Your Car</h2>
                <select id='carBrand'>
                    <option value="" defaultValue disabled hidden>Brand :</option>
                    <option value="Audi">Audi</option>
                    <option value="Ford">Ford</option>
                    <option value="Opel">Opel</option>
                    <option value="Lotus">Lotus</option>
                </select>
                <select id='carModel'>
                    <option value="" defaultValue disabled hidden>Model :</option>
                    <option value="S4">S4</option>
                    <option value="Falcon">Falcon</option>
                    <option value="Manta">Manta</option>
                    <option value="Elise">Elise</option>
                </select>
                <select id='carYear'>
                    <option value="" defaultValue disabled hidden>Year :</option>
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
