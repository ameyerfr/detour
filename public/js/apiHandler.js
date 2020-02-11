export default class APIHandler {
  constructor(baseUrl) {
    this.api = axios.create({
      baseURL: baseUrl
    });
  }

  getPOIList() {
    return this.api.get("/api/poi/query?lat=48.803595&lng=2.201986");
  }

  deleteUserPOI(user_id, poi_id) {
    return this.api.delete(`user/poi/delete/${user_id}/${poi_id}`);
  }
}
