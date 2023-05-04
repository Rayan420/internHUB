import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../../style/style.css';
import boxicons from 'boxicons';

const SideNavbar = ({title}) => {

  return (
  <div>
       {/* header componenet incase we implement the header based on design */} 

    <h1 className='header-title'>{title}</h1>

  </div>    
  );
}


export default SideNavbar;
