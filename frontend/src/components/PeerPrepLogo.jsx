import { GiSpellBook } from 'react-icons/gi';
import { useHistory } from 'react-router';

const PeerPrepLogo = () => {
  const history = useHistory();
  return (
    <div
      className="logo-container"
      onClick={() => history.push('home')}
      role="button"
    >
      <GiSpellBook className="logo" />
      <span className="logo-title"> PeerPrep </span>
    </div>
  );
};

export default PeerPrepLogo;
