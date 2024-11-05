import logoImage from '../../../shared/images/BuBu.png';

const Logo = () => {
  return (
    <button className="flex items-center text-display-bold-32">
      <img src={logoImage} alt="BuBu" width="34rem" />
      BooBit
    </button>
  );
};

export default Logo;
