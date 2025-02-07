export const api = "http://localhost:3333/api/v1"

// Config of requests

export const requestConfig = (
    method: "GET" | "POST" | "PUT" | "DELETE", 
    data: any,
    image? : File | null
): RequestInit => {
        let config : RequestInit

        if(image) {
            config = {
                method: method,
                body: data,
                headers: {},
            }
        }
        else if (method === "DELETE" || data === null) {
            config = {
                method: method,
                headers: {},
            }
        } 
        else {
            config = {
                method : method,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type" : "application/json",
                },
            }
        }

        return config
    }

