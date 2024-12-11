import { useState } from 'react'
import './App.css'
import Title from "./components/Title";
import Role from "./components/Role";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="layer-container">
        <div className="layer layer-back" id="back-layer">
          <div className="cell cell-back" style={{ gridArea: "span 1 / span 12" }}>&nbsp;</div>
	  
          <div className="cell cell-back" style={{ gridArea: "span 10 / span 1" }}>B b 1x10</div>
          <div className="cell cell-back" style={{ gridArea: "span 10 / span 10" }}>B c 10x10</div>
          <div className="cell cell-back" style={{ gridArea: "span 10 / span 1" }}>B f 1x10</div>
	  
          <div className="cell cell-back" style={{ gridArea: "span 1 / span 12" }}>B z 1x12</div>
        </div>

        <div className="layer layer-front" id="front-layer">
          <div className="cell cell-front" style={{ gridArea: "span 1 / span 12" }}>            
            <Title />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 10 / span 1" }}>F b 1x10</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Role title="Pivovarna" stock={200} preorder={30} cost={60} />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 3" }}>F d 3x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>F e 3x4</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 10 / span 1" }}>F f 1x10</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F g 2x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Role title="Distributer" stock={100} preorder={20} cost={50} />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>F i 1x2</div>

          <div className="cell cell-front" style={{ gridArea: "span 6 / span 3" }}>F k 3x6</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>F l 1x2</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Role title="Grosist" stock={300} preorder={40} cost={70} />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>F n 2x2</div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>F p 3x4</div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <Role title="Maloprodaja" stock={400} preorder={50} cost={80} />
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