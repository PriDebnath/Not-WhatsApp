let authHelpers = {
  saveDataInLocalStorage : (key:string,value:string)=>{
    localStorage.setItem(key,value)
  } ,
  getDataFromLocalStorage :(key:string)=>{
    return localStorage.getItem(key)
  }
}

export default authHelpers