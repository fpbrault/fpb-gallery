// src/components/secrets-toolbar.tsx

import { useState, useCallback } from "react"
import { ToolMenuProps, ToolLink } from "sanity"
import { Button, Flex, Box, Spinner, Dialog, Text, Stack } from "@sanity/ui"
import { PlugIcon, CogIcon, RefreshIcon } from "@sanity/icons"
import { SecretManager } from "./SecretManager"
import { useSecrets } from "@sanity/studio-secrets"
import { RevalidatePaths } from "../lib/actions"
import { client } from "../lib/client"
interface Secrets {
  apiKey?: string;
}


export const SecretsToolbar = (props: ToolMenuProps) => {
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false)
  const { activeToolName, context, tools } = props
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

  // Call UpdateAllPaths when the new button is clicked
  const handleUpdateAllPaths = useCallback(async () => {
    if (secrets) {
      setIsLoading(true) // Set loading to true when the button is clicked
      await UpdateAllPaths(secrets) // Wait for UpdateAllPaths to complete
      setIsLoading(false) // Set loading to false when the action is complete
    }
  }, [secrets])

  // Open the confirmation dialog
  const openConfirm = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  // Close the confirmation dialog and start the revalidation if confirmed
  const handleConfirm = useCallback(async () => {
    setIsConfirmOpen(false);
    await handleUpdateAllPaths();
  }, [handleUpdateAllPaths]);

  // Close the confirmation dialog without starting the revalidation
  const handleCancel = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);


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
        <Button
          as={"button"}
          name="UpdateAllPaths"
          padding={1}
          disabled={isLoading}
          text={
            isLoading ? (
              <Flex align={'center'} gap={2} direction={direction} padding={1}>
                <Spinner size={1} />
                Revalidating...
              </Flex>
            ) : (
              <Flex align={'center'} gap={2} direction={direction} padding={1}> <RefreshIcon/>Revalidate All Paths</Flex>
            )
          }
          tone="primary"
          onClick={openConfirm} // Open the confirmation dialog when the button is clicked
          type="button"
          style={{ cursor: "pointer" }}
        />

        {isConfirmOpen && (
          <Dialog
            header="Confirm Revalidation"
            id="confirm-dialog"
            onClose={handleCancel}
            width={[0, 0, 0, 1]}
            zOffset={1000}
          >
            <Box padding={4}>
              <Stack space={[3, 3, 4, 5]}>
                <Text>
                  This will revalidate (update) all the paths/page, forcing the cache to be purged
                </Text>
                <Text>
                  This is usually not required as the relevant paths will normally be revalidated when publishing a document.
  
                  However, if you made a site-wide change, or if revalidation seems to not have completed, you can revalidate all the paths.
                </Text>
                <Text>
                  Are you sure you want to continue?
                </Text>
              </Stack>
            </Box>
            <Flex padding={4} gap={2} justify="flex-end">
              <Button mode="ghost" text={"Cancel"} onClick={handleCancel} />
              <Button tone="positive" text={"Confirm"} onClick={handleConfirm} />
            </Flex>
          </Dialog>
        )}
      </>
      {secretsOpen ? (
        <SecretManager open={secretsOpen} onClose={closeSecrets} />
      ) : null}
    </Flex>
  )
}

export async function UpdateAllPaths(props?: any) {
  const apiKey = props?.apiKey ?? ""
  if (apiKey != "") {
    try {
      const pages = await client.fetch('*[_type == "page"]');
      const posts = await client.fetch('*[_type == "post"]');
      const albums = await client.fetch('*[_type == "album"]');
      const categories = await client.fetch('*[_type == "category"]');

      const paths = [
        '/',
        '/blog',
        '/fr/blog',
        '/fr',
        '/album/featured',
        '/album/all',
        '/fr/album/featured',
        '/fr/album/all',
        ...pages.map((page: { slug: { current: any; }; }) => `/${page.slug.current}`),
        ...pages.map((page: { slug: { current: any; }; }) => `/fr/${page.slug.current}`),
        ...posts.map((post: { slug: { current: any; }; slug_fr: { current: any; }; }) => `/blog/${post.slug.current}`),
        ...posts.map((post: { slug: { current: any; }; slug_fr: { current: any; }; }) => `/fr/blog/${post.slug_fr.current}`),
        ...albums.map((album: { slug: { current: any; }; }) => `/album/${album.slug.current}`),
        ...albums.map((album: { slug: { current: any; }; }) => `/fr/album/${album.slug.current}`),
        ...categories.map((category: { slug: { current: any; }; }) => `/category/${category.slug.current}`),
        ...categories.map((category: { slug: { current: any; }; }) => `/fr/category/${category.slug.current}`),
      ];
      await RevalidatePaths(paths, props);

      //alert("Revalidation Complete!")
    } catch (err) {
      console.error(err);
    }

  } else {
    alert("Set the api key secret first!")
  }

}
