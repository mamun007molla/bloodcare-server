const { getCol } = require("../config/db");

// GET /donors?bloodGroup=&district=&upazila=
const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, district, upazila } = req.query;

    const query = { role: "donor", status: "active" };

    if (bloodGroup) query.blood = bloodGroup.replace(/ /g, "+").trim();
    if (district)   query.district = district.trim();
    if (upazila)    query.subDistrict = upazila.trim();

    const userColl = getCol("users");
    const donors   = await userColl.find(query).toArray();

    res.json(donors);
  } catch (err) {
    next(err);
  }
};

module.exports = { searchDonors };
