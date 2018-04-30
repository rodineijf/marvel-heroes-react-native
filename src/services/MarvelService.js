import md5 from "md5";
import moment from "moment";

import { Config } from "../config/Config";

export const MarvelService = {
  limit: 25,
  get _authorization() {
    const ts = moment().format("X");
    const hash = md5(ts + Config.apiPrivateKey + Config.apiKey);

    return `?apikey=${Config.apiKey}&hash=${hash}&ts=${ts}`;
  },
  fetchCharacters(offset, search = null) {
    let params = `${this._authorization}&limit=${this.limit}&offset=${offset}`;
    params += search ? `&nameStartsWith=${search}` : "";
    return fetch(
      "https://gateway.marvel.com:443/v1/public/characters" + params,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(res => res.data.results);
  },
  fetchResource(resourceUri) {
    return fetch(resourceUri + this._authorization, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => res.json());
  }
};
