import './App.css'
import BackCentral from "./components/BackCentral";
import Title from "./components/Title";
import AkterPivovarna from "./components/AkterPivovarna";
import AkterDistributer from "./components/AkterDistributer";
import BannerRight from "./components/BannerRight";
import BannerNew from "./components/BannerNew";
import Kupec from "./components/Kupec";
import AkterGrosist from './components/AkterGrosist';
import AkterMaloprodaja from './components/AkterMaloprodaja';
import Stats from "./components/Stats";
import OrdersChart from "./components/OrdersChart";
import StockChart from "./components/StockChart";
import Transport from "./components/Transport";
import Veriga from "./components/Veriga";
import DostavaKupcu from "./components/DostavaKupcu";
import Footer from "./components/Footer";
import GameOver from "./components/GameOver";
import IzvediTeden from "./components/IzvediTeden";

function App() {
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
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 3" }}>
            <IzvediTeden />
          </div>
          {/* dodani argumenti pc={pc} dc={dc} gc={gc} mc={mc} v stats, da prenaša podatke v statistiko*/}
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>
            <Stats />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 10 / span 1" }}>
            <BannerRight />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>
            <Transport from="pivovarna" to="distributer" />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterDistributer />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>
            <Veriga />
          </div>

          <div className="cell cell-front" style={{ gridArea: "span 6 / span 3" }}>
            <OrdersChart />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 1" }}>
            <Transport from="distributer" to="grosist" />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterGrosist />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>
            <Transport from="grosist" to="maloprodaja" />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 4 / span 3" }}>
            <StockChart />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 4" }}>
            <AkterMaloprodaja />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>
            <DostavaKupcu />
          </div>
          <div className="cell cell-front" style={{ gridArea: "span 2 / span 2" }}>
            <Kupec />
          </div>
	  
          <div className="cell cell-front" style={{ gridArea: "span 1 / span 12" }}>
            <Footer />
          </div>
        </div>
      </div>
      <GameOver />
    </>
  )
}

export default App;