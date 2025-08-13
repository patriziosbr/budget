import axios from 'axios'

// const API_URL = "https://budget-7ehi.onrender.com/api/users/"; //OK per deploy inchiodato!!!
const API_URL = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_BASE_URL + "/api/users/" : '/api/users/'; 

// console.log(API_URL, "------------ API_URL") // Debugging;

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
  console.log("Login Response:", response.data);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// getUserById
const getUserById = async (req, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      req
    }
  }

  const response = await axios.get(API_URL+"getUserById/", config)

  return response.data
}

const authService = {
  register,
  logout,
  login,
  getUserById
}

export default authService
