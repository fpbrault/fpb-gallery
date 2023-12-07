// src/components/secrets-toolbar.tsx

import { useState, useEffect, useCallback } from "react"
import { ToolMenuProps, ToolLink, useCurrentUser } from "sanity"
import { Button, Flex, Box } from "@sanity/ui"
import { PlugIcon, CogIcon } from "@sanity/icons"
import { SecretManager } from "./SecretManager"

export const SecretsToolbar = (props: ToolMenuProps) => {
  const { activeToolName, context, tools } = props
  const user = useCurrentUser()
  const [authorized, setAuthorized] = useState(true)
  const [secretsOpen, setSecretsOpen] = useState(false)
  const isSidebar = context === "sidebar"

  const closeSecrets = useCallback(() => {
    setSecretsOpen(false)
  }, [])

  const openSecrets = useCallback(() => {
    setSecretsOpen(true)
  }, [])

  // Change flex direction depending on context
  const direction = isSidebar ? "column" : "row"



  return (
    <Flex gap={1} direction={direction}>
      {tools.map((tool) => (
        <Button
          as={ToolLink}
          icon={tool.icon || PlugIcon}
          key={tool.name}
          name={tool.name}
          padding={3}
          selected={tool.name === activeToolName}
          text={tool.title || tool.name}
          tone="primary"
        />
      ))}
      {authorized ? (
        <>
          <Box padding={2}>
            <p
              style={{
                border: "1px solid white",
                opacity: 0.4,
                height: "100%",
                margin: "0",
              }}
            />
          </Box>
          <Button
            as={"button"}
            name="Secrets"
            padding={3}
            selected={secretsOpen}
            text="Secrets"
            tone="caution"
            icon={CogIcon}
            onClick={openSecrets}
            type="button"
            style={{ cursor: "pointer" }}
          />
        </>
      ) : null}
      {secretsOpen ? (
        <SecretManager open={secretsOpen} onClose={closeSecrets} />
      ) : null}
    </Flex>
  )
}