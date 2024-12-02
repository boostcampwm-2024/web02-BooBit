export default interface FormValidationType {
  email: { hasError: boolean; message: string };
  password: { hasError: boolean; message: string };
  passwordCheck: { hasError: boolean; message: string };
  total: { hasError: boolean; message: string };
}
