import React, {useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { productsContext } from './GlobalVars';

import "./styling_folder/generalSiteStyling.css"
import "./styling_folder/searchBar.css"


function changeSearchBar(searchBy){  
  const searchByCar = document.getElementById("searchByCar");
  const searchByPN = document.getElementById("searchByPN");
  const searchByFreeText = document.getElementById("searchByFreeText");

    if (searchBy === 'car'){
        searchByCar.style.display = "block";
        searchByPN.style.display = "none";
        searchByFreeText.style.display = "none";
    }

    if (searchBy === 'pn'){
        searchByCar.style.display = "none";
        searchByPN.style.display = "block";
        searchByFreeText.style.display = "none";
    }

    if (searchBy === 'freeText'){
        searchByCar.style.display = "none";
        searchByPN.style.display = "none";
        searchByFreeText.style.display = "block";
    }
}



export default function SearchBar() {

  const {searchResulst, setSearchResults} = useContext(productsContext)


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
  console.log("Somehow I ran again........");
  })
},[]);

const [modelArrState, setModelArrState] = useState([]);

let modelArr = [];
function findModel() {
  let selectedYear = document.getElementById("selectedYear").value
  let selectedBrand = document.getElementById("selectedBrand").value
  fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${selectedBrand}/modelyear/${selectedYear}/vehicleType/car?format=json`)
  .then((response) => response.json())
  .then( data => {
  data.Results.forEach((element, index, array) => {
        modelArr.push(element.Model_Name)
        setModelArrState(modelArr.sort())
      })
  })
  }

  async function searchValues(){
    const searchByCar = document.getElementById("searchByCar");
    const searchByPN = document.getElementById("searchByPN");
    const searchByFreeText = document.getElementById("searchByFreeText");
    let freeText = document.getElementById("freeText").value;
    let partNum = document.getElementById("partNumber").value;
    let selectedYear = document.getElementById('selectedYear').value;
    let selectedBrand = document.getElementById('selectedBrand').value;
    let selectedModel = document.getElementById('selectedModel').value;
    let carYearBrandModel = `${selectedYear} ${selectedBrand} ${selectedModel}`;
  
    let productSearch = {text: "", type: "", brand:"", model:"", fromYear: 0};
  
    if(searchByFreeText.style.display === "block"){
      productSearch.type = "freeText";
      productSearch.text = freeText;
    }
  
    if(searchByPN.style.display === "block"){
      productSearch.type = "partNum";
      productSearch.text = partNum;
    }

    if(searchByCar.style.display === "block"){
      productSearch.type = "carModel";
      productSearch.text = "find by car";
      productSearch.brand = selectedBrand;
      productSearch.model = selectedModel;
      productSearch.fromYear = selectedYear;
      console.log(productSearch);
    }

    if(productSearch.text === "" || productSearch.text === " " || productSearch.text === "  "){
      alert("Fill the text area")
      return
    }
  
    await fetch("/get_products", {
      method: 'Post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(productSearch)
    }).then( response => response.json() )
    .then( data => {
      setSearchResults(data)
      console.log(searchResulst);
      // history.push("/search_results");
    })
  }

  return (
    <div className='searchBar'>
      <div className='searchType'>
            Search By:&nbsp;
            <span className='clickableText' onClick={() => changeSearchBar("car")}>Car&nbsp;</span>
            /&nbsp;
            <span className='clickableText' onClick={() => changeSearchBar("pn")}>Part Number&nbsp;</span>
            /&nbsp;
            <span className='clickableText' onClick={() => changeSearchBar("freeText")}>Free Text</span>
      </div>

      <div id='searchByFreeText'>
        <label>Search By Free Text:</label>
        <input placeholder='Free Text Here' id='freeText'></input>
        <Link to={"/search_results"}>
          <button className='allButtons' onClick={() => searchValues()}>Search</button>
        </Link>
      </div>

      <div id='searchByPN'>
        <label>Search By Part Number:</label>
        <input placeholder='Part Number Here' id='partNumber'></input>
        <Link to={"/search_results"}>
          <button className='allButtons' onClick={() => searchValues()}>Search</button>
        </Link>
      </div>

      <div id='searchByCar' style={{display: "block"}}>
      <div className='searchInputs'>
            <select id='selectedYear' onChange={findModel}>
                <option value="" hidden>Year :</option>
                {(() => {
                    let yearArr = [];
                    for (let i=1920; i <= new Date().getFullYear(); i++) {
                      yearArr.push(<option value={i} key={i} >{i}</option>);
                    }
                    return yearArr.reverse();
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
            <Link to={"/search_results"}>
              <button className='allButtons' onClick={() => searchValues()}>Search</button>
            </Link>
      </div>
      </div>
    </div>
  )
}