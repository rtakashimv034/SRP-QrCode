
import {api, requestConfig} from "../utils/config"

// Register an user 
const register = async(data: any) => {
    const config = requestConfig("POST", data) 

    try{
        const res = await fetch(api + "/users", config)
            .then((res) => res.json())
            .catch((error) => error)    
        
        if(res.email) {
            localStorage.setItem("user", JSON.stringify(res))
        }

        return res
    } catch(error) {
        console.log(error)
    }
}

//Logout an user 
const logout = () => {
    localStorage.removeItem("user")
}



// Sign in a user 
const login = async(data: any) => {
    const config = requestConfig("POST", data)

    try{
        const res = await fetch(api + "/users/login", config)
                            .then((res) => res.json())
                            .catch((error) => error)
        
        if(res.email) {
            localStorage.setItem("user", JSON.stringify(res))
        }
        return res
    } catch(error) {
        console.log(error)
    }
}

const authService = {
    register, 
    logout,
    login,
}

export default authService