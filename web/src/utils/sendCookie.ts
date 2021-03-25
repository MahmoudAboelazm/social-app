import { SendCookieQuery } from "../generated/graphql";

const cookieToURL = (cookiedata: SendCookieQuery | undefined) => {
  if (cookiedata?.sendCookie) {
    document.cookie = ("qid=" + cookiedata?.sendCookie.split("=")[1]) as string;
  }
};

export default cookieToURL;
