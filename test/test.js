import http from "node:http"
const com=require("../").default

const a=new com({
    rootDir:process.cwd(),
    urlPrefix:"",
    dirDefaultEntries:null,
})
const server=new http.Server((req, res) =>{
    a.onRequest(req, res)
})
server.listen(3000)