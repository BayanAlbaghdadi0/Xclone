import jwt from "jsonwebtoken";

const generateAndSetCookie = async (userId, res) => {
  try {
    // console.log(userId);
    // console.log({userId});
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn : '15d'
    });
    res.cookie('token', token,{
        maxAge : 15 * 60 * 60 * 24 *1000,//ms
        httpOnly : true,
        sameSite:"strict"
    });
  } catch (error) {}
};
export default generateAndSetCookie

