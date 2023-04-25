import {useState} from "react";

export const useFetching = (callBack) => {
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState('')

    async function fetching(...args) {
        try {
            setIsLoading(true)
            await callBack(...args)
        }catch (e){
            setError(e.message);
        }finally {
            setIsLoading(false)
        }
    }

    return [fetching,isLoading,error]
}
