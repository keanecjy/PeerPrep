import { GiSpellBook } from 'react-icons/gi';

const PeerPrepLogo = () => {
  return (
    <a className="logo-container" href={'/'} role="button">
      <GiSpellBook className="logo" />
      <span className="logo-title"> PeerPrep </span>
    </a>
  );
};

export default PeerPrepLogo;
