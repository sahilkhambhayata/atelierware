import React from "react";
import EnglishFlag from "../../../images/flags/english.png";
import SpanishFlag from "../../../images/flags/spanish.png";
import FrenchFlag from "../../../images/flags/french.png";
import TurkeyFlag from "../../../images/flags/turkey.png";
import { Row, Col } from "reactstrap";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "react-router-dom";
const AuthFooter = () => {
  return (
    <div className="nk-block nk-auth-footer">
      <div className="nk-block-between">
        <ul className="nav nav-sm justify-content-center ">
          <li className="nav-item">
            <Link
              className="nav-link text-blueshblack "
              target="_blank"
              to={`${import.meta.env.PUBLIC_URL}/auths/terms`}
            >
              Terms &amp; Condition
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-blueshblack "
              target="_blank"
              to={`${import.meta.env.PUBLIC_URL}/auths/terms`}
            >
              Privacy Policy
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-blueshblack "
              target="_blank"
              to={`${import.meta.env.PUBLIC_URL}/auths/faq`}
            >
              Help
            </Link>
          </li>
          <li className="nav-item ">
            <UncontrolledDropdown direction="up">
              <DropdownToggle
                color="transparent"
                className="dropdown-toggle dropdown-indicator has-indicator nav-link text-blueshblack "
              >
                <span>English</span>
              </DropdownToggle>
              <DropdownMenu end className="dropdown-menu-sm">
                <ul className="language-list">
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                      className="language-item text-blueshblack"
                    >
                      <img src={EnglishFlag} alt="" className="language-flag" />
                      <span className="language-name text-blueshblack">
                        English
                      </span>
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                      className="language-item"
                    >
                      <img src={SpanishFlag} alt="" className="language-flag" />
                      <span className="language-name">Español</span>
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                      className="language-item"
                    >
                      <img src={FrenchFlag} alt="" className="language-flag" />
                      <span className="language-name">Français</span>
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                      className="language-item"
                    >
                      <img src={TurkeyFlag} alt="" className="language-flag" />
                      <span className="language-name">Türkçe</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </li>
        </ul>
      </div>
      <div className="mt-3">
      <p className=" nk-footer-copy-text text-center text-blueshblack">
              &copy; 2016-2023 Atelierware | All rights reserved
            </p>
      </div>
      {/* <div className="container wide-lg">
        <Col className="py-2">
          <ul className="nav nav-sm justify-content-center ">
            <li className="nav-item">
              <Link
                className="nav-link text-blueshblack "
                target="_blank"
                to={`${import.meta.env.PUBLIC_URL}/auths/terms`}
              >
                Terms &amp; Condition
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-blueshblack "
                target="_blank"
                to={`${import.meta.env.PUBLIC_URL}/auths/terms`}
              >
                Privacy Policy
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-blueshblack "
                target="_blank"
                to={`${import.meta.env.PUBLIC_URL}/auths/faq`}
              >
                Help
              </Link>
            </li>
            <li className="nav-item ">
              <UncontrolledDropdown direction="up">
                <DropdownToggle
                  color="transparent"
                  className="dropdown-toggle dropdown-indicator has-indicator nav-link text-blueshblack "
                >
                  <span>English</span>
                </DropdownToggle>
                <DropdownMenu end className="dropdown-menu-sm">
                  <ul className="language-list">
                    <li>
                      <DropdownItem
                        tag="a"
                        href="#dropdownitem"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="language-item text-blueshblack"
                      >
                        <img
                          src={EnglishFlag}
                          alt=""
                          className="language-flag"
                        />
                        <span className="language-name text-blueshblack">
                          English
                        </span>
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        tag="a"
                        href="#dropdownitem"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="language-item"
                      >
                        <img
                          src={SpanishFlag}
                          alt=""
                          className="language-flag"
                        />
                        <span className="language-name">Español</span>
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        tag="a"
                        href="#dropdownitem"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="language-item"
                      >
                        <img
                          src={FrenchFlag}
                          alt=""
                          className="language-flag"
                        />
                        <span className="language-name">Français</span>
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        tag="a"
                        href="#dropdownitem"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="language-item"
                      >
                        <img
                          src={TurkeyFlag}
                          alt=""
                          className="language-flag"
                        />
                        <span className="language-name">Türkçe</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </li>
          </ul>
        </Col>
        <Col className="py-2">
          <div className="nk-block-content text-center ">
            <p className=" nk-footer-copy-text text-blueshblack">
              &copy; 2022 Atelierware. All Rights Reserved.
            </p>
          </div>
        </Col>
      </div> */}
    </div>
  );
};

export default AuthFooter;
