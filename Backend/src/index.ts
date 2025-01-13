require('dotenv').config(({path:'./env'}))

import mongoose, { connect } from "mongoose";
import connectDB from "./Database/data";

connectDB(); 