interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  styles: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, styles }) => (
  <button className={`h-[3rem] rounded ${styles}`} onClick={onClick}>
    {label}
  </button>
);

export default Button;
