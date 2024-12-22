import { useEffect, useState } from 'react';

function Admin() {

    document.title = 'Admin';    
    const [partners, setPartners] = useState({});
    
    useEffect(() => {
        fetch("api/SecureWebSite/admin/" + user, {
            method: 'GET',
            credentials : 'include',

        }).then(response => response.json()).then(data => {
            setPartners(data.trustedPartners);
            console.log("Trusted Partners", data.trustedPartners);
        }).catch(error => {
            console.log("Error Admin page: ", error);
        })
    }, []);

    return (
        <section className="admin-page page">
            <header>
                <h1>Admin page</h1>
                <section>
                    {
                        partners ? 
                        <div>
                            <div>Our trusted partners are:</div>
                            <ol>
                                {partners.map((partner, i) => <li key={i}>{partner}</li>)};
                            </ol>
                        </div>
                        :
                        <div className="waiting-page">
                            <div>
                                Waiting. . .
                            </div>
                        </div>
                    }
                </section>
            </header>
        </section>
    );
    
}

export default Admin;