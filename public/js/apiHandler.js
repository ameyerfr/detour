export default class APIHandler {
  constructor(baseUrl) {
    this.api = axios.create({
      baseURL: baseUrl
    });
  }

  deleteUserPOI(user_id, poi_id) {
    return this.api.delete(`user/poi/delete/${user_id}/${poi_id}`);
  }
}
