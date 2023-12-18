import { definePlugin } from "sanity"
import { SecretsToolbar } from "../components/SecretsToolbar"

export const secretsToolbar = definePlugin({
  name: "secrets-toolbar",
  studio: {
    components: {
      toolMenu: SecretsToolbar,
    },
  },
})