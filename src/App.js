import React, {useContext, useState} from 'react';
import './App.css';
import {Input, Button} from 'antd'
import {Bar} from 'react-chartjs-2'

const context = React.createContext()

function App() {
  const[state, setState] = useState({
    searchTerm:''
  })

  return <context.Provider value ={{
    ...state,
    set: v=>setState({...state, ...v})
  }}>
    <div className="App">
      <Header />
      <Body />   
    </div>
  </context.Provider>
}

function Body () {
  const ctx = useContext(context)
  let data 
  if (ctx.weather) {
    data = {
      labels:ctx.weather.daily.data.map(d=>d.time), 
      datasets: [{
        data:ctx.weather.daily.data.map(d=>d.temperatureHigh)
      }]
    }
  }
  return <div className = "app-body"> 
    {ctx.error && <div className = "error">{ctx.error}</div>}
    {ctx.weather && <div className = "weather">
      <Bar 
        data = {data}
        width = {600} height = {300}
      /> 
    </div>}
  </div> 
}

function Header() {
  const ctx = useContext(context)
  
  return <header className="App-header">
    <Input 
      value = {ctx.searchTerm}
      onChange = {e=>ctx.set({searchTerm: e.target.value})}
      style = {{fontSize: '1rem', height:'2rem'}} 
      onKeyPress={e=>{
        if(e.key==='Enter' && ctx.searchTerm) search(ctx)
      }}
    />
    <Button 
      style = {{marginLeft: 10, height:'2rem'}}
      type = "primary"
      onClick = {()=> search(ctx)}
      disabled = {!ctx.searchTerm}
    >
      Search
    </Button>
  </header>
}

async function search({searchTerm, set}) {
  try {
    const term = searchTerm
    set({searchTerm:'', error:''})
    const osmurl = `https://nominatim.openstreetmap.org/search/${term}?format=json`
    const r = await fetch(osmurl)
    const loc = await r.json()
    if(!loc[0]) {
      set({searchTerm:''})
      return set({error:'No city matching that query'})
    }
    const city = loc[0]
    const key = '1787b2ba7c0c52cee05764611ef07302'
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`
    const r2 = await fetch(url)
    const weather = await r2.json()
    set({weather})
  } catch (e) {
    set({error: e.message})
  }
}

export default App;
