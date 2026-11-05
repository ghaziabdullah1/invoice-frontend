import axios from './axios'

export default {
  getMyProperties() {
    return axios.get('/admin/properties/my-properties')
  },
  getAssignable() {
    return axios.get('/admin/properties/assignable')
  },
}
