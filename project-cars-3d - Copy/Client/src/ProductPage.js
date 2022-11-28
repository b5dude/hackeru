import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductComments from './ProductComments';
import { ReactComponent as StarSvg } from './styling_folder/images/Empty_Rating_Star.svg';
import { userContext } from './GlobalVars';

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/productPage.css";


function scrollByArrowsLeft(){
    let smallImgScrollerContainer = document.getElementById("smallImgScrollerContainer");
    smallImgScrollerContainer.scrollBy(-85, 0);
};

function scrollByArrowsRight(){
    let smallImgScrollerContainer = document.getElementById("smallImgScrollerContainer");
    smallImgScrollerContainer.scrollBy(85, 0);
};



function ProductPage() {

    function setRatingStars(rate){
        let oneStar = document.getElementById("oneStar");
        let twoStar = document.getElementById("twoStar");
        let threeStar = document.getElementById("threeStar");
        let fourStar = document.getElementById("fourStar");
        let fiveStar = document.getElementById("fiveStar");
        let ratingTextbox = document.getElementById("ratingTextbox");

        if(rate === 1){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.removeAttribute('class', 'ratedStar');
            threeStar.removeAttribute('class', 'ratedStar');
            fourStar.removeAttribute('class', 'ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 2){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.removeAttribute('class', 'ratedStar');
            fourStar.removeAttribute('class', 'ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 3){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.setAttribute('class', 'ratingStars ratedStar');
            fourStar.removeAttribute('class', 'ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 4){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.setAttribute('class', 'ratingStars ratedStar');
            fourStar.setAttribute('class', 'ratingStars ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 5){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.setAttribute('class', 'ratingStars ratedStar');
            fourStar.setAttribute('class', 'ratingStars ratedStar');
            fiveStar.setAttribute('class', 'ratingStars ratedStar');
        }

        ratingTextbox.value = rate;
    }


    function addImageToReview(){
        document.getElementById("addReviewImage").click();
     }


    function addCommentDiv(){

    let commentText = document.getElementById("commentTextArea").value;
    let addImage = document.getElementById("addReviewImage").value;
    let userRaring = document.getElementById("ratingTextbox").value;

        if(commentText !== ""){

            let newComment =   {
                productId: productIdUrl,
                userProfile: 'pic.jpg',
                userName: user.userSiteName,
                commentDate: new Date(),
                userRate: parseInt(userRaring),
                commentText: commentText,
                pic: addImage
            }

            // console.log(newComment);
            fetch("/product_comments", {
                method: 'Post',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newComment)
              }).then( response => response.json() )
              .then( data => {
                if(data._id === '')
                {
                    console.log(data.msg)
                }
                else
                {
                    document.getElementById("commentTextArea").value = '';
                    document.getElementById("addReviewImage").value = '';
                    document.getElementById("ratingTextbox").value = 0;

                    fetch("/get_products", {
                        method: 'Post',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(productSearch)
                      }).then( response => response.json() )
                      .then( data => {
                        let sumOfRates = 0
                        data.productCommentsArr.forEach((element, index, array) => {
                            sumOfRates = sumOfRates + element.userRate
                        })
                        setProductRate(Math.round(sumOfRates / data.productCommentsArr.length))
                        setProducts(data)
                      })
                }
            }
            )
        }
        else{
            alert("Fill the comment")
        }
    };

    const {user, setUser} = useContext(userContext);

    const params = useParams()
    const productIdUrl = params.productId
    // console.log("Hi I'm params" + productIdUrl);

    let productSearch = {text: productIdUrl, type: "productId"}; 
    const [products, setProducts] = useState([]);
    const [productRate, setProductRate] = useState(0);
    
    useEffect(() => {
        fetch("/get_products", {
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(productSearch)
      }).then( response => response.json() )
      .then( data => {
        let sumOfRates = 0
        data.productCommentsArr.forEach((element, index, array) => {
            sumOfRates = sumOfRates + element.userRate
        })
        setProductRate(Math.round(sumOfRates / data.productCommentsArr.length))
        setProducts(data)
      })
    }, [])


    const productOwnerSearch = {text: products.productOwner}
    const [productOwner, setProductOwner] = useState();

    
    async function getProductOwner(){
        await fetch('/getProductOwner', {
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(productOwnerSearch)
      }).then( response => response.json()
      ).then (data => {
            setProductOwner(data.userSiteName);
        }
      )}
      getProductOwner()      



    const rawCreationDate = new Date(products.creationDate);
    const creationDate = rawCreationDate.getDate() + "/" + (rawCreationDate.getMonth() + 1) + "/" + rawCreationDate.getFullYear();

    const rawUpdateDate = new Date(products.lastUpdateDate);
    const updateDate = rawUpdateDate.getDate() + "/" + (rawUpdateDate.getMonth() + 1) + "/" + rawUpdateDate.getFullYear();

    const [mainPicture, setMainPicture] = useState(0);
    
    async function mainImage(i){
        setMainPicture(i)
    }


    async function productWasDownloaded() {
        fetch("/product_was_downloaded", {
            method: 'Post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(products)
          }).then( response => response.json() )
          .then( data => {
            setProducts(data)
          })
    }


  return (
    
    <div>
        <div style={{borderBottom: "double"}}>
            <div className='pageName'>
                <h1>
                    Product
                </h1>
            </div>
            {(products === undefined || products === null || products.productPictures === undefined || products.productPictures === null || products.productFiles === undefined || products.productFiles === null || productOwner === null) ? ( 
              <h1>Loading...</h1>  
            ) : (
            <div style={{display: "flex"}}>
                <div className='productDescriptionComponent'>
                    <div className='productImgsContainer'>
                        <div id='mainImageContainer'>
                                <img id='mainImage' src={`http://localhost:5000/${products.productPictures[mainPicture]}`} alt="Main product"/>
                        </div>
                        <div className='smallImageContainer'>
                            <div>
                                <img onClick={scrollByArrowsLeft} id='arrowLeftScroll' className='scrollerArrows' src={require('./styling_folder/images/arrowLeft.png')} alt="Arrow left"/>
                            </div>
                            <div id='smallImgScrollerContainer'>
                            {(() => {
                                let picturesArr = [];
                                for (let i=0; i < products.productPictures.length; i++) {
                                picturesArr.push(<div key={i}><img key={i} className='scrollImg' src={`http://localhost:5000/${products.productPictures[i]}`} alt="Scroll" onClick={() => mainImage(i)}/></div>);
                                }
                                return picturesArr;
                            })()}
                            </div>
                            <div>
                                <img onClick={scrollByArrowsRight} id='arrowRightScroll' className='scrollerArrows' src={require('./styling_folder/images/arrowRight.png')} alt="Arrow left"/>
                            </div>
    
                        </div>
                    </div>
                    <div className='productInfoContainer'>
                        <div className='productDescriptionMainContainer' style={{display:"flex"}}>
                            <div className='productDescriptionContainer'>
                                <h2>{products.productName}</h2>
                                <p>
                                    Product Description - {products.productDescription}
                                </p>
                            </div>
                            <div className='productBtnsContainer'>
                                <a href={`http://localhost:5000/${products.productFiles[0]}`}>
                                    <button className='allButtons'  onClick={productWasDownloaded}>Download</button>
                                </a>
                                <Link to={"/contact_us"}>
                                <button className='allButtons'>Ask a question</button>
                                </Link>
                            </div>
                        </div>
                            <div className='productRecommendation'>
                            <div className='productRecommendationDivs'>
                                <img src={require('./styling_folder/images/printSettingsIcon.png')} alt="Print Settings Icon"/>
                                <h3>Printing Recommendation</h3>
                                <p>Print Material: {products.filamentDropDown}</p>
                                {/* <p>Infill: 40%</p>
                                <p>Infill Stracture: Triangles</p> */}
                                {(products.productNozzleTemp === undefined || products.productNozzleTemp === null) ? ( 
                                    <p>Nozzle Temp: Not Specified</p>
                                ) : (
                                    <p>Nozzle Temp: {products.productNozzleTemp}c</p>
                                )}
                                {(products.productBedTemp === undefined || products.productBedTemp === null) ? ( 
                                    <p>Bed Temp: Not Specified</p>
                                ) : (
                                    <p>Bed Temp: {products.productBedTemp}c</p>
                                )}
                            </div>
                            <div className='productRecommendationDivs'>
                                <img src={require('./styling_folder/images/informationIcon.png')} alt="Information Icon"/>
                                <h3>Information</h3>
                                {(products.productPartNumber === undefined || products.productPartNumber === null || products.productPartNumber === "") ? ( 
                                    <p>Part Number: Not Specified</p>
                                ) : (
                                    <p>Part Number: {products.productPartNumber}</p>
                                    )}
                                {/* <p>Uploaded By: {(productOwner === undefined || productOwner === null) ? ( 'Loading...') : ({productOwner})}</p> */}
                                <p>Uploaded By: {productOwner}</p>
                                <p>Upload Date: {creationDate}</p>
                                {(products.lastUpdateDate === undefined || products.lastUpdateDate === null) ? ( 
                                    <p>Last Update Date: None</p>  
                                ) : (
                                    <p>Last Update Date: {updateDate}</p>
                                )}
                            </div>
                            <div className='productRecommendationDivs'>
                                <img src={require('./styling_folder/images/downloadIcon.png')} alt="Download Icon"/>
                                <h3>Downloads</h3>
                                <p>{products.productDownloads}</p>
                            </div>
                            <div className='productRecommendationDivs'>
                            {(() => {
                                let noStars = 'No Rates'
                                let drewStars = [];
                                console.log("------------------");
                                console.log(products.productCommentsArr[0]);
                                console.log("------------------");
                                if(products.productCommentsArr[0] === undefined){
                                    return noStars;
                                }
                                else{
                                    for (let i=0; i < productRate; i++) {
                                        drewStars.push(<img key={i} src={require('./styling_folder/images/Star.png')} alt="star Icon"/>);
                                    }
                                    return drewStars;
                                }
                            })()}
                                <h3>{productRate} Stars</h3>
                                <p>From {products.productCommentsArr.length} Rates</p>
                            </div>
                    </div>
                    </div>
                </div>
            </div>
            )}
        </div>
        <div className='pageName'>
            <h1>
                Reviews
            </h1>
        </div>
            <div className='productReviewComponent'>
                {user ? (
                <div id='addReviewContainer'>
                    <textarea placeholder="Write Your Review Here.." id='commentTextArea'></textarea>
                    <input id='addReviewImage' type={"file"}></input>
                    <img src={require('./styling_folder/images/addPhoto.png')} alt="Add" className='addImage' onClick={addImageToReview}/>
                    <div id='addReviewBtnContainer'>
                        <button className='allButtons'onClick={addCommentDiv}>Add Review</button>
                        <div id='starRatingContainer'>
                            <StarSvg id="oneStar" onMouseOver={() => setRatingStars(1)}/>
                            <StarSvg id="twoStar" onMouseOver={() => setRatingStars(2)}/>
                            <StarSvg id="threeStar" onMouseOver={() => setRatingStars(3)}/>
                            <StarSvg id="fourStar" onMouseOver={() => setRatingStars(4)}/>
                            <StarSvg id="fiveStar" onMouseOver={() => setRatingStars(5)}/>
                        </div>
                        <input type={"number"} id="ratingTextbox" style={{display:"none"}}></input>
                    </div>
                </div>
                ) : (
                    <div className='noCommentForYouCnt'>
                        <div id='addReviewContainer'>
                            <textarea placeholder="Write Your Review Here.." id='commentTextArea'></textarea>
                            <input id='addReviewImage' type={"file"}></input>
                            <img src={require('./styling_folder/images/addPhoto.png')} alt="Add" className='addImage' onClick={addImageToReview}/>
                            <div id='addReviewBtnContainer'>
                                <button className='allButtons'>Add Review</button>
                                <div id='starRatingContainer'>
                                    <StarSvg id="oneStar" onMouseOver={() => setRatingStars(1)}/>
                                    <StarSvg id="twoStar" onMouseOver={() => setRatingStars(2)}/>
                                    <StarSvg id="threeStar" onMouseOver={() => setRatingStars(3)}/>
                                    <StarSvg id="fourStar" onMouseOver={() => setRatingStars(4)}/>
                                    <StarSvg id="fiveStar" onMouseOver={() => setRatingStars(5)}/>
                                </div>
                                <input type={"number"} id="ratingTextbox" style={{display:"none"}}></input>
                            </div>
                        </div>
                        <div className='noCommentForYou'>
                            <h2>
                                Please login in-order to add a comment
                            </h2>
                        </div>
                    </div>
                )}
            </div>
            <ProductComments productComments={products}></ProductComments>
    </div>
  )
}

export default ProductPage;