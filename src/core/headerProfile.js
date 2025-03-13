import Cookies from 'js-cookie';
import parseToken from './parseJson';
// import jwt_decode  from 'jwt-decode';
// const JWT_SECRET = process.env.JWT_SECRET || 'CHITTIOOM';





export default function HeaderProfile() {
    const token = Cookies.get('jwt_token');
    const userData = parseToken(token)
    return (
        <div className="flex align-center ">
        <p>
            <span className="font-bold">Hello, </span>
                <span className="">
                    {`${userData.first_name || ''} ${userData.middle_name || ''} ${userData.last_name || ''}`.trim()}
                </span>
            </p>
        </div>
    );
}