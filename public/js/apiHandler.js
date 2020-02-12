export default class APIHandler {
  constructor() {
    this.api = axios.create();
  }

  deleteUserPOI(user_id, poi_id) {
    return this.api.delete(`user/poi/delete/${user_id}/${poi_id}`);
  }
}
