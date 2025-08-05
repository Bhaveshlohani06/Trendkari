import React from 'react'
import Layout from '../../Layout/Layout'
import UserMenu from '../../Layout/UserMenu'
import {useAuth} from "../../context/auth";


const UserDashboard = () => {
    const[auth] = useAuth();

     console.log("AUTH:", auth);
  return (
    <Layout>
        <div className='container'>
            <div className='row dashboard'>
                    <div className='card w-75 p-3'>
                        <h3>User Name:{auth?.user?.name} </h3>
                        <h3>User Email:{auth?.user?.email} </h3>
                        <h3>User Contact:{auth?.user?.email} </h3>
                    </div>
               
            </div>
        </div>
    </Layout>
  )
}

export default UserDashboard;