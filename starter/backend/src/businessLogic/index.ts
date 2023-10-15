import dataLayer from "../dataLayer";
import BusinessLogic from "./business-logic";
import fileStorage from "../fileAttachment";

const business = new BusinessLogic(dataLayer, fileStorage);

export default business;
