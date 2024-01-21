export type TwitchRefreshResponse = {
  "access_token": string,
  "refresh_token": string,
  "scope": string[],
  "token_type": "bearer"
}

export type TwitchChattersResponse = {
  user_id: string,
  user_login: string,
  user_name: string
}
