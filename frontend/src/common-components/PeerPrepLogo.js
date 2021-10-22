import React, { useContext, useEffect } from 'react';
import { GiSpellBook } from 'react-icons/gi';

const PeerPrepLogo = () => {
  return (
    <div className="logo-container">
      <GiSpellBook className="logo" />
      <span className="logo-title"> PeerPrep </span>
    </div>
  );
};

export default PeerPrepLogo;
