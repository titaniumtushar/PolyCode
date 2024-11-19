



export function decodeToken(){
    const token = localStorage.getItem("token");
    if(!token){
        return {};
    
    }

    try {
    const decoded = atob(token.split(".")[1]);
    console.log(decoded);
    return JSON.parse(decoded);
        
    } catch (error) {
        return {};
        
    }

   


}
