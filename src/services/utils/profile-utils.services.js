import { ROUTES } from "@root/constants";
import { createSearchParams } from "react-router-dom";

export class ProfileUtils {
  static navigateToProfile(data, navigate) {
    const url = `${ROUTES.SOCIAL}/profile/${data.username}?${createSearchParams({ id: data?._id, uId: data?.uId })}`;
    navigate(url);
  }
}
