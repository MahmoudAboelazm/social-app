import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const userIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (
      !fetching &&
      !data?.me &&
      router.route !== "/login" &&
      router.route !== "/register"
    ) {
      router.replace("/login?next=" + router.pathname);
    } else if (router.route === "/login" && !fetching && data?.me) {
      router.replace("/");
    } else if (router.route === "/register" && !fetching && data?.me) {
      router.replace("/");
    }
  }, [data, fetching, router]);
};
