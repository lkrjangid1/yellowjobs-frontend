import { useSWRInfinite } from 'swr'
import { API_URL, fetcher } from 'lib/api'

export const useTweets = ({ query }) => {
  // default url
  let url = `${API_URL}/api/tweets/?`

  // when we have role, for searching
  if (query.s) {
    const keyword = query.s.replace(/ /g, '')
    url += `&q=${keyword}`
  }

  // for query params
  if (query.types) {
    const types = query.types.replace(/ /g, '')
    url += `&type=${types}`
  }

  if (query.roles) {
    const roles = query.roles.replace(/ /g, '')
    url += `&role=${roles}`
  }
  const getKey = (pageIndex, previousPageData) => {
    // not send a request if location or resource are not empty
    // if (!query.s || !query.types || !query.roles) return null

    const l = 3
    const o = 3 * pageIndex

    if (previousPageData && !previousPageData.length) return null
    console.log(`${url}&limit=${l}&offset=${o}`)
    return `${url}&limit=${l}&offset=${o}`
  }

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher)
  return { data, error, size, setSize }
}
