import { getAlbumsForCategory } from "@/sanity/lib/client";
import { NextApiRequest, NextApiResponse } from "next";

async function fetchAlbumById(albumId: any) {
  try {
    const response = await fetch(`http://localhost:3000/api/data`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const album = await response.json();
    return album[albumId];
  } catch (error) {
    console.error('Error fetching album by ID', error);
    throw error;
  }
}



export default async function getCategoryByName(req: NextApiRequest, res: NextApiResponse) {
  const { categoryName } = req.query;

  if (!categoryName) {
    return res.status(400).json({ error: 'Missing categoryName parameter' });
  }

  const category = await getAlbumsForCategory(categoryName);

  if (!category) {
    return res.status(404).json({ error: 'Album not found' });
  }

  res.json(category);
}