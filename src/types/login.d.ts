export type LoginResult = {
  tokens: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: "bearer"
  };
  user: {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: string
  }
}
