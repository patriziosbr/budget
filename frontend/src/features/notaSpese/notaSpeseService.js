import axios from 'axios'
import { toast } from 'react-toastify'

// const API_URL = '/api/notaSpese/' // OK

// const API_URL = "https://budget-7ehi.onrender.com/api/notaSpese/"; //OK!!!
const API_URL = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_BASE_URL + '/api/notaSpese/' : '/api/notaSpese/'; 

// Get
const getNotaSpese = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Create new events
const createNotaSpese = async (notaSpeseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, notaSpeseData, config)

  return response.data
}

// // Update events
const updateNotaSpese = async (notaSpeseId, notaSpeseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + notaSpeseId, notaSpeseData, config)

  return response.data
}

// Delete nota spese
const deleteNotaSpese = async (notaId, schedaId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { schedaId }
  }
  const response = await axios.delete(API_URL + notaId, config)
  return response.data
}

const notaSpeseService = {
  getNotaSpese,
  createNotaSpese,
  updateNotaSpese,
  deleteNotaSpese
}

export default notaSpeseService