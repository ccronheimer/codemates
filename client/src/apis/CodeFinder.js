import axios from "axios";

export default axios.create({
    baseURL: "http://codemates.us-east-1.elasticbeanstalk.com/api/v1/code"
   
})