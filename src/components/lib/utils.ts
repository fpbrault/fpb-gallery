export function getSlugFromContext(context: any) {
    let slug
    if (Array.isArray(context.params.slug)) {
     slug = context.params.slug[0];
    } else if (typeof context.params.slug === 'string') {
      slug = context.params.slug;
    }
    return slug
  }
  