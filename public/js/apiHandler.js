export default class APIHandler {
  constructor(baseUrl) {
    this.api = axios.create({
      baseURL: baseUrl
    });
  }

  getPOIList() {
    return this.api.get("/poi/query?lat=48.803595&lng=2.201986");
  }
}
