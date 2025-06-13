import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Instructions from '../game/instructions'

function Routing() {
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<App />} />
                    <Route path={'/instructions'} element={<Instructions/>}/>

                </Routes>

            </BrowserRouter>
    </>
    )
}

export default Routing