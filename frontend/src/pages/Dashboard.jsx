import  { useEffect, useState } from 'react'
import { Appbar } from '../components/Appbar'
import { Balance } from '../components/Balance'
import { Users } from '../components/Users'
import axios from 'axios'

const Dashboard = () => {
  const [value,setValue] = useState(0)
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/user/me', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        if (response.data && response.data.balance) {
          console.log(`Current balance: ${response.data.balance}`);
          console.log(`Current user: ${response.data.firstName}`);
          setValue(response.data.balance)
          setName(response.data.firstName)
        } else {
          console.error('Failed to fetch balance');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);
  return (
    <div className='px-2 w-full'>
        <Appbar name={name}/>
        <Balance value={value}/>
        <Users/>
    </div>
  )
}

export default Dashboard