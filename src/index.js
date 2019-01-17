import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'

// Import from './classic/App' for the non-hooks version
import App from './hooks/App'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
