import { API_ENDPOINTS } from '../../Constants'
const microSiteBaseUrl = 'https://sit.rigelsoft.com/services'
export function ProfileUrlDetails(imageUrl) {
	return `data:image/png;base64,${imageUrl}`
}

export const getImgUrl = (uuid, token) => {
	return `${microSiteBaseUrl + API_ENDPOINTS.DOWNLOAD_FILE}/${uuid}?token=${encodeURIComponent(token)}`
}

export const getProfileImgUrl = (uuid, token) => {
	return `${microSiteBaseUrl + API_ENDPOINTS.DOWNLOAD_FILE}/${uuid}?token=${encodeURIComponent(token)}&isThumbnail=false`
}
