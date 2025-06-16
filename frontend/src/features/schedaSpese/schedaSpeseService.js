import axios from 'axios'

// const API_URL = '/api/schedaSpese/' // OK

// const API_URL = "https://budget-7ehi.onrender.com/api/schedaSpese/"; //OK!!!
const API_URL = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_BASE_URL + "/api/schedaSpese/" : '/api/schedaSpese/'; 


// Get single scheda spese
const singleSchedaSpeseGet = async (schedaId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL+ schedaId, config)

  return response.data
}
// Get
const getSchedaSpese = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Create new events
const createSchedaSpese = async (schedaSpeseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, schedaSpeseData, config)

  return response.data
}

// // Update events
const updateSchedaSpese = async (schedaId, schedaData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.put(API_URL + schedaId, schedaData, config)
  return response.data
}

// Delete scheda spese
const deleteSchedaSpese = async (schedaId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + schedaId, config)
  // return response.data
  return { id: schedaId };
}

const schedaSpeseService = {
  singleSchedaSpeseGet,
  getSchedaSpese,
  createSchedaSpese,
  updateSchedaSpese,
  deleteSchedaSpese
}

export default schedaSpeseService