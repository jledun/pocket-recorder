'use strict';

const u = {
  getTimeStamp: () => {
    const d = new Date();
    return `${d.getFullYear().toString()}${((d.getMonth() + 1).toString().length < 2) ? "0".concat((d.getMonth() + 1).toString()): (d.getMonth() + 1).toString()}${((d.getDate() + 1).toString().length < 2) ? "0".concat((d.getDate() + 1).toString()) : (d.getDate() + 1).toString()}-${(d.getHours().toString().length < 2) ? "0".concat(d.getHours().toString()):d.getHours()}${(d.getMinutes().toString().length < 2) ? "0".concat(d.getMinutes().toString()): d.getMinutes()}${(d.getSeconds().toString().length < 2) ? "0".concat(d.getSeconds().toString()): d.getSeconds().toString()}`;
  }
};

module.exports = u;
