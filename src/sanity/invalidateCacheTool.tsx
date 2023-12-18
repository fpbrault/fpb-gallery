// invalidateCacheTool.tsx
import React, { useState } from 'react';
import { Button, TextInput, Box, Heading, Stack } from '@sanity/ui';

async function revalidatePaths(paths: string[]) {
    try {
  
      const endpoint = new URL("http://localhost:3000/api/revalidate");
  
      endpoint.searchParams.append("paths", paths.join(","));
      endpoint.searchParams.append("secret", process.env.SANITY_WEBHOOK_SECRET ?? "");
  
      await fetch(endpoint.href);
    } catch (err) {
      console.error(err);
  
      return null;
    }
  }

  
  function getAllBlogPagePaths() {
    return ['/blog','/blog/test-post-2']
  }

  function getAllSitePaths() {
    return ['/hometest']
  }

export function InvalidateCacheTool() {
    const [path, setPath] = useState('');

    const invalidateSpecificPath = () => {
        revalidatePaths([path]);
    };

    const invalidateBlogPages = () => {
        // Assuming you have a way to get all blog page paths
        const allBlogPagePaths = getAllBlogPagePaths();
        revalidatePaths(allBlogPagePaths);
    };

    const invalidateFullSite = () => {
        // Assuming you have a way to get all site paths
        const allSitePaths = getAllSitePaths();
        revalidatePaths(allSitePaths);
    };

    return (
        <Box padding={4}>
            <Heading as="h1">Invalidate Cache</Heading>
            <Stack space={3}>
                <TextInput
                    placeholder="Enter path"
                    value={path}
                    onChange={(event) => setPath(event.currentTarget.value)}
                />
                <Button onClick={invalidateSpecificPath}>Invalidate Specific Path</Button>
                <Button onClick={invalidateBlogPages}>Invalidate All Blog Pages</Button>
                <Button onClick={invalidateFullSite}>Invalidate Full Site</Button>
            </Stack>
        </Box>
    );
}