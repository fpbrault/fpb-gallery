import "server-only";

export async function runSanityRequest<T>(
  operation: string,
  request: () => Promise<T>
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "sanity_fetch_error",
        operation,
        message: error instanceof Error ? error.message : String(error)
      })
    );
    throw error;
  }
}
