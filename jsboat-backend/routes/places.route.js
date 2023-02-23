const app = require("express");
const PlaceService = require("../services/places.service");
const router = app.Router();
const { filterResp } = require("../helpers/function");
const verifyToken = require("../middleware/auth");

const ApiService = {
  AddPlaces: async (req, res) => {
    const resp = await PlaceService.AddPlaces(req);
    res.status(resp.statusCode).json(filterResp(resp));
  },
  GetPlaces: async (req, res) => {
    const resp = await PlaceService.GetPlaces(req);
    res.status(resp.statusCode).json(filterResp(resp));
  },
  LikedCount: async (req, res) => {
    const resp = await PlaceService.LikedCount(req);
    res.status(resp.statusCode).json(filterResp(resp));
  },
};

router
  .post("/places", verifyToken, ApiService.AddPlaces)
  .get("/get/places", verifyToken, ApiService.GetPlaces)
  .post("/like/count", verifyToken, ApiService.LikedCount);

module.exports = router;
