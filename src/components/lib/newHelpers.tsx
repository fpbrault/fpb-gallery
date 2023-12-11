import { serverSideTranslations } from "next-i18next/serverSideTranslations"


export const getTranslations = async (context: any) => {
    return (await serverSideTranslations(context.locale ?? "en", ["common", "footer"]))
}