function authorizeUser(req:any,res:any,next:any):any{

    if(!req.decoded){
        return res.status(500).json({message:"something went wrong"})
    }

    else if(req.decoded.role==="U"){
        return next();

    }

    return res.status(403).json({message:"You are not allowed!"})


}


function authorizeCommunity(req:any,res:any,next:any):any{

    if(!req.decoded){
        return res.status(500).json({message:"something went wrong"})
    }

    else if(req.decoded.role==="C"){
        return next();

    }

    return res.status(403).json({message:"You are not allowed!"})


} 


export {authorizeCommunity,authorizeUser};