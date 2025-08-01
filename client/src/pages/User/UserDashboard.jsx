import React from 'react'
import Layout from '../../Layout/Layout'
import UserMenu from '../../Layout/UserMenu'
import {useAuth} from "../../context/auth";


const UserDashboard = () => {
    const[auth] = useAuth();

     console.log("AUTH:", auth);
  return (
    <Layout>
        <div className='container-fluid m-3 p-3 dashboard'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu/>
                </div>
                <div className='col-md-9'>
                    <div className='card w-75 p-3'>
                        <h3>User Name:{auth?.user?.name} </h3>
                        <h3>User Email:{auth?.user?.email} </h3>
                        <h3>User Contact:{auth?.user?.email} </h3>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default UserDashboard;