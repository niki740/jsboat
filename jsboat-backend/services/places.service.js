const { socketResp } = require("../socket");

const Service = {};

const sequilizeArray = (obj, seq) => {
  return seq.map((key) => {
    return obj[`${key}`];
  });
};

// Add Places Service
Service.AddPlaces = async (req) => {
  try {
    const { db, body } = req;
    const places = await db.addPlaces(
      sequilizeArray(body, [
        "place_name",
        "city",
        "state",
        "liked_count",
        "popularity",
      ])
    );

    return {
      statusCode: 200,
      status: true,
      message: "Add Places Successfully",
      data: places,
    };
  } catch (err) {
    return {
      statusCode: 500,
      status: false,
      message: err.message,
    };
  }
};

// Get Places Service
Service.GetPlaces = async (req) => {
  try {
    const { db, query, decoded } = req;

    const places = await db.getPlaces(query);
    const userData = await db.getUser([decoded.id]);

    let arr1 = [];
    let arr2 = [];

    places.filter((e) => {
      return userData.prefrered_states.map((states) => {
        e.state === states ? arr1.push(e) : arr2.push(e);
      });
    });
    const prefreredStates = [...new Set([...arr1, ...arr2])];

    return {
      statusCode: 200,
      status: true,
      message: "Get Places successfully.",
      data: prefreredStates,
    };
  } catch (err) {
    return {
      statusCode: 500,
      status: false,
      message: err.message,
    };
  }
};

// Like INC and DEC Service
Service.LikedCount = async (req) => {
  try {
    const { db, decoded, body, io } = req;
    const { like, place_id } = body;
    let resp = null;
    let dbData = null;

    if (like === true) {
      resp = await db.likedInc([place_id]);
      dbData = await db.addPlaceInUser([decoded.id, place_id]);
    } else {
      resp = await db.likedDec([place_id]);
      dbData = await db.removePlaceInUser([decoded.id, place_id]);
    }
    await socketResp(resp);

    return {
      statusCode: 200,
      status: true,
      message: "Add Like successfully",
      data: resp,
      userdata: dbData,
    };
  } catch (err) {
    return {
      statusCode: 500,
      status: false,
      message: err.message,
    };
  }
};

module.exports = Service;
