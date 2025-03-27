'use server';




export default async function getRSSFeed() {
    const RSS_URL = `https://codepen.io/picks/feed/`;

    const response = await fetch(RSS_URL)
    return response.text()
}