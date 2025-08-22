import axios from 'axios'

const API_URL = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_BASE_URL + "/api/categorie/" : '/api/categorie/'; 


// Get
const getAllCategories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

const categorieService = {
  getAllCategories
}

export default categorieService