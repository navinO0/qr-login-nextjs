"use client"
import Cookies from "js-cookie"
const clearToken = () => {
    Cookies.remove('jwt_token')
    if (!process.env.NEXT_AUTH_ENABLE) {
     window.location.reload()
}
}

export default clearToken