import { useNavigate } from 'react-router-dom';
import logoImage from '../../../shared/images/BuBu.png';

const Logo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button className="flex items-center text-display-bold-32" onClick={handleClick}>
      <img src={logoImage} alt="BuBu" width="34rem" />
      BooBit
    </button>
  );
};

export default Logo;
