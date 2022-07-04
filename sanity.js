import {
    createCurrentUserHook,
    createClient,
} from "next-sanity"
import createImageUrlBuilder from '@sanity/image-url'


export const config = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "j6zgo4kq",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2021-03-25",

    useCdn: process.env.NODE_ENV === "production"
    //aps get realy fast www (by caching those files)
}

// Set up the CLI for fetching data in the getProps page functions
export const sanityClient = createClient(config)

// healper func to extract URL from img

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// helper func for useing the curr logged in user accout
export const useCurretUser = createCurrentUserHook(config);

