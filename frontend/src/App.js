import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './screens/Home'
import Favourites from './screens/Favourites'
import Account from './screens/Account'
import Camera from './screens/Camera'

const App = () => {
  return (
    <Router>
      <Route exact path='/' component={Home} />
      <Route exact path='/camera' component={Camera} />
      <Route exact path='/favourites' component={Favourites} />
      <Route exact path='/account' component={Account} />
    </Router>
  )
}

export default App
