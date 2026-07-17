const ALLOWED_PREVIEW_PATH =
  /^\/(?:fr(?:\/.*)?|gallery|blog(?:\/[^/?#]+)?|album\/(?:all|featured|[^/?#]+)|category\/[^/?#]+|(?:[^/?#]+\/)*[^/?#]+)?(?:\?[^#]*)?$/;

export function isAllowedPreviewPath(value: string | null) {
  return (
    value !== null &&
    value.length <= 500 &&
    !/^\/(?:api|studio|_next)(?:\/|$)/.test(value) &&
    ALLOWED_PREVIEW_PATH.test(value)
  );
}
