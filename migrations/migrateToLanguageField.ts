import { migrateToLanguageField } from "sanity-plugin-internationalized-array/migrations";

const DOCUMENT_TYPES = ["post", "album", "translation.metadata"];

export default migrateToLanguageField(DOCUMENT_TYPES);
