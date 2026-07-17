import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaFlickr,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTumblr,
  FaTwitch,
  FaVimeoV,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const icons: Record<string, IconType> = {
  behance: FaBehance,
  discord: FaDiscord,
  dribbble: FaDribbble,
  facebook: FaFacebook,
  flickr: FaFlickr,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  medium: FaMedium,
  pinterest: FaPinterest,
  reddit: FaReddit,
  snapchat: FaSnapchat,
  soundcloud: FaSoundcloud,
  spotify: FaSpotify,
  telegram: FaTelegram,
  tiktok: FaTiktok,
  tumblr: FaTumblr,
  twitch: FaTwitch,
  twitter: FaXTwitter,
  vimeo: FaVimeoV,
  whatsapp: FaWhatsapp,
  youtube: FaYoutube
};

export function getSocialIcon(type: string) {
  const Icon = icons[type.toLowerCase()];
  return Icon ? <Icon aria-hidden="true" /> : null;
}
