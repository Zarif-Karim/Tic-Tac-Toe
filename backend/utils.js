const parseParams = (url) => {
    //expected format: /?r=<row>&c=<col>&p=<player>
    //todo: match regex
    const correct = true; //do regex check here
    if(!correct) console.log('Wrong url format', url);

    //assuming url correct at this point
    const params = url
        .split('?')[1]
        .split('&')
        .reduce((obj,val)=>{
            val = val.split('=');
            obj[val[0]] = parseInt(val[1]);
            return obj;
        },{});
    return params;
}


module.exports = parseParams;