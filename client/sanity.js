// sanity.js
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "9quolbjs", // Replace with your Sanity project ID
  dataset: "stellar", // Replace with your dataset name (e.g., 'production')
  apiVersion: "2023-12-01", // Use today's date or a specific API version
  useCdn: true,
  token:
    "skmFxBoATvghR2dJgSNaZP3fwAImx0plBFP4AB5t8DIgM0v0Joy88u66oki0oSRHSiIB04156iGphOkkeb0lH9xwm6cbwtjYJWcOEojWKnqj9F5zuLFa6LRpy6CrK9HV0MG6FcYeAjtBKkJ2DwCyj8E3nUV0aSNwfETYwuNnT1VPIABTayEc", // `true` for faster responses with cached data
});
