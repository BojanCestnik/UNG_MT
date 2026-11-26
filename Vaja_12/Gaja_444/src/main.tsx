import {createRoot} from 'react-dom/client';
import {KitchenApp} from './KitchenApp';
import './style.css';
import './design.css';
import './fresh.css';

createRoot(document.getElementById('root')!).render(<KitchenApp/>);
