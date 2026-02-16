import { ROUTES } from "@root/constants";

export class ProfileUtils {
  static navigateToProfile(data, navigate) {
    const url = `${ROUTES.SOCIAL}/profile/${data.username}/${data._id}`;
    navigate(url);
  }
}
