import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faFacebook } from "@fortawesome/free-brands-svg-icons";

export function getSocialIcon(type: string) {
  switch (type) {
    case "instagram":
      return <FontAwesomeIcon icon={faInstagram} />;
    case "youtube":
      return <FontAwesomeIcon icon={faYoutube} />;
    case "facebook":
      return <FontAwesomeIcon icon={faFacebook} />;
    // Add more cases for other social media types if needed
    default:
      return null;
  }
}
