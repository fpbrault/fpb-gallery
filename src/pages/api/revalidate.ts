import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export default async function handler(req: any, res: any) {

  const signature = req.headers[SIGNATURE_HEADER_NAME];
  const secret = req.query.secret;

  const isValid = SANITY_WEBHOOK_SECRET == secret;
  console.log(`===== Is the Revalidation request valid? ${isValid}`);

  // Validate signature
  if (!isValid) {
    res.status(401).json({ success: false, message: 'Invalid signature' });
    return;
  }

  try {
    //const pathToRevalidate = req.body.slug.current;
    const paths = (req.query.paths as string).split(",");

    //console.log(`===== Revalidating: ${pathToRevalidate}`);

    for (let i = 0; i < paths.length; i++) {
      
      console.log("===== Revalidating: " + paths[i])
      await res.revalidate(paths[i]);
    }

    console.log("===== Revalidation complete")

    return res.json({ revalidated: true });
  } catch (err) {
    console.error(err)
    // Could not revalidate. The stale page will continue to be shown until
    // this issue is fixed.
    return res.status(500).send('Error while revalidating');
  }
}
