export type ApiResponse =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      message: string;
      data?: any;
    };
