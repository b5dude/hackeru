import React from "react"


import "./styling_folder/generalSiteStyling.css"
import "./styling_folder/productComments.css"

const ProductComments = ({productComments}) => {
    // console.log(productComments[0].productCommentsArr);

    return ( 
        <div id='usersReviewsContainer'>
        {(productComments === undefined || productComments.length === 0) ? ( 
              <h1>Loading...</h1>  
            ) : (
            productComments.productCommentsArr.map((productComment, i) => (
                <div className='reviewContainer' key={i}>
                    <div className='usersReviewDetails'>
                        {productComment.userName}
                    </div>
                    <div className='commentDiv'>
                        {productComment.commentText}
                    </div>
                    <div className='usersPrintImage'>
                        {productComment.pic}
                    </div>
                </div>
            ))
            )}
        </div>
    )
}

export default ProductComments;