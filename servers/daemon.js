/**
 * Loggin API
 * 추후 추가 필요
 */

/**
 * Servers Common
 */
const express = require("express");
const app = express();

const server = require("http");
const http = server.createServer(app);

const socket = require("socket.io");
const io = socket(http);

/**
 * pub / sub 관련내용 처리
 * redis 이용?
 */

/**
 * io Service
 */
io.use((socket, next) => {
  try {
    // socket empty 확인

    return next();
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  io,
};
