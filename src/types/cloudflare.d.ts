export type CloudflareAPIOptions = {
  account_identifier: string;
  database_identifier: string;
  authorization: string;
};

export type CloudflareSQLResponse = {
  errors: [];
  messages: [];
  result: [
    {
      meta: {
        changed_db: boolean;
        changes: number;
        duration: number;
        last_row_id: number;
        rows_read: number;
        rows_written: number;
        size_after: number;
      };
      results: Record<string, unknown>[];
      success: boolean;
    }
  ];
  success: boolean;
};

export type D1User = {
  id_user: number;
  user_login: string;
  refresh_token: string;
};
