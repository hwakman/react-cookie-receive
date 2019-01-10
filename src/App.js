import React, { Component, Fragment } from 'react';
import { CSVLink } from 'react-csv';
import JsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.submitBt = React.createRef();
    this.state = {
      data: [],
      name : '',
      value : ''
    }
    this.changeName = this.changeName.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.commitCookie = this.commitCookie.bind(this);
    this.saveState = this.saveState.bind(this);
    this.reload = this.reload.bind(this);
    this.delCookieAll = this.delCookieAll.bind(this);
    this.delmethod = this.delmethod.bind(this);
    this.pdfExport = this.pdfExport.bind(this);
  }

  changeName = e => {
    this.setState({
      name : e.target.value
    });
  }

  changeValue = e => {
    this.setState({
      value : e.target.value
    });
  }

  commitCookie = () => {
    let name = this.state.name;
    let value = this.state.value;
    if(this.state.data.length > 0){
      let check = false;
      this.state.data.map(data => data.name === name ? check = true:null);
      if(!check){
        document.cookie = '{"name":"'+name+'"="value":"'+value+'"}';
        this.reload();

        this.submitBt.current.value = '';
        this.submitBt.current.focus();
      }else {
        alert('This name already exit!');
      }
    }else{
      document.cookie = '{"name":"'+name+'"="value":"'+value+'"}';
      this.reload();

      this.submitBt.current.value = '';
      this.submitBt.current.focus();
    }
  }

  saveState = () => {
    let cookie = document.cookie.toString();
    cookie = cookie.replace(/[;=]/g, ",");
    console.log(typeof(cookie),cookie);
  }

  csvData = () => {
    let csv = '{\n"data": ['
    this.state.data.map(data => 
      csv += '{"name":"'+data.name+'","value":"'+data.value+'"},'
    );
    csv = csv.substring(csv.length -1,0);
    csv += ']\n}';
    return csv;
  }

  delCookieAll = () => {
    if(this.state.data.length > 0){
      let check = window.confirm('Are you sure to clear all data ?');
      if(check){
        let cookies = document.cookie.split(";");
      
        for(let i=0;i < cookies.length ;i++) {
          let capsul = cookies[i];
          let eqCk = capsul.indexOf("=");
          let name = eqCk > -1 ? capsul.substr(0,eqCk) : capsul;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    
        this.setState({
          data : []
        })
      }    
      console.log(check,'check value');
    }
  }

  pdfExport = () => {
    let pdf = new JsPDF();
    let content = [];
    this.state.data.map((data,key) => content.push([key+1,data.name,data.value]))
    console.log(content);
    pdf.autoTable({
      theme:'grid',
      margin:{top:10},
      StyleDef : {cellWidth:'auto'},
      head:[['Number','Name','Value']],
      body: content
    });
    pdf.output('save','example.pdf');
  }

  delmethod = method => {
    let check = window.confirm("Remove ' "+this.state.data[method].name+" ' are you sure ?");
    if(check){
      let targetCookie = document.cookie.split(";");
      document.cookie = targetCookie[method] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      this.reload();
      console.log(this.state.data[method],targetCookie[method]);      
    }
  }

  componentDidMount(){
    this.reload();
  }

  reload = () => {
    if(document.cookie){
      let cookie = document.cookie.toString();
      cookie = cookie.replace(/[=]/g, ",");
      let a = cookie.split(";");
      let b = []
      a.map(data => b.push(JSON.parse(data)))
      this.setState({
        data : b
      })
    }
  }
  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-light bg-light shadow-sm align-items-center mb-3">
          <button className="btn btn-light">Home</button>

          <span>
            {this.state.data.length > 0 ? 
            <span>
              <button className="btn btn-outline-info mr-3" onClick={this.pdfExport}>Print</button>
              <CSVLink data={this.csvData()} filename={"CSV-export.json"}>
                <button className="btn btn-outline-primary mr-3">Save</button>
              </CSVLink>
              <button className="btn btn-outline-danger mr-3" onClick={this.delCookieAll}>Clear</button>
            </span>
            :
            null}
          </span>
        </nav>

        <div className="container">
          <div className="row mb-3 rounded">
            <span className="form-inline">
              <input className="form-control mr-2" placeholder="Name" type="text" maxLength="10" onChange={this.changeName} ref={this.submitBt}/>
              <input className="form-control mr-2" placeholder="Target" type="text" maxLength="10" onChange={this.changeValue} />
              <button className="btn btn-primary" onClick={this.commitCookie}>Add</button>
            </span>
          </div>

          <div className="row bg-light rounded mb-4 shadow-sm">
            {this.state.data.map((data,key) => 
              <span className="col-md-3 mb-2 p-3 d-flex justify-content-center align-items-center" key={key}>
                  <small className="mr-3">Name : {data.name} <br /> type : {data.value}</small> 
                  <button className="btn btn-sm btn-danger" onClick={this.delmethod.bind(this,key)}>Delete</button>
              </span>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
