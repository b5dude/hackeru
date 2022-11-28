import React from 'react'

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/aboutPage.css";

export default function AboutPage() {
  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
              About
            </h1>
        </div>

        <div className='aboutUsCnt'>
            <h1>
                Who We Are?
            </h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut lectus arcu bibendum at varius vel pharetra vel. Morbi tristique senectus et netus et malesuada fames ac. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Eu augue ut lectus arcu bibendum at varius. Volutpat blandit aliquam etiam erat. Urna condimentum mattis pellentesque id nibh tortor id. Vulputate ut pharetra sit amet. Aliquam nulla facilisi cras fermentum odio eu. Euismod lacinia at quis risus sed vulputate odio ut enim. Nulla aliquet enim tortor at auctor urna nunc id cursus.
            </p>
            <img className='aboutImg' src={require('./styling_folder/images/peugeot206Cup.JPG')} alt="Race car"/>
            <br></br>
            <p className='bottomParagraph'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut lectus arcu bibendum at varius vel pharetra vel. Morbi tristique senectus et netus et malesuada fames ac. Dictum varius duis at consectetur lorem donec massa sapien faucibus. Eu augue ut lectus arcu bibendum at varius. Volutpat blandit aliquam etiam erat. Urna condimentum mattis pellentesque id nibh tortor id. Vulputate ut pharetra sit amet. Aliquam nulla facilisi cras fermentum odio eu. Euismod lacinia at quis risus sed vulputate odio ut enim. Nulla aliquet enim tortor at auctor urna nunc id cursus.
            </p>
        </div>
    </div>
  )
}
