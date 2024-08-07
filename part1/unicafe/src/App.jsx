import { useState } from 'react'
import Statistics from './Statistics'
import Button from './Button'

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGood = () => {
    const updatedAll = all + 1
    setAll(updatedAll)
    const updatedGood = good + 1
    setGood(updatedGood)
    setAverage((updatedGood - bad) / updatedAll)
    setPositive((updatedGood / updatedAll) * 100)
  }

  const handleNeutral = () => {
    const updatedAll = all + 1
    setAll(updatedAll)
    setNeutral(neutral + 1)
    setAverage((good - bad) / updatedAll)
    setPositive((good / updatedAll) * 100)
  }
  
  const handleBad = () => {
    const updatedAll = all + 1
    setAll(updatedAll)
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAverage((good - updatedBad) / updatedAll)
    setPositive((good / updatedAll) * 100)
  }

  return(
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text="good"/>
      <Button onClick={handleNeutral} text="neutral"/>
      <Button onClick={handleBad} text="bad"/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>)

}

export default App
