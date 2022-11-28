import React from 'react'

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/donateUsPage.css";

export default function DonateUsPage() {
  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
              Donate Us
            </h1>
        </div>
        <div className='donateUsCnt'>
          <div>
              <h1>
                  Why Donating Us?
              </h1>
              <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut lectus arcu bibendum at varius vel pharetra vel. Morbi tristique senectus et netus et malesuada fames ac. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Eu augue ut lectus arcu bibendum at varius. Volutpat blandit aliquam etiam erat. Urna condimentum mattis pellentesque id nibh tortor id. Vulputate ut pharetra sit amet. Aliquam nulla facilisi cras fermentum odio eu. Euismod lacinia at quis risus sed vulputate odio ut enim. Nulla aliquet enim tortor at auctor urna nunc id cursus.
              </p>
              <br></br> <br></br>
              <h1>
                  How To Donate Us?
              </h1>
              <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut lectus arcu bibendum at varius vel pharetra vel. Morbi tristique senectus et netus et malesuada fames ac. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Eu augue ut lectus arcu bibendum at varius. Volutpat blandit aliquam etiam erat. Urna condimentum mattis pellentesque id nibh tortor id. Vulputate ut pharetra sit amet. Aliquam nulla facilisi cras fermentum odio eu. Euismod lacinia at quis risus sed vulputate odio ut enim. Nulla aliquet enim tortor at auctor urna nunc id cursus.
              </p>
          </div>

          <div className='donateImgCnt'>
            <img className='donateImg' src={require('./styling_folder/images/peugeot206Cup.JPG')} alt="Race car"/>
            <img className='donateBtn' src={require('./styling_folder/images/donatePaypal.png')} alt="Donate"/>
          </div>
        </div>
    </div>
  )
}
