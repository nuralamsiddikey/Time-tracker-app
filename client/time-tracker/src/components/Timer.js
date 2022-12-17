import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/timer.css'


class Timer extends Component {
  constructor(props) {
    super(props)


    this.state = {
      second: 0,
      minute: 0,
      hour: 0,
      totalPause: 0,
      totalTime: { second: 0, minute: 0, hour: 0 },
      start: true,
      pause: false,
      reset: false,
      resume: false,
      stop: false,
      showTimer: false,
      reportBox: false,
      sessionStore: [],
      totalHour: 0,
      totalMinute: 0,
      fromDate:'',
      toDate  :''
    }
  }



  componentDidMount() {
    fetch('http://localhost:5000')
      .then(res => res.json())
      .then(result => {
        this.setState({
              sessionStore: result.data,
              totalHour: result.hour,
              totalMinute:result.minute
           })

      })
  }


  startTimer = () => {
    this.timer = setInterval(() => {
      this.setState({
        second: this.state.second + 1
      })
      if (this.state.second === 4) {
        this.setState({
          minute: this.state.minute + 1,
          second: 0
        })
      }
      if (this.state.minute === 9) {
        this.setState({
          hour: this.state.hour + 1,
          minute: 0
        })
      }
    }, 1000);

    this.setState({
      start: false,
      resume: false,
      reportBox: false,
      reset: true,
      pause: true,
      stop: true,
      showTimer: true

    })
  }

  pauseTime = () => {
    clearInterval(this.timer)
    this.setState({
      resume: true,
      pause: false,
      totalPause:this.state.totalPause+1
    })
  }

  resetTime = () => {
    this.setState({
      second: 0,
      minute: 0
    })
  }

  stopSession = () => {
    const totalTime = {
      second: this.state.second,
      minute: this.state.minute,
      hour: this.state.hour
    }
    this.setState({
      start: true,
      pause: false,
      reset: false,
      stop: false,
      showTimer: false,
      reportBox: true,
      second: 0,
      minute: 0,
      hour: 0,
      totalPause:0
    })

  

    const newSession = {
        hour: totalTime.hour,
        minute: totalTime.minute,
        totalPause: this.state.totalPause
    }
        
    fetch('http://localhost:5000/session/create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSession)
    })
      .then(res => res.json())
      .then(data => {

        this.setState({ 
          sessionStore: [...this.state.sessionStore, newSession],
          totalHour: this.state.totalHour+totalTime.hour,
          totalMinute: this.state.totalMinute+ totalTime.minute
         })
      })
    clearInterval(this.timer)
  }


 
 filterSession = ()=>{
        const from = this.state.fromDate
        const to = this.state.toDate
         fetch(`http://localhost:5000/getBetween/${from}/${to}`)
         .then(res=>res.json())
         .then(data=>{
            this.setState({sessionStore: data})
         })
 } 
 
  render() {
    return (
      <div className='content'>
        <h3>Time tracker</h3>

        {this.state.start && 
        <button 
          className='btn-start'
          onClick={this.startTimer}>Start
        </button>}
        
        {this.state.showTimer && 
          <h1>{this.state.hour} 
          : {this.state.minute} 
          : {this.state.second}
        </h1>}

        {this.state.pause &&
         <button
          className='btn-pause'
          onClick={this.pauseTime}>Pause
        </button>}

         {this.state.resume && 
         <button 
          className='btn-resume'
          onClick={this.startTimer}>Resume
         </button>}

        {this.state.reset && 
         <button 
         className='btn-reset'
         onClick={this.resetTime}>Reset
        </button>}

        {this.state.stop && 
        <button
         className='btn-stop'
         onClick={this.stopSession}>Stop
        </button>}


<div className='filter'>
    <label >From</label>
    <input type="date" name='from' onChange={(e)=>{
               
                 this.setState({fromDate:e.target.value})
    }}/>
    <label >To</label>
    <input type="date" name='to' onChange={(e)=>{
            
                this.setState({toDate:e.target.value})
      
    }}/>
    <button className='btn-search' onClick={this.filterSession}>Show</button>
</div>
        <table>
          <thead>
            <tr>
              <th>SessionId</th>
              <th>SessionDate</th>
              <th>Time</th>
              <th>Pause</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.sessionStore.map((data, index) => (
                <tr key={index}>
                  <Link to={`/session/${data.id}`}>#{index+1}</Link>           
                  <td>{data.sessionDate}</td>
                  <td>{data.hour}hr {data.minute}min</td>
                  <td>{data.totalPause} times</td>

                </tr>
              ))
            }
            <tr>
               <td><span style={{marginRight:'10px',fontWeight:900}}>Total time </span>{this.state.totalHour}hr {this.state.totalMinute}min</td>
            </tr>
          </tbody>
        </table>
        
      </div>
    );
  }
}

export default Timer;