import axios from "./axios";
import { createRefresh } from "react-auth-kit";

const refreshApi = createRefresh({
  interval: 40, // refresh the token every 10 minutes
  refreshApiCallback: async ({
    // arguments
    authToken,
    authTokenExpireAt,
    refreshToken,
    refreshTokenExpiresAt,
    authUserState,
  }) => {
    console.log("refreshApiCallback..........................................");
    console.log("authToken:", authToken);
    console.log("authTokenExpireAt:", authTokenExpireAt);
    console.log("refreshToken:", refreshToken);
    console.log("refreshTokenExpiresAt:", refreshTokenExpiresAt);
    console.log("authUserState:", authUserState);

    // Insert return HERE before axios.post( ...
    await axios
      .post("/refresh", refreshToken, {
        headers: { authorization: `${authToken}` },
      })
      .then(({ data }) => {
        return {
          // As the request is successful, we are passing new tokens.
          isSuccess: true, // For successful network request isSuccess is true
          newAuthToken: data.newAuthToken,
          newAuthTokenExpireIn: data.newAuthTokenExpireIn,
          // You can also add new refresh token ad new user state
        };
      })
      .catch((e) => {
        console.error(e);
        return {
          // As the request is unsuccessful, we are just passing the isSuccess.
          isSuccess: false, // For unsuccessful network request isSuccess is false
        };
      });
  },
});

export default refreshApi;
