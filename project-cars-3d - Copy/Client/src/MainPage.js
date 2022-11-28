import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { userContext } from './GlobalVars';
import { productsContext } from './GlobalVars';
import "./styling_folder/generalSiteStyling.css"

let productSearch = {text: "", type: "new"}; 

export default function MainPage() {


  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/get_products", {
      method: 'Post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(productSearch)
    }).then( response => response.json() )
    .then( data => setProducts(data))
  }, [])

  const rawCreationDate = new Date(products.creationDate);
  const creationDate = rawCreationDate.getDate() + "/" + (rawCreationDate.getMonth() + 1) + "/" + rawCreationDate.getFullYear();

  return (
    <main>
      <div>
        <h1> 
          Newst Products
        </h1>
      </div>

      <div className='cardsContainer'>
      {products ? ( 
              products.map((product, i) => {
                const rawCreationDate = new Date(product.creationDate);
                const creationDate = rawCreationDate.getDate() + "/" + (rawCreationDate.getMonth() + 1) + "/" + rawCreationDate.getFullYear();
                return <div className='productCard' key={i}>
                <div className='productCardTitle'> 
                  {product.productName}
                </div>
                <div>
                  <Link to={`/product/${product._id}`}>
                  <img src={`http://localhost:5000/${product.productPictures[0]}`} alt='Product' className='productCardImg'/>
                  </Link>
                </div>
                <div>
                  <p>Upload: {creationDate}</p>
                    <p>Fits: {product.fitCars[0].selectedFromYear} - {product.fitCars[0].selectedToYear} {product.fitCars[0].selectedBrand} {product.fitCars[0].selectedModel}</p>
                </div>
              </div>
              })
            ) : (
              <h1>Loading...</h1>  
            )}
      </div>
    </main>
  )
}
