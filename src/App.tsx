import {Route, Routes} from "react-router-dom";
import Main from "./Pages/Main/Main";
import Product from "./Pages/Product/Product";
import Account from "./Pages/Account/Account";

function App() {

  return (
      <Routes>
          <Route path={'/'} element={<Main/>}/>
          <Route path={'/product/:id'} element={<Product/>}/>
          <Route path={'/account'} element={<Account/>}/>
      </Routes>
  )
}

export default App
