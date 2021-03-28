import { Button } from "@chakra-ui/button";
import React from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from "react-google-login";
import { useLoginByGoogleMutation } from "../generated/graphql";

interface loginByGoogleProps {}
const LoginByGoogle: React.FC<loginByGoogleProps> = ({}) => {
  const [, loginByGoogle] = useLoginByGoogleMutation();

  const onSuccess = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    let resposnse = res as GoogleLoginResponse;
    if (resposnse.tokenId) {
      const loginResponse = await loginByGoogle({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
        tokenId: resposnse.tokenId,
        email: resposnse.profileObj.email,
      });

      //console.log(loginResponse);
    }
  };

  const onFailure = (res: any) => {
    console.log(res);
  };

  const { signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
    onSuccess,
    onFailure,
    isSignedIn: true,
    //accessType: ""
  });

  return (
    <>
      <Button onClick={signIn} m={"auto"} d={"block"} mt={4}>
        Sign in with google
      </Button>
    </>
  );
};

export default LoginByGoogle;
