import React, {useEffect, useState, useContext} from "react";
import { Link } from 'react-router-dom'
import { userContext } from './GlobalVars'

import "./styling_folder/generalSiteStyling.css"
import "./styling_folder/myUploadsPage.css"


export default function MyUploadsPage() {
  
  const {user, setUser} = useContext(userContext);

  const [products, setProducts] = useState([]);
  let productSearch = {text: user == null ? "" : user._id, type: "myProducts"};

    useEffect(() => {
      fetch("/get_products", {
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(productSearch)
      }).then( response => response.json() )
      .then( data => setProducts(data))
    }, [])


    function deleteProduct(productIdToDelete){
      let productIdToDeleteReq = {productIdToDelete: productIdToDelete}
        fetch("/delete_products", {
          method: 'Post',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(productIdToDeleteReq)
        }).then(console.log(productIdToDeleteReq))
        fetch("/get_products", {
          method: 'Post',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(productSearch)
        }).then( response => response.json() )
        .then( data => setProducts(data))
    }
  
    // console.log(products)

  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
              My Uploads
            </h1>
        </div>
        <div className='myUploadCardCtn'>
        {(products === undefined || products.length === 0) ? ( 
              <h1>No uploads found :(</h1>  
            ) : (
            products.map((product, i) => {
                return <div className='myUploadCard' key={i}>
                <div className='myUploadCard-ImageCtn'>
                    <img src={`http://localhost:5000/` + product.productPictures[0]} alt="Add" className='myUploadCard-Image'/>
                </div>

                <div className='myUploadCard-TextCtn'>
                    <h2>{product.productName}</h2>
                    <h3>Category: {product.productCategory}</h3>
                    <h3>Upload Date: {product.creationDate}</h3>
                </div>

                <div className='myUploadCard-IconsCtn'>
                    <Link to={"edit_upload/" + product._id}>
                        <img src={require('./styling_folder/images/editIcon.png')} alt="Edit" className='myUploadCard-Icons'/>
                    </Link>
                    <img src={require('./styling_folder/images/trashIcon.png')} alt="Delete" value={product._id} onClick={() => deleteProduct(product._id)} className='myUploadCard-Icons'/>
                </div>
            </div>
            })
        )}
    </div>
</div>
  )
}
