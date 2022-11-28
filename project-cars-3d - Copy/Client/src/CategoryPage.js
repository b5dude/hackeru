import React, {useContext, useState} from "react";
import { Link } from 'react-router-dom';
import { productsContext, userContext } from "./GlobalVars";

import "./styling_folder/generalSiteStyling.css"

function addAndRemoveCategoryEnds(){
    let scrollPosotion = document.getElementById("scroller").scrollLeft;
    let categoryEndLeft = document.getElementById("categoryEndLeft");
    let categoryEndRight = document.getElementById("categoryEndRight");
    //console.log(scrollPosotion);
    if(scrollPosotion < 15){
        categoryEndLeft.style.display = "none"
    }

    else{
        categoryEndLeft.style.display = "block"
    }

    if(scrollPosotion > 1605){
        categoryEndRight.style.display = "none"
    }

    else{
        categoryEndRight.style.display = "block"
    }
}

export default function CategoryPage() {

  const {searchResulst, setSearchResults} = useContext(productsContext)  

  return (
    <> 
    <div className='pageName'>
        <h1>
          Search Results
        </h1>
    </div>
    <div id='mainContainer'>
    <aside id='scroller' onScroll={addAndRemoveCategoryEnds}>
    <div id='categoryEndLeft'>
    </div>
    <div id='categoryEndRight'>
    </div>
    <button className='allButtons asideBtns'>All</button>
    <button className='allButtons asideBtns'>Engine</button>
    <button className='allButtons asideBtns'>Braking</button>
    <button className='allButtons asideBtns'>A/C</button>
    <button className='allButtons asideBtns'>Drivetrain</button>
    <button className='allButtons asideBtns'>Exhaust</button>
    <button className='allButtons asideBtns'>Interior</button>
    <button className='allButtons asideBtns'>Exterior</button>
    <button className='allButtons asideBtns'>Suspension</button>
    <button className='allButtons asideBtns'>Steering</button>
    <button className='allButtons asideBtns'>Accessories</button>
    <button className='allButtons asideBtns'>Tools</button>

    </aside>
    <main>
      <div className='cardsContainer'>
        {(typeof searchResulst === undefined || searchResulst.length === 0) ? (
              <h1>No files found..</h1>
            ) : (
              searchResulst.map((searchResulst, i) => {
              return <div className='productCard' key={i}>
              <div className='productCardTitle'>
                {searchResulst.productName}
              </div>
              <div>
                <Link to={"/product/" + searchResulst._id}>
                <img src={`http://localhost:5000/` + searchResulst.productPictures[0]} alt='Product' className='productCardImg'/>
                </Link>
              </div>
              <div className='cardDawnloadDiv'>
                {/* <img src={require('./styling_folder/images/downloadIcon.png')} alt='Download Icon'/> &nbsp; */}
                {searchResulst.productDownloads} Downloads
              </div>
              <div className='cardStarDiv'>
                <img src={require('./styling_folder/images/Star.png')} alt='Star Icon'/> &nbsp;
                {`(` + searchResulst.productCommentsArr.length + ` Rates)`}
              </div>
            </div>
              })
            )}
      </div>
    </main>
    </div> 
    </>
  )
}
