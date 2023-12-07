import {useEffect, useState} from 'react'
import {useSecrets, SettingsView} from '@sanity/studio-secrets'

const namespace = "myPlugin";

const pluginConfigKeys = [
  {
    key: "apiKey",
    title: "Your secret API key",
  },
];

interface SecretManagerProps {
  open: boolean;
  onClose: () => void;
}

export const SecretManager: React.FC<SecretManagerProps> = ({ open, onClose }) => {
  const { secrets } = useSecrets(namespace);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!secrets) {
      setShowSettings(true);
    }
  }, [secrets]);

  if (!showSettings) {
    return null;
  }
  return (
    <>
    <SettingsView
      title={"Sanity Read API Token"}
      namespace={namespace}
      keys={pluginConfigKeys}
      onClose={() => {
        setShowSettings(false);
      }}
    /></>
  );
};
