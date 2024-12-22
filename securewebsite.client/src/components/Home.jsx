import { useEffect, useState } from 'react';

function Home() {

    document.title = 'Home';    
    const [userInfo, setUserInfo] = useState({});
    
    useEffect(() => {
        const user = localStorage.getItem('user');  
        fetch("api/SecureWebSite/home/" + user, {
            method: 'GET',
            credentials : 'include',

        }).then(response => response.json()).then(data => {
            setUserInfo(data.userInfo);
            console.log("user info ", data.userInfo);
        }).catch(error => {
            console.log("Error home page: ", error);
        })
    }, []);

    return (
        <section className="page">
            <header>
                <h1>Welcome to your page</h1>
                {
                userInfo ?
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{userInfo.name}</td>
                                    <td>{userInfo.email}</td>
                                    <td>{userInfo.createdDate ? userInfo.createdDate.split(":")[0] : ""}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>    
                    :
                    <div>

                    </div>
                }
            </header>
        </section>
    );
    
}

export default Home;