import { useState } from 'react'
import './App.css'
import BackCentral from "./components/BackCentral";
import Title from "./components/Title";
import Akter from "./components/Akter";
import AkterPivovarna from "./components/AkterPivovarna";
import BannerLeft from "./components/BannerLeft";
import BannerRight from "./components/BannerRight";

function App() {
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
            <BannerLeft />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterPivovarna />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 3" }}>F d 3x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>F e 3x4</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 10 / span 1" }}>
            <BannerRight />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F g 2x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Akter title="Distributer" stock={100} preorder={20} cost={50} />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>F i 1x2</div>

          <div className="cell cell-front" style={{ gridArea: "span 6 / span 3" }}>F k 3x6</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>F l 1x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Akter title="Grosist" stock={300} preorder={40} cost={70} />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F n 2x2</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>F p 3x4</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Akter title="Maloprodaja" stock={400} preorder={50} cost={80} />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F t 2x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>
            F u 2x2 Kupec<br/>Naročilo: 5
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 1 / span 12" }}>F z 1x12</div>
        </div>
      </div>
    </>
  )
}

export default App;