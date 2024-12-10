function authorizeUser(req:any,res:any,next:any):any{

    console.log(req.path);

    if(req.path ==="/login" || req.path ==="/signup" ){
        return next();
    }

    else if(!req.decoded){
        return res.status(500).json({message:"something went wrong"})
    }

    else if(req.decoded.role==="U"){
        return next();

    }

    return res.status(403).json({message:"You are not allowed!"})


}


function authorizeCommunity(req:any,res:any,next:any):any{


    console.log(req.path);

    


    if(req.path ==="/login" || req.path ==="/signup" ){
        
        return next();
    }
    else if(req.allownext===true){
        return next();
    }
    

    

    else if(!req.decoded){
        return res.status(500).json({message:"Something went wrong"})
    }

    else if(req.decoded.role==="C"){
        return next();

    }

    return res.status(403).json({message:"You are not allowed!"})


} 


export {authorizeCommunity,authorizeUser};