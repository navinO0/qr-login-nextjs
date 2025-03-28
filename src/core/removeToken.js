"use client"
import Cookies from "js-cookie"
const clearToken = () => {
    Cookies.remove('jwt_token')
    // window.location.reload()
}

export default clearToken