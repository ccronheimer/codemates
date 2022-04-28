import axios from "axios";

export default axios.create({
    //baseURL: process.env.REACT_APP_API
    baseURL: "http://localhost:3001/v1/code"
})