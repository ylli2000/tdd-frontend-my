import './Navbar.css';
import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Segment, Input, Menu } from 'semantic-ui-react';

const Navbar = () => {
    const [activeItem, setActiveItem] = useState('home');
    const onClick = (evt, { name }) => {
        setActiveItem(name);
    };
    return (
        <Segment className="Navbar" inverted color="teal">
            <Menu secondary inverted color="teal">
                <NavLink to="/">
                    <Menu.Item name="home" as="span" active={activeItem === 'home'} onClick={onClick} />
                </NavLink>
                <NavLink to="/Manage/Profile/">
                    <Menu.Item name="profile" as="span" active={activeItem === 'profile'} onClick={onClick} />
                </NavLink>
                <NavLink to="/Manage/Users/">
                    <Menu.Item name="users" as="span" active={activeItem === 'users'} onClick={onClick} />
                </NavLink>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Input icon="search" as="span" placeholder="Search..." />
                    </Menu.Item>
                    <NavLink to="/Login">
                        <Menu.Item name="login" as="span" active={activeItem === 'login'} onClick={onClick} />
                    </NavLink>
                    <NavLink to="/LogOut">
                        <Menu.Item name="logout" as="span" active={activeItem === 'logout'} onClick={onClick} />
                    </NavLink>
                </Menu.Menu>
            </Menu>
        </Segment>
    );
};
export default Navbar;
