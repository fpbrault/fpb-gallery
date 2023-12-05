import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faYoutube,
  faFacebook,
  faTwitter,
  faLinkedin,
  faPinterest,
  faSnapchat,
  faTiktok,
  faReddit,
  faTumblr,
  faWhatsapp,
  faTelegram,
  faDiscord,
  faMedium,
  faFlickr,
  faVimeo,
  faSoundcloud,
  faSpotify,
  faBehance,
  faDribbble,
  faTwitch
} from "@fortawesome/free-brands-svg-icons";

export function getSocialIcon(type: string) {
  switch (type) {
    case "instagram":
      return <FontAwesomeIcon icon={faInstagram} />;
    case "youtube":
      return <FontAwesomeIcon icon={faYoutube} />;
    case "facebook":
      return <FontAwesomeIcon icon={faFacebook} />;
    case "twitter":
      return <FontAwesomeIcon icon={faTwitter} />;
    case "twitch":
      return <FontAwesomeIcon icon={faTwitch} />;
    case "linkedin":
      return <FontAwesomeIcon icon={faLinkedin} />;
    case "pinterest":
      return <FontAwesomeIcon icon={faPinterest} />;
    case "snapchat":
      return <FontAwesomeIcon icon={faSnapchat} />;
    case "tiktok":
      return <FontAwesomeIcon icon={faTiktok} />;
    case "reddit":
      return <FontAwesomeIcon icon={faReddit} />;
    case "tumblr":
      return <FontAwesomeIcon icon={faTumblr} />;
    case "whatsapp":
      return <FontAwesomeIcon icon={faWhatsapp} />;
    case "telegram":
      return <FontAwesomeIcon icon={faTelegram} />;
    case "discord":
      return <FontAwesomeIcon icon={faDiscord} />;
    case "medium":
      return <FontAwesomeIcon icon={faMedium} />;
    case "flickr":
      return <FontAwesomeIcon icon={faFlickr} />;
    case "vimeo":
      return <FontAwesomeIcon icon={faVimeo} />;
    case "soundcloud":
      return <FontAwesomeIcon icon={faSoundcloud} />;
    case "spotify":
      return <FontAwesomeIcon icon={faSpotify} />;
    case "behance":
      return <FontAwesomeIcon icon={faBehance} />;
    case "dribbble":
      return <FontAwesomeIcon icon={faDribbble} />;
    default:
      return null;
  }
}
