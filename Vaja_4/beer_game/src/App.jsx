import { useState } from 'react'
import './App.css'
import BackCentral from "./components/BackCentral";
import Title from "./components/Title";
import Akter from "./components/Akter";
import AkterPivovarna from "./components/AkterPivovarna";
import AkterDistributer from "./components/AkterDistributer";
import BannerLeft from "./components/BannerLeft";
import BannerRight from "./components/BannerRight";
import BannerNew from "./components/BannerNew";
import Kupec from "./components/Kupec";
import AkterGrosisit from './components/AkterGrosist';
import AkterMaloprodaja from './components/AkterMaloprodaja';
import Stats from "./components/Stats";


  function App() {
    // Define cost states for all departments
    const [pc, setPc] = useState(0); // Brewery cost
    const [dc, setDc] = useState(0); // Distributor cost
    const [gc, setGc] = useState(0); // Wholesaler cost
    const [mc, setMc] = useState(0); // Retailer cost

  const [count, setCount] = useState(0)

  return (
    <>
      <div className="layer-container">
        <div className="layer layer-back" id="back-layer">
          <div className="cell cell-back" style={{ gridArea: "span 1 / span 12" }}>&nbsp;</div>
	  
          <div className="cell cell-back" style={{ gridArea: "span 10 / span 1" }}>&nbsp;</div>
          <div className="cell cell-back" style={{ gridArea: "span 10 / span 10" }}>
            <BackCentral />
          </div>
          <div className="cell cell-back" style={{ gridArea: "span 10 / span 1" }}>&nbsp;</div>
	  
          <div className="cell cell-back" style={{ gridArea: "span 1 / span 12" }}>&nbsp;</div>
        </div>

        <div className="layer layer-front" id="front-layer">
          <div className="cell cell-front" style={{ gridArea: "span 1 / span 12" }}>            
            <Title />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 10 / span 1" }}>
            <BannerNew />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterPivovarna />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 3" }}>F d 3x2</div>
            {/* dodani argumenti pc={pc} dc={dc} gc={gc} mc={mc} v stats, da prenaša podatke v statistiko*/}
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>
            <Stats pc={pc} dc={dc} gc={gc} mc={mc} />  
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 10 / span 1" }}>
            <BannerRight />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F g 2x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterDistributer />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>F i 1x2</div>

          <div className="cell cell-front" style={{ gridArea: "span 6 / span 3" }}>F k 3x6</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>F l 1x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterGrosisit />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F n 2x2</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>F p 3x4</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterMaloprodaja />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F t 2x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>
            <Kupec />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 1 / span 12" }}>F z 1x12</div>
        </div>
      </div>
    </>
  )
}

export default App;